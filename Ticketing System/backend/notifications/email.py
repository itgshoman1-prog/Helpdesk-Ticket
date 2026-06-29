from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string


def send_ticket_email(subject, recipient_email, template_name, context):
    try:
        html_message = render_to_string(f'emails/{template_name}.html', context)
        send_mail(
            subject=subject,
            message='',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[recipient_email],
            html_message=html_message,
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f'Email error: {e}')
        return False


def notify_ticket_created(ticket):
    ctx = {
        'ticket': ticket,
        'frontend_url': settings.FRONTEND_URL,
    }
    send_ticket_email(
        f'[{ticket.ticket_number}] Your ticket has been received',
        ticket.requester.email,
        'ticket_created',
        ctx,
    )
    if ticket.department and ticket.department.email:
        send_ticket_email(
            f'[{ticket.ticket_number}] New ticket assigned to your department',
            ticket.department.email,
            'ticket_dept_notification',
            ctx,
        )


def notify_ticket_assigned(ticket):
    ctx = {
        'ticket': ticket,
        'frontend_url': settings.FRONTEND_URL,
    }
    if ticket.assigned_to:
        send_ticket_email(
            f'[{ticket.ticket_number}] Ticket assigned to you',
            ticket.assigned_to.email,
            'ticket_assigned',
            ctx,
        )


def notify_status_updated(ticket):
    ctx = {
        'ticket': ticket,
        'frontend_url': settings.FRONTEND_URL,
    }
    send_ticket_email(
        f'[{ticket.ticket_number}] Status updated to {ticket.get_status_display()}',
        ticket.requester.email,
        'status_updated',
        ctx,
    )


def notify_comment_added(ticket):
    ctx = {
        'ticket': ticket,
        'frontend_url': settings.FRONTEND_URL,
    }
    send_ticket_email(
        f'[{ticket.ticket_number}] New update on your ticket',
        ticket.requester.email,
        'comment_added',
        ctx,
    )


def notify_ticket_resolved(ticket):
    ctx = {
        'ticket': ticket,
        'frontend_url': settings.FRONTEND_URL,
    }
    send_ticket_email(
        f'[{ticket.ticket_number}] Your ticket has been resolved',
        ticket.requester.email,
        'ticket_resolved',
        ctx,
    )
