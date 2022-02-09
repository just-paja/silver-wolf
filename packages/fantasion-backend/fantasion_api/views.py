from django.http import HttpResponseNotFound

import json


def error404(request, exception):
    response_data = {}
    response_data['detail'] = 'Not found.'
    return HttpResponseNotFound(
        json.dumps(response_data),
        content_type="application/json",
    )
