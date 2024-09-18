from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin


class SingePageApp(LoginRequiredMixin, TemplateView):
    template_name = 'spa/index.html'