import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import logo from '../assets/tapfeed logo white wide transparent.svg';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Paper,
  Box,
  Grid,
  Typography,
  Alert
} from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';
import { useTheme } from '../context/ThemeContext';
import API_URL from '../config';

const RequestReset = () => {
  const { mode } = useTheme();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/request-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setError('');
      } else {
        setError(data.message || 'Der opstod en fejl ved anmodning om nulstilling');
      }
    } catch (error) {
      console.error('Fejl ved nulstilling:', error);
      setError('Der opstod en fejl. Prøv igen senere.');
    }
  };

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: 'url(/background.jpg)',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#001F3F',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 31, 63, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={logo}
            alt="TapFeed Logo"
            style={{
              maxWidth: '80%',
              width: '400px',
              zIndex: 1,
            }}
          />
        </Box>
      </Grid>
      <Grid 
        item 
        xs={12} 
        sm={8} 
        md={5} 
        component={Paper} 
        elevation={6} 
        square
        sx={{
          backgroundColor: '#fff'
        }}
      >
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockResetIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Nulstil adgangskode
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {success ? (
              <Alert severity="success" sx={{ mb: 2 }}>
                Vi har sendt dig en email med instruktioner til at nulstille din adgangskode.
              </Alert>
            ) : (
              <>
                <Typography variant="body2" sx={{ mb: 3 }}>
                  Indtast din email-adresse, og vi sender dig et link til at nulstille din adgangskode.
                </Typography>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Send nulstillingslink
                </Button>
              </>
            )}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Link component={RouterLink} to="/login" variant="body2">
                  Tilbage til login
                </Link>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Link component={RouterLink} to="/register" variant="body2">
                  Opret ny konto
                </Link>
              </Grid>
            </Grid>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 5 }}>
              {'Copyright © '}
              <Link color="inherit" component={RouterLink} to="/">
                TapFeed
              </Link>{' '}
              {new Date().getFullYear()}
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default RequestReset; 