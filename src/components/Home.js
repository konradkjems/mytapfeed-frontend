import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/tapfeed logo white wide transparent.svg';
import { Box, Container, Typography, Button, Grid, Paper } from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  Store as StoreIcon,
  BarChart as AnalyticsIcon,
  Web as WebIcon
} from '@mui/icons-material';

function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const features = [
    {
      icon: <DashboardIcon sx={{ fontSize: 40, color: '#001F3F' }} />,
      title: 'Brugervenligt Dashboard',
      description: 'Få overblik over dine data og administrer dine produkter fra ét sted'
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 40, color: '#001F3F' }} />,
      title: 'Detaljeret Statistik',
      description: 'Følg med i dine besøgstal og se hvordan dine produkter performer'
    },
    {
      icon: <WebIcon sx={{ fontSize: 40, color: '#001F3F' }} />,
      title: 'Landing Pages',
      description: 'Opret og tilpas professionelle landing pages på få minutter'
    },
    {
      icon: <StoreIcon sx={{ fontSize: 40, color: '#001F3F' }} />,
      title: 'Google Reviews',
      description: 'Se og administrer dine Google anmeldelser direkte fra dashboardet'
    }
  ];

  return (
    <Box sx={{ 
      backgroundColor: '#fff',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <img 
                src={logo} 
                alt="TapFeed Logo" 
                style={{ 
                  maxWidth: '100%',
                  width: '400px',
                  marginBottom: '24px',
                  filter: 'brightness(0.2)'
                }} 
              />
              <Typography variant="h4" component="h1" sx={{ color: '#001F3F', mb: 2 }}>
                Velkommen til MyTapFeed
              </Typography>
              <Typography variant="h6" sx={{ color: '#001F3F', mb: 4, opacity: 0.9 }}>
                Din platform til at administrere og optimere din digitale tilstedeværelse
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <Button 
                  component={Link}
                  to="/login"
                  variant="contained"
                  size="large"
                  sx={{ 
                    backgroundColor: '#001F3F',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: '#002f5f'
                    }
                  }}
                >
                  Log ind
                </Button>
                <Button 
                  component={Link}
                  to="/register"
                  variant="outlined"
                  size="large"
                  sx={{ 
                    borderColor: '#001F3F',
                    color: '#001F3F',
                    '&:hover': {
                      borderColor: '#002f5f',
                      backgroundColor: 'rgba(0,31,63,0.1)'
                    }
                  }}
                >
                  Registrer
                </Button>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ color: '#001F3F', mb: 3, textAlign: 'center' }}>
                Besøg vores webshop
              </Typography>
              <Paper sx={{ 
                p: 3, 
                backgroundColor: '#fff',
                border: '1px solid rgba(0,31,63,0.2)',
                boxShadow: '0 4px 6px rgba(0,31,63,0.1)'
              }}>
                <Typography sx={{ color: '#001F3F', mb: 2, textAlign: 'center' }}>
                  Find vores komplette udvalg af produkter på vores webshop
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Button 
                    variant="contained"
                    size="large"
                    href="https://tapfeed.dk"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ 
                      backgroundColor: '#001F3F',
                      color: '#fff',
                      '&:hover': {
                        backgroundColor: '#002f5f'
                      }
                    }}
                  >
                    Besøg Webshop
                  </Button>
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper sx={{ 
                p: 3, 
                height: '100%',
                backgroundColor: '#fff',
                border: '1px solid rgba(0,31,63,0.2)',
                boxShadow: '0 4px 6px rgba(0,31,63,0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}>
                {feature.icon}
                <Typography variant="h6" sx={{ color: '#001F3F', my: 2 }}>
                  {feature.title}
                </Typography>
                <Typography sx={{ color: '#001F3F', opacity: 0.9 }}>
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default Home;