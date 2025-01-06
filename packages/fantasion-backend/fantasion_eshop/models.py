from io import BytesIO
import qrcode
import qrcode.image.svg
from datetime import date, timedelta

from django.apps import apps
from django.conf import settings
from django.core.exceptions import ValidationError
from django.db.models import Q, Sum
from django.db.models.signals import post_save
from django.dispatch import receiver
from django_extensions.db.models import TimeStampedModel
from django.template.loader import render_to_string
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.utils.html import escape
from django.core.validators import (
    MaxValueValidator,
    MinLengthValidator,
    MinValueValidator,
)
from django.db.models import (
    BooleanField,
    CharField,
    DateTimeField,
    DecimalField,
    ForeignKey,
    PositiveIntegerField,
    CASCADE,
    RESTRICT,
    SET_NULL,
)

from rest_framework.exceptions import PermissionDenied
from fantasion.models import UserAddressBase
from fantasion_generics.emails import get_lang, send_mail
from fantasion_generics.models import MarkdownField, PublicModel
from fantasion_generics.money import MoneyField
from fantasion_banking.constants import (
    DEBT_SOURCE_GENERATED_ORDER,
    DEBT_TYPE_DEPOSIT,
    DEBT_TYPE_FULL_PAYMENT,
    DEBT_TYPE_SURCHARGE,
    PROMISE_STATUS_DEPOSIT_PAID,
    PROMISE_WAS_PAID,
)

ORDER_STATUS_NEW = 1
ORDER_STATUS_CONFIRMED = 2
ORDER_STATUS_DEPOSIT_PAID = 3
ORDER_STATUS_PAID = 4
ORDER_STATUS_DISPATCHED = 5
ORDER_STATUS_RESOLVED = 6
ORDER_STATUS_CANCELLED = 7
ORDER_STATUS_REFUNDED = 8

ORDER_STATES = (
    (ORDER_STATUS_NEW, _("New")),
    (ORDER_STATUS_CONFIRMED, _("Confirmed")),
    (ORDER_STATUS_DEPOSIT_PAID, _("Deposit Paid")),
    (ORDER_STATUS_PAID, _("Paid")),
    (ORDER_STATUS_DISPATCHED, _("Dispatched")),
    (ORDER_STATUS_RESOLVED, _("Resolved")),
    (ORDER_STATUS_CANCELLED, _("Cancelled")),
    (ORDER_STATUS_REFUNDED, _("Refunded")),
)

ORDER_REACTS_TO_PAYMENTS = (
    ORDER_STATUS_NEW,
    ORDER_STATUS_CONFIRMED,
    ORDER_STATUS_DEPOSIT_PAID,
)

ORDER_CAN_BE_DELETED = (ORDER_STATUS_NEW, )

ORDER_CAN_BE_CANCELLED = (
    ORDER_STATUS_CONFIRMED,
    ORDER_STATUS_DEPOSIT_PAID,
)


def generate_payment_qr_svg(
    amount, iban, bic, currency, variable_symbol, message
):
    emv_header = "SPD*1.0*"
    code_vars = [
        f"ACC:{iban}+{bic}",
        f"AM:{amount}",
        f"CC:{currency}",
        f"RF:{variable_symbol}",
        f"MSG:{message}",
        f"X-VS:{variable_symbol}",
    ]
    code = emv_header + "*".join(code_vars)
    factory = qrcode.image.svg.SvgImage
    buffer = BytesIO()
    qr = qrcode.make(code, image_factory=factory)
    qr.save(buffer)
    buffer.seek(0)
    return buffer.getvalue().decode('utf-8')


class EnabledField(BooleanField):

    def __init__(self, *args, **kwargs):
        kwargs.setdefault("default", True)
        kwargs.setdefault("verbose_name", _("Enabled"))
        super().__init__(*args, **kwargs)


class PriceLevel(PublicModel):
    """
    PriceLevel represents an abstract level for a price of a product. For
    example, a product can have base price 250, but early birds can get it
    for 200.
    """

    class Meta:
        verbose_name = _("Price Level")
        verbose_name_plural = _("Price Levels")

    enabled = EnabledField()


