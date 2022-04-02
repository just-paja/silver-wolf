from django.utils.translation import ugettext_lazy as _
from django_extensions.db.models import TimeStampedModel
from django.conf import settings
from django.db.models import Sum
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
        return "{product} {price_level}".format(
            product=self.product,
            price_level=self.price_level,
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

    def calculate_price(self):
        data = self.order_items.aggregate(Sum('price'))
        return data['price__sum']

    calculate_price.short_description = _('Price')


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
        on_delete=RESTRICT,
        related_name="order_items",
        verbose_name=_("Product Price"),
    )
    price = MoneyField(verbose_name=_("Real Price"))

    def save(self, *args, **kwargs):
        """
        Backup price and currency in case the parent objects change. The price
        of existing order item must not change.
        """
        self.price = self.product_price.amount
        self.currenct = self.product_price.currency
        """
        Store the item description to make it easy to describe this order item
        on the invoice
        """
        self.description = self.get_description()
        super().save(*args, **kwargs)

    def get_description(self):
        raise NotImplementedError()


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
