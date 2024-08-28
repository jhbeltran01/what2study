from django.views.generic import TemplateView


class SingePageApp(TemplateView):
    template_name = 'spa/spa.html'
