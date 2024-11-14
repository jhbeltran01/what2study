import random
import numpy as np

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
        self.answers = answers
        self.embeddings = None

    def check(self):
        self._initialize_embeddings()

        for index, answer in enumerate(self.answers):
            embedded_correct_answer = self.embeddings.embed_query(answer[0])
            embedded_user_answer = self.embeddings.embed_query(answer[1])
            accuracy = np.dot(embedded_correct_answer, embedded_user_answer) * 100
            is_correct = accuracy >= 95
            self.answers[index].append(is_correct)

    def _initialize_embeddings(self):
        self.embeddings = HuggingFaceBgeEmbeddings(
            model_name="BAAI/bge-small-en",
            model_kwargs={"device": "cpu"},
            encode_kwargs={"normalize_embeddings": True}
        )