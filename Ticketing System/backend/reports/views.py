from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Avg, Q
from django.db.models.functions import TruncMonth, TruncDate
from django.utils import timezone
from datetime import timedelta

from tickets.models import Ticket
from users.models import User
from departments.models import Department
from users.permissions import IsManagerOrAbove


class DashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        base_qs = Ticket.objects.all()

        if not user.is_manager_or_above:
            base_qs = base_qs.filter(requester=user)
        elif not user.is_admin and user.department:
            base_qs = base_qs.filter(department=user.department)

        summary = {
            'total': base_qs.count(),
            'new': base_qs.filter(status='new').count(),
            'open': base_qs.filter(status__in=['assigned', 'in_progress', 'escalated']).count(),
            'pending': base_qs.filter(status__in=['pending_user', 'pending_vendor']).count(),
            'resolved': base_qs.filter(status='resolved').count(),
            'closed': base_qs.filter(status='closed').count(),
            'sla_breached': sum(1 for t in base_qs.select_related() if t.is_sla_resolution_breached),
        }

        if user.is_agent_or_above:
            summary['assigned_to_me'] = Ticket.objects.filter(
                assigned_to=user,
                status__in=['assigned', 'in_progress']
            ).count()

        return Response(summary)


class TicketsByStatusView(APIView):
    permission_classes = [IsManagerOrAbove]

    def get(self, request):
        dept_id = request.query_params.get('department')
        qs = Ticket.objects.all()
        if dept_id:
            qs = qs.filter(department_id=dept_id)
        elif not request.user.is_admin and request.user.department:
            qs = qs.filter(department=request.user.department)

        data = qs.values('status').annotate(count=Count('id')).order_by('status')
        return Response(list(data))


class TicketsByPriorityView(APIView):
    permission_classes = [IsManagerOrAbove]

    def get(self, request):
        dept_id = request.query_params.get('department')
        qs = Ticket.objects.all()
        if dept_id:
            qs = qs.filter(department_id=dept_id)
        elif not request.user.is_admin and request.user.department:
            qs = qs.filter(department=request.user.department)

        data = qs.values('priority').annotate(count=Count('id'))
        return Response(list(data))


class TicketsByDepartmentView(APIView):
    permission_classes = [IsManagerOrAbove]

    def get(self, request):
        data = (
            Ticket.objects.values('department__name')
            .annotate(total=Count('id'),
                      open=Count('id', filter=Q(status__in=['new', 'assigned', 'in_progress'])),
                      resolved=Count('id', filter=Q(status__in=['resolved', 'closed'])))
            .order_by('-total')
        )
        return Response(list(data))


class TicketTrendView(APIView):
    permission_classes = [IsManagerOrAbove]

    def get(self, request):
        days = int(request.query_params.get('days', 30))
        since = timezone.now() - timedelta(days=days)
        dept_id = request.query_params.get('department')

        qs = Ticket.objects.filter(created_at__gte=since)
        if dept_id:
            qs = qs.filter(department_id=dept_id)
        elif not request.user.is_admin and request.user.department:
            qs = qs.filter(department=request.user.department)

        data = (
            qs.annotate(date=TruncDate('created_at'))
            .values('date')
            .annotate(count=Count('id'))
            .order_by('date')
        )
        return Response(list(data))


class AgentPerformanceView(APIView):
    permission_classes = [IsManagerOrAbove]

    def get(self, request):
        dept_id = request.query_params.get('department')
        qs = Ticket.objects.filter(assigned_to__isnull=False)
        if dept_id:
            qs = qs.filter(department_id=dept_id)
        elif not request.user.is_admin and request.user.department:
            qs = qs.filter(department=request.user.department)

        data = (
            qs.values('assigned_to__first_name', 'assigned_to__last_name', 'assigned_to__email')
            .annotate(
                total=Count('id'),
                resolved=Count('id', filter=Q(status__in=['resolved', 'closed'])),
            )
            .order_by('-resolved')
        )
        return Response(list(data))


class SLAComplianceView(APIView):
    permission_classes = [IsManagerOrAbove]

    def get(self, request):
        dept_id = request.query_params.get('department')
        qs = Ticket.objects.filter(sla_resolution_due__isnull=False)
        if dept_id:
            qs = qs.filter(department_id=dept_id)
        elif not request.user.is_admin and request.user.department:
            qs = qs.filter(department=request.user.department)

        total = qs.count()
        breached = sum(1 for t in qs if t.is_sla_resolution_breached)
        compliant = total - breached
        rate = round((compliant / total * 100), 1) if total else 0

        return Response({
            'total': total,
            'compliant': compliant,
            'breached': breached,
            'compliance_rate': rate,
        })
