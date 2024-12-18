"""@TODO when generate_unique_id, add the owner id"""
from django.db import models
from django.utils.text import slugify
from django.conf import settings
from rest_framework.exceptions import ValidationError

from apis.authentication.models import User

from common.services import generate_access_code, generate_unique_id


class Timestamp(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class SlugField(Timestamp):
    slug = models.SlugField(
        editable=settings.DEBUG,
        unique=True,
        default=None
    )

    class Meta:
        abstract = True


class Reviewer(SlugField):
    class QuestionType(models.TextChoices):
        IDENTIFICATION = ('I', 'IDENTIFICATION')
        ENUMERATION = ('E', 'ENUMERATION')
        MULTIPLE_CHOICE = ('M', 'MULTIPLE_CHOICE')

    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        editable=False,
    )
    name = models.TextField(max_length=50)
    content = models.TextField(default='')
    description = models.TextField(default='')

    reviewers = models.Manager()

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.slug

    def save(self, **kwargs):
        self.slug = slugify('{}-{}'.format(self.name, self.owner.id))
        super().save(**kwargs)


class AvailableQuestionType(SlugField):
    available_question_types = models.JSONField(
        default=list,
        editable=True,
    )

    reviewers = models.Manager()

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        if self.slug is None:
            self.slug = generate_unique_id()
        super().save(*args, **kwargs)


class ReviewerAvailableQuestionType(AvailableQuestionType):
    reviewer = models.ForeignKey(
        Reviewer,
        on_delete=models.CASCADE,
        related_name='available_question_types'
    )

    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='available_question_types'
    )

    class Meta:
        unique_together = ['owner', 'reviewer']

    def __str__(self):
        return self.reviewer.name


class PublicReviewer(SlugField):
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )
    reviewer = models.OneToOneField(
        Reviewer,
        on_delete=models.CASCADE,
        related_name='public'
    )
    name = models.CharField(max_length=50)

    reviewers = models.Manager()

    class Meta:
        ordering = ['-created_at']
        unique_together = ('owner', 'reviewer')

    def __str__(self):
        return self.slug

    def save(self, *args, **kwargs):
        self.slug = slugify('{}-{}'.format(self.name, self.reviewer.owner.id))
        super().save(*args, **kwargs)


class StudyPod(SlugField):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.TextField(max_length=50)
    size = models.IntegerField(default=10)
    access_code = models.TextField(
        max_length=100,
        # editable=False,
        unique=True,
    )
    # PKs of the users that has the access code
    members = models.JSONField(
        default=list,
        editable=False,
    )

    groups = models.Manager()

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.slug

    def save(self, **kwargs):
        if self.slug is None or self.slug == '':
            self.access_code = generate_access_code()
            self.members = [self.owner.id]
        self.slug = slugify('{}-{}'.format(self.name, self.owner.id))
        super().save(**kwargs)

class StudypodReviewer(SlugField):
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )
    studypod = models.ForeignKey(
        StudyPod,
        on_delete=models.CASCADE
    )
    reviewer = models.ForeignKey(
        Reviewer,
        on_delete=models.CASCADE
    )
    name = models.CharField(
        max_length=50,
        blank=True
    )

    reviewers = models.Manager()

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.slug

    def save(self, **kwargs):
        self.slug = slugify('{}-{}-{}-{}'.format(
            self.name,
            self.studypod.id,
            self.reviewer.id,
            self.owner.id
        ))
        super().save(**kwargs)


class StudypodReviewerAvailableQuestionType(AvailableQuestionType):
    studypod = models.ForeignKey(
        StudyPod,
        on_delete=models.CASCADE,
        related_name='available_types'
    )

    reviewer = models.ForeignKey(
        Reviewer,
        on_delete=models.CASCADE,
        related_name='available_types'
    )

    class Meta:
        unique_together = ['studypod', 'reviewer']


