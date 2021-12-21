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


class Currency(TimeStampedModel):
    """
    Currency represents a a currency to be used in eshop orders. Currencies can
    be converted between each other.
    """
    # Three+ letter code based on ISO-4217
    code = CharField(max_length=15)
    # Local name
    title = TitleField()
    # Exchange rate to base currency (CZK)
    exchange_rate = DecimalField(max_digits=9, decimal_places=6)
    enabled = BooleanField(default=True)

    def __str__(self):
        return self.code


class PriceLevel(PublicModel):
    """
    PriceLevel represents an abstract level for a price of a product. For
    example, a product can have base price 250, but early birds can get it
    for 200.
    """
    enabled = BooleanField(default=True)


class EshopProduct(TimeStampedModel):
    """
    EshopProduct is a generic class to be used for everything you want to sell.
    """
    description = CharField(
        max_length=255,
        help_text=_((
            'Description is automatically generated'
            'summary of the product'
        )),
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
    product = ForeignKey(
        EshopProduct,
        on_delete=CASCADE,
        related_name='prices',
    )
    price_level = ForeignKey(
        PriceLevel,
        on_delete=RESTRICT,
        related_name='prices',
    )
    currency = ForeignKey(
        Currency,
        on_delete=RESTRICT,
        related_name='prices',
    )
    amount = DecimalField(
        decimal_places=2,
        max_digits=15,
        verbose_name=_('Amount'),
    )
    available_since = DateTimeField(
        null=True,
        blank=True,
    )
    available_until = DateTimeField(
        null=True,
        blank=True,
    )

    class Meta:
        unique_together = ('product', 'price_level', 'currency')

    def __str__(self):
        return '{product} {price_level} ({currency})'.format(
            product=self.product,
            price_level=self.price_level,
            currency=self.currency,
        )


class Order(TimeStampedModel):
    owner = ForeignKey(
        'auth.User',
        related_name='orders',
        on_delete=RESTRICT
    )


class OrderItem(TimeStampedModel):
    order = ForeignKey(
        Order,
        on_delete=CASCADE,
        related_name='order_items',
    )
    product_price = ForeignKey(
        'fantasion_eshop.ProductPrice',
        on_delete=RESTRICT,
        related_name='order_items',
    )
    price = DecimalField(
        decimal_places=2,
        max_digits=9,
        verbose_name=_('Price'),
    )
    currency = ForeignKey(
        Currency,
        on_delete=RESTRICT,
        related_name='order_items'
    )

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
