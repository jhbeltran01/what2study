from ast import Index

import pdfplumber

from rest_framework.serializers import ValidationError

from django.utils.text import slugify
from django.db.models import Q


from common.models import (
    Title, Definition,
    EnumerationTitle,
    Reviewer,
    PublicReviewer,
    RecentViewedPublicReviewer,
    BookmarkedPublicReviewer, DefinitionIsCorrectlyAnswered, EnumerationIsCorrectlyAnswered,
)
from common.services import generate_unique_id


class Document:
    def __init__(self, owner='', reviewer='', files=''):
        self.owner = owner
        self.reviewer = reviewer
        self.files = files
        self.text_content = ''
        self.definition = None
        self.definition_is_answered_correctly_objs = []
        self.enumeration_is_answered_correctly_objs = []
        self.enum_titles = []
        self.new_title = None
        self.new_enum_title = None
        self.text = ''
        self.DEFINITION_TITLE_MARK = '$'
        self.DEFINITION_MARK = '-'
        self.ENUMERATION_MARK = '>'
        self.ENUMERATION_TITLE_MARK = '+'
        self.number_of_title = 0
        self.has_enumeration = False
        self.has_identification = False
        self.question_types = []
        self.markers = [
            self.DEFINITION_MARK,
            self.ENUMERATION_MARK,
            self.ENUMERATION_TITLE_MARK,
            self.DEFINITION_TITLE_MARK,
        ]
        self.new_titles = []

    def generate_text(self):
        for file in self.files:
            self._extract_text(file)

        return self.text_content

    def _extract_text(self, file):
        with pdfplumber.open(file) as pdf:
            for page in pdf.pages:
                self.text_content += page.extract_text()

        self.text_content += '\n'

    def convert_text_to_content(self, reviewer, content=None):
        content = self.text_content.split('\n') if content is None else content.splitlines()
        content = self._clean_text_content(content)
        self.reviewer = reviewer

        for text in content:
            self.text = text.strip()
            self._identify_content_type(self.text[0])

        self._add_multiple_choice_to_question_types()

        DefinitionIsCorrectlyAnswered.definitions.bulk_create(self.definition_is_answered_correctly_objs)
        EnumerationIsCorrectlyAnswered.titles.bulk_create(self.enumeration_is_answered_correctly_objs)
        EnumerationTitle.titles.bulk_create(self.enum_titles)

    def _clean_text_content(self, content):
        index = -1
        while index + 1 < len(content):
            index += 1

            text = content[index].strip()
            prev_text = content[index - 1]

            if  text == '':
                content.pop(index)
                continue

            if prev_text == '' or prev_text is None:
                continue

            curr_text_has_a_marker = text[0] in self.markers
            prev_text_has_a_marker = prev_text[0] in self.markers

            if not curr_text_has_a_marker and prev_text_has_a_marker:
                content[index-1] += ' ' + text
                content.pop(index)
                index -= 1

        return content

    def _identify_content_type(self, marker):
        match marker:
            case self.DEFINITION_MARK:
                self._add_to_definitions()
                self._add_identification_to_question_types()
                self._add_to_definition_is_answered_correctly_objs()
            case self.ENUMERATION_MARK:
                self.new_enum_title = self._create_title(title_type=Title.Type.ENUMERATION)
                self.new_titles.append(self.new_enum_title)
                self._add_to_enum_title()
                self._add_to_enumeration_is_answered_correctly_objs()
            case self.ENUMERATION_TITLE_MARK:
                self.new_title = self._create_title(
                    title_type=Title.Type.ENUMERATION_TITLE,
                    enum_title=self.new_enum_title
                )
                self.new_titles.append(self.new_title)
                self.number_of_title += 1
                self._add_enumeration_to_question_types()
            case self.DEFINITION_TITLE_MARK:
                self.new_title = self._create_title(title_type=Title.Type.DEFINITION)
                self.new_titles.append(self.new_title)
                self.number_of_title += 1

    def _create_title(self, title_type='', enum_title=None):
        return Title.titles.create(
            owner=self.owner,
            reviewer=self.reviewer,
            text=self._get_text(self.text),
            type=title_type,
            enum_title=enum_title,
        )

    def _add_to_definitions(self):
        self.definition = Definition.definitions.create(
            owner=self.owner,
            reviewer=self.reviewer,
            title=self.new_title,
            text=self._get_text(self.text),
            slug=generate_unique_id(),
        )

    def _add_to_definition_is_answered_correctly_objs(self):
        self.definition_is_answered_correctly_objs.append(
            DefinitionIsCorrectlyAnswered(
                owner=self.owner,
                reviewer=self.reviewer,
                definition=self.definition,
                slug=generate_unique_id(),
            )
        )

    def _add_to_enum_title(self):
        self.enum_titles.append(EnumerationTitle(
            title=self.new_enum_title,
            slug=generate_unique_id(),
        ))

    def _add_to_enumeration_is_answered_correctly_objs(self):
        self.enumeration_is_answered_correctly_objs.append(
            EnumerationIsCorrectlyAnswered(
                owner=self.owner,
                reviewer=self.reviewer,
                title=self.new_enum_title,
                slug=generate_unique_id(),
            )
        )

    def _add_identification_to_question_types(self):
        if self.has_identification or self.number_of_title < 0:
            return
        self.has_identification = True
        self.question_types.append(Reviewer.QuestionType.IDENTIFICATION)

    def _add_enumeration_to_question_types(self):
        if self.has_enumeration:
            return
        self.has_enumeration = True
        self.question_types.append(Reviewer.QuestionType.ENUMERATION)

    def _add_multiple_choice_to_question_types(self):
        if self.number_of_title < 4:
            return
        self.question_types.append(Reviewer.QuestionType.MULTIPLE_CHOICE)

    @staticmethod
    def _get_text(text):
        """Remove the mark"""
        return text[1:].strip()


