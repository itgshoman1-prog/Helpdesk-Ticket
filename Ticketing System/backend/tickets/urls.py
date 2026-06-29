from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TicketViewSet, TicketFormConfigView

router = DefaultRouter()
router.register('', TicketViewSet, basename='ticket')

urlpatterns = [
    path('form-config/', TicketFormConfigView.as_view(), name='ticket-form-config'),
    path('', include(router.urls)),
]
