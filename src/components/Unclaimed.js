import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  TextField,
  CircularProgress,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LoginIcon from '@mui/icons-material/Login';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DashboardIcon from '@mui/icons-material/Dashboard';
import API_URL from '../config';
import logo from '../assets/tapfeed logo dark wide transparent.svg';

const Unclaimed = () => {
  const { setIsAuthenticated, setUserData, fetchUserData } = useAuth();
  const { standerId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stand, setStand] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const checkStand = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/stands/${standerId}`);
        
        if (!response.ok) {
          throw new Error('Produkt ikke fundet');
        }

        const data = await response.json();
        setStand(data);
      } catch (error) {
        console.error('Fejl ved hentning af produkt:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    checkStand();
  }, [standerId]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: loginData.username,
          password: loginData.password,
          standerId: standerId
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login succesfuldt:', data);
        setIsAuthenticated(true);
        setUserData(data.user);
        navigate('/dashboard');
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Login fejl:', error);
      setError('Der opstod en fejl under login');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      setError('Adgangskoderne matcher ikke');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: registerData.username,
          email: registerData.email,
          password: registerData.password,
          standerId: standerId
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Registrering succesfuld:', data);
        setIsAuthenticated(true);
        setUserData(data.user);
        navigate('/dashboard');
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Registreringsfejl:', error);
      setError('Der opstod en fejl under registrering');
    }
  };

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

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', color: '#001F3F', p: 3 }}>
      <Container maxWidth="sm">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <Box
            component="img"
            src={logo}
            alt="Tapfeed Logo"
            sx={{ width: '200px', height: 'auto', mb: 4 }}
          />

          <Typography variant="h4" gutterBottom align="center" sx={{ color: '#001F3F' }}>
            Aktiver dit produkt
          </Typography>

          <Typography variant="subtitle1" align="center" sx={{ color: '#001F3F', mb: 3 }}>
            Produkt ID: {standerId}
          </Typography>

          <Alert severity="info" sx={{ width: '100%', mb: 3 }}>
            Dette produkt er endnu ikke aktiveret. Log ind med din eksisterende konto eller opret en ny for at aktivere det.
          </Alert>

          <Paper sx={{ p: 4, width: '100%', boxShadow: '0 4px 6px rgba(0, 31, 63, 0.1)', backgroundColor: 'white' }}>
            <Typography variant="h6" gutterBottom align="center" sx={{ color: '#001F3F' }}>
              Sådan gør du:
            </Typography>

            <List>
              <ListItem>
                <ListItemIcon>
                  <DashboardIcon sx={{ color: '#001F3F' }} />
                </ListItemIcon>
                <ListItemText 
                  primary={<Typography sx={{ color: '#001F3F', fontWeight: 500 }}>1. Log ind eller opret en konto</Typography>}
                  secondary={
                    <Typography sx={{ color: '#001F3F', opacity: 0.7 }}>
                      Brug formularen nedenfor til at logge ind eller oprette en ny konto
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon sx={{ color: '#001F3F' }} />
                </ListItemIcon>
                <ListItemText 
                  primary={<Typography sx={{ color: '#001F3F', fontWeight: 500 }}>2. Produktet aktiveres automatisk</Typography>}
                  secondary={
                    <Typography sx={{ color: '#001F3F', opacity: 0.7 }}>
                      Når du logger ind eller opretter en konto, vil produktet automatisk blive tilføjet til din profil
                    </Typography>
                  }
                />
              </ListItem>
            </List>

            <Divider sx={{ my: 3 }} />

            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              centered
              sx={{ 
                mb: 3,
                '& .MuiTab-root': {
                  color: '#001F3F',
                  '&.Mui-selected': {
                    color: '#001F3F'
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#001F3F'
                }
              }}
            >
              <Tab 
                label="Log ind" 
                icon={<LoginIcon />} 
                sx={{ 
                  textTransform: 'none',
                  fontSize: '1rem'
                }}
              />
              <Tab 
                label="Opret konto" 
                icon={<PersonAddIcon />} 
                sx={{ 
                  textTransform: 'none',
                  fontSize: '1rem'
                }}
              />
            </Tabs>

            {activeTab === 0 ? (
              <form onSubmit={handleLogin}>
                <TextField
                  fullWidth
                  label="Brugernavn"
                  variant="outlined"
                  margin="normal"
                  value={loginData.username}
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(0, 31, 63, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#001F3F',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#001F3F',
                      },
                      '& input': {
                        color: '#001F3F',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(0, 31, 63, 0.7)',
                      '&.Mui-focused': {
                        color: '#001F3F',
                      },
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Adgangskode"
                  type="password"
                  variant="outlined"
                  margin="normal"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(0, 31, 63, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#001F3F',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#001F3F',
                      },
                      '& input': {
                        color: '#001F3F',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(0, 31, 63, 0.7)',
                      '&.Mui-focused': {
                        color: '#001F3F',
                      },
                    },
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    backgroundColor: '#001F3F',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#003366'
                    }
                  }}
                >
                  Log ind
                </Button>
              </form>
            ) : (
              <form onSubmit={handleRegister}>
                <TextField
                  fullWidth
                  label="Brugernavn"
                  variant="outlined"
                  margin="normal"
                  value={registerData.username}
                  onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(0, 31, 63, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#001F3F',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#001F3F',
                      },
                      '& input': {
                        color: '#001F3F',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(0, 31, 63, 0.7)',
                      '&.Mui-focused': {
                        color: '#001F3F',
                      },
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  variant="outlined"
                  margin="normal"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(0, 31, 63, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#001F3F',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#001F3F',
                      },
                      '& input': {
                        color: '#001F3F',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(0, 31, 63, 0.7)',
                      '&.Mui-focused': {
                        color: '#001F3F',
                      },
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Adgangskode"
                  type="password"
                  variant="outlined"
                  margin="normal"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(0, 31, 63, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#001F3F',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#001F3F',
                      },
                      '& input': {
                        color: '#001F3F',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(0, 31, 63, 0.7)',
                      '&.Mui-focused': {
                        color: '#001F3F',
                      },
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Bekræft adgangskode"
                  type="password"
                  variant="outlined"
                  margin="normal"
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(0, 31, 63, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#001F3F',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#001F3F',
                      },
                      '& input': {
                        color: '#001F3F',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(0, 31, 63, 0.7)',
                      '&.Mui-focused': {
                        color: '#001F3F',
                      },
                    },
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    backgroundColor: '#001F3F',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#003366'
                    }
                  }}
                >
                  Opret konto
                </Button>
              </form>
            )}
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Unclaimed; 