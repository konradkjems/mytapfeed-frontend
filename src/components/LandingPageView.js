import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  IconButton,
  CircularProgress,
  Stack,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Instagram as InstagramIcon,
  Facebook as FacebookIcon,
  YouTube as YouTubeIcon,
  Twitter as TwitterIcon
} from '@mui/icons-material';
import API_URL from '../config';

const LandingPageView = () => {
  const { id, urlPath } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width:393px)');

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        let response;
        
        if (id) {
          response = await fetch(`${API_URL}/api/landing/${id}`);
        } else if (urlPath) {
          response = await fetch(`${API_URL}/${urlPath}`);
        }

        if (!response.ok) {
          throw new Error('Landing page ikke fundet');
        }

        const data = await response.json();
        setPage(data);
      } catch (error) {
        console.error('Fejl ved hentning af landing page:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [id, urlPath]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">Fejl: {error}</Typography>
      </Box>
    );
  }

  if (!page) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Landing page ikke fundet</Typography>
      </Box>
    );
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
        padding: isMobile ? 2 : 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        overflowX: 'hidden'
      }}
    >
      {page.logo && (
        <Box
          component="img"
          src={page.logo}
          alt="Logo"
          sx={{
            width: 'auto',
            maxWidth: isMobile ? '120px' : '150px',
            height: 'auto',
            maxHeight: isMobile ? '120px' : '150px',
            marginBottom: isMobile ? 1.5 : 2
          }}
        />
      )}

      {page.showTitle !== false && (
        <Typography
          variant={isMobile ? "h5" : "h4"}
          component="h1"
          sx={{
            color: page.titleColor || '#000000',
            textAlign: 'center',
            marginBottom: isMobile ? 2 : 3,
            maxWidth: isMobile ? '340px' : '600px',
            fontFamily: page.titleFont || 'Roboto',
            padding: isMobile ? '0 16px' : 0,
            wordWrap: 'break-word'
          }}
        >
          {page.title}
        </Typography>
      )}

      <Typography
        variant="body1"
        sx={{
          color: page.descriptionColor || '#000000',
          textAlign: 'center',
          marginBottom: isMobile ? 3 : 4,
          maxWidth: isMobile ? '340px' : '600px',
          fontFamily: page.descriptionFont || 'Roboto',
          padding: isMobile ? '0 16px' : 0,
          fontSize: isMobile ? '0.9rem' : '1rem',
          wordWrap: 'break-word'
        }}
      >
        {page.description}
      </Typography>

      <Stack 
        spacing={isMobile ? 1.5 : 2} 
        sx={{ 
          width: '100%', 
          maxWidth: isMobile ? '340px' : '300px',
          padding: isMobile ? '0 16px' : 0
        }}
      >
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
              padding: isMobile ? '10px 16px' : '12px 24px',
              fontSize: isMobile ? '0.9rem' : '1rem',
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

      <Box 
        sx={{ 
          marginTop: 'auto', 
          display: 'flex', 
          gap: isMobile ? 1.5 : 2, 
          padding: isMobile ? 1.5 : 2 
        }}
      >
        {page.socialLinks?.instagram && (
          <IconButton
            href={page.socialLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ 
              color: page.buttonColor || '#000000',
              padding: isMobile ? '8px' : '12px',
              backgroundColor: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)'
              }
            }}
          >
            <InstagramIcon sx={{ fontSize: isMobile ? '1.5rem' : '2rem' }} />
          </IconButton>
        )}
        {page.socialLinks?.facebook && (
          <IconButton
            href={page.socialLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ 
              color: page.buttonColor || '#000000',
              padding: isMobile ? '8px' : '12px',
              backgroundColor: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)'
              }
            }}
          >
            <FacebookIcon sx={{ fontSize: isMobile ? '1.5rem' : '2rem' }} />
          </IconButton>
        )}
        {page.socialLinks?.youtube && (
          <IconButton
            href={page.socialLinks.youtube}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ 
              color: page.buttonColor || '#000000',
              padding: isMobile ? '8px' : '12px',
              backgroundColor: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)'
              }
            }}
          >
            <YouTubeIcon sx={{ fontSize: isMobile ? '1.5rem' : '2rem' }} />
          </IconButton>
        )}
        {page.socialLinks?.twitter && (
          <IconButton
            href={page.socialLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ 
              color: page.buttonColor || '#000000',
              padding: isMobile ? '8px' : '12px',
              backgroundColor: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)'
              }
            }}
          >
            <TwitterIcon sx={{ fontSize: isMobile ? '1.5rem' : '2rem' }} />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default LandingPageView; 