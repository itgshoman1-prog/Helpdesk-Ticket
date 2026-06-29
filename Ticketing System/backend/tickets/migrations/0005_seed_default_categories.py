from django.db import migrations

DEFAULT_CATEGORIES = [
    ('it_support',     'IT Support',              '#3b82f6', 0),
    ('biomedical',     'Biomedical Engineering',  '#8b5cf6', 1),
    ('maintenance',    'Maintenance',             '#f97316', 2),
    ('housekeeping',   'Housekeeping',            '#10b981', 3),
    ('hr',             'Human Resources',         '#ec4899', 4),
    ('finance',        'Finance',                 '#14b8a6', 5),
    ('procurement',    'Procurement',             '#f59e0b', 6),
    ('administration', 'Administration',          '#6366f1', 7),
    ('security',       'Security',                '#ef4444', 8),
    ('other',          'Other',                   '#6b7280', 9),
]


def seed_categories(apps, schema_editor):
    TicketCategory = apps.get_model('tickets', 'TicketCategory')
    for slug, name, color, order in DEFAULT_CATEGORIES:
        TicketCategory.objects.get_or_create(
            slug=slug,
            defaults={'name': name, 'color': color, 'order': order, 'is_active': True},
        )


def unseed_categories(apps, schema_editor):
    TicketCategory = apps.get_model('tickets', 'TicketCategory')
    TicketCategory.objects.filter(slug__in=[s for s, *_ in DEFAULT_CATEGORIES]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('tickets', '0004_ticketcategory_alter_ticket_category'),
    ]

    operations = [
        migrations.RunPython(seed_categories, unseed_categories),
    ]
