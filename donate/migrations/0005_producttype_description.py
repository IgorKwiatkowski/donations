# Generated by Django 2.2.4 on 2019-08-28 15:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('donate', '0004_auto_20190827_1539'),
    ]

    operations = [
        migrations.AddField(
            model_name='producttype',
            name='description',
            field=models.TextField(default='opis'),
            preserve_default=False,
        ),
    ]
