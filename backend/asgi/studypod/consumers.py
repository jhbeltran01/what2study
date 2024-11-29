import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.exceptions import DenyConnection

from apis.authentication.serializers import UserInfoSerializer
from apis.reviewers.serializers import ReviewerSerializer
from asgi.studypod.services import (
    GenerateQuestion,
    GetReviewer, Answer, ReviewerList, get_error_data,
)
from common.models import StudyPod


INCREMENT = 'I'
DECREMENT = 'D'

# the number of connected users per room
connected_users = {}
# the room moderators per room
moderators = {}
# all the answers of the users per room
user_answers = {}
# all the last action per room
last_action = {}
# all the questions per room
all_questions = {}
# all selected reviewer per room
all_selected_reviewer = {}


class StudyPodBaseConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        global connected_users, moderators, user_answers, last_action, all_questions, all_selected_reviewer

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
        self.will_send_message_to_room = True
        self.all_questions = all_questions
        self.all_selected_reviewer = all_selected_reviewer
        self.is_update_moderator = False

    async def disconnect(self, close_code):
        self.update_number_of_connected_users(DECREMENT)
        self._update_moderator(is_disconnected=True)
        await self._update_number_of_connected_user_in_room_ui()
        await self._send_notif_on_user_disconnect()
        await self._send_notif_on_moderator_disconnect()
        await self.channel_layer.group_discard(
            self.room_name,
            self.channel_name
        )

    async def initiate_connect(self):
        self.study_pod_name = self.scope['url_route']['kwargs']['study_pod_slug']
        self.set_room_name(root_name='study_pod')

        await self._set_study_pod_instance()
        self._check_if_studypod_exists()
        await self.channel_layer.group_add(
            self.room_name,
            self.channel_name
        )
        await self.accept()

    async def _set_study_pod_instance(self):
        self.study_pod = await self._get_study_pod()

    @database_sync_to_async
    def _get_study_pod(self):
        return StudyPod.groups.filter(slug=self.study_pod_name).first()

    def _check_if_studypod_exists(self):
        if self.study_pod is not None:
            return
        raise DenyConnection('Studypod doesn\'nt exists.')

    def set_room_name(self, root_name=''):
        self.room_name = '{}_{}'.format(
            root_name,
            self.study_pod_name
        )

    async def channel_group_send(self, channel_type):
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': channel_type,
                'data': self.data
            }
        )

    async def _send_message_to_room(self):
        await self.channel_group_send('send_message')

    async def _send_message_to_self(self):
        await self.send(text_data=json.dumps(self.data))

    def update_number_of_connected_users(self, action=INCREMENT):
        room_connected_users = self.connected_users.get(self.room_name, 0)
        if room_connected_users == 0 and action == INCREMENT:
            self.connected_users[self.room_name] = 1
            return

        if room_connected_users > 0:
            self.connected_users[self.room_name] = room_connected_users + 1 if action == INCREMENT else room_connected_users - 1

    def _update_moderator(self, is_disconnected=False):
        if self.connected_users.get(self.room_name) is None:
            return

        local_connected_users = self.connected_users[self.room_name]

        # the first connected user is the moderator
        if not is_disconnected and local_connected_users == 1:
            self._set_moderator(self.user)
            return

        if is_disconnected and local_connected_users == 0:
            self._set_moderator(None)
            return

        has_moderator = self.moderators[self.room_name] is not None
        room_moderator_has_disconnected = has_moderator and self.moderators[self.room_name].id == self.user.id

        if is_disconnected and room_moderator_has_disconnected:
            self.moderators[self.room_name] = None


    def _set_moderator(self, user):
        if user is None:
            # delete all room data if all the users has disconnected
            del self.connected_users[self.room_name]
            del self.moderators[self.room_name]
            del self.last_action[self.room_name]
            if self.room_user_answers.get(self.room_name, None) is not None:
                del self.room_user_answers[self.room_name]
            if self.all_questions.get(self.room_name, None) is not None:
                del self.all_questions[self.room_name]
            if self.all_selected_reviewer.get(self.room_name, None) is not None:
                del self.all_selected_reviewer[self.room_name]
        else:
            self.moderators[self.room_name] = user

    async def _update_number_of_connected_user_in_room_ui(self):
        self.data = {
            'action': 'UPDATE_CONNECTED_USER',
            'connected_users': self.connected_users.get(self.room_name, 0)
        }
        await self._send_message_to_room()

    async def _send_notif_on_user_disconnect(self):
        self.data = get_error_data(
            self.data,
            '{} has disconnected'.format(self.user.username)
        )
        await self._send_message_to_room()
        print(self.data)


