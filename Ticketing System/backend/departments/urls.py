from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DepartmentViewSet, SLAPolicyViewSet

router = DefaultRouter()
router.register('', DepartmentViewSet, basename='department')
router.register('sla-policies', SLAPolicyViewSet, basename='sla-policy')

urlpatterns = [path('', include(router.urls))]
