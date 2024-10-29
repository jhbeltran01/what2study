from django.db import models
from django.utils.text import slugify

from apis.authentication.models import User

from common.services import generate_access_code


class Timestamp(models.Model):
    created_at = models.DateTimeField(auto_now=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True


class SlugField(Timestamp):
    slug = models.SlugField(
        default='',
        # editable=False,
        unique=True
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
    available_question_types = models.JSONField(
        default=list,
        editable=True,
    )
    description = models.TextField(default='')

    reviewers = models.Manager()

    def __str__(self):
        return self.slug

    def save(self, **kwargs):
        self.slug = slugify('{}-{}'.format(self.name, self.owner.id))
        super().save(**kwargs)


class PublicReviewer(SlugField):
    reviewer = models.ForeignKey(
        Reviewer,
        on_delete=models.CASCADE
    )
    name = models.CharField(max_length=50)

    reviewers = models.Manager()

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

    def __str__(self):
        return self.slug

    def save(self, **kwargs):
        if self.slug == '':
            self.access_code = generate_access_code()

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

    def __str__(self):
        return self.slug

    def save(self, **kwargs):
        self.slug = slugify('{}-{}'.format(self.name, self.owner.id))
        super().save(**kwargs)



class Title(Timestamp):
    class Type(models.TextChoices):
        DEFINITION = ('D', 'DEFINITION')
        ENUMERATION = ('E', 'ENUMERATION')
        ENUMERATION_TITLE = ('T', 'ENUMERATION_TITLE')

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
        on_delete=models.CASCADE,
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
        default=Type.DEFINITION,
        editable=False,
    )

    titles = models.Manager()

    def __str__(self):
        return self.text


class EnumerationTitle(Timestamp):
    title = models.ForeignKey(
        Title,
        on_delete=models.CASCADE,
        editable=False,
        related_name='enum'
    )
    is_answered_correctly = models.BooleanField(default=False)
    is_in_order = models.BooleanField(default=False)

    titles = models.Manager()

    def __str__(self):
        return self.title.text


class Definition(Timestamp):
    owner = models.ForeignKey(
        User,
        editable=False,
        on_delete=models.CASCADE
    )
    reviewer = models.ForeignKey(
        Reviewer,
        on_delete=models.CASCADE,
        editable=False,
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

    def __str__(self):
        return self.text

    @property
    def answer(self):
        return self.title.text


class Note(SlugField):
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        editable=False,
    )
    name = models.TextField(max_length=50)
    content = models.TextField(default='')

    notes = models.Manager()

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

    def __str__(self):
        return self.slug

    def save(self, **kwargs):
        self.slug = slugify('{}-{}'.format(self.name, self.owner.id))
        super().save(**kwargs)


class PublicReviewerCategory(SlugField):
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )
    public_reviewer = models.ForeignKey(
        PublicReviewer,
        on_delete=models.CASCADE
    )

    reviewers = models.Manager()

    class Meta:
        ordering = ['-updated_at']
        abstract = True

    def __str__(self):
        return str(self.public_reviewer.slug)

    def save(self, *args, **kwargs):
        self.slug = slugify('{}-{}'.format(self.public_reviewer.id, self.owner.id))
        super().save(*args, **kwargs)



class RecentViewedPublicReviewer(PublicReviewerCategory):
    pass


class BookmarkedPublicReviewer(PublicReviewerCategory):
    pass