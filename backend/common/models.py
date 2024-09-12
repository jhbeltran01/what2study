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
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.TextField(max_length=50)

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
    bg_color = models.TextField(max_length=20)
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