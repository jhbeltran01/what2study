from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from apis.questions.serializers import GenerateQuestionParamsSerializer, AnswersSerializer
from apis.questions.services import Question, CorrectlyAnswered


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
    def post(self, request, *args, **kwargs):
        serializer = AnswersSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self._update_correctly_answered_objs(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def _update_correctly_answered_objs(self, data):
        answers = CorrectlyAnswered(data)
        answers.update_status()