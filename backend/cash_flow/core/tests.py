from django.test import TransactionTestCase, Client
from .mixins import TestMixin
from . import models


class TestHttpCore(TestMixin, TransactionTestCase):
    def setUp(self):
        self.client = Client()

    def test_get_cash_flow_records(self):
        response = self.client.get('/api/cash-flow-records/')
        self.assertEqual(response.status_code, 200)

    def test_categories(self):
        self.fill_default()
        response = self.client.get('/api/categories/')
        self.assertEqual(response.status_code, 200)
        json = response.json()
        self.assertEqual(len(json), 2)
        categories = [c['name'] for c in json]

        self.assertIn('Инфраструктура', categories)
        self.assertIn('Финансы', categories)

    def test_get_subcategories(self):
        self.fill_default()
        first_category = models.RecordCategory.objects.first()
        response = self.client.get(f'/api/categories/{first_category.id}/subcategories/')
        self.assertEqual(response.status_code, 200)
        json = response.json()
        self.assertEqual(len(json), 2)
        for subcategory in json:
            self.assertEqual(subcategory['category'], first_category.id)

    def test_get_types(self):
        self.fill_default()
        response = self.client.get('/api/types/')
        self.assertEqual(response.status_code, 200)
        json = response.json()
        self.assertEqual(len(json), 2)
        types = [t['value'] for t in json]
        self.assertIn('Пополнение', types)
        self.assertIn('Списание', types)

    def test_get_statuses(self):
        self.fill_default()
        response = self.client.get('/api/statuses/')
        self.assertEqual(response.status_code, 200)
        json = response.json()
        self.assertEqual(len(json), 3)
        statuses = [s['value'] for s in json]
        self.assertIn('Бизнес', statuses)
        self.assertIn('Личное', statuses)
        self.assertIn('Налог', statuses)

    def test_get_total_number_of_records(self):
        response = self.client.get('/api/cash-flow-records/total/')
        self.assertEqual(response.status_code, 200)
        json = response.json()
        self.assertEqual(json['total'], 0)

    def test_get_category_statistic(self):
        self.fill_default()

        first_category = models.RecordCategory.objects.first()
        second_category = models.RecordCategory.objects.last()

        self.create_cash_flow_record(100, category=first_category)
        self.create_cash_flow_record(100, category=second_category)
        self.create_cash_flow_record(100, category=first_category)
        response = self.client.get('/api/statistics/categories/')
        self.assertEqual(response.status_code, 200)
        json = response.json()
        for stat in json:
            if stat['name'] == 'Инфраструктура':
                self.assertEqual(stat['amount'], 200)
            elif stat['name'] == 'Финансы':
                self.assertEqual(stat['amount'], 100)
