# Generated by Django 3.2.11 on 2022-01-20 22:55

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('fantasion_expeditions', '0004_auto_20220118_1913'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='expeditionmedia',
            name='created',
        ),
        migrations.RemoveField(
            model_name='expeditionmedia',
            name='modified',
        ),
        migrations.RemoveField(
            model_name='expeditionmedia',
            name='title',
        ),
        migrations.RemoveField(
            model_name='expeditionmedia',
            name='title_cs',
        ),
        migrations.RemoveField(
            model_name='expeditionmedia',
            name='title_en',
        ),
        migrations.RemoveField(
            model_name='expeditionprogrammedia',
            name='created',
        ),
        migrations.RemoveField(
            model_name='expeditionprogrammedia',
            name='modified',
        ),
        migrations.RemoveField(
            model_name='expeditionprogrammedia',
            name='title',
        ),
        migrations.RemoveField(
            model_name='expeditionprogrammedia',
            name='title_cs',
        ),
        migrations.RemoveField(
            model_name='expeditionprogrammedia',
            name='title_en',
        ),
        migrations.RemoveField(
            model_name='leisurecentremedia',
            name='created',
        ),
        migrations.RemoveField(
            model_name='leisurecentremedia',
            name='modified',
        ),
        migrations.RemoveField(
            model_name='leisurecentremedia',
            name='title',
        ),
        migrations.RemoveField(
            model_name='leisurecentremedia',
            name='title_cs',
        ),
        migrations.RemoveField(
            model_name='leisurecentremedia',
            name='title_en',
        ),
        migrations.RemoveField(
            model_name='staffrolemedia',
            name='created',
        ),
        migrations.RemoveField(
            model_name='staffrolemedia',
            name='modified',
        ),
        migrations.RemoveField(
            model_name='staffrolemedia',
            name='title',
        ),
        migrations.RemoveField(
            model_name='staffrolemedia',
            name='title_cs',
        ),
        migrations.RemoveField(
            model_name='staffrolemedia',
            name='title_en',
        ),
    ]
