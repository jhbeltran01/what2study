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