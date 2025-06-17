from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SurpriseItemViewSet

router = DefaultRouter()
router.register(r'surprise-items', SurpriseItemViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 