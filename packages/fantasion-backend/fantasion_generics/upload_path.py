import os

from uuid import uuid4
from datetime import datetime

def get_upload_path(instance, filename):
    date = datetime.today()
    name, extension = os.path.splitext(filename)
    return '{base_dir}/{date}-{uuid}{extension}'.format(
        base_dir=instance.upload_dir,
        date=date.strftime('%Y-%m-%d'),
        uuid=uuid4().hex,
        extension=extension,
    )
