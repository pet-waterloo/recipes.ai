# Generated by Django 5.1.1 on 2024-11-29 00:38

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('conversation', '0016_user_social_login_alter_session_expire_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='session',
            name='expire_date',
            field=models.DateTimeField(default=datetime.datetime(2024, 12, 12, 19, 38, 22, 761639)),
        ),
    ]