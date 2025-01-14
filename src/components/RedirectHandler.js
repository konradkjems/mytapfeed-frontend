import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, CircularProgress, Container, Paper, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import API_URL from '../config';

const RedirectHandler = () => {
  const { standerId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const ensureValidUrl = (url) => {
    console.log('Validating URL:', url);
    console.log('URL type:', typeof url);
    
    if (!url) {
      console.log('URL is null or undefined');
      return null;
    }
    
    if (typeof url !== 'string') {
      console.log('URL is not a string');
      return null;
    }
    
    const trimmedUrl = url.trim();
    console.log('Trimmed URL:', trimmedUrl);
    
    if (trimmedUrl.length === 0) {
      console.log('URL is empty after trimming');
      return null;
    }
    
    // Hvis URL'en ikke starter med http:// eller https://, tilføj https://
    if (!trimmedUrl.match(/^https?:\/\//i)) {
      const validUrl = `https://${trimmedUrl}`;
      console.log('Added https:// to URL:', validUrl);
      return validUrl;
    }
    
    console.log('URL already has protocol:', trimmedUrl);
    return trimmedUrl;
  };

  useEffect(() => {
    const checkAndRedirect = async () => {
      try {
        console.log('Checking product:', standerId);
        console.log('API URL:', `${API_URL}/api/stands/${standerId}`);
        
        const response = await fetch(`${API_URL}/api/stands/${standerId}`);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error('Produkt ikke fundet');
        }

        const data = await response.json();
        console.log('Product data:', JSON.stringify(data, null, 2));
        
        // Hvis produktet ikke er claimed, vis unclaimed siden
        if (data.status !== 'claimed') {
          console.log('Product is not claimed, redirecting to unclaimed page');
          window.location.href = `/unclaimed/${standerId}`;
          return;
        }

        // Tjek om produktet er konfigureret
        if (!data.configured) {
          console.log('Product is not configured, showing not-configured page');
          window.location.href = `/not-configured/${standerId}`;
          return;
        }

        console.log('Product is claimed and configured, checking redirectUrl');
        console.log('Raw redirectUrl:', data.redirectUrl);

        // Hvis produktet er claimed, konfigureret og har en redirect URL
        const validRedirectUrl = ensureValidUrl(data.redirectUrl);
        console.log('Validated redirectUrl:', validRedirectUrl);
        
        if (validRedirectUrl) {
          console.log('Redirecting to:', validRedirectUrl);
          window.location.href = validRedirectUrl;
          return;
        }

        // Hvis produktet er claimed men ikke har en gyldig redirect URL
        console.log('No valid redirect URL found, showing not-configured page');
        window.location.href = `/not-configured/${standerId}`;
        
      } catch (error) {
        console.error('Fejl ved håndtering af redirect:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    checkAndRedirect();
  }, [standerId]);

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <CircularProgress sx={{ color: '#001F3F' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <Container maxWidth="sm">
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom color="error">
              {error}
            </Typography>
            <Button
              variant="contained"
              sx={{ 
                mt: 2, 
                backgroundColor: '#001F3F',
                '&:hover': {
                  backgroundColor: '#003366'
                }
              }}
              component={Link}
              to="/"
            >
              Gå til forsiden
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return null;
};

export default RedirectHandler; 