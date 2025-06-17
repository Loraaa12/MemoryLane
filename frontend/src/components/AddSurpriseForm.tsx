import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { Category, NewSurpriseItem } from '../types';
import { api } from '../services/api';

const AddSurpriseForm: React.FC = () => {
  const [category, setCategory] = useState<Category>('film');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Film fields
  const [filmName, setFilmName] = useState('');
  const [filmYear, setFilmYear] = useState('');

  // Photo fields
  const [photoUrl, setPhotoUrl] = useState('');

  // Quote fields
  const [quoteText, setQuoteText] = useState('');
  const [quoteAuthor, setQuoteAuthor] = useState('');

  // Common fields
  const [note, setNote] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let itemData: NewSurpriseItem;

      switch (category) {
        case 'film':
          if (!filmName || !filmYear) {
            throw new Error('Please fill in all required fields');
          }
          itemData = {
            category: 'film',
            name: filmName,
            year: parseInt(filmYear),
            note: note || '',
          };
          break;

        case 'photo':
          if (!photoUrl) {
            throw new Error('Please enter a photo URL');
          }
          itemData = {
            category: 'photo',
            image_url: photoUrl,
            note: note || '',
          };
          break;

        case 'quote':
          if (!quoteText || !quoteAuthor) {
            throw new Error('Please fill in all required fields');
          }
          itemData = {
            category: 'quote',
            text: quoteText,
            author: quoteAuthor,
            note: note || '',
          };
          break;
      }

      await api.addItem(itemData);
      
      // Reset form
      setFilmName('');
      setFilmYear('');
      setPhotoUrl('');
      setQuoteText('');
      setQuoteAuthor('');
      setNote('');
      setCategory('film');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Add New Surprise
        </Typography>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value as Category)}
            >
              <MenuItem value="film">Film</MenuItem>
              <MenuItem value="photo">Photo</MenuItem>
              <MenuItem value="quote">Quote</MenuItem>
            </Select>
          </FormControl>

          {category === 'film' && (
            <>
              <TextField
                fullWidth
                label="Film Name"
                value={filmName}
                onChange={(e) => setFilmName(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Year"
                type="number"
                value={filmYear}
                onChange={(e) => setFilmYear(e.target.value)}
                sx={{ mb: 2 }}
              />
            </>
          )}

          {category === 'photo' && (
            <TextField
              fullWidth
              label="Photo URL"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="Enter the direct URL of your photo (should end with .jpg, .png, etc.)"
              helperText="Right-click on an image and select 'Copy image address' to get the direct URL"
              sx={{ mb: 2 }}
            />
          )}

          {category === 'quote' && (
            <>
              <TextField
                fullWidth
                label="Quote Text"
                multiline
                rows={3}
                value={quoteText}
                onChange={(e) => setQuoteText(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Author"
                value={quoteAuthor}
                onChange={(e) => setQuoteAuthor(e.target.value)}
                sx={{ mb: 2 }}
              />
            </>
          )}

          <TextField
            fullWidth
            label="Note (optional)"
            multiline
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            sx={{ mb: 2 }}
          />

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            fullWidth
          >
            {loading ? <CircularProgress size={24} /> : 'Add Surprise'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default AddSurpriseForm; 