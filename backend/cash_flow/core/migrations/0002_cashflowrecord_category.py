# Generated by Django 5.1.5 on 2025-01-25 16:07

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='cashflowrecord',
            name='category',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='core.recordcategory'),
            preserve_default=False,
        ),
    ]