class Title(SlugField):
    class Type(models.TextChoices):
        DEFINITION = ('D', 'DEFINITION')
        ENUMERATION = ('E', 'ENUMERATION')
        ENUMERATION_TITLE = ('T', 'ENUMERATION_TITLE')


    class Meta:
        ordering = ['created_at']

    owner = models.ForeignKey(
        User,
        editable=False,
        on_delete=models.CASCADE
    )
    reviewer = models.ForeignKey(
        Reviewer,
        on_delete=models.CASCADE,
        editable=False,
        related_name='titles'
    )
    enum_title = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        editable=False,
        default=None,
        null=True,
        blank=True,
        related_name='answers'
    )
    text = models.TextField()
    type = models.CharField(
        max_length=1,
        choices=Type.choices,
        editable=settings.DEBUG,
    )

    titles = models.Manager()

    def __str__(self):
        return self.text

    def save(self, *args, **kwargs):
        if self.slug is None:
            self.slug = generate_unique_id()
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        answers = self.answers.all()
        to_be_deleted = []

        for answer in answers:
            if answer.definitions.all().first() is None:
                to_be_deleted.append(answer.id)

        Title.titles.filter(id__in=to_be_deleted).delete()
        super().delete(*args, **kwargs)


class EnumerationTitle(SlugField):
    title = models.OneToOneField(
        Title,
        on_delete=models.CASCADE,
        editable=False,
        related_name='enum'
    )
    is_answered_correctly = models.BooleanField(default=False)
    is_in_order = models.BooleanField(default=False)

    titles = models.Manager()

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return self.title.text

    def save(self, *args, **kwargs):
        if self.slug is None:
            self.slug = generate_unique_id()
        super().save(*args, **kwargs)


class Definition(SlugField):
    owner = models.ForeignKey(
        User,
        editable=False,
        on_delete=models.CASCADE
    )
    reviewer = models.ForeignKey(
        Reviewer,
        on_delete=models.CASCADE,
        editable=False,
        related_name='definitions'
    )
    title = models.ForeignKey(
        Title,
        on_delete=models.CASCADE,
        editable=False,
        related_name='definitions'
    )
    text = models.TextField()
    is_answered_correctly = models.BooleanField(default=False)

    definitions = models.Manager()

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return self.text

    def save(self, *args, **kwargs):
        if self.slug is None:
            self.slug = generate_unique_id()
        super().save(*args, **kwargs)

    @property
    def answer(self):
        return self.title.text


class IsCorrectlyAnswered(SlugField):
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )
    reviewer = models.ForeignKey(
        Reviewer,
        on_delete=models.CASCADE,
    )
    is_correctly_answered = models.BooleanField(default=False)

    class Meta:
        abstract = True

    def __str__(self):
        return self.slug

    def save(self, *args, **kwargs):
        if self.slug is None:
            self.slug = '{}{}'.format(generate_unique_id(), self.owner.id)
        super().save(*args, **kwargs)


class DefinitionIsCorrectlyAnswered(IsCorrectlyAnswered):
    definition = models.ForeignKey(
        Definition,
        on_delete=models.CASCADE,
        related_name='statuses'
    )

    definitions = models.Manager()

    class Meta:
        unique_together = ('owner', 'reviewer', 'definition')


class EnumerationIsCorrectlyAnswered(IsCorrectlyAnswered):
    title = models.ForeignKey(
        Title,
        on_delete=models.CASCADE,
        related_name='statuses'
    )

    titles = models.Manager()

    class Meta:
        unique_together = ('owner', 'reviewer', 'title')

    def save(self, *args, **kwargs):
        if self.title.type != Title.Type.ENUMERATION:
            raise ValidationError('The title must be of type "Enumeration"')

        if self.slug is None:
            self.slug = '{}{}'.format(generate_unique_id(), self.owner.id)

        super().save(*args, **kwargs)


class StudypodIsCorrectlyAnswered(SlugField):
    studypod = models.ForeignKey(
        StudyPod,
        on_delete=models.CASCADE,
    )
    reviewer = models.ForeignKey(
        Reviewer,
        on_delete=models.CASCADE,
    )
    is_correctly_answered = models.BooleanField(default=False)

    class Meta:
        abstract = True

    def __str__(self):
        return self.slug

    def save(self, *args, **kwargs):
        if self.slug is None:
            self.slug = '{}'.format(generate_unique_id())
        super().save(*args, **kwargs)


