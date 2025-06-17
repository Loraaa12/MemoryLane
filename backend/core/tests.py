from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import SurpriseItem
from datetime import datetime

# Create your tests here.

class SurpriseItemModelTest(TestCase):
    def setUp(self):
        self.film_data = {
            'category': 'film',
            'note': 'Test film',
            'name': 'Test Movie',
            'year': 2024
        }
        self.photo_data = {
            'category': 'photo',
            'note': 'Test photo',
            'image_url': 'https://example.com/test.jpg'
        }
        self.quote_data = {
            'category': 'quote',
            'note': 'Test quote',
            'text': 'Test quote text',
            'author': 'Test Author'
        }

    def test_create_film(self):
        film = SurpriseItem.objects.create(**self.film_data)
        self.assertEqual(film.category, 'film')
        self.assertEqual(film.name, 'Test Movie')
        self.assertEqual(film.year, 2024)

    def test_create_photo(self):
        photo = SurpriseItem.objects.create(**self.photo_data)
        self.assertEqual(photo.category, 'photo')
        self.assertEqual(photo.image_url, 'https://example.com/test.jpg')

    def test_create_quote(self):
        quote = SurpriseItem.objects.create(**self.quote_data)
        self.assertEqual(quote.category, 'quote')
        self.assertEqual(quote.text, 'Test quote text')
        self.assertEqual(quote.author, 'Test Author')

class SurpriseItemAPITest(APITestCase):
    def setUp(self):
        self.film = SurpriseItem.objects.create(
            category='film',
            note='Test film',
            name='Test Movie',
            year=2024
        )
        self.photo = SurpriseItem.objects.create(
            category='photo',
            note='Test photo',
            image_url='https://example.com/test.jpg'
        )
        self.quote = SurpriseItem.objects.create(
            category='quote',
            note='Test quote',
            text='Test quote text',
            author='Test Author'
        )

    def test_get_all_surprises(self):
        url = reverse('surprise-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)

    def test_get_random_surprise(self):
        url = reverse('surprise-random')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('category', response.data)
        self.assertIn('note', response.data)

    def test_create_film(self):
        url = reverse('surprise-list')
        data = {
            'category': 'film',
            'note': 'New film',
            'name': 'New Movie',
            'year': 2024
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(SurpriseItem.objects.count(), 4)

    def test_create_photo(self):
        url = reverse('surprise-list')
        data = {
            'category': 'photo',
            'note': 'New photo',
            'image_url': 'https://example.com/new.jpg'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(SurpriseItem.objects.count(), 4)

    def test_create_quote(self):
        url = reverse('surprise-list')
        data = {
            'category': 'quote',
            'note': 'New quote',
            'text': 'New quote text',
            'author': 'New Author'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(SurpriseItem.objects.count(), 4)

    def test_invalid_category(self):
        url = reverse('surprise-list')
        data = {
            'category': 'invalid',
            'note': 'Invalid category'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_missing_required_fields(self):
        url = reverse('surprise-list')
        data = {
            'category': 'film',
            'note': 'Missing required fields'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
