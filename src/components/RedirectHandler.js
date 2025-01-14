import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, CircularProgress, Container, Paper, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import API_URL from '../config';

const RedirectHandler = () => {
  const { standerId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAndRedirect = async () => {
      try {
        console.log('Checking product:', standerId);
        const response = await fetch(`${API_URL}/api/stands/${standerId}`);
        
        if (!response.ok) {
          throw new Error('Produkt ikke fundet');
        }

        const data = await response.json();
        console.log('Product data:', data);
        
        // Hvis produktet ikke er claimed, vis unclaimed siden
        if (data.status !== 'claimed') {
          console.log('Product is not claimed, redirecting to unclaimed page');
          window.location.href = `/unclaimed/${standerId}`;
          return;
        }

        // Hvis produktet er claimed og har en redirect URL
        if (data.redirectUrl) {
          console.log('Product is claimed and has redirect URL:', data.redirectUrl);
          window.location.href = data.redirectUrl;
          return;
        }

        // Hvis produktet er claimed men ikke har en redirect URL
        console.log('Product is claimed but has no redirect URL');
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