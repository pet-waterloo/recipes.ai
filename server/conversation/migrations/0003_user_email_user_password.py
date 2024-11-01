# Generated by Django 5.1.1 on 2024-10-30 02:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('conversation', '0002_userdata'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='email',
            field=models.EmailField(default='defaultemail', max_length=64, unique=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='user',
            name='password',
            field=models.CharField(default='defaultpassword', max_length=64),
            preserve_default=False,
        ),
    ]
