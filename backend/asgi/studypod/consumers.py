import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from common.models import StudyPod


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


class StudyPodConsumer(StudyPodBaseConsumer):
    async def connect(self):
        self.set_room_name(root_name='study_pod')
        await self.initiate_connect()

    def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]

        self.send(text_data=json.dumps({"message": message}))