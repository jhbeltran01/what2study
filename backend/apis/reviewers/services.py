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
    BookmarkedPublicReviewer,
)


class Document:
    def __init__(self, owner='', reviewer='', files=''):
        self.owner = owner
        self.reviewer = reviewer
        self.files = files
        self.text_content = ''
        self.definitions = []
        self.enum_titles = []
        self.new_title = ''
        self.new_enum_title = ''
        self.text = ''
        self.DEFINITION_MARK = '-'
        self.ENUMERATION_MARK = '>'
        self.ENUMERATION_TITLE_MARK = '+'
        self.number_of_title = 0
        self.has_enumeration = False
        self.has_identification = False
        self.question_types = []

    def generate_text(self):
        for file in self.files:
            self._extract_text(file)

        return self.text_content

    def _extract_text(self, file):
        with pdfplumber.open(file) as pdf:
            for page in pdf.pages:
                self.text_content += page.extract_text()

        self.text_content += '\n'

    def convert_text_to_content(self, reviewer):
        self.reviewer = reviewer
        contents = self.text_content.split('\n')

        for index, text in enumerate(contents):
            self.text = text

            if self.text == '':
                continue

            self._identify_content_type(marker=text[0])

        self._add_multiple_choice_to_question_types()

        Definition.definitions.bulk_create(self.definitions)
        EnumerationTitle.titles.bulk_create(self.enum_titles)

    def _identify_content_type(self, marker):
        match marker:
            case self.DEFINITION_MARK:
                self._add_to_definitions()
                self._add_identification_to_question_types()
            case self.ENUMERATION_MARK:
                self.new_enum_title = self._create_title(title_type=Title.Type.ENUMERATION)
                self._add_to_enum_title()
                self._add_enumeration_to_question_types()
            case self.ENUMERATION_TITLE_MARK:
                self.new_title = self._create_title(
                    title_type=Title.Type.ENUMERATION_TITLE,
                    enum_title=self.new_enum_title
                )
                self.number_of_title += 1
            case _:
                self.new_title = self._create_title(title_type=Title.Type.DEFINITION)
                self.number_of_title += 1

    def _create_title(self, title_type='', enum_title=None):
        return Title.titles.create(
            owner=self.owner,
            reviewer=self.reviewer,
            text=self._get_text(self.text) if title_type != Title.Type.DEFINITION else self.text,
            type=title_type,
            enum_title=enum_title
        )

    def _add_to_definitions(self):
        self.definitions.append(Definition(
            owner=self.owner,
            reviewer=self.reviewer,
            title=self.new_title,
            text=self._get_text(self.text)
        ))

    def _add_to_enum_title(self):
        self.enum_titles.append(EnumerationTitle(
            title=self.new_enum_title
        ))

    def _add_identification_to_question_types(self):
        if not self.has_identification and self.number_of_title > 0:
            self.has_identification = True
            self.question_types.append(Reviewer.QuestionType.IDENTIFICATION)

    def _add_enumeration_to_question_types(self):
        if not self.has_enumeration:
            self.has_enumeration = True
            self.question_types.append(Reviewer.QuestionType.ENUMERATION)

    def _add_multiple_choice_to_question_types(self):
        if self.number_of_title >= 4:
            self.question_types.append(Reviewer.QuestionType.MULTIPLE_CHOICE)

    @staticmethod
    def _get_text(text):
        """Remove the mark"""
        return text[2:]


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

def remove_items_in_dictionary(dict, keys):
    for key in keys:
        dict.pop(key, None)
    return dict