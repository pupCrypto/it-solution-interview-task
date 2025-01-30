from rest_framework import viewsets, response, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from django.http import JsonResponse
from django.db.models import Sum, Q
from . import models
from . import serializers


class FilteredSubcategoryView(viewsets.ModelViewSet):
    """
    View for filtered subcategories
    This view provide you possibility filter subcategories by url like '/api/categories/<category_id>/subcategories/'
    """
    model = models.RecordSubCategory
    queryset = model.objects.all()
    serializer_class = serializers.RecordSubCategorySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        category_id = self.kwargs.get('cat_id')
        return self.queryset.filter(category_id=category_id)


class CashFlowRecordViewSet(viewsets.ModelViewSet):
    """
    General view for cash flow records with one exception - it provides another serializer for response.
    It done to avoid multiple requests from frontend for fetching names for categories and subcategories and so on.
    """
    queryset = models.CashFlowRecord.objects.all()
    serializer_class = serializers.CashFlowRecordSerializer
    response_serializer_class = serializers.CashFlowRecordSlugsSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        response_serializer = self.response_serializer_class(serializer.instance)
        # response_serializer.is_valid(raise_exception=True)
        return response.Response(response_serializer.data, status=status.HTTP_201_CREATED)

    def list(self, request):
        queryset = self.queryset.all().filter(self.get_filter(request)).order_by('-id')
        page = int(request.GET.get('page', 0))
        limit = int(request.GET.get('limit', 10))
        offset = limit * page
        queryset = queryset[offset:offset + limit]
        serializer = self.response_serializer_class(queryset, many=True)
        return response.Response(serializer.data)

    @action(detail=False, methods=['get'])
    def total(self, request):
        total = len(self.queryset.all().filter(self.get_filter(request)))
        return JsonResponse({'total': total})

    def get_filter(self, request):
        q = Q(id__gt=0)
        if (statuses := request.GET.getlist('status')):
            statuses = [int(status) for status in statuses]
            q &= Q(record_status__in=statuses)
        if (categories := request.GET.getlist('category')):
            categories = [int(category) for category in categories]
            q &= Q(category__in=categories)
        if (types := request.GET.getlist('type')):
            types = [int(type) for type in types]
            q &= Q(record_type__in=types)
        if (subcategories := request.GET.getlist('subcategory')):
            subcategories = [int(subcategory) for subcategory in subcategories]
            q &= Q(subcategory__in=subcategories)
        if (date_from := request.GET.get('date_start')):
            q &= Q(date__gte=date_from)
        if (date_to := request.GET.get('date_end')):
            q &= Q(date__lte=date_to)
        return q


class CategoryViewSet(viewsets.ModelViewSet):
    model = models.RecordCategory
    queryset = model.objects.all()
    serializer_class = serializers.RecordCategorySerializer
    permission_classes = [AllowAny]

    @action(detail=False, methods=['get'])
    def subcategories(self, request):
        """This action provides list of subcategories for selected category"""
        serializer = serializers.CategoriesWithSubcategoriesSerializer(self.model.objects.all(), many=True)
        return response.Response(serializer.data)


class SubcategoriesViewSet(viewsets.ModelViewSet):
    model = models.RecordSubCategory
    queryset = model.objects.all()
    serializer_class = serializers.RecordSubCategorySerializer
    permission_classes = [AllowAny]


class TypeViewSet(viewsets.ModelViewSet):
    queryset = models.RecordType.objects.all()
    serializer_class = serializers.RecordTypeSerializer
    permission_classes = [AllowAny]


class StatusViewSet(viewsets.ModelViewSet):
    queryset = models.RecordStatus.objects.all()
    serializer_class = serializers.RecordStatusSerializer
    permission_classes = [AllowAny]


class StatisticView(viewsets.ViewSet):
    permission_classes = [AllowAny]

    @action(detail=False, methods=['get'])
    def categories(self, request):
        queryset = models.RecordCategory.objects.annotate(amount=Sum('cashflowrecord__amount'))
        serializer = serializers.CategoriesStatisticSerializer(queryset, many=True)
        return response.Response(serializer.data)
