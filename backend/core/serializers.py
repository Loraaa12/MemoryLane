from rest_framework import serializers
from .models import SurpriseItem, ViewedSurprise

class SurpriseItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = SurpriseItem
        fields = ['id', 'category', 'note', 'created_at', 'name', 'year', 'image_url', 'text', 'author']
        read_only_fields = ['id', 'created_at']

class ViewedSurpriseSerializer(serializers.ModelSerializer):
    class Meta:
        model = ViewedSurprise
        fields = ['id', 'item', 'viewed_at']
        read_only_fields = ['id', 'viewed_at'] 