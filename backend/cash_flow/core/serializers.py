from rest_framework import serializers
from . import models


class CashFlowRecordSlugsSerializer(serializers.ModelSerializer):
    record_status = serializers.SlugRelatedField(slug_field='value', queryset=models.RecordStatus.objects.all())
    record_type = serializers.SlugRelatedField(slug_field='value', queryset=models.RecordType.objects.all())
    category = serializers.SlugRelatedField(slug_field='name', queryset=models.RecordCategory.objects.all())
    subcategory = serializers.SlugRelatedField(slug_field='name', queryset=models.RecordSubCategory.objects.all())

    class Meta:
        model = models.CashFlowRecord
        fields = '__all__'


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


class CategoriesWithSubcategoriesSerializer(serializers.ModelSerializer):
    subcategories = RecordSubCategorySerializer(many=True, read_only=True)

    class Meta:
        model = models.RecordCategory
        fields = ('id', 'name', 'subcategories')


class RecordTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.RecordType
        fields = '__all__'


class RecordStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.RecordStatus
        fields = '__all__'


class CategoriesStatisticSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    amount = serializers.FloatField()
    name = serializers.CharField()
