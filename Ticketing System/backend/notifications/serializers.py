from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    ticket_number = serializers.CharField(source='ticket.ticket_number', read_only=True)
    notification_type_display = serializers.CharField(source='get_notification_type_display', read_only=True)

    class Meta:
        model = Notification
        fields = [
            'id', 'ticket', 'ticket_number', 'notification_type',
            'notification_type_display', 'title', 'message',
            'is_read', 'created_at',
        ]
        read_only_fields = ['created_at']
