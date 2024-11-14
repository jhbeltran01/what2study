from django.contrib import admin

from . import models

admin.site.register(models.User)
admin.site.register(models.Reviewer)
admin.site.register(models.StudyPod)
admin.site.register(models.Title)
admin.site.register(models.Definition)
admin.site.register(models.StudypodReviewer)
admin.site.register(models.PublicReviewer)
admin.site.register(models.RecentViewedPublicReviewer)
admin.site.register(models.BookmarkedPublicReviewer)
admin.site.register(models.EnumerationTitle)
admin.site.register(models.TodoItem)
admin.site.register(models.Todo)
admin.site.register(models.Subject)
admin.site.register(models.SubjectReviewer)
admin.site.register(models.Note)
admin.site.register(models.SubjectNote)
admin.site.register(models.DefinitionIsCorrectlyAnswered)
admin.site.register(models.EnumerationIsCorrectlyAnswered)
admin.site.register(models.ReviewerAvailableQuestionType)