"""
ASGI config for core project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

django.setup() 

from asgi.asgi_auth.middlewares import AuthMiddleWareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application
from asgi import routing

django_asgi_app = get_asgi_application()

applications = ProtocolTypeRouter({
        'http': django_asgi_app,
        'websocket': AllowedHostsOriginValidator(
            AuthMiddleWareStack(URLRouter(routing.websocket_urlpatterns))
        )
    }
)
