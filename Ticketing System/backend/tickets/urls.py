from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TicketViewSet, TicketFormConfigView, TicketCategoryViewSet

router = DefaultRouter()
router.register('categories', TicketCategoryViewSet, basename='ticket-category')
router.register('', TicketViewSet, basename='ticket')

urlpatterns = [
    path('form-config/', TicketFormConfigView.as_view(), name='ticket-form-config'),
    path('', include(router.urls)),
]
