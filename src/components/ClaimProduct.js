import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Box
} from '@mui/material';
import API_URL from '../config';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/tapfeed logo white wide transparent.svg';

const ClaimProduct = () => {
  const { standerId } = useParams();
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Hvis brugeren ikke er logget ind, redirect til login
    if (!userData) {
      navigate('/login', { state: { from: `/claim/${standerId}` } });
      return;
    }
// comment //
    // Automatisk aktiver produktet når brugeren er logget ind
    const claimProduct = async () => {
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
        setLoading(false);
      }
    };

    claimProduct();
  }, [userData, navigate, standerId]);

  if (!userData) {
    return null; // Viser intet mens der redirectes til login
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <Paper 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3
          }}
        >
          <img
            src={logo}
            alt="TapFeed Logo"
            style={{
              width: '200px',
              marginBottom: '20px'
            }}
          />
          
          {loading ? (
            <>
              <Typography variant="h5" gutterBottom>
                Aktiverer dit TapFeed produkt...
              </Typography>
              <CircularProgress sx={{ mt: 2 }} />
            </>
          ) : error ? (
            <Alert severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          ) : null}
        </Paper>
      </Container>
    </Box>
  );
};
export default ClaimProduct; 