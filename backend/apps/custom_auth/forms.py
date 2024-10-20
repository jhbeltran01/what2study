from django.contrib.auth.forms import UserCreationForm
from django import forms
from apis.authentication.models import User


class UserForm(UserCreationForm):
    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'password1',
            'password2',
        ]

    email = forms.CharField(required=True)