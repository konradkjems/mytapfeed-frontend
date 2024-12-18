import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  Alert,
  Divider
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import googleIcon from '../assets/google.svg';

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

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
        const response = await fetch('https://api.tapfeed.dk/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                username: formData.username,
                password: formData.password
            })
        });

        const data = await response.json();

        if (response.ok) {
            setIsAuthenticated(true);
            // Vent et kort øjeblik for at sikre at session er gemt
            setTimeout(() => {
                navigate('/dashboard');
            }, 100);
        } else {
            setError(data.message || 'Login fejlede');
        }
    } catch (error) {
        console.error('Login fejl:', error);
        setError('Der opstod en fejl under login. Prøv igen.');
    } finally {
        setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/api/auth/google';
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container sx={{ height: '100vh' }}>
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
              Log ind
            </Typography>

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
                id="username"
                label="Brugernavn"
                name="username"
                autoComplete="username"
                autoFocus
                value={formData.username}
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
                name="password"
                label="Adgangskode"
                type="password"
                id="password"
                autoComplete="current-password"
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
              <Button
                type="submit"
                fullWidth
                variant="outlined"
                disabled={isLoading}
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
                {isLoading ? 'Logger ind...' : 'LOG IND'}
              </Button>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Link 
                    component={RouterLink} 
                    to="/reset-password" 
                    sx={{ 
                      color: 'primary.main',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Glemt adgangskode?
                  </Link>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Link 
                    component={RouterLink} 
                    to="/register"
                    sx={{ 
                      color: 'primary.main',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Har du ikke en konto? Registrer dig
                  </Link>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ 
              width: '100%', 
              mb: 3,
              color: 'primary.main',
              '&::before, &::after': {
                borderColor: 'primary.main',
              }
            }}>
              ELLER
            </Divider>

            <Button
              fullWidth
              variant="contained"
              onClick={handleGoogleLogin}
              startIcon={
                <img 
                  src={googleIcon} 
                  alt="Google" 
                  style={{ 
                    width: '20px', 
                    height: '20px',
                    marginRight: '8px' 
                  }} 
                />
              }
              sx={{
                backgroundColor: '#fff',
                color: '#000',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '16px',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                border: '1px solid #dadce0',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                  boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.15)',
                },
              }}
            >
              Log ind med Google
            </Button>

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

export default Login;
