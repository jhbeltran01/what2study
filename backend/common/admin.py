from django.contrib import admin

from . import models

admin.site.register(models.User)
admin.site.register(models.Reviewer)
admin.site.register(models.StudyPod)
admin.site.register(models.Title)
admin.site.register(models.Definition)
admin.site.register(models.StudypodReviewer)