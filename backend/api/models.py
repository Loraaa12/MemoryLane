from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Category(models.Model):
    name = models.CharField(max_length=50)
    
    def __str__(self):
        return self.name

class Item(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='items')
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='items/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.title} - {self.category.name}"

class Connection(models.Model):
    user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='connections_as_user1')
    user2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='connections_as_user2')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user1', 'user2')
    
    def __str__(self):
        return f"{self.user1.username} - {self.user2.username}"

class DailySelection(models.Model):
    connection = models.ForeignKey(Connection, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    selected_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('connection', 'selected_at')
    
    def __str__(self):
        return f"Selection for {self.connection} on {self.selected_at.date()}"

class SurpriseItem(models.Model):
    CATEGORY_CHOICES = [
        ('film', 'Film'),
        ('photo', 'Photo'),
        ('quote', 'Quote'),
    ]
    
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES)
    note = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Film specific fields
    name = models.CharField(max_length=200, blank=True, null=True)
    year = models.IntegerField(blank=True, null=True)
    
    # Photo specific fields
    image_url = models.TextField(blank=True, null=True)
    
    # Quote specific fields
    text = models.TextField(blank=True, null=True)
    author = models.CharField(max_length=200, blank=True, null=True)
    
    def __str__(self):
        if self.category == 'film':
            return f"Film: {self.name} ({self.year})"
        elif self.category == 'photo':
            return f"Photo: {self.image_url}"
        else:
            return f"Quote: {self.text[:50]}..."

class ViewedSurprise(models.Model):
    item = models.ForeignKey(SurpriseItem, on_delete=models.CASCADE)
    viewed_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-viewed_at']
    
    def __str__(self):
        return f"Viewed {self.item} at {self.viewed_at}" 