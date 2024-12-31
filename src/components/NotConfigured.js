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
  Alert
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LinkIcon from '@mui/icons-material/Link';
import DescriptionIcon from '@mui/icons-material/Description';
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

          <Typography variant="h4" component="h1" gutterBottom align="center">
            Dette produkt er aktiveret men mangler opsætning
          </Typography>

          {error ? (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          ) : (
            <>
              <Typography variant="body1" color="text.secondary" align="center" paragraph>
                Dette TapFeed produkt er blevet aktiveret, men der mangler at blive sat et redirect link eller en landing page op.
                Følg instruktionerne herunder for at færdiggøre opsætningen.
              </Typography>

              <List sx={{ width: '100%', maxWidth: 600 }}>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleOutlineIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="1. Log ind på dit TapFeed dashboard" 
                    secondary="Gå til my.tapfeed.dk og log ind på din konto"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LinkIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="2. Vælg en destination" 
                    secondary="Du kan enten tilføje et direkte redirect link (f.eks. til din hjemmeside eller sociale medier) eller oprette en landing page"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <DescriptionIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="3. Gem ændringerne" 
                    secondary="Efter du har valgt en destination, vil dit produkt automatisk begynde at redirecte besøgende"
                  />
                </ListItem>
              </List>

              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to="/login"
                  size="large"
                >
                  Gå til login
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