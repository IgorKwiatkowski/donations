# Generated by Django 2.2.4 on 2019-08-27 13:39

from django.db import migrations
import donate.models


class Migration(migrations.Migration):

    dependencies = [
        ('donate', '0003_auto_20190826_1613'),
    ]

    operations = [
        migrations.AlterModelManagers(
            name='user',
            managers=[
                ('objects', donate.models.UserManager()),
            ],
        ),
    ]
