from django.db import models


class CashFlowRecord(models.Model):
    date = models.DateField(auto_now_add=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    comment = models.CharField(max_length=124, null=True)
    record_status = models.ForeignKey('RecordStatus', on_delete=models.CASCADE)
    record_type = models.ForeignKey('RecordType', on_delete=models.CASCADE)
    category = models.ForeignKey('RecordCategory', on_delete=models.CASCADE)
    subcategory = models.ForeignKey('RecordSubCategory', on_delete=models.CASCADE)


class RecordStatus(models.Model):
    value = models.CharField(max_length=124, unique=True)


class RecordType(models.Model):
    value = models.CharField(max_length=124, unique=True)


class RecordCategory(models.Model):
    name = models.CharField(max_length=124, unique=True)

    @property
    def subcategories(self):
        return self.recordsubcategory_set.all()


class RecordSubCategory(models.Model):
    name = models.CharField(max_length=124)
    category = models.ForeignKey('RecordCategory', on_delete=models.CASCADE)

    class Meta:
        unique_together = ('name', 'category')
