import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import API_URL from '../config';
import { useAuth } from '../context/AuthContext';

const ClaimProduct = () => {
  const { standerId } = useParams();
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Hvis brugeren ikke er logget ind, redirect til login
    if (!userData) {
      navigate('/login', { state: { from: `/claim/${standerId}` } });
    }
  }, [userData, navigate, standerId]);

  const handleClaim = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/stands/${standerId}/claim`, {
        method: 'POST',
        credentials: 'include'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Der opstod en fejl ved aktivering af produktet');
      }

      // Redirect til dashboard efter succesfuld aktivering
      navigate('/dashboard', { 
        state: { 
          message: 'Produkt aktiveret succesfuldt! Du kan nu konfigurere det under "Produkter".' 
        } 
      });
    } catch (error) {
      console.error('Fejl ved aktivering af produkt:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!userData) {
    return null; // Viser intet mens der redirectes til login
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Aktiver TapFeed Produkt
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 3 }}>
          Du er ved at aktivere TapFeed produkt med ID: <strong>{standerId}</strong>
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={handleClaim}
            disabled={loading}
            sx={{ minWidth: 200 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Aktiver Produkt'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ClaimProduct; 