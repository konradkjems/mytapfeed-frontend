import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
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

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const navigate = useNavigate();
  const { token } = useParams();

  useEffect(() => {
    // Verificer token når komponenten indlæses
    const verifyToken = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/verify-reset-token/${token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'http://localhost:3001'
          }
        });

        if (!response.ok) {
          setTokenValid(false);
          setError('Dette link er ugyldigt eller udløbet');
        }
      } catch (error) {
        console.error('Token verifikation fejl:', error);
        setTokenValid(false);
        setError('Der opstod en fejl ved verificering af linket');
      }
    };

    if (token) {
      verifyToken();
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Adgangskoderne matcher ikke');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'http://localhost:3001'
        },
        body: JSON.stringify({
          token,
          newPassword: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setError('');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(data.message || 'Der opstod en fejl ved nulstilling af adgangskoden');
      }
    } catch (error) {
      console.error('Nulstilling fejl:', error);
      setError('Der opstod en fejl. Prøv igen senere.');
    }
  };

  if (!tokenValid) {
    return (
      <ThemeProvider theme={defaultTheme}>
        <Grid container component="main" sx={{ height: '100vh' }}>
          <CssBaseline />
          <Grid item xs={12} sx={{ bgcolor: 'background.default', p: 4 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
              <Button
                component={RouterLink}
                to="/reset-password"
                variant="outlined"
                sx={{ mt: 2 }}
              >
                Anmod om nyt nulstillingslink
              </Button>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    );
  }

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
              Indtast ny adgangskode
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              {success ? (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Din adgangskode er blevet ændret. Du vil blive omdirigeret til login...
                </Alert>
              ) : (
                <>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Ny adgangskode"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    sx={{
                      '& label': { color: 'primary.main' },
                      '& input': { color: 'primary.main' },
                    }}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Bekræft ny adgangskode"
                    type="password"
                    id="confirmPassword"
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
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
                    Opdater adgangskode
                  </Button>
                </>
              )}
              <Grid container justifyContent="center">
                <Grid item>
                  <Link component={RouterLink} to="/login" variant="body2" sx={{ color: 'primary.main' }}>
                    Tilbage til login
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

export default ResetPassword; 