from django.conf import settings
from django.db.models import Sum
from django_extensions.db.models import TimeStampedModel
from django.utils.translation import ugettext_lazy as _
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
)

from fantasion_generics.models import PublicModel
from fantasion_generics.money import MoneyField


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


class ProductPrice(TimeStampedModel):
    """
    ProductPrice represents product price in a price level and a currency.
    """
    class Meta:
        unique_together = ("product", "price_level")
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
    price = MoneyField(verbose_name=_("Price"))
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
    promise = ForeignKey(
        "fantasion_banking.Promise",
        null=True,
        blank=True,
        on_delete=CASCADE,
        verbose_name=_("Payment Promise"),
    )
    price = MoneyField(verbose_name=_("Total Price"))
    deposit = MoneyField(
        default=0,
        verbose_name=_("Deposit"),
    )
    use_deposit_payment = BooleanField(
        default=False,
        help_text=_(
            "System will split the payment into deposit and surcharge based "
            "on Order Items configuration"
        ),
        verbose_name=_("Use Deposit Payment"),
    )

    def calculate_price(self):
        data = self.order_items.aggregate(Sum('price'))
        return data['price__sum'] or 0

    def get_surcharge(self):
        return self.price - self.deposit

    def save(self, *args, **kwargs):
        self.price = self.calculate_price()
        return super().save(*args, **kwargs)

    calculate_price.short_description = _('Price')
    get_surcharge.short_description = _('Surcharge')


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
    )
    price = MoneyField(verbose_name=_("Real Price"))
    product_type = CharField(
        max_length=63,
        verbose_name=_("Product Type"),
    )

    def save(self, *args, **kwargs):
        if not self.product_type:
            self.product_type = self.get_product_type()
        """
        Backup price and currency in case the parent objects change. The price
        of existing order item must not change.
        """
        self.recalculate()
        if self.price is None and self.product_price:
            self.price = self.product_price.price
        """
        Store the item description to make it easy to describe this order item
        on the invoice
        """
        self.description = self.get_description()
        super().save(*args, **kwargs)
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

    def recalculate(self):
        pass


class PromotionCode(TimeStampedModel):
    class Meta:
        verbose_name = _("Promotion Code")
        verbose_name_plural = _("Promotion Codes")

    code = CharField(
        max_length=63,
        unique=True,
        validators=[MinLengthValidator(8)],
        verbose_name=_("Promotion Code"),
        help_text=_(
            "Type an unique code with combination of letters, numbers and "
            "symbols that are not too difficult to type"),
    )
    discount = DecimalField(
        decimal_places=2,
        max_digits=5,
        validators=[MaxValueValidator(100),
                    MinValueValidator(0.01)],
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
            product_type=self.get_product_type()
        ).aggregate(Sum('price'))
        base_price = base_price_data['price__sum'] or 0

        promotion_code = self.promotion_code
        relative_discount = base_price * promotion_code.discount
        if promotion_code.max_discount:
            return min(relative_discount, promotion_code.max_discount)
        return relative_discount

    def recalculate(self):
        self.price = -1 * self.get_abs_discount()

    def get_description(self):
        return f"Sleva: {self.promotion_code.code}"
