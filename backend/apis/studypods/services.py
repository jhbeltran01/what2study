from cryptography.fernet import Fernet
from django.conf import settings
import os
import ast

from common.models import StudypodReviewer

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
    if not is_member_of_studypod(studypod, user_id):
        studypod.members.append(user_id)
        studypod.save()


def is_member_of_studypod(studypod, user_id):
    try:
        studypod.members.index(user_id)
        return True
    except ValueError:
        return False

def leave_studypod(studypod, user_id):
    studypod.members.remove(user_id)
    studypod.save()


def retrieve_reviewer(reviewer_slug, studypod_slug):
    will_retrieve = reviewer_slug is not None
    filter_manager = StudypodReviewer.reviewers.filter

    if will_retrieve:
        return filter_manager(slug=reviewer_slug).first()
    else:
        return filter_manager(studypod__slug=studypod_slug)
