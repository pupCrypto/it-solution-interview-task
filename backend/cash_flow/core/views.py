from rest_framework import viewsets, response
from rest_framework.decorators import action
from . import models
from . import serializers


class CashFlowRecordViewSet(viewsets.ModelViewSet):
    queryset = models.CashFlowRecord.objects.all()
    serializer_class = serializers.CashFlowRecordSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = models.RecordCategory.objects.all()
    serializer_class = serializers.RecordCategorySerializer

    @action(detail=True, methods=['get'])
    def subcategories(self, request, pk=None):
        query = self.queryset.get(pk=pk).recordsubcategory_set.all()
        serializer = serializers.RecordSubCategorySerializer(query, many=True)
        return response.Response(serializer.data)


class TypeViewSet(viewsets.ModelViewSet):
    queryset = models.RecordType.objects.all()
    serializer_class = serializers.RecordTypeSerializer


class StatusViewSet(viewsets.ModelViewSet):
    queryset = models.RecordStatus.objects.all()
    serializer_class = serializers.RecordStatusSerializer