from rest_framework.generics import GenericAPIView
from rest_framework.mixins import UpdateModelMixin

from apis.authentication.serializers import UserInfoSerializer
from apis.authentication.models import User


class UserInfoAPIView(
    UpdateModelMixin,
    GenericAPIView,
):
    serializer_class = UserInfoSerializer
    lookup_field = 'username'
    queryset = User.objects.all()

    def patch(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return super().update(request, *args, **kwargs)
