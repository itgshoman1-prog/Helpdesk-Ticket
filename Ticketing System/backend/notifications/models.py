from django.db import models


class Notification(models.Model):
    TICKET_CREATED = 'ticket_created'
    TICKET_ASSIGNED = 'ticket_assigned'
    STATUS_UPDATED = 'status_updated'
    COMMENT_ADDED = 'comment_added'
    TICKET_RESOLVED = 'ticket_resolved'
    TICKET_CLOSED = 'ticket_closed'
    SLA_BREACH = 'sla_breach'
    TICKET_ESCALATED = 'ticket_escalated'

    TYPE_CHOICES = [
        (TICKET_CREATED, 'Ticket Created'),
        (TICKET_ASSIGNED, 'Ticket Assigned'),
        (STATUS_UPDATED, 'Status Updated'),
        (COMMENT_ADDED, 'Comment Added'),
        (TICKET_RESOLVED, 'Ticket Resolved'),
        (TICKET_CLOSED, 'Ticket Closed'),
        (SLA_BREACH, 'SLA Breach'),
        (TICKET_ESCALATED, 'Ticket Escalated'),
    ]

    recipient = models.ForeignKey(
        'users.User',
        on_delete=models.CASCADE,
        related_name='notifications',
    )
    ticket = models.ForeignKey(
        'tickets.Ticket',
        on_delete=models.CASCADE,
        related_name='notifications',
        null=True,
        blank=True,
    )
    notification_type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    title = models.CharField(max_length=300)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    email_sent = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.notification_type} for {self.recipient}'
