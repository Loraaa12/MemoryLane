from django.db import models
from django.utils import timezone

class SurpriseItem(models.Model):
    CATEGORY_CHOICES = [
        ('film', 'Film'),
        ('photo', 'Photo'),
        ('quote', 'Quote'),
    ]

    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES)
    note = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Film specific fields
    name = models.CharField(max_length=200, blank=True)
    year = models.IntegerField(null=True, blank=True)
    
    # Photo specific fields
    image_url = models.TextField(blank=True)
    
    # Quote specific fields
    text = models.TextField(blank=True)
    author = models.CharField(max_length=200, blank=True)

    def __str__(self):
        if self.category == 'film':
            return f"{self.name} ({self.year})"
        elif self.category == 'photo':
            return f"Photo: {self.note[:50]}"
        else:
            return f"Quote: {self.text[:50]}"

class ViewedSurprise(models.Model):
    item = models.ForeignKey(SurpriseItem, on_delete=models.CASCADE)
    viewed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.item} viewed at {self.viewed_at}"
