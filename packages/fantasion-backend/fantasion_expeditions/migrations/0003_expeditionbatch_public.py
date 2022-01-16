# Generated by Django 3.2.11 on 2022-01-16 18:16

from django.db import migrations
import fantasion_generics.models


class Migration(migrations.Migration):

    dependencies = [
        ('fantasion_expeditions', '0002_auto_20220116_1915'),
    ]

    operations = [
        migrations.AddField(
            model_name='expeditionbatch',
            name='public',
            field=fantasion_generics.models.VisibilityField(default=True, help_text='Public objects will be visible on the website', verbose_name='Public'),
        ),
    ]