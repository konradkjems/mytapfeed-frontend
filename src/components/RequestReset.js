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
import { createTheme, ThemeProvider } from '@mui/material/styles';

const defaultTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#fff',
    },
    background: {
      default: '#001F3F',
      paper: 'rgba(255, 255, 255, 0.1)',
    },
  },
});

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" component={RouterLink} to="/">
        TapFeed
      </Link>{' '}
      {new Date().getFullYear()}
    </Typography>
  );
}

const RequestReset = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/request-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'http://localhost:3001'
        },
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
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'linear-gradient(rgba(0, 31, 63, 0.8), rgba(0, 31, 63, 0.8))',
            backgroundRepeat: 'no-repeat',
            backgroundColor: '#001F3F',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
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
            }}
          />
        </Grid>
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
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
            <Typography component="h1" variant="h5" sx={{ color: 'primary.main' }}>
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
                  <Typography variant="body2" sx={{ mb: 3, color: 'primary.main' }}>
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
                    sx={{
                      '& label': { color: 'primary.main' },
                      '& input': { color: 'primary.main' },
                    }}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="outlined"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Send nulstillingslink
                  </Button>
                </>
              )}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Link component={RouterLink} to="/login" variant="body2" sx={{ color: 'primary.main' }}>
                    Tilbage til login
                  </Link>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Link component={RouterLink} to="/register" variant="body2" sx={{ color: 'primary.main' }}>
                    Opret ny konto
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5, color: 'primary.main' }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default RequestReset; 