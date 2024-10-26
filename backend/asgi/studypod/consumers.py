import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from apis.authentication.serializers import UserInfoSerializer
from asgi.studypod.services import (
    GenerateQuestion,
    GetReviewer, Answer,
)
from common.models import StudyPod

INCREMENT = 'I'
DECREMENT = 'D'

connected_users = {}
moderators = {}
user_answers = {}
last_action = {}

class StudyPodBaseConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        global connected_users, moderators, user_answers, last_action

        self.study_pod_name = ''
        self.room_name = ''
        self.study_pod = ''
        self.reviewer = None
        self.connected_users = connected_users
        self.moderators = moderators
        self.room_user_answers = user_answers
        self.user = None
        self.data = None
        self.last_action = last_action

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_name,
            self.channel_name
        )
        self.update_number_of_connected_users(DECREMENT)
        self._update_moderator(is_disconnected=True)

    async def initiate_connect(self):
        self.study_pod_name = self.scope['url_route']['kwargs']['study_pod_slug']
        self.set_room_name(root_name='study_pod')
        await self.set_study_pod_instance()
        await self.channel_layer.group_add(
            self.room_name,
            self.channel_name
        )
        await self.accept()

    async def set_study_pod_instance(self):
        self.study_pod = await self.get_study_pod()

    @database_sync_to_async
    def get_study_pod(self):
        return StudyPod.groups.filter(slug=self.study_pod_name).first()

    def set_room_name(self, root_name=''):
        self.room_name = '{}_{}'.format(
            root_name,
            self.study_pod_name
        )

    async def channel_group_send(self, data, channel_type):
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': channel_type,
                'data': data
            }
        )

    async def _send_message_to_room(self):
        await self.channel_group_send(self.data, 'send_message')

    async def _send_message_to_self(self):
        await self.send(text_data=json.dumps(self.data))

    def update_number_of_connected_users(self, action=INCREMENT):
        room_connected_users = self.connected_users.get(self.room_name, 0)
        if room_connected_users == 0:
            self.connected_users[self.room_name] = 1
            self._update_moderator()
            return

        if room_connected_users == 0:
            del self.connected_users[self.room_name]

        if room_connected_users > 0:
            self.connected_users[self.room_name] = self.connected_users[self.room_name] + 1 if action == INCREMENT else self.connected_users[self.room_name] - 1

    def _update_moderator(self, is_disconnected=False):
        local_connected_users = self.connected_users.get(self.room_name, 0)
        # the first connected user is the moderator
        if local_connected_users == 1:
            self._set_moderator(self.user)

        if local_connected_users == 0:
            self._set_moderator(None)

        room_moderator_has_disconnected = self.moderators[self.room_name].id == self.user.id

        if is_disconnected and room_moderator_has_disconnected:
            self.moderators[self.room_name] = None

    def _set_moderator(self, user):
        if user is None:
            # delete all room data if all the users has disconnected
            del self.moderators[self.room_name]
            del self.connected_users[self.room_name]
            del self.moderators[self.room_name]
            del self.room_user_answers[self.room_name]
            del self.last_action[self.room_name]
        else:
            self.moderators[self.room_name] = user


