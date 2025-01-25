from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Fills the database with default data'

    def handle(self, *args, **options):
        from core.models import RecordStatus, RecordType, RecordCategory, RecordSubCategory

        RecordStatus.objects.bulk_create([
            RecordStatus(value='Бизнес'),
            RecordStatus(value='Личное'),
            RecordStatus(value='Налог'),
        ], ignore_conflicts=True)

        RecordType.objects.bulk_create([
            RecordType(value='Пополнение'),
            RecordType(value='Списание'),
        ], ignore_conflicts=True)

        category_infrastructure, _ = RecordCategory.objects.get_or_create(
            name='Инфраструктура',
            defaults={'name': 'Инфраструктура'}
        )
        category_finance, _ = RecordCategory.objects.get_or_create(
            name='Финансы',
            defaults={'name': 'Финансы'}
        )

        RecordSubCategory.objects.bulk_create([
            RecordSubCategory(name='VPS', category=category_infrastructure),
            RecordSubCategory(name='Proxy', category=category_infrastructure),

            RecordSubCategory(name='Farpost', category=category_finance),
            RecordSubCategory(name='Avito', category=category_finance),
        ], ignore_conflicts=True)
