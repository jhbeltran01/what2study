from django.shortcuts import redirect
from django.urls import reverse


def redirect_to_app():
    return redirect(reverse('spa:spa'))