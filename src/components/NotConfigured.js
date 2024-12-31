import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  Chip
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LinkIcon from '@mui/icons-material/Link';
import DescriptionIcon from '@mui/icons-material/Description';
import DashboardIcon from '@mui/icons-material/Dashboard';
import API_URL from '../config';
import logo from '../assets/tapfeed logo white wide transparent.svg';

const NotConfigured = () => {
  const { standerId } = useParams();
  const [stand, setStand] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStand = async () => {
      try {
        const response = await fetch(`${API_URL}/api/stands/${standerId}`, {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Kunne ikke hente produkt information');
        }

        const data = await response.json();
        setStand(data);
      } catch (error) {
        console.error('Fejl ved hentning af produkt:', error);
        setError('Der opstod en fejl ved hentning af produkt information');
      }
    };

    fetchStand();
  }, [standerId]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        py: 4
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            p: 4,
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

          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Chip 
              label="Aktiveret men ikke konfigureret" 
              color="warning" 
              sx={{ mb: 2 }}
            />
            <Typography variant="h4" component="h1" gutterBottom>
              Dette produkt mangler opsætning
            </Typography>
          </Box>

          {error ? (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          ) : (
            <>
              <Typography variant="body1" color="text.secondary" align="center" paragraph>
                Dette TapFeed produkt er blevet aktiveret og tilknyttet din konto, men der mangler at blive sat et redirect link eller en landing page op.
                For at gøre produktet aktivt skal du følge instruktionerne herunder.
              </Typography>

              <Divider sx={{ width: '100%', my: 2 }} />

              <Typography variant="h6" gutterBottom align="center">
                Sådan gør du:
              </Typography>

              <List sx={{ width: '100%', maxWidth: 600 }}>
                <ListItem>
                  <ListItemIcon>
                    <DashboardIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="1. Gå til dit dashboard" 
                    secondary="Log ind på my.tapfeed.dk og gå til dit dashboard"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleOutlineIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="2. Find dit produkt" 
                    secondary="Under 'Produkter' finder du dette produkt med ID'et"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LinkIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="3. Vælg destination" 
                    secondary="Du kan enten tilføje et direkte link til din hjemmeside/sociale medier, eller oprette en flot landing page"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <DescriptionIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="4. Gem ændringerne" 
                    secondary="Efter du har gemt ændringerne, vil dit produkt automatisk begynde at redirecte besøgende til den valgte destination"
                  />
                </ListItem>
              </List>

              <Divider sx={{ width: '100%', my: 2 }} />

              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to="/login"
                  size="large"
                >
                  Log ind
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  component={Link}
                  to="/dashboard"
                  size="large"
                >
                  Gå til dashboard
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default NotConfigured; 