from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SurpriseItemViewSet

router = DefaultRouter()
router.register(r'surprises', SurpriseItemViewSet, basename='surprise')

urlpatterns = [
    path('', include(router.urls)),
] 