class StudyPodConsumer(StudyPodBaseConsumer):
    GENERATE_QUESTION = 'GENERATE_QUESTION'
    SELECT_REVIEWER = 'SELECT_REVIEWER'
    SUBMIT_ANSWER = 'SUBMIT_ANSWER'
    SHOW_RESULTS = 'SHOW_RESULTS'
    UPDATE_MODERATOR = 'UPDATE_MODERATOR'
    RETRIEVE_REVIEWER_LIST = 'RETRIEVE_REVIEWER_LIST'
    ERROR = 'ERROR'
    SUCCESS = 'SUCCESS'
    GET_ROOM_INFO = 'GET_ROOM_INFO'
    UPDATE_CONNECTED_USER = 'UPDATE_CONNECTED_USER'
    UPDATE_NUMBER_OF_SUBMISSIONS = 'UPDATE_NUMBER_OF_SUBMISSIONS'

    async def connect(self):
        self.user = self.scope['user']
        await super().initiate_connect()
        super().update_number_of_connected_users()
        super()._update_moderator()
        await self._set_action_to_retrieve_reviewer_list_if_the_moderator()
        await self._set_action_to_sync_to_room_if_not_the_moderator()
        await self._send_notification_on_entering_the_room()
        await self._update_number_of_connected_user_in_room_ui()

    async def receive(self, text_data=None, bytes_data=None):
        self.is_update_moderator = False
        self.data = json.loads(text_data)
        self.will_send_message_to_room = True

        await self._perform_action(self.data['action'])

        if self.data['action'] == self.ERROR:
            await self._send_message_to_self()
            return

        if self.will_send_message_to_room:
            await self._send_message_to_room()
            if self.is_update_moderator:
                return
            self._set_last_action(self.data)
        else:
            await self._send_message_to_self()

    async def _perform_action(self, action):
        match action:
            case self.RETRIEVE_REVIEWER_LIST:
                if self._has_moderator():
                    self.will_send_message_to_room = await self._retrieve_reviewer_list()
            case self.SELECT_REVIEWER:
                if self._has_moderator():
                    await self._select_reviewer()
            case self.GENERATE_QUESTION:
                if self._has_moderator():
                    await self._generate_question()
            case self.SUBMIT_ANSWER:
                if self._has_moderator():
                    await self._submit_answer()
                    self.will_send_message_to_room = False
            case self.SHOW_RESULTS:
                if self._has_moderator():
                    await self._show_results()
            case self.UPDATE_MODERATOR:
                if not self._has_moderator(is_update_moderator=True):
                    self.is_update_moderator = True
                    self._update_new_moderator()
                else:
                    self._has_existing_moderator()
                    self.will_send_message_to_room = False
            case self.GET_ROOM_INFO:
                 self._get_room_info()
                 self.will_send_message_to_room = False
            case _:
                self.data = self._get_data(
                    self.data, {
                        'isUnknownAction': True,
                        'error': 'Unknown action.'
                    }
                )

    async def send_message(self, event):
        await self.send(text_data=json.dumps(event['data']))

    async def _set_action_to_retrieve_reviewer_list_if_the_moderator(self):
        if self.connected_users[self.room_name] != 1:
            return

        self.data = {'action': self.RETRIEVE_REVIEWER_LIST}
        await self._retrieve_reviewer_list()
        self.last_action[self.room_name] = self.data
        await super()._send_message_to_room()

    async def _set_action_to_sync_to_room_if_not_the_moderator(self):
        if self.connected_users[self.room_name] == 1:
            return

        self.data = self.last_action[self.room_name]
        action = self.data['action']

        if action == self.GENERATE_QUESTION:
            await self._sync_on_generate_question()
            return

        if action == self.SHOW_RESULTS:
            await self._sync_on_generate_question()
            await self._sync_to_room({
                'action': self.SHOW_RESULTS,
                'content': self.room_user_answers.get(self.room_name, []),
                'is_room_sync': True
            })

        data = {
            **self.last_action[self.room_name],
            'is_room_sync': True,
        }
        await self._sync_to_room(data)

    async def _send_notification_on_entering_the_room(self):
        self.data = {
            'action': self.SUCCESS,
            'message': '{} has joined the room.'.format(self.user.username)
        }
        await self._send_message_to_room()

    async def _sync_on_generate_question(self):
        await self._sync_to_room({
            'action': self.SELECT_REVIEWER,
            'reviewer': await self._get_reviewer_data(),
            'is_room_sync': True,
        })

        await self._sync_to_room({
            'action': self.GENERATE_QUESTION,
            'questions': self.all_questions[self.room_name],
            'is_room_sync': True
        })

    @database_sync_to_async
    def _get_reviewer_data(self):
        return ReviewerSerializer(self.all_selected_reviewer[self.room_name]).data

    async def _sync_to_room(self, data):
        self.data = data
        await self._send_message_to_self()

    @staticmethod
    def _get_data(data, content):
        return {
            **data,
            "content": content
        }

    async def _retrieve_reviewer_list(self):
        is_the_moderator = self.moderators[self.room_name].id == self.user.id
        reviewer_list = ReviewerList(studypod=self.study_pod)
        self.data = self._get_data(self.data, await reviewer_list.get())
        return is_the_moderator

    def _set_last_action(self, data):
        self.last_action[self.room_name] = data

    def _has_moderator(self, is_update_moderator=False):
        has_moderator = self.moderators[self.room_name] is not None
        if not is_update_moderator and not has_moderator:
            self.data = {
                'action': self.ERROR,
                'has_no_moderator': True,
                'message': 'A moderator must be chosen first.'
            }
        return has_moderator

    async def _generate_question(self):
        question = GenerateQuestion(
            reviewer=self.all_selected_reviewer.get(self.room_name, None),
            data=self.data,
            user=self.user,
            moderator=self.moderators[self.room_name],
            number_of_questions=self.data['number_of_questions'],
            studypod=self.study_pod,
        )
        self.data = await question.generate()
        questions = self.data.get('questions', None)
        self.all_questions[self.room_name] = questions
        if questions is not None:
            self.room_user_answers[self.room_name] = []

    async def _select_reviewer(self):

        reviewer = GetReviewer(
            slug=self.data['reviewer_slug'],
            data=self.data,
            user=self.user,
            moderator=self.moderators[self.room_name],
        )
        self.data = await reviewer.get()
        self.reviewer = reviewer.get_obj()

        self.all_selected_reviewer[self.room_name] =  self.reviewer

    async def _submit_answer(self):
        answer = Answer(
            user=self.user,
            answers=self.data.pop('answers', []),
            user_answers=self.room_user_answers[self.room_name],
            questions=self.all_questions[self.room_name],
            data=self.data,
            room_name=self.room_name
        )
        answer.submit()
        self.data = self._get_data(self.data, {'success': 'Answer has been submitted.'})
        await self._update_number_of_submissions()
        await self._send_submitted_an_answer_message()


    async def _show_results(self):
        answers = self.room_user_answers.get(self.room_name, [])

        if self.user.id != self.moderators[self.room_name].id:
            self.data = get_error_data(
                self.data,
                'The moderator is the only one that can show the results.'
            )
            return

        if len(answers) == 0:
            self. data = {
                'action': self.ERROR,
                'has_no_submitted_answers': True,
                'message': 'No submitted answers.'
            }
            return
        self.data = self._get_data(self.data, answers)
        self.last_action[self.room_name] = self.data
        self.room_user_answers[self.room_name] = []
        await self._update_number_of_submissions()

    def _update_new_moderator(self):
        message = 'The moderator has been'
        moderator = None if self.data.get('unset_moderator', None) is None else self.user
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
        self.data = {
            'action': self.ERROR,
            'has_an_existing_moderator': True,
            'message': 'There is an existing moderator.',
        }

    def _get_room_info(self):
        moderator = self.moderators[self.room_name]
        self.data = {
            **self.data,
            'content': {
                'moderator': UserInfoSerializer(self.moderators[self.room_name]).data if moderator is not None else None,
                'connected_users': self.connected_users[self.room_name],
                'number_of_submissions': len(self.room_user_answers.get(self.room_name, []))
            }
        }

    async def _update_number_of_submissions(self):
        data = {
            'action': self.UPDATE_NUMBER_OF_SUBMISSIONS,
            'number_of_submissions': len(self.room_user_answers[self.room_name])
        }
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': 'send_message',
                'data': data
            }
        )

    async def _send_submitted_an_answer_message(self):
        data = {
            'action': self.SUCCESS,
            'message': '{} has submitted an answer.'.format(self.user.username)
        }
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': 'send_message',
                'data': data
            }
        )

    async def _send_notif_on_moderator_disconnect(self):
        moderator = self.moderators.get(self.room_name, None)

        if moderator is not None:
            return

        data = {
            'action': self.UPDATE_MODERATOR,
            'content': {
                'message': 'The moderator has left the room.'.format(self.user.username),
                'moderator': None
            }
        }
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': 'send_message',
                'data': data
            }
        )