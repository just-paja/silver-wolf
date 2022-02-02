# Generated by Django 3.2.11 on 2022-02-02 12:39

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('fantasion_expeditions', '0014_alter_troop_options'),
    ]

    operations = [
        migrations.AlterField(
            model_name='troop',
            name='age_group',
            field=models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, related_name='troops', to='fantasion_expeditions.agegroup', verbose_name='Age Group'),
        ),
        migrations.AlterField(
            model_name='troop',
            name='batch',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='troops', to='fantasion_expeditions.expeditionbatch', verbose_name='Expedition Batch'),
        ),
        migrations.AlterField(
            model_name='troop',
            name='program',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.RESTRICT, related_name='troops', to='fantasion_expeditions.expeditionprogram', verbose_name='Expedition Program'),
        ),
    ]
