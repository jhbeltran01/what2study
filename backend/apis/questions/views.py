from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from apis.questions.serializers import (
    GenerateQuestionParamsSerializer,
    AnswersSerializer
)
from apis.questions.services import (
    Question,
    CorrectlyAnswered,
    update_question_types,
    has_available_question_types,
    has_available_content, Reset
)
from apis.reviewer_content.services import QuestionType
from common.models import Reviewer


class GenerateQuestion(APIView):
    def __init__(self):
        super().__init__()
        self.reviewer = ''
        self.params_serializer = None
        self.payload = None
        self.http_status = None
        self.will_generate_questions = True
        self.reviewer = None
        self.owner = None

    def get(self, request, *args, **kwargs):
        self._make_sure_that_needed_url_params_are_supplied()
        self.reviewer = self.params_serializer.reviewer_instance
        self.owner = request.user

        self._check_for_content()
        self._check_for_question_types()
        self._check_if_will_generate_questions()

        return Response(self.payload, status=self.http_status)

    def _make_sure_that_needed_url_params_are_supplied(self):
        self.params_serializer = GenerateQuestionParamsSerializer(data=self.request.GET)

        try:
            self.params_serializer.is_valid(raise_exception=True)
        except Exception as err:
            raise err

    def _check_for_content(self):
        if not has_available_content(self.reviewer):
            self.payload = {
                'message': 'There is no available content definition or enumeration content. Please add one.',
                'has_content': False
            }
            self.http_status = status.HTTP_400_BAD_REQUEST
            self.will_generate_questions = False

    def _check_for_question_types(self):
        if not has_available_question_types(self.reviewer, self.owner):
            self.payload = {
                'message': 'All questions has been answered correctly. Reset is needed to review again.',
                'must_reset': True
            }
            self.http_status = status.HTTP_202_ACCEPTED
            self.will_generate_questions = False

    def _check_if_will_generate_questions(self):
        if self.will_generate_questions:
            question = Question(**self.params_serializer.data, owner=self.request.user)
            self.payload = question.generate()
            self.http_status = status.HTTP_200_OK


class CheckAnswerAPIView(APIView):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.has_answered_an_item_correctly = False

    def post(self, request, *args, **kwargs):
        serializer = AnswersSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self._update_correctly_answered_objs(serializer.data)
        self._update_question_types(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def _update_correctly_answered_objs(self, data):
        answers = CorrectlyAnswered(data)
        answers.update_status()
        self.has_answered_an_item_correctly = answers.has_answered_an_item_correctly

    def _update_question_types(self, serializer):
        if not self.has_answered_an_item_correctly:
            return

        update_question_types(
            question_type_indicator=serializer.data['question_type'],
            reviewer=serializer.reviewer,
            owner=self.request.user
        )


class ResetQuestionsAPIView(APIView):
    def post(self, request, *args, **kwargs):
        reviewer = Reviewer.reviewers.filter(slug=kwargs['reviewer']).first()

        if reviewer is None:
            raise NotFound('Reviewer not found')

        reset = Reset(reviewer, self.request.user)
        reset.execute()

        question_types = QuestionType(
            reviewer=reviewer,
            owner=self.request.user,
            for_definition=True,
            for_enumeration=True,
        )
        question_types.update()

        return Response({'detail': 'Reset is successful.'}, status=status.HTTP_200_OK)