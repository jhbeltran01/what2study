from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from apis.questions.serializers import GenerateQuestionParamsSerializer, AnswersSerializer
from apis.questions.services import Question, CorrectlyAnswered, update_question_types
from apis.reviewer_content.services import QuestionType
from common.models import Reviewer


class GenerateQuestion(APIView):
    def __init__(self):
        super().__init__()
        self.reviewer = ''
        self.params_serializer = None

    def get(self, request, *args, **kwargs):
        self._make_sure_that_needed_url_params_are_supplied()
        question = Question(**self.params_serializer.data, owner=self.request.user)
        return Response(question.generate(), status=status.HTTP_200_OK)

    def _make_sure_that_needed_url_params_are_supplied(self):
        self.params_serializer = GenerateQuestionParamsSerializer(data=self.request.GET)

        try:
            self.params_serializer.is_valid(raise_exception=True)
        except Exception as err:
            raise err


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