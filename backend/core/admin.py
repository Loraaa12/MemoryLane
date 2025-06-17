from django.contrib import admin
from .models import SurpriseItem, ViewedSurprise

@admin.register(SurpriseItem)
class SurpriseItemAdmin(admin.ModelAdmin):
    list_display = ('category', 'name', 'year', 'created_at')
    list_filter = ('category', 'created_at')
    search_fields = ('name', 'note', 'text', 'author')

@admin.register(ViewedSurprise)
class ViewedSurpriseAdmin(admin.ModelAdmin):
    list_display = ('item', 'viewed_at')
    list_filter = ('viewed_at',)
    search_fields = ('item__name', 'item__note', 'item__text')
