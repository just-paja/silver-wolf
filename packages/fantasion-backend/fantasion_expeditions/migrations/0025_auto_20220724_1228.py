# Generated by Django 3.2.13 on 2022-07-24 10:28

from django.db import migrations, models
import django.db.models.deletion
import fantasion_generics.titles


class Migration(migrations.Migration):

    dependencies = [
        ('fantasion_locations', '0004_country_code'),
        ('fantasion_expeditions', '0024_transport_departed'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transport',
            name='arrives_to',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.RESTRICT, related_name='expedition_transport_destinations', to='fantasion_locations.location', verbose_name='Arrives to'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='transport',
            name='departs_from',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.RESTRICT, related_name='expedition_transports', to='fantasion_locations.location', verbose_name='Departs from'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='transportvehicle',
            name='title',
            field=fantasion_generics.titles.TitleField(default=None, help_text='Object name', max_length=255, verbose_name='Title'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='transportvehicle',
            name='title_cs',
            field=fantasion_generics.titles.TitleField(help_text='Object name', max_length=255, null=True, verbose_name='Title'),
        ),
        migrations.AlterField(
            model_name='transportvehicle',
            name='title_en',
            field=fantasion_generics.titles.TitleField(help_text='Object name', max_length=255, null=True, verbose_name='Title'),
        ),
    ]