from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/departments/', include('departments.urls')),
    path('api/tickets/', include('tickets.urls')),
    path('api/notifications/', include('notifications.urls')),
    path('api/audit/', include('audit.urls')),
    path('api/reports/', include('reports.urls')),
    path('api/branding/', include('branding.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
