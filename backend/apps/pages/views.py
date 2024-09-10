from django.shortcuts import render
from django.views.generic import TemplateView
from django.shortcuts import render, redirect
from django.contrib.auth import logout


class LandingPageView(TemplateView):
    template_name = 'pages/landing-page.html'

def logout_view(request):
    logout(request)
    return redirect("/")