from rest_framework import viewsets
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from .models import AuditLog
from .serializers import AuditLogSerializer
from users.permissions import IsManagerOrAbove


class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuditLog.objects.select_related('user', 'ticket').all()
    serializer_class = AuditLogSerializer
    permission_classes = [IsManagerOrAbove]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['action', 'user', 'ticket']
    search_fields = ['description', 'user__email']
    ordering_fields = ['timestamp']
