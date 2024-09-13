import io

import pdfplumber

from common.models import Title, Definition, EnumerationTitle


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

    def generate_text(self):
        for file in self.files:
            self.extract_text(file)

        return self.text_content

    def extract_text(self, file):
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

        Definition.definitions.bulk_create(self.definitions)
        EnumerationTitle.titles.bulk_create(self.enum_titles)

    def _identify_content_type(self, marker):
        match marker:
            case self.DEFINITION_MARK:
                self._add_to_definitions()
            case self.ENUMERATION_MARK:
                self.new_enum_title = self._create_title(title_type=Title.Type.ENUMERATION)
                self._add_to_enum_title()
            case self.ENUMERATION_TITLE_MARK:
                self.new_title = self._create_title(
                    title_type=Title.Type.ENUMERATION_TITLE,
                    enum_title=self.new_enum_title
                )
            case _:
                self.new_title = self._create_title(title_type=Title.Type.DEFINITION)

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

    @staticmethod
    def _get_text(text):
        """Remove the mark"""
        return text[2:]