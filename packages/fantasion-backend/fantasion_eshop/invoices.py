from .serializers import InvoiceSerializer
from .pdf import render_pdf


def render_invoice(inst):
    serializer = InvoiceSerializer(inst)
    file = render_pdf('eshop/invoice.html', serializer.data)
    file.name = f"invoice-{inst.variable_symbol}.pdf"
    return file
