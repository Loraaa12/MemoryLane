import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import { SurpriseItem } from '../types';
import { api } from '../services/api';

const COOLDOWN_SECONDS = 15;

const SurpriseViewer: React.FC = () => {
  const [surprise, setSurprise] = useState<SurpriseItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [cooldown]);

  const getRandomSurprise = async () => {
    setLoading(true);
    setError('');
    try {
      const newSurprise = await api.getRandomSurprise();
      setSurprise(newSurprise);
      await api.markSurpriseAsViewed(newSurprise.id);
      setCooldown(COOLDOWN_SECONDS);
    } catch (err) {
      setError('Failed to get a surprise. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const renderSurpriseContent = () => {
    if (!surprise) return null;

    switch (surprise.category) {
      case 'film':
        return (
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {surprise.name} ({surprise.year})
            </Typography>
            {surprise.note && (
              <Typography variant="body1" color="text.secondary">
                {surprise.note}
              </Typography>
            )}
          </CardContent>
        );

      case 'photo':
        return (
          <>
            <CardMedia
              component="img"
              height="300"
              image={surprise.image_url}
              alt="Surprise photo"
            />
            <CardContent>
              {surprise.note && (
                <Typography variant="body1" color="text.secondary">
                  {surprise.note}
                </Typography>
              )}
            </CardContent>
          </>
        );

      case 'quote':
        return (
          <CardContent>
            <Typography variant="h5" gutterBottom>
              "{surprise.text}"
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              - {surprise.author}
            </Typography>
            {surprise.note && (
              <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                {surprise.note}
              </Typography>
            )}
          </CardContent>
        );
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Random Surprise
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {surprise ? (
          <Card>
            {renderSurpriseContent()}
          </Card>
        ) : (
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Click the button below to get a random surprise!
          </Typography>
        )}

        <Button
          variant="contained"
          onClick={getRandomSurprise}
          disabled={loading || cooldown > 0}
          fullWidth
          sx={{ mt: 2 }}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : cooldown > 0 ? (
            `Wait ${cooldown} seconds`
          ) : (
            'Get Random Surprise'
          )}
        </Button>
      </Paper>
    </Box>
  );
};

export default SurpriseViewer; 