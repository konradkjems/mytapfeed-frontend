import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Stack,
  CircularProgress
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/landing-pages/view/${id}`);
        if (!response.ok) {
          throw new Error('Landing page ikke fundet');
        }
        const data = await response.json();
        setPage(data);
      } catch (error) {
        console.error('Fejl ved hentning af landing page:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPage();
  }, [id]);

  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !page) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <Typography color="error">
          {error || 'Landing page ikke fundet'}
        </Typography>
      </Box>
    );
  }

  const activeSocialLinks = Object.entries(page.socialLinks || {})
    .filter(([_, url]) => url && url.trim() !== '');

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: page.backgroundColor,
        backgroundImage: page.backgroundImage ? `url(${page.backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '20px'
      }}
    >
      {page.logo && (
        <Box
          component="img"
          src={page.logo}
          alt="Logo"
          sx={{
            width: 'auto',
            maxWidth: '200px',
            height: 'auto',
            maxHeight: '100px',
            mb: 2
          }}
        />
      )}
      
      {page.showTitle && (
        <Typography 
          variant="h4" 
          component="h1" 
          align="center"
          sx={{ 
            mb: 2,
            color: page.titleColor,
            wordBreak: 'break-word'
          }}
        >
          {page.title}
        </Typography>
      )}

      {page.description && (
        <Typography 
          variant="body1" 
          align="center"
          sx={{ 
            mb: 3,
            color: page.descriptionColor,
            wordBreak: 'break-word'
          }}
        >
          {page.description}
        </Typography>
      )}

      <Stack spacing={2} sx={{ width: '100%', maxWidth: '300px' }}>
        {(page.buttons || []).map((button, index) => (
          <Button
            key={index}
            variant="contained"
            fullWidth
            href={button.url}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              backgroundColor: page.buttonColor,
              color: page.buttonTextColor,
              '&:hover': {
                backgroundColor: page.buttonColor,
                opacity: 0.9
              }
            }}
          >
            {button.text}
          </Button>
        ))}
      </Stack>

      {activeSocialLinks.length > 0 && (
        <Box sx={{ mt: 'auto', pt: 3 }}>
          <Stack direction="row" spacing={2} justifyContent="center">
            {activeSocialLinks.map(([platform, url]) => {
              const Icon = {
                instagram: InstagramIcon,
                facebook: FacebookIcon,
                youtube: YouTubeIcon,
                twitter: TwitterIcon
              }[platform];
              
              return Icon && (
                <IconButton
                  key={platform}
                  component="a"
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ 
                    color: page.buttonColor,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)'
                    }
                  }}
                >
                  <Icon />
                </IconButton>
              );
            })}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default LandingPageView; 