class EshopProduct(TimeStampedModel):
    """
    EshopProduct is a generic class to be used for everything you want to sell.
    """

    class Meta:
        verbose_name = _("E-shop Product")
        verbose_name_plural = _("E-shop Products")

    description = CharField(
        max_length=255,
        help_text=_(("Description is automatically generated"
                     "summary of the product")),
    )
    price_includes = MarkdownField(
        blank=True,
        help_text=_("Desription of services included in price"),
        null=True,
        verbose_name=_("Price includes"),
    )

    def save(self, *args, **kwargs):
        """
        Store the item description to make it easy to describe this order item
        on the invoice
        """
        self.description = self.get_description()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.description

    def get_description(self):
        raise NotImplementedError()

    def get_active_price(self):
        now = timezone.now()
        return self.prices.filter(
            Q(available_since__isnull=True) | Q(available_since__lte=now),
            Q(available_until__isnull=True) | Q(available_until__gt=now),
        ).get()


class ProductPrice(TimeStampedModel):
    """
    ProductPrice represents product price in a price level and a currency.
    """

    class Meta:
        unique_together = ("product", "price_level")
        ordering = ('available_since', 'available_until')
        verbose_name = _("E-shop Product Price")
        verbose_name_plural = _("E-shop Product Prices")

    product = ForeignKey(
        EshopProduct,
        on_delete=CASCADE,
        related_name="prices",
        verbose_name=_("Product"),
    )
    price_level = ForeignKey(
        PriceLevel,
        on_delete=RESTRICT,
        related_name="prices",
        verbose_name=_("Price level"),
    )
    price = MoneyField(
        verbose_name=_("Price"),
        default=0,
    )
    available_since = DateTimeField(
        null=True,
        blank=True,
        verbose_name=_("Available since"),
    )
    available_until = DateTimeField(
        null=True,
        blank=True,
        verbose_name=_("Available until"),
    )

    def __str__(self):
        return "{price_level} ({price}): {product}".format(
            price=self.price,
            price_level=self.price_level,
            product=self.product,
        )

    def is_available(self):
        now = timezone.now()
        since = not self.available_since or self.available_since <= now
        until = not self.available_until or now <= self.available_until
        return since and until


class OrderInvoiceAddress(UserAddressBase):
    country = ForeignKey(
        "fantasion_locations.Country",
        on_delete=CASCADE,
        related_name='order_invoice_addresses',
        verbose_name=_('Country'),
    )


