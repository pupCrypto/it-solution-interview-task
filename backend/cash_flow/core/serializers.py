from rest_framework import serializers
from . import models


class CashFlowRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CashFlowRecord
        fields = '__all__'


class RecordCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.RecordCategory
        fields = '__all__'


class RecordSubCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.RecordSubCategory
        fields = '__all__'


class RecordTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.RecordType
        fields = '__all__'


class RecordStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.RecordStatus
        fields = '__all__'
