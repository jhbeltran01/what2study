from rest_framework.mixins import (
    CreateModelMixin,
    ListModelMixin,
    RetrieveModelMixin,
    UpdateModelMixin,
    DestroyModelMixin,
)
from rest_framework.generics import GenericAPIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import exceptions
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from common.models import (
    Reviewer,
    PublicReviewer,
    RecentViewedPublicReviewer,
    BookmarkedPublicReviewer, ReviewerAvailableQuestionType,
)

from .serializers import (
    ReviewerSerializer,
    PublicReviewerSerializer,
    RecentlyViewedQueryParamSerializer,
    BookmarkedQueryParamSerializer,
)
from .services import (
    Document,
    get_public_reviewers,
    create_reviewer_category_public,
    get_category_reviewer, create_reviewer_category_private,
)


class ReviewersAPIView(
    CreateModelMixin,
    ListModelMixin,
    RetrieveModelMixin,
    UpdateModelMixin,
    DestroyModelMixin,
    GenericAPIView
):
    serializer_class = ReviewerSerializer
    lookup_field = 'slug'
    parser_classes = (MultiPartParser, FormParser)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.slug = ''
        self.is_get_reviewer = ''
        self.files = ''
        self.is_get_content = False
        self.is_partial = False

    def dispatch(self, request, *args, **kwargs):
        self.slug = kwargs.get('slug', None)
        self.is_get_content = request.GET.get('is_get_content', False)
        self.is_partial = request.GET.get('is_partial', False)
        return super().dispatch(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        self.files = request.FILES.getlist('files')
        return self.create(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        self.is_get_reviewer = self.slug is not None

        if self.is_get_reviewer:
            return self.retrieve(request, *args, **kwargs)
        return self.list(request, *args, **kwargs)
    
    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)

    def perform_create(self, serializer):
        document = Document(
            files=self.files,
            owner=self.request.user,
        )
        reviewer = serializer.save(
            owner=self.request.user,
            content=document.generate_text(),
        )
        document.convert_text_to_content(reviewer)
        ReviewerAvailableQuestionType.reviewers.create(
            owner=self.request.user,
            reviewer=reviewer,
            available_question_types=document.question_types,
        )

    def patch(self, request, *args, **kwargs):
        if self.slug is None:
            raise exceptions.MethodNotAllowed('PATCH')
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)
    
    def get_queryset(self):
        return Reviewer.reviewers.filter(owner=self.request.user)
    
    def get_object(self):
        reviewer = Reviewer.reviewers.filter(
            slug=self.slug,
            owner=self.request.user,
        ).first()
        if reviewer is None:
            raise exceptions.NotFound('Reviewer not found.')
        return reviewer
    
    def get_serializer_context(self):
        return {
            'owner': self.request.user,
            'is_get_content': self.is_get_content,
            'is_partial': self.is_partial
        }


class PublicizeReviewerAPIView(
    CreateModelMixin,
    DestroyModelMixin,
    ListModelMixin,
    RetrieveModelMixin,
    GenericAPIView
):
    lookup_field = 'slug'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.slug = None
        self.is_get_method = False
        self.category = None
        self.is_get_content = False
        self.is_partial = False
        self.get_list = False
        self.is_public = True
        self.is_get_single_reviewer = False
        self.is_create = False

    def dispatch(self, request, *args, **kwargs):
        self.slug = kwargs.get('slug')
        self.is_get_method = request.method == 'GET'
        self.category = request.GET.get('category')
        self.is_get_content = request.GET.get('is_get_content', False)
        self.is_partial = request.GET.get('is_partial', False)
        self.is_public = request.GET.get('is_public', True) != 'false'
        return super().dispatch(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        if kwargs.get('slug') is not None:
            self.is_get_single_reviewer = True
            return super().retrieve(request, *args, **kwargs)
        return super().list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        self.is_create = True
        return super().create(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        if self.slug is None:
            raise exceptions.MethodNotAllowed('DELETE')

        super().destroy(request, *args, **kwargs)
        payload = {'detail': 'Reviewer has been set to private.'}
        return Response(payload, status=status.HTTP_200_OK)

    def get_queryset(self):
        if self.is_get_method:
            return get_public_reviewers(self.request.user, self.category)

    def get_object(self):
        if self.is_get_single_reviewer and not self.is_public:
            return Reviewer.reviewers.filter(slug=self.slug).first()

        return PublicReviewer.reviewers.filter(reviewer__slug=self.slug).first()

    def get_serializer_class(self):
        if self.is_public and (self.is_get_content or self.is_create) :
            return PublicReviewerSerializer

        if self.is_get_method:
            return ReviewerSerializer
    def get_serializer_context(self):
        return {
            'owner': self.request.user,
            'is_get_content': self.is_get_content,
            'is_partial': self.is_partial,
        }

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class RecentViewedReviewerAPIView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = RecentlyViewedQueryParamSerializer(data=request.GET)
        serializer.is_valid(raise_exception=True)

        reviewer_slug = serializer.data.get('reviewer')
        reviewer = get_category_reviewer(
            reviewer_slug,
            RecentViewedPublicReviewer,
            self.request.user
        )
        print(reviewer)
        has_been_viewed = reviewer is not None
        is_public = serializer.data.get('is_public')

        if has_been_viewed:
            self.perform_update(reviewer)
        else:
            self.perform_create(reviewer_slug, is_public)

        return Response({'success': 'Reviewer is added or updated as recently viewed.'})

    def perform_update(self, reviewer):
        reviewer.save()

    def perform_create(self, reviewer_slug, is_public):
        create_reviewer = create_reviewer_category_public \
            if is_public \
            else create_reviewer_category_private
        create_reviewer(
            reviewer_slug,
            self.request.user,
            RecentViewedPublicReviewer
        )


class BookmarkedReviewerAPIView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = BookmarkedQueryParamSerializer(data=request.GET)
        serializer.is_valid(raise_exception=True)

        reviewer_slug = serializer.data.get('reviewer')
        reviewer = get_category_reviewer(
            reviewer_slug,
            BookmarkedPublicReviewer,
            self.request.user
        )
        has_been_bookmarked = reviewer is not None
        is_bookmarked = serializer.data.get('is_bookmarked')
        is_public = serializer.data.get('is_public')
        message = 'No action performed.'

        if has_been_bookmarked and not is_bookmarked:
            self.perform_destroy(reviewer)
            message = 'Public reviewer has been removed in bookmarked.'

        if not has_been_bookmarked and is_bookmarked:
            self.perform_create(reviewer_slug, is_public=is_public)
            message = 'Public reviewer has been bookmarked.'

        return Response({'success': message})

    def perform_create(self, reviewer_slug, is_public):
        create_reviewer = create_reviewer_category_public \
            if is_public \
            else create_reviewer_category_private
        create_reviewer(
            reviewer_slug,
            self.request.user,
            BookmarkedPublicReviewer
        )


    def perform_destroy(self, reviewer):
        reviewer.delete()