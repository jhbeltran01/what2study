import random
import numpy as np

from apis.questions.serializers import (
    IdentificationQuestionSerializer,
    EnumerationQuestionSerializer,
    MultipleChoiceQuestionSerializer,
)

from langchain_community.embeddings import HuggingFaceBgeEmbeddings

from apis.reviewer_content.services import QuestionType
from common.models import (
    Reviewer,
    Definition,
    Title,
    EnumerationTitle, DefinitionIsCorrectlyAnswered, EnumerationIsCorrectlyAnswered,
    StudypodDefinitionIsAnsweredCorrectly, StudypodEnumerationIsCorrectlyAnswered,
)

embeddings = HuggingFaceBgeEmbeddings(
    model_name="BAAI/bge-small-en",
    model_kwargs={"device": "cpu"},
    encode_kwargs={"normalize_embeddings": True}
)

class Question:
    def __init__(
        self,
        available_question_types=list,
        reviewer_obj=None,
        number_of_questions=1,
        owner=None,
        studypod=None,
        *args,
        **kwargs
    ):
        self.studypod = studypod
        self.owner = owner
        self.reviewer = reviewer_obj
        self.number_of_questions = number_of_questions
        self.question_type = None
        self.question_type_class = ''
        self.available_question_types = available_question_types

    def generate(self):
        self._set_question_type()
        self._set_question_type_function()

        question = globals()[self.question_type_class](
            reviewer=self.reviewer,
            number_of_questions=self.number_of_questions,
            owner=self.owner,
            studypod=self.studypod,
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
    def __init__(
        self,
        reviewer=None,
        number_of_questions=1,
        owner=None,
        studypod=None
    ):
        self.reviewer = reviewer
        self.number_of_questions = number_of_questions
        self.owner = owner
        self.studypod = studypod

    def generate(self):
        return IdentificationQuestionSerializer(
            self._get_definitions(),
            many=True,
            context={'category': Reviewer.QuestionType.IDENTIFICATION.label},
        ).data

    def _get_definitions(self):
        objs = self._get_objs().order_by('?')[:self.number_of_questions]
        return [obj.definition for obj in objs]

    def _get_objs(self):
        if self.studypod is not None:
            return StudypodDefinitionIsAnsweredCorrectly.definitions.filter(
                studypod=self.studypod,
                reviewer=self.reviewer,
                is_correctly_answered=False
            )
        return DefinitionIsCorrectlyAnswered.definitions.filter(
            owner=self.owner,
            reviewer=self.reviewer,
            is_correctly_answered=False
        )


class MultipleChoiceQuestion(IdentificationQuestion):
    def generate(self):
        return MultipleChoiceQuestionSerializer(
            self._get_definitions(),
            many=True,
            context={'category': Reviewer.QuestionType.MULTIPLE_CHOICE.label},
        ).data


class EnumerationQuestion:
    def __init__(
        self,
        reviewer=None,
        number_of_questions=1,
        owner=None,
        studypod=None,
    ):
        self.reviewer = reviewer
        self.number_of_questions = number_of_questions
        self.owner = owner
        self.studypod = studypod

    def generate(self):
        return EnumerationQuestionSerializer(
            self._get_titles(),
            many=True,
            context={'category': Reviewer.QuestionType.ENUMERATION.label},
        ).data

    def _get_titles(self):
        objs = self._get_objs().order_by('?')[:self.number_of_questions]
        return [obj.title for obj in objs]

    def _get_objs(self):
        if self.studypod is not None:
            return StudypodEnumerationIsCorrectlyAnswered.titles.filter(
                studypod=self.studypod,
                reviewer=self.reviewer,
                is_correctly_answered=False
            )
        return EnumerationIsCorrectlyAnswered.titles.filter(
            owner=self.owner,
            reviewer=self.reviewer,
            is_correctly_answered=False
        )


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
                # user answer list is in type dict, only get the answer text
                text = text['answer']
            temp_answers.append(self.embeddings.embed_query(text))

        return temp_answers

    def _check_is_in_order(self, index):
        self._set_needed_data(index)

        for user_answer_index, user_answer in enumerate(self.user_answers):
            if self._is_correct(self.correct_answers[user_answer_index], user_answer):
                self.checked_user_answers[user_answer_index]['is_correct'] = True
                continue

            self.checked_user_answers[user_answer_index]['is_correct'] = False
            self.answers_are_all_correct = False

        return self.answers_are_all_correct

    def _check_unordered(self, index):
        self._set_needed_data(index)

        for user_answer_index, user_answer in enumerate(self.user_answers):
            answer_is_correct = False

            for correct_answer_index, correct_answer in enumerate(self.correct_answers):
                if self._is_correct(correct_answer, user_answer):
                    self.correct_answers.pop(correct_answer_index)
                    answer_is_correct = True
                    break

            self.checked_user_answers[user_answer_index]['is_correct'] = answer_is_correct

            if self.answers_are_all_correct and not answer_is_correct:
                self.answers_are_all_correct = False

        return self.answers_are_all_correct

    def _set_needed_data(self, index):
        self.correct_answers = self.embedded_data[index][self.correct_answers_key]
        self.user_answers = self.embedded_data[index][self.user_answers_key]
        self.checked_user_answers = self.answers[index][self.user_answers_key]

        answered_all_items = len(self.correct_answers) == len(self.user_answers)
        has_an_answer = len(self.user_answers) > 0
        self.answers_are_all_correct = has_an_answer and answered_all_items

    @staticmethod
    def _is_correct(correct_answer, user_answer):
        accuracy = np.dot(correct_answer, user_answer) * 100
        return accuracy >= 96


class CorrectlyAnswered:
    def __init__(self, data, is_studypod=False):
        self.checked_answers = data['checked_answers']
        self.question_type = data['question_type']
        self.slugs_of_correctly_answered = []
        self.is_studypod = is_studypod

    @property
    def has_answered_an_item_correctly(self):
        return len(self.slugs_of_correctly_answered)

    def update_status(self):
        self._set_slugs_of_correctly_answered()

        if self.is_studypod:
            self._update_status_on_studypod()
            return

        self._update_status_on_reviewer()

    def _update_status_on_reviewer(self):
        match self.question_type:
            case Reviewer.QuestionType.IDENTIFICATION | Reviewer.QuestionType.MULTIPLE_CHOICE:
                self._update_definitions_status()
            case Reviewer.QuestionType.ENUMERATION:
                self._update_enumeration_status()

    def _update_status_on_studypod(self):
        match self.question_type:
            case Reviewer.QuestionType.IDENTIFICATION | Reviewer.QuestionType.MULTIPLE_CHOICE:
                self._update_studypod_definitions_status()
            case Reviewer.QuestionType.ENUMERATION:
                self._update_studypod_enumeration_status()

    def _set_slugs_of_correctly_answered(self):
        for answer in self.checked_answers:
            if not answer.get('is_correct', False):
                continue
            self.slugs_of_correctly_answered.append(answer['slug'])

    def _update_definitions_status(self):
        DefinitionIsCorrectlyAnswered.definitions.filter(
            definition__slug__in=self.slugs_of_correctly_answered
        ).update(is_correctly_answered=True)

    def _update_enumeration_status(self):
        EnumerationIsCorrectlyAnswered.titles.filter(
            title__slug__in=self.slugs_of_correctly_answered
        ).update(is_correctly_answered=True)

    def _update_studypod_definitions_status(self):
        StudypodDefinitionIsAnsweredCorrectly.definitions.filter(
            definition__slug__in=self.slugs_of_correctly_answered
        ).update(is_correctly_answered=True)

    def _update_studypod_enumeration_status(self):
        StudypodEnumerationIsCorrectlyAnswered.titles.filter(
            title__slug__in=self.slugs_of_correctly_answered
        ).update(is_correctly_answered=True)


class Reset:
    def __init__(self, reviewer, owner, studypod=None):
        self.reviewer = reviewer
        self.owner = owner
        self.studypod = studypod

    def execute(self):
        if self.studypod is not None:
            self.reset_studypod_definitions()
            self.reset_enumerations()
            return

        self.reset_definitions()
        self.reset_enumerations()

    def reset_definitions(self):
        DefinitionIsCorrectlyAnswered.definitions.filter(
            owner=self.owner,
            reviewer=self.reviewer
        ).update(is_correctly_answered=False)

    def reset_enumerations(self):
        EnumerationIsCorrectlyAnswered.titles.filter(
            owner=self.owner,
            reviewer=self.reviewer
        ).update(is_correctly_answered=False)

    def reset_studypod_definitions(self):
        StudypodDefinitionIsAnsweredCorrectly.definitions.filter(
            stuydpod=self.studypod,
            reviewer=self.reviewer
        ).update(is_correctly_answered=False)

    def reset_studypod_enumerations(self):
        StudypodEnumerationIsCorrectlyAnswered.titles.filter(
            stuydpod=self.studypod,
            reviewer=self.reviewer
        ).update(is_correctly_answered=False)


def update_question_types(
    question_type_indicator='',
    reviewer=None,
    owner=None
):
    question_type_obj = Reviewer.QuestionType
    for_definition = question_type_indicator == question_type_obj.IDENTIFICATION or \
                     question_type_indicator == question_type_obj.MULTIPLE_CHOICE
    for_enumeration = question_type_indicator == question_type_obj.ENUMERATION

    question_type = QuestionType(
        reviewer=reviewer,
        owner={'owner': owner},
        for_definition=for_definition,
        for_enumeration=for_enumeration,
        available_question_types_obj=reviewer.available_question_types.filter(owner=owner).first()
    )
    question_type.update()


def has_available_question_types(reviewer, owner):
    available_question_types_obj = reviewer.available_question_types.filter(owner=owner).first()
    return len(available_question_types_obj.available_question_types) > 0


def has_available_content(reviewer):
    has_definition = reviewer.definitions.all().first() is not None
    has_enumeration = reviewer.titles.filter(type=Reviewer.QuestionType.ENUMERATION).first() is not None
    return has_definition or has_enumeration


