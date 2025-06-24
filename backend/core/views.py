from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
import random

from .models import SurpriseItem, ViewedSurprise
from .serializers import SurpriseItemSerializer, ViewedSurpriseSerializer

# Create your views here.

class SurpriseItemViewSet(viewsets.ModelViewSet):
    queryset = SurpriseItem.objects.all()
    serializer_class = SurpriseItemSerializer

    @action(detail=False, methods=['get'])
    def random(self, request):
        # Get IDs of all items that have been viewed
        viewed_item_ids = ViewedSurprise.objects.values_list('item_id', flat=True)
        
        # Get all items that are not in the viewed list
        available_items = SurpriseItem.objects.exclude(id__in=viewed_item_ids)

        # If no items are left, return the specific message
        if not available_items.exists():
            return Response({'error': 'no available surprises'}, status=status.HTTP_404_NOT_FOUND)

        # Check for cooldown based on the most recent view
        last_view = ViewedSurprise.objects.order_by('-viewed_at').first()
        if last_view:
            time_since_last_view = timezone.now() - last_view.viewed_at
            cooldown_seconds = 15
            if time_since_last_view < timedelta(seconds=cooldown_seconds):
                return Response({
                    'error': 'Please wait before viewing another surprise',
                    'seconds_remaining': cooldown_seconds - time_since_last_view.seconds
                }, status=status.HTTP_429_TOO_MANY_REQUESTS)

        # If cooldown has passed, select a random item from the available ones
        random_item = random.choice(list(available_items))
        serializer = self.get_serializer(random_item)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def view(self, request, pk=None):
        item = self.get_object()
        # Use get_or_create to prevent creating duplicate view entries
        ViewedSurprise.objects.get_or_create(item=item)
        return Response({'status': 'success'})
