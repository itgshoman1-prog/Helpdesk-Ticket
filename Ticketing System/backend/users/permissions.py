from rest_framework.permissions import BasePermission


class IsAdminUser(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_admin


class IsManagerOrAbove(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_manager_or_above


class IsAgentOrAbove(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_agent_or_above
