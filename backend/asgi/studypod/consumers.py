import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

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

class StudyPodBaseConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        global connected_users, moderators, user_answers

        self.study_pod_name = ''
        self.room_name = ''
        self.study_pod = ''
        self.reviewer = None
        self.connected_users = connected_users
        self.moderators = moderators
        self.room_user_answers = user_answers
        self.user = None
        self.data = None

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_name,
            self.channel_name
        )
        self.update_number_of_connected_users(DECREMENT)
        self.update_moderator()

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

    def update_number_of_connected_users(self, action=INCREMENT):
        local_connected_users = self.connected_users.get(self.room_name, 0)
        if local_connected_users == 0:
            self.connected_users[self.room_name] = 1
            self.update_moderator()
            return

        if local_connected_users == 0:
            del self.connected_users[self.room_name]

        if local_connected_users > 0:
            self.connected_users[self.room_name] = self.connected_users[self.room_name] + 1 if action == INCREMENT else self.connected_users[self.room_name] - 1

    def update_moderator(self):
        local_connected_users = self.connected_users.get(self.room_name, 0)
        # the first connected user is the moderator
        if local_connected_users == 1:
            self.set_moderator(self.user)

        # set the moderator to None if all the user disconnect on the room
        if local_connected_users == 0:
            self.set_moderator(None)

    def set_moderator(self, user):
        if user is None:
            del self.moderators[self.room_name]
            return

        self.moderators[self.room_name] = user


class StudyPodConsumer(StudyPodBaseConsumer):
    GENERATE_QUESTION = 'GENERATE_QUESTION'
    SELECT_REVIEWER = 'SELECT_REVIEWER'
    SUBMIT_ANSWER = 'SUBMIT_ANSWER'
    SHOW_RESULTS = 'SHOW_RESULTS'

    async def connect(self):
        self.user = self.scope['user']
        await self.initiate_connect()
        self.update_number_of_connected_users(INCREMENT)
        self.update_moderator()

    async def receive(self, text_data=None, bytes_data=None):
        self.data = json.loads(text_data)

        match self.data['action']:
            case self.GENERATE_QUESTION:
                await self._generate_question()
            case self.SELECT_REVIEWER:
                await self._select_reviewer()
            case self.SUBMIT_ANSWER:
                await self._submit_answer()
            case self.SHOW_RESULTS:
                await self._show_results()
            case _:
                self.data = self._get_data(self.data, {"error": "Unknown action."})

        await self.channel_group_send(self.data, 'send_message')

    async def send_message(self, event):
        await self.send(text_data=json.dumps(event['data']))

    @staticmethod
    def _get_data(data, message):
        return {
            **data,
            "content": message
        }

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
        self.data = self._get_data(self.data, {"success": "Answer has been submitted."})

    async def _show_results(self):
        answers = self.room_user_answers.get(self.room_name, {})

        if answers is None:
            self. data = self._get_data(self.data, {"error": "No available answers."})
            return

        answers.pop('questions')
        self.data = self._get_data(self.data, answers)