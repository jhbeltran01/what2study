from django.shortcuts import render
from django.views.generic import TemplateView
from django.shortcuts import render, redirect
from django.contrib.auth import logout


def home(request):
    return render(request, "pages/home.html")

def logout_view(request):
    logout(request)
    return redirect("/")

class dashboard(TemplateView):
    print("efhlwknschi")
    template_name = 'dashboard'
    def get(self, request):
        return render(request, 'pages/dashboard.html')