class StudyPodConsumer(StudyPodBaseConsumer):
    GENERATE_QUESTION = 'GENERATE_QUESTION'
    SELECT_REVIEWER = 'SELECT_REVIEWER'
    SUBMIT_ANSWER = 'SUBMIT_ANSWER'
    SHOW_RESULTS = 'SHOW_RESULTS'
    UPDATE_MODERATOR = 'UPDATE_MODERATOR'
    SYNC_TO_ROOM = 'SYNC_TO_ROOM'
    RETRIEVE_REVIEWER_LIST = 'RETRIEVE_REVIEWER_LIST'

    async def connect(self):
        self.user = self.scope['user']
        await self.initiate_connect()
        self.update_number_of_connected_users()
        self._update_moderator()
        await self._set_action_to_retrieve_reviewer_list_if_the_moderator()
        await self._set_action_to_sync_to_room_if_not_the_moderator()

    async def receive(self, text_data=None, bytes_data=None):
        self.data = json.loads(text_data)
        will_send_message_to_room = True
        action = self.data['action']

        match action:
            case self.SYNC_TO_ROOM:
                if self._has_moderator():
                    self._sync_to_room()
                    will_send_message_to_room = False
            case self.RETRIEVE_REVIEWER_LIST:
                if self._has_moderator():
                    will_send_message_to_room = self._retrieve_reviewer_list()
            case self.SELECT_REVIEWER:
                if self._has_moderator():
                    await self._select_reviewer()
            case self.GENERATE_QUESTION:
                if self._has_moderator():
                    await self._generate_question()
            case self.SUBMIT_ANSWER:
                if self._has_moderator():
                    await self._submit_answer()
                    will_send_message_to_room = False
            case self.SHOW_RESULTS:
                if self._has_moderator():
                    await self._show_results()
            case self.UPDATE_MODERATOR:
                if not self._has_moderator():
                    self._update_new_moderator()
                else:
                    self._has_existing_moderator()
                    will_send_message_to_room = False
            case _:
                self.data = self._get_data(
                    self.data, {
                        'isUnknownAction': True,
                        'error': 'Unknown action.'
                    }
                )

        if will_send_message_to_room:
            await self._send_message_to_room()
            self._set_last_action(action)
        else:
            await self._send_message_to_self()

    async def send_message(self, event):
        await self.send(text_data=json.dumps(event['data']))

    async def _set_action_to_retrieve_reviewer_list_if_the_moderator(self):
        if self.connected_users[self.room_name] != 1:
            return

        self.data = {'action': "RETRIEVE_REVIEWER_LIST"}
        await self._send_message_to_self()

    async def _set_action_to_sync_to_room_if_not_the_moderator(self):
        if self.connected_users[self.room_name] == 1:
            return

        self.data = {'action': "SYNC_TO_ROOM"}
        await self._send_message_to_self()

    @staticmethod
    def _get_data(data, content):
        return {
            **data,
            "content": content
        }

    def _sync_to_room(self):
        self.data = {
            **self.data,
            "last_action": self.last_action[self.room_name]
        }

    """@TODO: retrieve the reviewers that belongs on the studypod"""
    def _retrieve_reviewer_list(self):
        is_the_moderator = self.moderators[self.room_name].id == self.user.id
        self.data = self._get_data(self.data, {'reviewers': []})
        return is_the_moderator

    def _set_last_action(self, action):
        self.last_action[self.room_name] = action

    def _has_moderator(self):
        has_moderator = self.moderators[self.room_name] is not None
        if not has_moderator:
            self.data = self._get_data(
                self.data,
                {
                    'has_no_moderator': True,
                    'error': 'A moderator must be chosen first.'
                }
            )
        return has_moderator

    async def _generate_question(self):
        question = GenerateQuestion(
            reviewer=self.reviewer,
            data=self.data,
            user=self.user,
            moderator=self.moderators[self.room_name],
            number_of_questions=self.data['number_of_questions']
        )
        data = await question.generate()

        questions = data['questions']

        if questions is not None:
            self.room_user_answers[self.room_name] = {
                "questions": data['questions'],
            }

    async def _select_reviewer(self):
        reviewer = GetReviewer(
            slug=self.data['reviewer_slug'],
            data=self.data,
            user=self.user,
            moderator=self.moderators[self.room_name],
        )
        self.data = await reviewer.get()
        self.reviewer = reviewer.get_obj()

    async def _submit_answer(self):
        answer = Answer(
            user=self.user,
            answers=self.data.pop('answers', []),
            user_answers=self.room_user_answers[self.room_name],
            questions=self.room_user_answers[self.room_name]['questions'],
            data=self.data,
            room_name=self.room_name
        )
        answer.submit()
        self.data = self._get_data(self.data, {'success': 'Answer has been submitted.'})

    async def _show_results(self):
        answers = self.room_user_answers.get(self.room_name, {})

        if answers is {}:
            self. data = self._get_data(
                self.data,
                {
                    'has_no_submitted_answers': True,
                    'error': 'No submitted answers.'
                }
            )
            return

        self.data = self._get_data(self.data, answers)

    def _update_new_moderator(self):
        message = 'The moderator has been'
        moderator = None if self.data['unset_moderator'] is None else self.user
        self.moderators[self.room_name] = moderator

        self.data = self._get_data(
            self.data,
            {
                'moderatorHasBeenSet': moderator is not None,
                'message': '{} unset.'.format(message) if moderator is None else '{} set.'.format(message),
                'moderator': None if moderator is None else UserInfoSerializer(self.user).data
            }
        )

    def _has_existing_moderator(self):
        self.data = self._get_data(
            self.data,
            {
                'has_an_existing_moderator': True,
                'error': 'There is an existing moderator.',
            }
        )