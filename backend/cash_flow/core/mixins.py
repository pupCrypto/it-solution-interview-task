import random
from django.db.models import QuerySet
from .management.commands.filldefault import Command
from . import models


class TestMixin:
    def create_cash_flow_record(self, amount, category=None, record_status=None, record_type=None, subcategory=None, comment=None):
        return models.CashFlowRecord.objects.create(
            amount=amount,
            comment=comment,
            record_status=record_status or self.random_model(models.RecordStatus.objects.all()),
            record_type=record_type or self.random_model(models.RecordType.objects.all()),
            category=category or self.random_model(models.RecordCategory.objects.all()),
            subcategory=subcategory or self.random_model(models.RecordSubCategory.objects.all())
        )

    def fill_default(self):
        command = Command()
        command.handle()

    def random_model(self, models: QuerySet):
        return random.choice(models)
