from cryptography.fernet import Fernet
from django.conf import settings
import os
import ast


key = settings.FERNET_KEY
cipher_suite = Fernet(key)

def encrypt_text(plain_text):
    cipher_text = cipher_suite.encrypt(plain_text.encode())
    return cipher_text.decode('utf-8')


def decrypt_data(string):
    cipher_text = string.encode('utf-8')
    plain_text = cipher_suite.decrypt(cipher_text)
    return plain_text.decode('utf-8')


def add_user_to_studypod(studypod, user_id):
    try:
        studypod.members.index(user_id)
        user_is_in_the_studypod = True
    except ValueError:
        user_is_in_the_studypod = False

    if not user_is_in_the_studypod:
        studypod.members.append(user_id)
        studypod.save()