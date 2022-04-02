from modeltranslation.translator import register, TranslationOptions

from . import models


@register(models.Account)
class AccountTranslationOptions(TranslationOptions):
    fields = ('title', 'description')


@register(models.CounterParty)
class CounterPartyTranslationOptions(TranslationOptions):
    fields = ('title', 'description')


@register(models.Debt)
class DebtTranslationOptions(TranslationOptions):
    fields = ('description', )
