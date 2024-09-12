from django.db import models
from apis.authentication.models import User
from django.utils.text import slugify


class Timestamp(models.Model):
    created_at = models.DateTimeField(auto_now=True)
    updated_at = models.DateTimeField(auto_now_add=True)


class Reviewer(Timestamp):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    slug = models.SlugField(default='', editable=False)

    def save(self, **kwargs):
        self.slug = slugify('{}-{}'.format(self.name, self.owner))
        super().save(**kwargs)

