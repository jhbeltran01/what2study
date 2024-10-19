from channels.db import database_sync_to_async

from apis.authentication.services import JWTTokens
from channels.exceptions import DenyConnection

@database_sync_to_async
def get_user_from_tokens(cookies):
    access_token = cookies['token']
    refresh_token = cookies['refresh']

    if access_token is None or refresh_token is None:
        raise DenyConnection('User credentials not provided')

    jwt_auth = JWTTokens(
        access_token=access_token,
        refresh_token=refresh_token
    )
    jwt_auth.check_for_tokens_expirations()
    return jwt_auth.user