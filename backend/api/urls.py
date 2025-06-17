from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from . import views

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet)
router.register(r'items', views.ItemViewSet, basename='item')
router.register(r'connections', views.ConnectionViewSet, basename='connection')
router.register(r'daily-selections', views.DailySelectionViewSet, basename='daily-selection')
router.register(r'surprise-items', views.SurpriseItemViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
] 