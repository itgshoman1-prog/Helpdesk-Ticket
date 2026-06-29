from django.db import migrations


DEFAULT_SLA = [
    ('critical', 15, 240),
    ('high', 60, 480),
    ('medium', 240, 1440),
    ('low', 480, 4320),
]


def create_default_sla(apps, schema_editor):
    SLAPolicy = apps.get_model('departments', 'SLAPolicy')
    for priority, response, resolution in DEFAULT_SLA:
        SLAPolicy.objects.get_or_create(
            department=None,
            priority=priority,
            defaults={
                'response_time_minutes': response,
                'resolution_time_minutes': resolution,
            }
        )


def remove_default_sla(apps, schema_editor):
    SLAPolicy = apps.get_model('departments', 'SLAPolicy')
    SLAPolicy.objects.filter(department=None).delete()


class Migration(migrations.Migration):
    dependencies = [
        ('departments', '0002_initial'),
    ]

    operations = [
        migrations.RunPython(create_default_sla, remove_default_sla),
    ]
