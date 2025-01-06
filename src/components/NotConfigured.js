import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
  Divider,
  Chip,
  CircularProgress
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LinkIcon from '@mui/icons-material/Link';
import DescriptionIcon from '@mui/icons-material/Description';
import DashboardIcon from '@mui/icons-material/Dashboard';
import API_URL from '../config';
import logo from '../assets/tapfeed logo dark wide transparent.svg';

const NotConfigured = () => {
  const { standerId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stand, setStand] = useState(null);

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

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white'
        }}
      >
        <CircularProgress sx={{ color: '#001F3F' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white'
        }}
      >
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
              to="/login"
            >
              Gå til login
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        color: '#001F3F',
        p: 3
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="Tapfeed Logo"
            sx={{
              width: '200px',
              height: 'auto',
              mb: 4
            }}
          />

          <Typography variant="h4" gutterBottom align="center" sx={{ color: '#001F3F' }}>
            Dette produkt er ikke konfigureret endnu
          </Typography>

          <Typography variant="subtitle1" align="center" sx={{ color: '#001F3F', mb: 3 }}>
            Produkt ID: {standerId}
          </Typography>

          <Alert severity="info" sx={{ width: '100%', mb: 3 }}>
            Dette produkt er endnu ikke sat op. Log ind på din Tapfeed konto for at konfigurere det.
          </Alert>

          <Paper 
            sx={{ 
              p: 4, 
              width: '100%',
              boxShadow: '0 4px 6px rgba(0, 31, 63, 0.1)',
              backgroundColor: 'white'
            }}
          >
            <Typography variant="h6" gutterBottom align="center" sx={{ color: '#001F3F' }}>
              Sådan gør du:
            </Typography>

            <List>
              <ListItem>
                <ListItemIcon>
                  <DashboardIcon sx={{ color: '#001F3F' }} />
                </ListItemIcon>
                <ListItemText 
                  primary={<Typography sx={{ color: '#001F3F', fontWeight: 500 }}>1. Gå til dit dashboard</Typography>}
                  secondary={
                    <Typography sx={{ color: '#001F3F', opacity: 0.7 }}>
                      Log ind på my.tapfeed.dk og gå til dit dashboard
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon sx={{ color: '#001F3F' }} />
                </ListItemIcon>
                <ListItemText 
                  primary={<Typography sx={{ color: '#001F3F', fontWeight: 500 }}>2. Find dit produkt</Typography>}
                  secondary={
                    <Typography sx={{ color: '#001F3F', opacity: 0.7 }}>
                      Under 'Produkter' finder du dette produkt med ID'et {standerId}
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <LinkIcon sx={{ color: '#001F3F' }} />
                </ListItemIcon>
                <ListItemText 
                  primary={<Typography sx={{ color: '#001F3F', fontWeight: 500 }}>3. Vælg destination</Typography>}
                  secondary={
                    <Typography sx={{ color: '#001F3F', opacity: 0.7 }}>
                      Du kan enten tilføje et direkte link til din Google Review side, hjemmeside/sociale medier, eller oprette en flot landing page
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <DescriptionIcon sx={{ color: '#001F3F' }} />
                </ListItemIcon>
                <ListItemText 
                  primary={<Typography sx={{ color: '#001F3F', fontWeight: 500 }}>4. Gem ændringerne</Typography>}
                  secondary={
                    <Typography sx={{ color: '#001F3F', opacity: 0.7 }}>
                      Efter du har gemt ændringerne, vil dit produkt automatisk begynde at redirecte besøgende til den valgte destination
                    </Typography>
                  }
                />
              </ListItem>
            </List>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="contained"
                sx={{ 
                  backgroundColor: '#001F3F',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#003366'
                  }
                }}
                component={Link}
                to="/login"
                size="large"
              >
                Log ind
              </Button>
              <Button
                variant="outlined"
                sx={{ 
                  color: '#001F3F',
                  borderColor: '#001F3F',
                  '&:hover': {
                    borderColor: '#003366',
                    backgroundColor: 'rgba(0, 31, 63, 0.04)'
                  }
                }}
                component={Link}
                to="/dashboard"
                size="large"
              >
                Gå til dashboard
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default NotConfigured; 