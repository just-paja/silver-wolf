from rest_framework import decorators, status
from rest_framework.response import Response

from .auth import CsrfExemptAuth


def public_endpoint(methods):

    def wrapper(fn):

        @decorators.api_view(methods)
        @decorators.authentication_classes([CsrfExemptAuth])
        @decorators.permission_classes([])
        def inner(*args, **kwargs):
            return fn(*args, **kwargs)

        def get_extra_actions():
            return []

        inner.get_extra_actions = get_extra_actions
        return inner

    return wrapper


def with_serializer(serializer_class):

    def wrapper(fn):

        def inner(request, *args, **kwargs):
            serializer = serializer_class(data=request.data)
            if serializer.is_valid():
                return fn(request, serializer, *args, **kwargs)
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

        return inner

    return wrapper
