from rest_framework.mixins import (
    CreateModelMixin,
    UpdateModelMixin,
    DestroyModelMixin,
)
from rest_framework.generics import GenericAPIView
from rest_framework import exceptions
from rest_framework.response import Response
from rest_framework import status

from common.models import (
    Title,
    Definition,
    EnumerationTitle
)
from common.services import generate_unique_id

from .serializers import (
    DefinitionSerializer,
    ReviewerContentQueryParamSerializer, ReviewerContentSerializer,
)
from ..reviewers.serializers import TitleSerializer
from ..reviewers.services import get_query_params, Document


class DefinitionAPIView(
    CreateModelMixin,
    UpdateModelMixin,
    DestroyModelMixin,
    GenericAPIView
):
    serializer_class = DefinitionSerializer
    lookup_field = 'slug'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.query_params = None

    def post(self, request, *args, **kwargs):
        self.query_params = get_query_params(kwargs)
        return super().create(request,*args, **kwargs)

    def patch(self, request, *args, **kwargs):
        self.query_params = get_query_params(kwargs)

        if kwargs.get('slug') is None:
            raise exceptions.MethodNotAllowed('PATCH')

        kwargs['partial'] = True
        return super().update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        self.query_params = get_query_params(kwargs)

        if kwargs.get('slug') is None:
            raise exceptions.MethodNotAllowed('DELETE')

        super().destroy(request, *args, **kwargs)

        payload = {'detail': 'Definition has been deleted.'}
        return Response(payload, status=status.HTTP_200_OK)

    def get_queryset(self):
        return Definition.definitions.filter(title=self.query_params.get('title'))

    def perform_create(self, serializer):
        serializer.save(
            owner=self.request.user,
            reviewer=self.query_params.get('reviewer'),
            title=self.query_params.get('title'),
            slug=generate_unique_id()
        )


class EnumerationTitleAPIView(
    CreateModelMixin,
    UpdateModelMixin,
    DestroyModelMixin,
    GenericAPIView
):
    serializer_class = TitleSerializer
    lookup_field = 'slug'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.query_params = None
        self.valid_types = {'valid_title_types': [Title.Type.ENUMERATION]}

    def post(self, request, *args, **kwargs):
        self.query_params = get_query_params(kwargs, context=self.valid_types)
        return super().create(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        self.query_params = get_query_params(kwargs, context=self.valid_types)

        if kwargs.get('slug') is None:
            raise exceptions.MethodNotAllowed('PATCH')

        kwargs['partial'] = True
        return super().update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        self.query_params = get_query_params(kwargs, context=self.valid_types)

        if kwargs.get('slug') is None:
            raise exceptions.MethodNotAllowed('DELETE')

        payload = {'detail': 'Title has been deleted.'}
        return Response(payload, status=status.HTTP_200_OK)

    def get_queryset(self):
        return Title.titles.filter(enum_title=self.query_params.get('title'))

    def perform_create(self, serializer):
        title = serializer.save(
            owner=self.request.user,
            reviewer=self.query_params.get('reviewer'),
            enum_title=self.query_params.get('title')
        )
        EnumerationTitle.titles.create(title=title)


class TitleAPIView(
    UpdateModelMixin,
    DestroyModelMixin,
    GenericAPIView
):
    serializer_class = TitleSerializer
    lookup_field = 'slug'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.query_params = None
        self.custom_context = {
            'valid_title_types': [
                Title.Type.ENUMERATION,
                Title.Type.DEFINITION,
                Title.Type.ENUMERATION_TITLE
            ],
            'title_slug_is_needed': True
        }

    def dispatch(self, request, *args, **kwargs):
        kwargs['title_slug'] = kwargs.get('slug')
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        self.custom_context['title_slug_is_needed'] = False
        self.query_params = get_query_params(kwargs, context=self.custom_context)
        serializer = ReviewerContentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({'details': 'Adding a content is successful.'}, status=status.HTTP_200_OK)

    def patch(self, request, *args, **kwargs):
        self.query_params = get_query_params(kwargs, context=self.custom_context)

        if kwargs.get('slug') is None:
            raise exceptions.MethodNotAllowed('PATCH')

        kwargs['partial'] = True
        return super().update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        self.query_params = get_query_params(kwargs, context=self.custom_context)

        if kwargs.get('slug') is None:
            raise exceptions.MethodNotAllowed('DELETE')

        super().destroy(request, *args, **kwargs)

        payload = {'detail': 'Title has been deleted.'}
        return Response(payload, status=status.HTTP_200_OK)

    def get_object(self):
        return self.query_params.get('title')

    def get_queryset(self):
        reviewer = self.query_params.get('reviewer')
        return reviewer.titles.all()

    def perform_create(self, serializer):
        document = Document(owner=self.request.user)
        reviewer = self.query_params.get('reviewer')
        content = serializer.data.get('content')

        document.convert_text_to_content(reviewer, content=content)

        reviewer.content += content
        reviewer.available_question_types = document.question_types
        reviewer.save()