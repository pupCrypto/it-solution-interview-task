from .management.commands.filldefault import Command
from .models import CashFlowRecord


class TestMixin:
    def create_cash_flow_record(self, amount, comment, record_status, record_type, subcategory):
        return CashFlowRecord.objects.create(
            amount=amount,
            comment=comment,
            record_status=record_status,
            record_type=record_type,
            subcategory=subcategory
        )

    def fill_default(self):
        command = Command()
        command.handle()
