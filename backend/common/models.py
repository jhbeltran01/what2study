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
        editable=False
    )

    class Meta:
        abstract = True


class Reviewer(SlugField):
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        editable=False,
    )
    name = models.TextField(max_length=50)
    content = models.TextField(default='')

    reviewers = models.Manager()

    def __str__(self):
        return self.slug

    def save(self, **kwargs):
        self.slug = slugify('{}-{}'.format(self.name, self.owner.id))
        super().save(**kwargs)


class StudyPod(SlugField):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.TextField(max_length=50)
    size = models.IntegerField(default=10)
    access_code = models.TextField(
        max_length=100,
        editable=False
    )
    # PKs of the users that has the access code
    members = models.JSONField(
        default=dict,
        editable=False
    )

    groups = models.Manager()

    def __str__(self):
        return self.slug

    def save(self, **kwargs):
        self.slug = slugify('{}-{}'.format(self.name, self.owner.id))
        self.access_code = generate_access_code()
        super().save(**kwargs)


class Title(Timestamp):
    class Type(models.TextChoices):
        DEFINITION = ('D', 'Definition')
        ENUMERATION = ('E', 'Enumeration')
        ENUMERATION_TITLE = ('T', 'Enumeration_Title')

    owner = models.ForeignKey(
        User,
        editable=False,
        on_delete=models.CASCADE
    )
    reviewer = models.ForeignKey(
        Reviewer,
        on_delete=models.CASCADE,
        editable=False
    )
    enum_title = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        editable=False,
        default=None,
        null=True,
        blank=True,
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
    )
    text = models.TextField()
    is_answered_correctly = models.BooleanField(default=False)

    definitions = models.Manager()

    def __str__(self):
        return self.text