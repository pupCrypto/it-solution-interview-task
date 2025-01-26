from rest_framework import viewsets, response
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from . import models
from . import serializers


class CashFlowRecordViewSet(viewsets.ModelViewSet):
    queryset = models.CashFlowRecord.objects.all()
    serializer_class = serializers.CashFlowRecordSerializer
    permission_classes = [AllowAny]

    def list(self, request):
        queryset = self.queryset.all()
        serializer = serializers.CashFlowRecordSlugsSerializer(queryset, many=True)
        return response.Response(serializer.data)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = models.RecordCategory.objects.all()
    serializer_class = serializers.RecordCategorySerializer

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


class StatusViewSet(viewsets.ModelViewSet):
    queryset = models.RecordStatus.objects.all()
    serializer_class = serializers.RecordStatusSerializer
