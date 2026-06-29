from django.utils import timezone
from datetime import timedelta
from departments.models import SLAPolicy


def apply_sla(ticket):
    policy = (
        SLAPolicy.objects.filter(department=ticket.department, priority=ticket.priority).first()
        or SLAPolicy.objects.filter(department=None, priority=ticket.priority).first()
    )
    if policy:
        now = timezone.now()
        ticket.sla_response_due = now + timedelta(minutes=policy.response_time_minutes)
        ticket.sla_resolution_due = now + timedelta(minutes=policy.resolution_time_minutes)
