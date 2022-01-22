# Generated by Django 3.2.11 on 2022-01-22 22:25

from django.db import migrations
import fantasion_generics.models


class Migration(migrations.Migration):

    dependencies = [
        ('fantasion_content', '0008_auto_20220122_2304'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='flavourtext',
            options={'ordering': ['-importance'], 'verbose_name': 'Flavour Text', 'verbose_name_plural': 'Flavour Texts'},
        ),
        migrations.AddField(
            model_name='flavourtext',
            name='importance',
            field=fantasion_generics.models.ImportanceField(default=0, help_text='More important objects will appear on the top or sooner on the page', verbose_name='Object Importance'),
        ),
    ]
