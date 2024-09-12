from channels.sessions import CookieMiddleware, SessionMiddleware
from channels.auth import AuthMiddleware, get_user


class CustomAuthMiddleware(AuthMiddleware):
    async def resolve_scope(self, scope):
        scope["user"]._wrapped = await get_user(scope)

        if not scope['user'].is_authenticated:
            raise ValueError('UnAuthenticated')


def AuthMiddleWareStack(inner):
    return CookieMiddleware(SessionMiddleware(CustomAuthMiddleware(inner)))