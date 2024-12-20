import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Button,
    TextField,
    Link,
    Grid,
    Typography,
    Alert,
    CssBaseline
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import logo from '../assets/tapfeed logo white wide transparent.svg';
import API_URL from '../config';

const defaultTheme = createTheme({
  typography: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
  },
  palette: {
    primary: {
      main: '#001F3F',
    },
    secondary: {
      main: '#2C4B6E',
    },
  },
});

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
    const verifyToken = async () => {
      try {
        const response = await fetch(`${API_URL}/api/verify-reset-token/${token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
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
      const response = await fetch(`${API_URL}/api/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
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
        <Grid container sx={{ height: '100vh' }}>
          <Grid item xs={12} sx={{ p: 4 }}>
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
                sx={{
                  mt: 2,
                  color: 'primary.main',
                  borderColor: 'primary.main',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'rgba(0, 31, 63, 0.1)',
                  },
                }}
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
      <Grid container sx={{ height: '100vh' }}>
        {/* Logo side */}
        <Grid
          item
          xs={12}
          sm={6}
          sx={{
            backgroundColor: '#001F3F',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <img
            src={logo}
            alt="TapFeed Logo"
            style={{
              width: '50%',
              maxWidth: '300px'
            }}
          />
        </Grid>

        {/* Form side */}
        <Grid
          item
          xs={12}
          sm={6}
          sx={{
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: '400px',
              width: '100%'
            }}
          >
            <LockOutlinedIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography component="h1" variant="h5" sx={{ color: 'primary.main', mb: 3 }}>
              Nulstil adgangskode
            </Typography>

            {success ? (
              <Alert severity="success" sx={{ mb: 2, width: '100%' }}>
                Din adgangskode er blevet nulstillet. Du vil blive omdirigeret til login siden.
              </Alert>
            ) : (
              <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mb: 3 }}>
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Ny adgangskode"
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'primary.main',
                      },
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'primary.main',
                    },
                    '& .MuiOutlinedInput-input': {
                      color: 'primary.main',
                    },
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
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'primary.main',
                      },
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'primary.main',
                    },
                    '& .MuiOutlinedInput-input': {
                      color: 'primary.main',
                    },
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="outlined"
                  sx={{
                    mt: 3,
                    mb: 2,
                    color: 'primary.main',
                    borderColor: 'primary.main',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: 'rgba(0, 31, 63, 0.1)',
                    },
                  }}
                >
                  Nulstil adgangskode
                </Button>
              </Box>
            )}

            <Grid container>
              <Grid item xs>
                <Link 
                  component={RouterLink} 
                  to="/login"
                  sx={{ 
                    color: 'primary.main',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Tilbage til login
                </Link>
              </Grid>
            </Grid>

            <Typography 
              variant="body2" 
              color="primary.main" 
              align="center" 
              sx={{ mt: 5 }}
            >
              Copyright © TapFeed {new Date().getFullYear()}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default ResetPassword; 