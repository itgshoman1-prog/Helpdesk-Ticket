from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend

from .models import Department, SLAPolicy
from .serializers import DepartmentSerializer, DepartmentMinimalSerializer, SLAPolicySerializer
from users.permissions import IsAdminUser, IsManagerOrAbove


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.prefetch_related('sla_policies').select_related('manager', 'auto_assign_to').all()
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['is_active']
    search_fields = ['name']

    def get_serializer_class(self):
        if self.action == 'list' and not self.request.user.is_admin:
            return DepartmentMinimalSerializer
        return DepartmentSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [IsAuthenticated()]


class SLAPolicyViewSet(viewsets.ModelViewSet):
    queryset = SLAPolicy.objects.select_related('department').all()
    serializer_class = SLAPolicySerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['department', 'priority']