class StudypodDefinitionIsAnsweredCorrectly(StudypodIsCorrectlyAnswered):
    definition = models.ForeignKey(
        Definition,
        on_delete=models.CASCADE,
        related_name='studypod_statuses'
    )

    definitions = models.Manager()

    class Meta:
        unique_together = ('studypod', 'reviewer', 'definition')


class StudypodEnumerationIsCorrectlyAnswered(StudypodIsCorrectlyAnswered):
    title = models.ForeignKey(
        Title,
        on_delete=models.CASCADE,
        related_name='studypod_statuses'
    )

    titles = models.Manager()

    class Meta:
        unique_together = ('studypod', 'reviewer', 'title')


class Note(SlugField):
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        editable=False,
    )
    name = models.TextField(max_length=50)
    content = models.TextField(default='')

    notes = models.Manager()

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.slug

    def save(self, **kwargs):
        self.slug = slugify('{}-{}'.format(self.name, self.owner.id))
        super().save(**kwargs)

    
class Todo(SlugField):
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        editable=False,
    )
    name = models.TextField(max_length=50)
    content = models.TextField(default='')

    todos = models.Manager()

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.slug

    def save(self, **kwargs):
        self.slug = slugify('{}-{}'.format(self.name, self.owner.id))
        super().save(**kwargs)


class TodoItem(SlugField):
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        editable=False,
    )
    todo = models.ForeignKey(
        Todo,
        on_delete=models.CASCADE,
        related_name='items'
    )
    text = models.CharField(max_length=200)
    is_done = models.BooleanField(default=False)

    items = models.Manager()

    class Meta:
        ordering = ['-created_at']

    def save(self, **kwargs):
        if self.slug is None:
            self.slug = generate_unique_id()
        super().save(**kwargs)


class PublicReviewerCategory(SlugField):
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )
    public_reviewer = models.ForeignKey(
        PublicReviewer,
        on_delete=models.CASCADE,
        default=None,
        null=True,
        blank=True,
    )
    reviewer = models.ForeignKey(
        Reviewer,
        on_delete=models.CASCADE,
        default=None,
        null=True,
        blank=True,
    )

    reviewers = models.Manager()

    class Meta:
        ordering = ['-updated_at']
        abstract = True

    def __str__(self):
        if self.public_reviewer is not None:
            return str(self.public_reviewer.slug)
        return str(self.reviewer.slug)

    def save(self, *args, **kwargs):
        if self.slug is None:
            self.slug = generate_unique_id()
        super().save(*args, **kwargs)


class RecentViewedPublicReviewer(PublicReviewerCategory):
    pass


class BookmarkedPublicReviewer(PublicReviewerCategory):
    pass


class Subject(SlugField):
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='subjects'
    )
    name = models.CharField(max_length=50)

    subjects = models.Manager()

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.slug

    def save(self, *args, **kwargs):
        self.slug = slugify('{}-{}'.format(self.name, self.owner.id))
        super().save(*args, **kwargs)


class SubjectReviewer(SlugField):
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='subject_reviewers'
    )
    reviewer = models.OneToOneField(
        Reviewer,
        on_delete=models.CASCADE,
        related_name='subject'
    )
    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        related_name='reviewers'
    )

    reviewers = models.Manager()

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.slug

    def save(self, *args, **kwargs):
        if self.slug is None:
            self.slug = generate_unique_id()
        super().save(*args, **kwargs)


class SubjectNote(SlugField):
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='subject_notes'
    )
    note = models.OneToOneField(
        Note,
        on_delete=models.CASCADE,
        related_name='subject_notes'
    )
    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        related_name='notes'
    )

    notes = models.Manager()

    def __str__(self):
        return self.slug

    def save(self, *args, **kwargs):
        if self.slug is None:
            self.slug = generate_unique_id()
        super().save(*args, **kwargs)