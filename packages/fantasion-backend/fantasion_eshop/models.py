from django.utils.translation import ugettext_lazy as _
from django_extensions.db.models import TimeStampedModel
from django.db.models import (
    BooleanField,
    CharField,
    DateTimeField,
    DecimalField,
    ForeignKey,
    CASCADE,
    RESTRICT,
)

from fantasion_generics.models import PublicModel
from fantasion_generics.titles import TitleField


class EnabledField(BooleanField):
    def __init__(self, *args, **kwargs):
        kwargs.setdefault('default', True)
        kwargs.setdefault('verbose_name', _('Enabled'))
        super().__init__(*args, **kwargs)


class Currency(TimeStampedModel):
    """
    Currency represents a a currency to be used in eshop orders. Currencies can
    be converted between each other.
    """
    class Meta:
        verbose_name = _('Currency')
        verbose_name_plural = _('Currencies')

    # Three+ letter code based on ISO-4217
    code = CharField(
        max_length=15,
        verbose_name=_('Code'),
        help_text=_('Currency code respecting ISO 4217.'),
    )
    # Local name
    title = TitleField()
    exchange_rate = DecimalField(
        decimal_places=6,
        help_text=_('Exchange rate to base currency (CZK)'),
        max_digits=9,
        verbose_name=_('Exchange rate'),
    )
    enabled = EnabledField()

    def __str__(self):
        return self.code


class PriceLevel(PublicModel):
    """
    PriceLevel represents an abstract level for a price of a product. For
    example, a product can have base price 250, but early birds can get it
    for 200.
    """
    class Meta:
        verbose_name = _('Price Level')
        verbose_name_plural = _('Price Levels')

    enabled = EnabledField()


class EshopProduct(TimeStampedModel):
    """
    EshopProduct is a generic class to be used for everything you want to sell.
    """
    class Meta:
        verbose_name = _('E-shop Product')
        verbose_name_plural = _('E-shop Products')

    description = CharField(
        max_length=255,
        help_text=_(('Description is automatically generated'
                     'summary of the product')),
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
        unique_together = ('product', 'price_level', 'currency')
        verbose_name = _('E-shop Product Price')
        verbose_name_plural = _('E-shop Product Prices')

    product = ForeignKey(
        EshopProduct,
        on_delete=CASCADE,
        related_name='prices',
        verbose_name=_('Product'),
    )
    price_level = ForeignKey(
        PriceLevel,
        on_delete=RESTRICT,
        related_name='prices',
        verbose_name=_('Price level'),
    )
    currency = ForeignKey(
        Currency,
        on_delete=RESTRICT,
        related_name='prices',
        verbose_name=_('Currency'),
    )
    amount = DecimalField(
        decimal_places=2,
        max_digits=15,
        verbose_name=_('Amount'),
    )
    available_since = DateTimeField(
        null=True,
        blank=True,
        verbose_name=_('Available since'),
    )
    available_until = DateTimeField(
        null=True,
        blank=True,
        verbose_name=_('Available until'),
    )

    def __str__(self):
        return '{product} {price_level} ({currency})'.format(
            product=self.product,
            price_level=self.price_level,
            currency=self.currency,
        )


class Order(TimeStampedModel):
    class Meta:
        verbose_name = _('E-shop Order')
        verbose_name_plural = _('E-shop Orders')

    owner = ForeignKey(
        'auth.User',
        blank=True,
        null=True,
        on_delete=RESTRICT,
        related_name='orders',
        verbose_name=_('Order owner'),
    )


class OrderItem(TimeStampedModel):
    class Meta:
        verbose_name = _('E-shop Order Item')
        verbose_name_plural = _('E-shop Order Items')

    order = ForeignKey(
        Order,
        on_delete=CASCADE,
        related_name='order_items',
        verbose_name=_('E-shop Order'),
    )
    product_price = ForeignKey(
        'fantasion_eshop.ProductPrice',
        on_delete=RESTRICT,
        related_name='order_items',
        verbose_name=_('Product Price'),
    )
    price = DecimalField(
        decimal_places=2,
        max_digits=9,
        verbose_name=_('Price'),
    )
    currency = ForeignKey(Currency,
                          on_delete=RESTRICT,
                          related_name='order_items',
                          verbose_name=_('Currency'))

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
