from rest_framework import viewsets, response, views
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from django.http import JsonResponse
from django.db.models import Sum
from . import models
from . import serializers


class CashFlowRecordViewSet(viewsets.ModelViewSet):
    queryset = models.CashFlowRecord.objects.all()
    serializer_class = serializers.CashFlowRecordSerializer
    permission_classes = [AllowAny]

    def list(self, request):
        queryset = self.queryset.all()
        page = int(request.GET.get('page', 0))
        limit = int(request.GET.get('limit', 10))
        offset = limit * page
        queryset = queryset[offset:offset + limit]
        serializer = serializers.CashFlowRecordSlugsSerializer(queryset, many=True)
        return response.Response(serializer.data)

    @action(detail=False, methods=['get'])
    def total(self, request):
        total = len(self.queryset.all())
        return JsonResponse({'total': total})


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = models.RecordCategory.objects.all()
    serializer_class = serializers.RecordCategorySerializer
    permission_classes = [AllowAny]

    @action(detail=True, methods=['get'])
    def subcategories(self, request, pk=None):
        try:
            query = self.queryset.get(pk=pk).recordsubcategory_set.all()
        except models.RecordCategory.DoesNotExist:
            return response.Response(status=404)
        serializer = serializers.RecordSubCategorySerializer(query, many=True)
        return response.Response(serializer.data)


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
