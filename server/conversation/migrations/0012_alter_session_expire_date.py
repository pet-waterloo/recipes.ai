# Generated by Django 5.1.1 on 2024-11-28 19:57

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('conversation', '0011_alter_session_expire_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='session',
            name='expire_date',
            field=models.DateTimeField(default=datetime.datetime(2024, 12, 12, 14, 57, 9, 257924)),
        ),
    ]