def unauthorized_user(reviewer, user_id):
    if reviewer is not None and reviewer.owner.id != user_id:
        raise ValidationError('You can\'t publicize a reviewer that you don\'t own.')


def is_already_public(value='', user_id='', reviewer=''):
    slug = slugify('{}-{}'.format(value, user_id))
    public_reviewer = PublicReviewer.reviewers.filter(Q(slug=slug) | Q(reviewer=reviewer)).first()

    if public_reviewer is not None:
        raise ValidationError('Try to change the name to see if it works. If not, the '
                              'selected reviewer is already public')


def get_public_reviewers(user, category: str):
    public_reviewers_ids = None
    category_reviewers = None

    match category:
        case 'RECENTLY_VIEWED':
            category_reviewers = RecentViewedPublicReviewer.reviewers.filter(owner=user)
        case 'BOOKMARKED':
            category_reviewers = BookmarkedPublicReviewer.reviewers.filter(owner=user)
        case _:
            return PublicReviewer.reviewers.all()
        
    public_reviewers_ids = [category.public_reviewer.id for category in category_reviewers]

    return PublicReviewer.reviewers.filter(id__in=public_reviewers_ids)


def get_category_reviewer(slug, model):
    return model.reviewers.filter(public_reviewer__slug=slug).first()


def create_reviewer_category(public_reviewer_slug, user, model):
    public_reviewer = PublicReviewer.reviewers.filter(slug=public_reviewer_slug).first()
    if public_reviewer is None:
        raise ValidationError({'details': 'Public reviewer doesn\'t exists'})

    model.reviewers.create(
        owner=user,
        public_reviewer=public_reviewer
    )


def remove_items_in_dictionary(dictionary, keys):
    for key in keys:
        dictionary.pop(key, None)
    return dictionary


def get_reviewer(slug):
    return Reviewer.reviewers.filter(slug=slug).first()


def get_query_params(kwargs, context=None):
    from apis.reviewer_content.serializers import ReviewerContentQueryParamSerializer

    query_params_serializer = ReviewerContentQueryParamSerializer(
        data=kwargs,
        context=context,
    )
    query_params_serializer.is_valid(raise_exception=True)
    return query_params_serializer.data


def delete_enum_title(is_definition, instance):
    is_enum_title = not is_definition

    if is_definition and instance.enum_title is not None:
        instance.definitions.all().delete()
        return

    has_definition = instance.definitions.all().first() is not None

    if is_enum_title and has_definition:
        instance.enum_title = None
        instance.save()
        return

    instance.delete()