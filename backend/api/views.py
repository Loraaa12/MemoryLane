from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Q
from .models import Category, Item, Connection, DailySelection, SurpriseItem, ViewedSurprise
from .serializers import (
    CategorySerializer, ItemSerializer, ConnectionSerializer,
    DailySelectionSerializer, UserSerializer, SurpriseItemSerializer, ViewedSurpriseSerializer
)
from django.contrib.auth.models import User
import random
from datetime import timedelta

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

class ItemViewSet(viewsets.ModelViewSet):
    serializer_class = ItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Item.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ConnectionViewSet(viewsets.ModelViewSet):
    serializer_class = ConnectionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Connection.objects.filter(
            Q(user1=self.request.user) | Q(user2=self.request.user)
        )

    @action(detail=False, methods=['post'])
    def connect(self, request):
        username = request.data.get('username')
        try:
            other_user = User.objects.get(username=username)
            if other_user == request.user:
                return Response(
                    {"error": "Cannot connect with yourself"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            connection, created = Connection.objects.get_or_create(
                user1=min(request.user, other_user),
                user2=max(request.user, other_user)
            )
            
            serializer = self.get_serializer(connection)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )

class DailySelectionViewSet(viewsets.ModelViewSet):
    serializer_class = DailySelectionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return DailySelection.objects.filter(
            Q(connection__user1=self.request.user) | 
            Q(connection__user2=self.request.user)
        )

    @action(detail=False, methods=['post'])
    def get_random_item(self, request):
        connection_id = request.data.get('connection_id')
        try:
            connection = Connection.objects.filter(
                Q(user1=request.user) | Q(user2=request.user)
            ).get(id=connection_id)
            
            # Check if already selected today
            today = timezone.now().date()
            if DailySelection.objects.filter(
                connection=connection,
                selected_at__date=today
            ).exists():
                return Response(
                    {"error": "Already selected an item today"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get all items from the other user
            other_user = connection.user2 if connection.user1 == request.user else connection.user1
            items = Item.objects.filter(user=other_user)
            
            if not items.exists():
                return Response(
                    {"error": "No items available"},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Select random item
            random_item = random.choice(items)
            
            # Create daily selection
            selection = DailySelection.objects.create(
                connection=connection,
                item=random_item
            )
            
            serializer = self.get_serializer(selection)
            return Response(serializer.data)
            
        except Connection.DoesNotExist:
            return Response(
                {"error": "Connection not found"},
                status=status.HTTP_404_NOT_FOUND
            )

class SurpriseItemViewSet(viewsets.ModelViewSet):
    queryset = SurpriseItem.objects.all()
    serializer_class = SurpriseItemSerializer

    @action(detail=False, methods=['get'])
    def random(self, request):
        # Get the last viewed surprise time
        last_viewed = ViewedSurprise.objects.first()
        if last_viewed:
            time_since_last_view = timezone.now() - last_viewed.viewed_at
            if time_since_last_view < timedelta(seconds=30):
                return Response(
                    {"error": f"Please wait {30 - time_since_last_view.seconds} seconds before getting another surprise"},
                    status=status.HTTP_429_TOO_MANY_REQUESTS
                )

        # Get all items that haven't been viewed
        viewed_items = ViewedSurprise.objects.values_list('item_id', flat=True)
        available_items = SurpriseItem.objects.exclude(id__in=viewed_items)

        if not available_items.exists():
            # If all items have been viewed, reset the viewed items
            ViewedSurprise.objects.all().delete()
            available_items = SurpriseItem.objects.all()

        if not available_items.exists():
            return Response(
                {"error": "No surprises available"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Select a random item
        random_item = random.choice(available_items)
        serializer = self.get_serializer(random_item)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def view(self, request, pk=None):
        item = self.get_object()
        ViewedSurprise.objects.create(item=item)
        return Response(status=status.HTTP_200_OK) 