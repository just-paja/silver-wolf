import os

from datetime import datetime
from re import sub
from uuid import uuid4


def get_upload_path(instance, filename):
    date = datetime.today()
    name, extension = os.path.splitext(filename)
    return 'media/{base_dir}/{date}-{uuid}{extension}'.format(
        base_dir=instance.upload_dir,
        date=date.strftime('%Y-%m-%d'),
        uuid=uuid4().hex,
        extension=extension,
    )


ksub = r"[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+"


def kebab(s):
    return '-'.join(
        sub(r"(\s|_|-)+", " ",
            sub(ksub, lambda mo: ' ' + mo.group(0).lower(), s)).split())
