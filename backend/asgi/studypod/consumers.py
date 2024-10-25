import json

from PIL.ImImagePlugin import number
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from asgi.studypod.services import get_reviewer, GenerateQuestion
from common.models import StudyPod

INCREMENT = 'I'
DECREMENT = 'D'

connected_users = {}
moderators = {}


class StudyPodBaseConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        global connected_users, moderators

        self.study_pod_name = ''
        self.room_name = ''
        self.study_pod = ''
        self.reviewer = None
        self.connected_users = connected_users
        self.moderators = moderators

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_name,
            self.channel_name
        )
        self.update_number_of_connected_users(DECREMENT)

    async def initiate_connect(self):
        self.study_pod_name = self.scope['url_route']['kwargs']['study_pod_slug']
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
        if self.connected_users.get(self.room_name, None) is None:
            self.connected_users[self.room_name] = 1
            self.update_moderator()
            return

        if self.connected_users[self.room_name] == 0:
            del self.connected_users[self.room_name]

        if self.connected_users[self.room_name] > 0:
            self.connected_users[self.room_name] = self.connected_users[self.room_name] + 1 if action == INCREMENT else self.connected_users[self.room_name] - 1

        self.update_moderator()

    def update_moderator(self):
        # the first connected user is the moderator
        if self.connected_users[self.room_name] == 1:
            self.set_moderator(self.scope['user'])

        # set the moderator to None if all the user disconnect on the room
        if self.connected_users[self.room_name] == 0:
            self.set_moderator(None)

    def set_moderator(self, user):
        if user is None:
            del self.moderators[self.room_name]
            return 

        self.moderators[self.room_name] = user


class StudyPodConsumer(StudyPodBaseConsumer):
    GENERATE_QUESTION = 'GENERATE_QUESTION'
    SELECT_REVIEWER = 'SELECT_REVIEWER'

    async def connect(self):
        self.set_room_name(root_name='study_pod')
        await self.initiate_connect()
        self.update_number_of_connected_users(INCREMENT)

    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)

        match data['action']:
            case self.GENERATE_QUESTION:
                question = GenerateQuestion(
                    reviewer=self.reviewer,
                    data=data,
                    user=self.scope['user'],
                    moderator=self.moderators[self.room_name],
                    number_of_questions=data['number_of_questions']
                )
                data = await question.generate()
            case self.SELECT_REVIEWER:
                self.reviewer = await get_reviewer(data['reviewer_slug'])
            case _:
                return {
                    **data,
                    "message": {"error": "Unknown action."}
                }

        await self.channel_group_send(data, 'send_message')


    async def send_message(self, event):
        await self.send(text_data=json.dumps(event['data']))