class Order(TimeStampedModel):

    class Meta:
        verbose_name = _("E-shop Order")
        verbose_name_plural = _("E-shop Orders")

    owner = ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=RESTRICT,
        related_name="orders",
        verbose_name=_("Order owner"),
    )
    status = PositiveIntegerField(
        choices=ORDER_STATES,
        verbose_name=_("Order Status"),
        default=ORDER_STATUS_NEW,
    )
    promise = ForeignKey(
        "fantasion_banking.Promise",
        null=True,
        blank=True,
        on_delete=CASCADE,
        verbose_name=_("Payment Promise"),
    )
    price = MoneyField(default=0, verbose_name=_("Total Price"))
    deposit = MoneyField(
        default=0,
        verbose_name=_("Deposit"),
    )
    use_deposit_payment = BooleanField(
        default=False,
        help_text=_(
            "System will split the payment into deposit and surcharge based "
            "on Order Items configuration"),
        verbose_name=_("Use Deposit Payment"),
    )
    request_insurance = BooleanField(
        default=False,
        verbose_name=_("Insurance Request"),
        help_text=_(
            "The Order Owner requested assistance with getting insurance and "
            "expects to be contacted by Fantasion staff."),
    )
    submitted_at = DateTimeField(
        null=True,
        blank=True,
        verbose_name=_('Submitted at'),
    )
    user_invoice_address = ForeignKey(
        'fantasion.UserAddress',
        null=True,
        blank=True,
        on_delete=SET_NULL,
    )
    invoice_address = ForeignKey(
        'OrderInvoiceAddress',
        null=True,
        blank=True,
        on_delete=RESTRICT,
    )

    @property
    def variable_symbol(self):
        ident = str(self.id)
        padding = "0" * (8 - len(ident))
        year = date.today().strftime("%y")
        return f"{year}{padding}{ident}"

    def calculate_price(self):
        data = self.order_items.aggregate(Sum('price'))
        return max(0, data['price__sum'] or 0)

    def calculate_deposit(self):
        if self.use_deposit_payment:
            base = self.price
            return base / 2
        return 0

    def can_be_modified(self):
        return self.status in ORDER_CAN_BE_DELETED

    def get_surcharge(self):
        return self.price - self.deposit

    def get_earliest_troop_start(self):
        Signup = apps.get_model('fantasion_signups', 'Signup')
        signup = Signup.objects.filter(
            order=self, ).order_by('troop__starts_at').first()
        if signup:
            return signup.troop.starts_at - timedelta(days=5)
        return date.today() + timedelta(days=14)

    def get_deposit_maturity(self):
        return min(
            self.created.date() + timedelta(days=14),
            self.get_earliest_troop_start(),
        )

    def get_surcharge_maturity(self):
        return min(
            self.created.date() + timedelta(days=60),
            self.get_earliest_troop_start(),
        )

    def create_debt(self, **kwargs):
        Debt = apps.get_model("fantasion_banking", "Debt")
        debt = Debt(
            promise=self.promise,
            source=DEBT_SOURCE_GENERATED_ORDER,
            **kwargs,
        )
        debt.save()
        return debt

    def create_deposit_debts(self):
        self.create_debt(
            amount=self.deposit,
            debt_type=DEBT_TYPE_DEPOSIT,
            maturity=self.get_deposit_maturity(),
        )
        self.create_debt(
            amount=self.get_surcharge(),
            debt_type=DEBT_TYPE_SURCHARGE,
            maturity=self.get_surcharge_maturity(),
        )

    def create_promise(self):
        Promise = apps.get_model("fantasion_banking", "Promise")
        self.promise = Promise(
            title=str(self),
            amount=0,  # Prevents creating initial debt
            initial_amount=self.price,
            variable_symbol=self.variable_symbol)
        self.promise.save()
        if self.use_deposit_payment:
            self.create_deposit_debts()
        else:
            self.create_debt(
                amount=self.price,
                debt_type=DEBT_TYPE_FULL_PAYMENT,
                maturity=self.get_deposit_maturity(),
            )
        self.promise.save()
        self.save()

    def notify_order_confirmed(self):
        subject = (_("Order {number}")).format(number=self.variable_symbol)
        total = self.deposit if self.use_deposit_payment else self.price
        status_url = f"{settings.APP_WEBSITE_URL}/{get_lang()}/prehled"

        qr_code_svg = generate_payment_qr_svg(
            amount=total,
            iban=settings.BANK_ACCOUNT_IBAN,
            bic=settings.BANK_ACCOUNT_BIC,
            currency="CZK",
            variable_symbol=self.variable_symbol,
            message=f"Platba za objednávku: {self.id}",
        )

        body = render_to_string(
            'mail/order_confirmation.html',
            context={
                'account_number': settings.BANK_ACCOUNT_NUMBER,
                'items': self.order_items.all(),
                'total': total,
                'variable_symbol': self.variable_symbol,
                'status_url': status_url,
                'website_url': settings.APP_WEBSITE_URL,
                'qr_code_svg': escape(qr_code_svg),
            },
        )
        send_mail([self.owner.email], subject, body)

    def confirm(self):
        self.status = ORDER_STATUS_CONFIRMED
        address = self.user_invoice_address
        self.invoice_address = OrderInvoiceAddress(
            city=address.city,
            street=address.street,
            street_number=address.street_number,
            country=address.country,
            postal_code=address.postal_code,
            user=self.owner,
            order=self,
        )
        self.invoice_address.save()
        self.save()

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        for item in self.order_items.all():
            Model = apps.get_model(item.product_type)
            Model.objects.get(pk=item.pk).save(avoid_order_save=True)
        self.price = self.calculate_price()
        self.deposit = self.calculate_deposit()
        if self.status == ORDER_STATUS_CONFIRMED and not self.promise:
            self.submitted_at = timezone.now()
            self.create_promise()
            self.notify_order_confirmed()
        super().save(*args, **kwargs)

    def sync_with_promise(self, promise=None):
        p = promise or self.promise
        if p.status in PROMISE_WAS_PAID:
            self.status = ORDER_STATUS_PAID
        elif p.status == PROMISE_STATUS_DEPOSIT_PAID:
            self.status = ORDER_STATUS_DEPOSIT_PAID
        self.save()

    def is_cancellable(self):
        return self.status in ORDER_CAN_BE_CANCELLED

    def __str__(self):
        model_name = _("E-shop Order")
        return f"{model_name}#{self.id}"

    def cancel(self):
        if not self.is_cancellable():
            raise PermissionDenied(
                _(f"Cannot delete order in status {self.status}"))
        self.status = ORDER_STATUS_CANCELLED
        self.save()

    def is_payable(self):
        return self.status in ORDER_REACTS_TO_PAYMENTS

    calculate_price.short_description = _('Price')
    get_surcharge.short_description = _('Surcharge')


def product_price_available(product_price_id):
    value = ProductPrice.objects.get(pk=product_price_id)
    if not value.is_available():
        raise ValidationError(_("This product price is not available."))


