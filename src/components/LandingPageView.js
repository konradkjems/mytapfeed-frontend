import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
  Link
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
        const response = await fetch(`${API_URL}/landing/${id}`);
        if (!response.ok) {
          throw new Error('Kunne ikke hente landing page');
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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !page) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh'
        }}
      >
        <Typography color="error">
          {error || 'Landing page ikke fundet'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: page.backgroundColor,
        backgroundImage: page.backgroundImage ? `url(${page.backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: 3
      }}
    >
      {page.logo && (
        <Box
          component="img"
          src={page.logo}
          alt={page.title}
          sx={{
            width: 'auto',
            maxWidth: '200px',
            height: 'auto',
            maxHeight: '200px',
            marginBottom: 4
          }}
        />
      )}

      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{
          color: page.buttonTextColor,
          textAlign: 'center',
          marginBottom: 2
        }}
      >
        {page.title}
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: page.buttonTextColor,
          textAlign: 'center',
          marginBottom: 4,
          maxWidth: '600px'
        }}
      >
        {page.description}
      </Typography>

      <Stack spacing={2} sx={{ width: '100%', maxWidth: '400px', marginBottom: 4 }}>
        {page.buttons?.map((button, index) => (
          <Button
            key={index}
            variant="contained"
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

      {page.socialLinks && Object.values(page.socialLinks).some(link => link) && (
        <Stack
          direction="row"
          spacing={2}
          sx={{
            marginTop: 'auto',
            padding: 2
          }}
        >
          {page.socialLinks.instagram && (
            <IconButton
              href={page.socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: page.buttonColor }}
            >
              <InstagramIcon />
            </IconButton>
          )}
          {page.socialLinks.facebook && (
            <IconButton
              href={page.socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: page.buttonColor }}
            >
              <FacebookIcon />
            </IconButton>
          )}
          {page.socialLinks.youtube && (
            <IconButton
              href={page.socialLinks.youtube}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: page.buttonColor }}
            >
              <YouTubeIcon />
            </IconButton>
          )}
          {page.socialLinks.twitter && (
            <IconButton
              href={page.socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: page.buttonColor }}
            >
              <TwitterIcon />
            </IconButton>
          )}
        </Stack>
      )}
    </Box>
  );
};

export default LandingPageView; 