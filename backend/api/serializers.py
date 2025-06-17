from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Category, Item, Connection, DailySelection, SurpriseItem, ViewedSurprise

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')
        read_only_fields = ('id',)

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ItemSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Item
        fields = ('id', 'user', 'user_name', 'category', 'category_name', 
                 'title', 'description', 'image', 'created_at')
        read_only_fields = ('id', 'user', 'created_at')

class ConnectionSerializer(serializers.ModelSerializer):
    user1_details = UserSerializer(source='user1', read_only=True)
    user2_details = UserSerializer(source='user2', read_only=True)

    class Meta:
        model = Connection
        fields = ('id', 'user1', 'user1_details', 'user2', 'user2_details', 'created_at')
        read_only_fields = ('id', 'created_at')

class DailySelectionSerializer(serializers.ModelSerializer):
    item_details = ItemSerializer(source='item', read_only=True)
    connection_details = ConnectionSerializer(source='connection', read_only=True)

    class Meta:
        model = DailySelection
        fields = ('id', 'connection', 'connection_details', 'item', 'item_details', 'selected_at')
        read_only_fields = ('id', 'selected_at')

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