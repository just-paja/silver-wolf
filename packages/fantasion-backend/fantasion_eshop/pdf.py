import os

from io import BytesIO
from django.conf import settings
from django.core.files.base import File
from django.template.loader import get_template
from django.contrib.staticfiles import finders
from xhtml2pdf import pisa


def link_callback(uri, rel):
    """
    Convert HTML URIs to absolute system paths so xhtml2pdf can access those
    resources
    """
    sUrl = settings.STATIC_URL  # Typically /static/
    sRoot = settings.STATIC_ROOT  # Typically /home/userX/project_static/
    mUrl = settings.MEDIA_URL  # Typically /media/
    mRoot = settings.MEDIA_ROOT
    try:
        result = finders.find(uri.replace(sUrl, ""))
    except:  # noqa
        result = None

    print(f"{sUrl} {sRoot} {mUrl} {mRoot} {result}", flush=True)

    if result:
        if not isinstance(result, (list, tuple)):
            result = [result]
        result = list(os.path.realpath(path) for path in result)
        path = result[0]
    else:
        if uri.startswith(mUrl):
            path = os.path.join(mRoot, uri.replace(mUrl, ""))
        elif uri.startswith(sUrl):
            path = os.path.join(sRoot, uri.replace(sUrl, ""))
        else:
            return uri

    # make sure that file exists
    if not os.path.isfile(path):
        # raise Exception('media URI must start with %s or %s' % (sUrl, mUrl))
        return None
    return path


def render_pdf(template_src, context={}):
    template = get_template(template_src)
    html = template.render(context)
    result = BytesIO()
    pdf = pisa.pisaDocument(
        html.encode("UTF-8"),
        result,
        link_callback=link_callback,
        encoding="UTF-8",
    )
    file = File(result)
    if pdf.err:
        print(pdf.err, flush=True)
        raise pdf.err

    return file
