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
        # Check if there's a recent view
        last_view = ViewedSurprise.objects.order_by('-viewed_at').first()
        if last_view:
            time_since_last_view = timezone.now() - last_view.viewed_at
            if time_since_last_view < timedelta(seconds=30):
                return Response({
                    'error': 'Please wait before viewing another surprise',
                    'seconds_remaining': 30 - time_since_last_view.seconds
                }, status=status.HTTP_429_TOO_MANY_REQUESTS)

        # Get all items that haven't been viewed
        viewed_items = ViewedSurprise.objects.values_list('item_id', flat=True)
        available_items = SurpriseItem.objects.exclude(id__in=viewed_items)

        # If all items have been viewed, reset by clearing viewed items
        if not available_items.exists():
            ViewedSurprise.objects.all().delete()
            available_items = SurpriseItem.objects.all()

        # Select a random item
        if available_items.exists():
            random_item = random.choice(list(available_items))
            serializer = self.get_serializer(random_item)
            return Response(serializer.data)
        
        return Response({'error': 'No surprise items available'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'])
    def view(self, request, pk=None):
        item = self.get_object()
        ViewedSurprise.objects.create(item=item)
        return Response({'status': 'success'})
