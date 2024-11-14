from rest_framework import serializers
from rest_framework.exceptions import ValidationError

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

        if self.reviewer_instance is None:
            raise serializers.ValidationError("Reviewer doesn't exists.")
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
    category = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Definition
        fields = [
            'question',
            'answer',
            'category',
        ]
        
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.category = self.context.pop('category', None)

    def get_question(self, instance):
        return instance.text

    def get_answer(self, instance):
        return instance.answer
    
    def get_category(self, instance):
        return self.category


class EnumerationQuestionSerializer(serializers.ModelSerializer):
    question = serializers.SerializerMethodField(read_only=True)
    answers = serializers.SerializerMethodField(read_only=True)
    is_in_order = serializers.SerializerMethodField(read_only=True)
    category = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Title
        fields = [
            'question',
            'answers',
            'is_in_order',
            'category',
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.category = self.context.pop('category', None)

    def get_question(self, instance):
        return instance.text

    def get_answers(self, instance):
        return [answer.text for answer in instance.answers.all()]

    def get_is_in_order(self, instance):
        return instance.enum.is_in_order

    def get_category(self, instance):
        return self.category


class MultipleChoiceQuestionSerializer(serializers.ModelSerializer):
    question = serializers.SerializerMethodField(read_only=True)
    answer = serializers.SerializerMethodField(read_only=True)
    choices = serializers.SerializerMethodField(read_only=True)
    category = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Definition
        fields = [
            'question',
            'answer',
            'choices',
            'category',
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.category = self.context.pop('category', None)

    def get_question(self, instance):
        return instance.text

    def get_answer(self, instance):
        return instance.answer

    def get_choices(self, instance):
        titles = instance.reviewer.titles.exclude(type=Title.Type.ENUMERATION).order_by('?')[:3]
        return [title.text for title in titles]

    def get_category(self, instance):
        return self.category


class AnswersSerializer(serializers.Serializer):
    answers = serializers.ListField(
        child=serializers.DictField(
           child=serializers.JSONField()
        )
    )
    checked_answers = serializers.SerializerMethodField(read_only=True)
    number_of_items = serializers.SerializerMethodField(read_only=True)
    score = serializers.SerializerMethodField(read_only=True)
    question_type = serializers.CharField()
    reviewer_slug = serializers.CharField()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.answers = []
        self.reviewer = None

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation.pop('answers')
        return representation

    def validate_reviewer_slug(self, value):
        self.reviewer = Reviewer.reviewers.filter(slug=value).first()

        if self.reviewer is None:
            raise ValidationError('Reviewer not found')

        return value

    def get_checked_answers(self, instance):
        question_type = self.validated_data['question_type']
        submitted_answers = self.validated_data.get('answers')

        if question_type == Reviewer.QuestionType.MULTIPLE_CHOICE:
            self.answers = submitted_answers
            return submitted_answers

        from apis.questions.services import Answers

        answers = Answers(submitted_answers)
        answers.check()
        self.answers = answers.answers

        return self.answers

    def get_number_of_items(self, instance):
        return len(self.validated_data.get('answers'))

    def get_score(self, instance):
        score = 0

        for answer in self.answers:
            is_correct = answer['is_correct']
            if is_correct:
                score += 1

        return score