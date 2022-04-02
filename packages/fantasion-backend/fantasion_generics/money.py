from djmoney.models.fields import MoneyField as DjMoneyField


class MoneyField(DjMoneyField):
    def __init__(self, *args, **kwargs):
        kwargs.setdefault("max_digits", 14)
        kwargs.setdefault("decimal_places", 2)
        kwargs.setdefault("default_currency", "CZK")
        super().__init__(*args, **kwargs)
