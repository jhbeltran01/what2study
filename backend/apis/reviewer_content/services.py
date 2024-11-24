from common.models import Reviewer, Title, DefinitionIsCorrectlyAnswered, EnumerationIsCorrectlyAnswered


class QuestionType:
    def __init__(
        self,
        reviewer,
        available_question_types_obj,
        owner,
        for_definition=False,
        for_enumeration=False,
        definition_is_answered_correctly=DefinitionIsCorrectlyAnswered.definitions,
        enumeration_is_answered_correctly=EnumerationIsCorrectlyAnswered.titles,
    ):
        self.owner = owner
        self.reviewer = reviewer
        self.is_updated = False
        self.definition = None
        self.number_of_titles = None
        self.has_definition = None
        self.available_question_types_obj = available_question_types_obj
        self.available_question_types = self.available_question_types_obj.available_question_types
        self.has_enumeration = None
        self.for_definition = for_definition
        self.for_enumeration = for_enumeration
        self.definition_is_answered_correctly = definition_is_answered_correctly
        self.enumeration_is_answered_correctly = enumeration_is_answered_correctly

    def update(self):
        if self.for_definition:
            self.set_definition()
            self.set_number_of_titles()
            self.check_for_identification_questions()
            self.check_for_multiple_choice_questions()

        if self.for_enumeration:
            self.set_enum_title()
            self.check_for_enumeration_questions()

        self.update_reviewer()

    def set_definition(self):
        self.definition = self.definition_is_answered_correctly.filter(
            reviewer=self.reviewer,
            is_correctly_answered=False,
            **self.owner,
        ).first()
        self.has_definition = self.definition is not None

    def set_number_of_titles(self):
        self.number_of_titles = min(self.reviewer.titles.exclude(type=Title.Type.ENUMERATION).count(), 4)

    def set_enum_title(self):
        enumeration = self.enumeration_is_answered_correctly.filter(
            **self.owner,
            reviewer=self.reviewer,
            is_correctly_answered=False
        ).first()
        self.has_enumeration = enumeration and enumeration.title.answers.all().first() is not None

    def check_for_identification_questions(self):
        identification = Reviewer.QuestionType.IDENTIFICATION
        identification_is_in_question_types = identification in self.available_question_types

        if not self.has_definition and identification_is_in_question_types:
            self.available_question_types.remove(identification)
            self.is_updated = True

        if self.has_definition and not identification_is_in_question_types:
            self.available_question_types.append(identification)
            self.is_updated = True

    def check_for_multiple_choice_questions(self):
        multiple_choice = Reviewer.QuestionType.MULTIPLE_CHOICE
        multiple_choice_is_in_question_types = multiple_choice in self.available_question_types
        has_enough_choices = self.number_of_titles >= 4

        if (not self.has_definition or not has_enough_choices) and multiple_choice_is_in_question_types:
            self.available_question_types.remove(multiple_choice)
            self.is_updated = True

        if self.has_definition and has_enough_choices and not multiple_choice_is_in_question_types:
            self.available_question_types.append(multiple_choice)
            self.is_updated = True

    def check_for_enumeration_questions(self):
        enumeration = Reviewer.QuestionType.ENUMERATION
        enumeration_is_in_question_types = enumeration in self.available_question_types

        if not self.has_enumeration and enumeration_is_in_question_types:
            self.available_question_types.remove(enumeration)
            self.is_updated = True

        if self.has_enumeration and not enumeration_is_in_question_types:
            self.available_question_types.append(enumeration)
            self.is_updated = True

    def update_reviewer(self):
        if not self.is_updated:
            return

        self.available_question_types_obj.available_question_types = self.available_question_types
        self.available_question_types_obj.save()