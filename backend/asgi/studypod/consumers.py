import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from common.models import StudyPod

INCREMENT = 'I'
DECREMENT = 'D'

connected_users = 0
moderator = None


class StudyPodBaseConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.study_pod_name = ''
        self.room_name = ''
        self.study_pod = ''

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
        global connected_users
        connected_users = connected_users+1 if action == INCREMENT else connected_users-1
        connected_users = connected_users
        self.update_moderator()

    def update_moderator(self):
        global connected_users
        # the first connected user is the moderator
        if connected_users == 1:
            self.set_moderator(self.scope['user'])

        # set the moderator to None if all the user disconnect on the room
        if connected_users == 0:
            self.set_moderator(None)

    @staticmethod
    def set_moderator(user):
        global moderator
        moderator = user


class StudyPodConsumer(StudyPodBaseConsumer):
    async def connect(self):
        self.set_room_name(root_name='study_pod')
        await self.initiate_connect()
        self.update_number_of_connected_users(INCREMENT)

    async def receive(self, text_data=None, bytes_data=None):
        global connected_users, moderator
        data = json.loads(text_data)
        await self.channel_group_send(data, 'send_message')


    async def send_message(self, event):
        await self.send(text_data=json.dumps(event['data']))