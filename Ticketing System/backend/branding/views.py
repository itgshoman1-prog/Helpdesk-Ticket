from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import SystemSettings
from .serializers import SystemSettingsSerializer


class SystemSettingsView(APIView):
    """
    GET  /api/branding/  — public (used by login page, portal header)
    PATCH /api/branding/ — admin only
    """
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request):
        s = SystemSettings.get()
        return Response(SystemSettingsSerializer(s, context={'request': request}).data)

    def patch(self, request):
        if not request.user.is_authenticated or not request.user.is_admin:
            return Response({'error': 'Admin access required.'}, status=403)
        s = SystemSettings.get()
        data = request.data.copy() if hasattr(request.data, 'copy') else dict(request.data)
        # Allow clearing logo / favicon by sending "null"
        if data.get('company_logo') == 'null':
            s.company_logo = None
            s.save(update_fields=['company_logo'])
            data.pop('company_logo', None)
        if data.get('favicon') == 'null':
            s.favicon = None
            s.save(update_fields=['favicon'])
            data.pop('favicon', None)
        serializer = SystemSettingsSerializer(s, data=data, partial=True, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(SystemSettingsSerializer(s, context={'request': request}).data)
