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
  const { id, urlPath } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        let response;
        
        if (id) {
          // Hvis vi har et ID, brug det direkte
          response = await fetch(`${API_URL}/api/landing/${id}`);
        } else if (urlPath) {
          // Hvis vi har en URL-sti, find landing page via den
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
    return <div>Indlæser...</div>;
  }

  if (error) {
    return <div>Fejl: {error}</div>;
  }

  if (!page) {
    return <div>Landing page ikke fundet</div>;
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