from pkg_resources import require
from rest_framework import serializers

from common.models import Reviewer, Definition, Title


class GenerateQuestionParamsSerializer(serializers.Serializer):
    reviewer = serializers.CharField(
        max_length=100,
        required=True,
        error_messages={
            'required': 'Add a reviewer slug on the url parameters.',
        }
    )
    number_of_questions = serializers.IntegerField(default=1)
    reviewer_obj = serializers.SerializerMethodField(read_only=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.reviewer_instance = None

    def validate_reviewer(self, value):
        self.reviewer_instance = Reviewer.reviewers.filter(
            slug=value
        ).first()

        return value

    def validate_number_of_questions(self, value):
        if value < 1:
            raise serializers.ValidationError("The number of questions must be at least 1.")

        return value

    def get_reviewer_obj(self, instance):
        return self.reviewer_instance


class IdentificationQuestionSerializer(serializers.ModelSerializer):
    question = serializers.SerializerMethodField(read_only=True)
    answer = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Definition
        fields = [
            'question',
            'answer'
        ]

    def get_question(self, instance):
        return instance.text

    def get_answer(self, instance):
        return instance.answer


class EnumerationQuestionSerializer(serializers.ModelSerializer):
    question = serializers.SerializerMethodField(read_only=True)
    answers = serializers.SerializerMethodField(read_only=True)
    is_in_order = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Title
        fields = [
            'question',
            'answers',
            'is_in_order'
        ]

    def get_question(self, instance):
        return instance.text

    def get_answers(self, instance):
        return [answer.text for answer in instance.answers.all()]

    def get_is_in_order(self, instance):
        return instance.enum.all().first().is_in_order


class MultipleChoiceQuestionSerializer(serializers.ModelSerializer):
    question = serializers.SerializerMethodField(read_only=True)
    answer = serializers.SerializerMethodField(read_only=True)
    choices = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Definition
        fields = [
            'question',
            'answer',
            'choices',
        ]

    def get_question(self, instance):
        return instance.text

    def get_answer(self, instance):
        return instance.answer

    def get_choices(self, instance):
        titles = instance.reviewer.titles.exclude(type=Title.Type.ENUMERATION).order_by('?')[:3]
        return [title.text for title in titles]