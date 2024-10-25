from channels.db import database_sync_to_async

from apis.questions.services import Question
from common.models import Reviewer

@database_sync_to_async
def get_reviewer(slug):
    return Reviewer.reviewers.filter(slug=slug).first()


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
            return self._get_error_data("Please select a reviewer.")

        if self.user.id != self.moderator.id:
            return self._get_error_data("The moderator is the only one that can generate a question.")

        if self.number_of_questions < 1:
            return self._get_error_data("Number of questions must be atleast 1.")

        question = Question(
            reviewer_obj=self.reviewer,
            number_of_questions=self.number_of_questions
        )
        return {
            **self.data,
            "questions": question.generate()
        }

    def _get_error_data(self, message):
        return {
            **self.data,
            'message': {
                "error": message
            }
        }