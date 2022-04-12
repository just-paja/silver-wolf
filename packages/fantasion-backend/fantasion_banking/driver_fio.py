from datetime import datetime

from djmoney.money import Money
from django.utils import timezone
from fiobank import FioBank

from .statements import Statement


def get(src, attr, default=None):
    return src.get(attr, default)


def sync(account, scrape, *args, **kwargs):
    last = account.get_last_scrape_statement()
    client = FioBank(token=account.fio_readonly_key)

    if last:
        gen = client.last(from_id=last.ident)
    else:
        gen = client.last(from_date='2022-04-01')

    for line in gen:
        defaults = {
            'amount': Money(get(line, 'amount'), get(line, 'currency')),
            'constant_symbol': get(line, 'constant_symbol'),
            'message': get(line, 'recipient_message'),
            'received_at': timezone.make_aware(
                datetime.combine(
                    get(line, 'date'),
                    datetime.min.time(),
                ),
            ),
            'sender_account_number': get(line, 'account_number'),
            'sender_bank': get(line, 'bank_code'),
            'sender_bic': get(line, 'bic'),
            'sender_iban': get(line, 'iban'),
            'specific_symbol': get(line, 'specific_symbol'),
            'user_identification': get(line, 'user_identification'),
            'variable_symbol': get(line, 'variable_symbol'),
            'scrape': scrape,
        }

        Statement.objects.get_or_create(
            ident=line['transaction_id'],
            account=account,
            defaults=defaults,
        )
