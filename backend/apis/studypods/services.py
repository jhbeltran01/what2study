from cryptography.fernet import Fernet
from django.conf import settings
import os
import ast

from common.models import StudypodReviewer, StudypodDefinitionIsAnsweredCorrectly, Title, \
    StudypodEnumerationIsCorrectlyAnswered
from common.services import generate_unique_id

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


class GenerateIsCorrectlyAnsweredObj:
    def __init__(self, studypod, reviewer):
        self.studypod = studypod
        self.reviewer = reviewer

    def generate(self):
        self.generate_definition_is_correctly_answered()
        self.generate_enumeration_is_answered_correctly()

    def generate_definition_is_correctly_answered(self):
        definitions = self.reviewer.definitions.all()
        objs = []
        for definition in definitions:
            objs.append(StudypodDefinitionIsAnsweredCorrectly(
                studypod=self.studypod,
                reviewer=self.reviewer,
                definition=definition,
                slug=generate_unique_id(),
            ))
        StudypodDefinitionIsAnsweredCorrectly.definitions.bulk_create(objs)

    def generate_enumeration_is_answered_correctly(self):
        enumerations = self.reviewer.titles.filter(type=Title.Type.ENUMERATION)
        objs = []
        for title in enumerations:
            objs.append(StudypodEnumerationIsCorrectlyAnswered(
                studypod=self.studypod,
                reviewer=self.reviewer,
                title=title,
                slug=generate_unique_id(),
            ))
        StudypodEnumerationIsCorrectlyAnswered.titles.bulk_create(objs)
