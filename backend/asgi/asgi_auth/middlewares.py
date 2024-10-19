from channels.db import database_sync_to_async
from channels.sessions import (
    CookieMiddleware,
    SessionMiddleware,
)
from channels.auth import (
    AuthMiddleware,
    get_user,
    login
)
from channels.exceptions import DenyConnection

from asgi.asgi_auth.services import get_user_from_tokens


class CustomAuthMiddleware(AuthMiddleware):
    async def resolve_scope(self, scope):
        cookies = scope.get('cookies', {})
        scope["user"]._wrapped = await get_user(scope)

        if not scope['user'].is_authenticated:
            # JWT Token authentication will be used for authentication
            # if the websocket request is from other server
            user = await get_user_from_tokens(cookies)
            await login(scope, user)
            scope["user"]._wrapped = user

        if not scope["user"].is_authenticated:
            DenyConnection('User credentials is needed.')


def AuthMiddleWareStack(inner):
    return CookieMiddleware(SessionMiddleware(CustomAuthMiddleware(inner)))