import random
import numpy as np
from sympy.polys.groebnertools import is_reduced

from apis.questions.serializers import (
    IdentificationQuestionSerializer,
    EnumerationQuestionSerializer,
    MultipleChoiceQuestionSerializer,
)

from langchain_community.embeddings import HuggingFaceBgeEmbeddings

from common.models import (
    Reviewer,
    Definition,
    Title,
    EnumerationTitle,
)

embeddings = HuggingFaceBgeEmbeddings(
    model_name="BAAI/bge-small-en",
    model_kwargs={"device": "cpu"},
    encode_kwargs={"normalize_embeddings": True}
)

class Question:
    def __init__(
        self,
        reviewer_obj=None,
        number_of_questions=1,
        *args,
        **kwargs
    ):
        self.reviewer = reviewer_obj
        self.number_of_questions = number_of_questions
        self.available_question_types = self.reviewer.available_question_types
        self.question_type = None
        self.question_type_class = ''

    def generate(self):
        self._set_question_type()
        self._set_question_type_function()

        question = globals()[self.question_type_class](
            reviewer=self.reviewer,
            number_of_questions=self.number_of_questions,
        )
        return question.generate()

    def _set_question_type(self):
        index = random.randint(0, len(self.available_question_types)-1)
        self.question_type = self.available_question_types[index]

    def _set_question_type_function(self):
        match self.question_type:
            case Reviewer.QuestionType.IDENTIFICATION:
                self.question_type_class = 'IdentificationQuestion'
            case Reviewer.QuestionType.ENUMERATION:
                self.question_type_class = 'EnumerationQuestion'
            case Reviewer.QuestionType.MULTIPLE_CHOICE:
                self.question_type_class = 'MultipleChoiceQuestion'


class IdentificationQuestion:
    def __init__(self, reviewer=None, number_of_questions=1):
        self.reviewer = reviewer
        self.number_of_questions = number_of_questions

    def generate(self):
        return IdentificationQuestionSerializer(
            self._get_definitions(),
            many=True,
            context={
                'category': Reviewer.QuestionType.IDENTIFICATION.label
            },
        ).data

    def _get_definitions(self):
        return Definition.definitions.filter(
            reviewer=self.reviewer,
            is_answered_correctly=False,
        ).order_by('?')[:self.number_of_questions]


class MultipleChoiceQuestion(IdentificationQuestion):
    def generate(self):
        return MultipleChoiceQuestionSerializer(
            self._get_definitions(),
            many=True,
            context={
                'category': Reviewer.QuestionType.MULTIPLE_CHOICE.label
            },
        ).data


class EnumerationQuestion:
    def __init__(self, reviewer=None, number_of_questions=1):
        self.reviewer = reviewer
        self.number_of_questions = number_of_questions

    def generate(self):
        self._set_enumeration_titles()
        return EnumerationQuestionSerializer(
            self._get_titles(),
            many=True,
            context={
                'category': Reviewer.QuestionType.ENUMERATION.label
            },
        ).data

    def _set_enumeration_titles(self):
        self.enumeration_titles = EnumerationTitle.titles.filter(
            title__reviewer=self.reviewer,
            is_answered_correctly=False
        ).order_by('?')[:self.number_of_questions]

    def _get_titles(self):
        return [enum_title.title for enum_title in self.enumeration_titles]


class Answers:
    def __init__(self, answers):
        global embeddings
        self.answers = answers
        self.embeddings = embeddings
        self.embedded_data: list[dict] = []
        self.user_answers_key = 'user_answers'
        self.correct_answers_key = 'correct_answers'
        self.is_in_order_key = 'is_in_order'

    def check(self):
        self._embed_data()

        for index, answer in enumerate(self.embedded_data):
            if answer['is_in_order']:
                self.answers[index]['is_correct'] = self._check_is_in_order(index)
                continue

            self.answers[index]['is_correct'] = self._check_unordered(index)

    def _embed_data(self):
        for answer in self.answers:
            embedded_data = {
                self.correct_answers_key: self._embed_answer(answer[self.correct_answers_key], True),
                self.user_answers_key: self._embed_answer(answer[self.user_answers_key]),
                'is_in_order': answer.get('is_in_order', False)
            }
            self.embedded_data.append(embedded_data)

    def _embed_answer(self, answers, is_array=False):
        temp_answers = []

        for text in answers:
            if not is_array:
                text = text['answer']
            temp_answers.append(self.embeddings.embed_query(text))

        return temp_answers

    def _check_is_in_order(self, index):
        correct_answers = self.embedded_data[index][self.correct_answers_key]
        user_answers = self.embedded_data[index][self.user_answers_key]
        answers_are_all_correct = True
        checked_user_answers = self.answers[index][self.user_answers_key]

        for user_answer_index, user_answer in enumerate(user_answers):
            if self._is_correct(correct_answers[user_answer_index], user_answers[user_answer_index]):
                checked_user_answers[user_answer_index]['is_correct'] = True
                continue

            checked_user_answers[user_answer_index]['is_correct'] = False
            answers_are_all_correct = False

        return answers_are_all_correct


    def _check_unordered(self, index):
        correct_answers = self.embedded_data[index][self.correct_answers_key]
        user_answers = self.embedded_data[index][self.user_answers_key]
        answers_are_all_correct = True
        checked_user_answers = self.answers[index][self.user_answers_key]

        for user_answer_index, user_answer in enumerate(user_answers):
            answer_is_correct = False

            for correct_answer_index, correct_answer in enumerate(correct_answers):
                if self._is_correct(correct_answer, user_answer):
                    correct_answers.pop(correct_answer_index)
                    answer_is_correct = True
                    break

            checked_user_answers[user_answer_index]['is_correct'] = answer_is_correct

            if answers_are_all_correct and not answer_is_correct:
                answers_are_all_correct = False

        return answers_are_all_correct


    @staticmethod
    def _is_correct(correct_answer, user_answer):
        accuracy = np.dot(correct_answer, user_answer) * 100
        return accuracy >= 96
