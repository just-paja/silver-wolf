# Generated by Django 3.2.12 on 2022-04-07 01:18

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('fantasion_people', '0014_auto_20220402_1937'),
        ('fantasion_signups', '0015_signup_note'),
    ]

    operations = [
        migrations.AddField(
            model_name='participant',
            name='family',
            field=models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, related_name='participants', to='fantasion_people.family', verbose_name='Family'),
            preserve_default=False,
        ),
    ]
