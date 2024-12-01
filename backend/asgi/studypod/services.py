from channels.db import database_sync_to_async
import numpy as np

from apis.authentication.serializers import UserInfoSerializer
from apis.questions.services import Question, embeddings
from apis.reviewers.serializers import ReviewerSerializer
from apis.studypods.serializers import StudypodReviewerSerializer
from common.models import Reviewer, StudypodReviewer


class GetReviewer:
    def __init__(self, slug, data, user, moderator):
        self.user = user
        self.moderator = moderator
        self.data = data
        self.slug = slug
        self.reviewer = None

    @database_sync_to_async
    def get(self):
        if self.user.id != self.moderator.id:
            return get_error_data(
                self.data,
                "The moderator is the only one that can select a reviewer."
            )
        self.reviewer = Reviewer.reviewers.filter(slug=self.slug).first()

        if self.reviewer is None:
            return get_error_data(
                self.data,
                "Reviewer does not exists."
            )

        return {
            **self.data,
            "reviewer": ReviewerSerializer(self.reviewer).data
        }

    def get_obj(self):
        return self.reviewer


class GenerateQuestion:
    def __init__(
        self,
        reviewer,
        data,
        user,
        moderator,
        studypod,
        number_of_questions=1,
    ):
        self.reviewer = reviewer
        self.data = data
        self.user = user
        self.moderator = moderator
        self.number_of_questions = number_of_questions
        self.studypod = studypod

    @database_sync_to_async
    def generate(self):
        if self.user.id != self.moderator.id:
            return get_error_data(self.data, "The moderator is the only one that can generate a question.")

        if self.reviewer is None:
            return get_error_data(self.data, "Please select a reviewer.")

        if self.number_of_questions < 1:
            return get_error_data(self.data, "Number of questions must be atleast 1.")

        obj = self.studypod.available_types.filter(studypod=self.studypod).first()
        types = obj.available_question_types

        if len(types) == 0:
            return {
                'action': 'ERROR',
                'message': 'Reviewer has no available content.'
            }

        if 'E' in types:
            types.remove('E')
        question = Question(
            reviewer_obj=self.reviewer,
            number_of_questions=self.number_of_questions,
            studypod=self.studypod,
            available_question_types=types,
        )
        return {
            **self.data,
            "questions": question.generate()
        }


class Answer:
    def __init__(self, user, answers, user_answers, questions, data, room_name):
        self.user = user
        self.answers = answers
        self.user_answers = user_answers
        self.questions = questions
        self.room_name = room_name
        self.data = data
        self.embedded_question_answers = []
        self.embedded_user_answers = []

    def submit(self):
        if self.user_answers is None:
            return get_error_data(self.data, "Please generate a question first.")

        self._embed_question_answers()
        self._embed_user_answers()

        self._check_answer()

        for index, user_answer  in enumerate(self.user_answers):
            if user_answer['user']['username'] != self.user.username:
                continue

            self.user_answers[index]['answers'] = self.answers
            return

        self.user_answers.append({
            "answers": self.answers,
            "user": UserInfoSerializer(self.user).data
        })

    def _embed_question_answers(self):
        for question in self.questions:
            self.embedded_question_answers.append(
                embeddings.embed_query(question['answer'])
            )

    def _embed_user_answers(self):
        for answer in self.answers:
            self.embedded_user_answers.append(
                embeddings.embed_query(answer['text'])
            )

    def _check_answer(self):
        for index in range(len(self.answers)):
            accuracy = np.dot(
                self.embedded_user_answers[index],
                self.embedded_question_answers[index]
            ) * 100
            is_correct = accuracy > 96
            self.answers[index]['is_correct'] = bool(is_correct)


class ReviewerList:
    def __init__(self, studypod):
        self.studypod = studypod

    @database_sync_to_async
    def get(self):
        reviewers = StudypodReviewer.reviewers.filter(studypod=self.studypod)
        return StudypodReviewerSerializer(reviewers, many=True).data


def get_error_data(data, message):
    return {
        'action': 'ERROR',
        'message':  message,
    }