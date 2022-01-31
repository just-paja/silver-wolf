# Generated by Django 3.2.11 on 2022-01-31 22:35

from django.db import migrations
import fantasion_generics.models


class Migration(migrations.Migration):

    dependencies = [
        ('fantasion_expeditions', '0006_auto_20220131_2229'),
    ]

    operations = [
        migrations.AddField(
            model_name='leisurecentre',
            name='detailed_description_cs',
            field=fantasion_generics.models.DetailedDescriptionField(blank=True, help_text='Detailed verbose description formatted in Markdown. Thereis no text limit.', null=True, verbose_name='Detailed Description'),
        ),
        migrations.AddField(
            model_name='leisurecentre',
            name='detailed_description_en',
            field=fantasion_generics.models.DetailedDescriptionField(blank=True, help_text='Detailed verbose description formatted in Markdown. Thereis no text limit.', null=True, verbose_name='Detailed Description'),
        ),
    ]
