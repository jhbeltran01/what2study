from channels.db import database_sync_to_async

from apis.authentication.serializers import UserInfoSerializer
from apis.questions.services import Question
from apis.reviewers.serializers import ReviewerSerializer
from apis.studypods.serializers import StudypodReviewerSerializer
from common.models import Reviewer, StudypodReviewer


def get_error_data(data, message):
    return {
        **data,
        'message': {
            "error": message
        }
    }


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
        number_of_questions=1,
    ):
        self.reviewer = reviewer
        self.data = data
        self.user = user
        self.moderator = moderator
        self.number_of_questions = number_of_questions

    @database_sync_to_async
    def generate(self):
        if self.reviewer is None:
            return get_error_data(self.data, "Please select a reviewer.")

        if self.user.id != self.moderator.id:
            return get_error_data(self.data, "The moderator is the only one that can generate a question.")

        if self.number_of_questions < 1:
            return get_error_data(self.data, "Number of questions must be atleast 1.")

        question = Question(
            reviewer_obj=self.reviewer,
            number_of_questions=self.number_of_questions
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

    def submit(self):
        if self.user_answers is None:
            return get_error_data(self.data, "Please generate a question first.")

        self._check_answer()

        self.user_answers[str(self.user.id)] = {
            "answers": self.answers,
            "user": UserInfoSerializer(self.user).data
        }

    def _check_answer(self):
        for index in range(len(self.answers)):
            self.answers[index]['is_correct'] = True


class ReviewerList:
    def __init__(self, studypod):
        self.studypod = studypod

    @database_sync_to_async
    def get(self):
        reviewers = StudypodReviewer.reviewers.filter(studypod=self.studypod)
        return StudypodReviewerSerializer(reviewers, many=True).data