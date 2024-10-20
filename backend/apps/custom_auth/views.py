from django.contrib.auth.views import LoginView
from django.views.generic import CreateView

from rest_framework.reverse import reverse_lazy

from .services import redirect_to_app
from .forms import UserForm


class CustomLoginView(LoginView):
    template_name = 'authentication/login.html'

    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect_to_app()
        return super().dispatch(request, *args, **kwargs)


class CreateAccount(CreateView):
    template_name = 'authentication/create-account.html'
    form_class = UserForm
    success_url = reverse_lazy('custom_auth:login')
