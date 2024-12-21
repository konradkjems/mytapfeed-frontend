import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  IconButton,
  CircularProgress,
  Stack
} from '@mui/material';
import {
  Instagram as InstagramIcon,
  Facebook as FacebookIcon,
  YouTube as YouTubeIcon,
  Twitter as TwitterIcon
} from '@mui/icons-material';
import API_URL from '../config';

const LandingPageView = () => {
  const { id } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        console.log('Henter landing page med ID:', id);
        const response = await fetch(`${API_URL}/api/landing-pages/${id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Modtaget data:', data);
        
        if (!data) {
          throw new Error('Ingen data modtaget fra serveren');
        }
        
        setPage(data);
      } catch (err) {
        console.error('Detaljeret fejl ved hentning af landing page:', {
          error: err.message,
          stack: err.stack
        });
        setError(`Fejl ved hentning af landing page: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPage();
    }
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        bgcolor: '#fff',
        gap: 2,
        p: 3
      }}>
        <CircularProgress />
        <Typography>Indlæser landing page...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        bgcolor: '#fff',
        gap: 2,
        p: 3
      }}>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!page) {
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: page.backgroundColor || '#ffffff',
        backgroundImage: page.backgroundImage ? `url(${page.backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      {page.logo && (
        <Box
          component="img"
          src={page.logo}
          alt="Logo"
          sx={{
            width: 'auto',
            maxWidth: '150px',
            height: 'auto',
            maxHeight: '150px',
            marginBottom: 2
          }}
        />
      )}

      {page.showTitle && (
        <Typography
          variant="h4"
          component="h1"
          sx={{
            color: page.titleColor || '#000000',
            textAlign: 'center',
            marginBottom: 3,
            maxWidth: '600px',
            fontFamily: page.titleFont || 'Roboto'
          }}
        >
          {page.title}
        </Typography>
      )}

      {page.description && (
        <Typography
          variant="body1"
          sx={{
            color: page.descriptionColor || '#000000',
            textAlign: 'center',
            marginBottom: 4,
            maxWidth: '600px',
            fontFamily: page.descriptionFont || 'Roboto'
          }}
        >
          {page.description}
        </Typography>
      )}

      <Stack spacing={2} sx={{ width: '100%', maxWidth: '300px' }}>
        {page.buttons?.map((button, index) => (
          <Button
            key={index}
            variant="contained"
            href={button.url}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              backgroundColor: page.buttonColor || '#000000',
              color: page.buttonTextColor || '#ffffff',
              fontFamily: page.buttonFont || 'Roboto',
              '&:hover': {
                backgroundColor: page.buttonColor || '#000000',
                opacity: 0.9
              }
            }}
          >
            {button.text}
          </Button>
        ))}
      </Stack>

      <Box sx={{ marginTop: 'auto', display: 'flex', gap: 2, padding: 2 }}>
        {page.socialLinks?.instagram && (
          <IconButton
            href={page.socialLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: page.buttonColor || '#000000' }}
          >
            <InstagramIcon />
          </IconButton>
        )}
        {page.socialLinks?.facebook && (
          <IconButton
            href={page.socialLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: page.buttonColor || '#000000' }}
          >
            <FacebookIcon />
          </IconButton>
        )}
        {page.socialLinks?.youtube && (
          <IconButton
            href={page.socialLinks.youtube}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: page.buttonColor || '#000000' }}
          >
            <YouTubeIcon />
          </IconButton>
        )}
        {page.socialLinks?.twitter && (
          <IconButton
            href={page.socialLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: page.buttonColor || '#000000' }}
          >
            <TwitterIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default LandingPageView; 