class OrderItem(TimeStampedModel):

    class Meta:
        verbose_name = _("E-shop Order Item")
        verbose_name_plural = _("E-shop Order Items")

    order = ForeignKey(
        Order,
        on_delete=CASCADE,
        related_name="order_items",
        verbose_name=_("E-shop Order"),
    )
    product_price = ForeignKey(
        "fantasion_eshop.ProductPrice",
        blank=True,
        null=True,
        on_delete=RESTRICT,
        related_name="order_items",
        verbose_name=_("Product Price"),
        validators=[product_price_available],
    )
    price = MoneyField(verbose_name=_("Real Price"))
    product_type = CharField(
        max_length=63,
        verbose_name=_("Product Type"),
    )

    def save(self, avoid_order_save=False, *args, **kwargs):
        if not self.product_type:
            self.product_type = self.get_product_type()
        """
        Backup price and currency in case the parent objects change. The price
        of existing order item must not change.
        """
        if self.price is None and self.product_price:
            self.price = self.product_price.price
        self.recalculate()
        """
        Store the item description to make it easy to describe this order item
        on the invoice
        """
        self.description = self.get_description()
        super().save(*args, **kwargs)
        if not avoid_order_save:
            self.order.save()

    def delete(self, *args, **kwargs):
        order = self.order
        super().delete(*args, **kwargs)
        order.save()

    def get_description(self):
        raise NotImplementedError()

    def get_product_type(self):
        Model = type(self)
        return f"{Model._meta.app_label}.{Model._meta.object_name}"

    def remarshall(self):
        Model = apps.get_model(self.product_type)
        return Model.objects.get(pk=self.pk)

    def recalculate(self):
        pass

    @property
    def static_description(self):
        pp = self.product_price
        if pp:
            return self.product_price.product.description
        Model = apps.get_model(self.product_type)
        return Model._meta.verbose_name


class PromotionCode(TimeStampedModel):

    class Meta:
        verbose_name = _("Promotion Code")
        verbose_name_plural = _("Promotion Codes")

    code = CharField(
        max_length=63,
        unique=True,
        validators=[MinLengthValidator(7)],
        verbose_name=_("Promotion Code"),
        help_text=_(
            "Type an unique code with combination of letters, numbers and "
            "symbols that are not too difficult to type"),
    )
    discount = DecimalField(
        decimal_places=3,
        max_digits=5,
        validators=[MaxValueValidator(100),
                    MinValueValidator(0.001)],
        verbose_name=_("Discount"),
        help_text=_("This percentage will be cut of the total order price."),
    )
    max_discount = MoneyField(
        blank=True,
        null=True,
        verbose_name=_("Maximum discount"),
        help_text=_("The system will cap the absolute discount."),
    )
    max_usages = PositiveIntegerField(
        default=10,
        validators=[MinValueValidator(1)],
        verbose_name=_("Maximum Usages"),
        help_text=_(
            "This Promotion Code can be used only so many times, then it "
            "will be deactivated"),
    )
    enabled = EnabledField()
    valid_from = DateTimeField(
        blank=True,
        null=True,
        verbose_name=_("Valid from"),
        help_text=_(
            "This Promotion Code will be invalid until this date and time"),
    )
    valid_until = DateTimeField(
        blank=True,
        null=True,
        verbose_name=_("Valid until"),
        help_text=_(
            "This Promotion Code will be invalid after this date and time"),
    )

    @property
    def discount_formatted(self):
        return f"{self.discount * 100} %"

    def __str__(self):
        return f"{self.code} ({self.discount_formatted})"


class OrderPromotionCode(OrderItem):

    class Meta:
        verbose_name = _("Order Promotion Code")
        verbose_name_plural = _("Order Promotion Codes")

    promotion_code = ForeignKey(
        'PromotionCode',
        on_delete=RESTRICT,
        verbose_name=_('Promotion Code'),
    )

    def get_abs_discount(self):
        base_price_data = self.order.order_items.exclude(
            product_type=self.get_product_type()).aggregate(Sum('price'))
        base_price = base_price_data['price__sum'] or 0

        promotion_code = self.promotion_code
        relative_discount = base_price * promotion_code.discount
        if promotion_code.max_discount:
            return min(relative_discount, promotion_code.max_discount)
        return relative_discount

    def recalculate(self):
        self.price = -1 * self.get_abs_discount()

    def get_description(self):
        label = _("Discount")
        return f"{label} ({self.promotion_code.discount_formatted})"


@receiver(post_save, sender="fantasion_banking.Promise")
def set_order_state(sender, instance, **kwargs):
    orders = Order.objects.filter(
        promise=instance,
        status__in=ORDER_REACTS_TO_PAYMENTS,
    )
    for order in orders:
        order.sync_with_promise(instance)
