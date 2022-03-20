import requests

from django.conf import settings
from django.contrib.auth import authenticate, login
from django.http import HttpResponseRedirect
from django.shortcuts import redirect
from django.urls import reverse

from oauth2client.client import FlowExchangeError, OAuth2WebServerFlow


flow_kwargs = {
    "client_id": settings.DJANGO_ADMIN_SSO_OAUTH_CLIENT_ID,
    "client_secret": settings.DJANGO_ADMIN_SSO_OAUTH_CLIENT_SECRET,
    "scope": [
        "email",
        "profile",
        "https://apps-apis.google.com/a/feeds/groups/",
    ],
}

flow_override = None


def get_login_flow(request):
    return OAuth2WebServerFlow(
        redirect_uri=request.build_absolute_uri(
            reverse("sso_callback")
        ),
        **flow_kwargs
    )


def authorize(request):
    return HttpResponseRedirect(
        get_login_flow(request).step1_get_authorize_url()
    )


def get_groups(credentials):
    res = requests.get(
        "https://admin.googleapis.com/admin/directory/v1/groups",
        params={
            "domain": settings.DJANGO_ADMIN_SSO_DOMAIN,
            "userKey": credentials.id_token.get("email"),
        },
        headers={
            "Authorization": f"Bearer {credentials.access_token}"
        }
    )
    if res.status_code == 200:
        data = res.json()
        return data["groups"]
    return []


def callback(request):
    if flow_override is None:
        flow = get_login_flow(request)
    else:
        flow = flow_override

    code = request.GET.get("code", None)
    if not code:
        return HttpResponseRedirect(reverse("admin:index"))
    try:
        credentials = flow.step2_exchange(code)
    except FlowExchangeError:
        return HttpResponseRedirect(reverse("admin:index"))

    if credentials.id_token["email_verified"]:
        email = credentials.id_token["email"]
        user = authenticate(
            request,
            first_name=credentials.id_token.get("given_name", None),
            groups=get_groups(credentials),
            last_name=credentials.id_token.get("family_name", None),
            sso_email=email,
        )
        if user and user.is_active:
            login(request, user)
            return HttpResponseRedirect(reverse("admin:index"))

    # if anything fails redirect to admin:index
    return HttpResponseRedirect(reverse("admin:index"))


def gauth(req):
    if settings.DJANGO_ADMIN_SSO:
        return redirect(reverse("sso_login"))
    return redirect(reverse("content:login"))
