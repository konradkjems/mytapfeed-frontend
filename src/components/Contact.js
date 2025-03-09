import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  TextField, 
  Button, 
  Box,
  Snackbar,
  Alert
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import API_URL from '../config';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Der opstod en fejl ved afsendelse af beskeden');
      }

      setSnackbar({
        open: true,
        message: 'Tak for din besked! Vi vender tilbage hurtigst muligt.',
        severity: 'success'
      });

      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Fejl ved afsendelse af kontaktformular:', error);
      setSnackbar({
        open: true,
        message: 'Der opstod en fejl ved afsendelse af beskeden. Prøv venligst igen senere.',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const contactInfo = [
    {
      icon: <EmailIcon sx={{ fontSize: 40, color: '#001F3F' }} />,
      title: 'Email',
      content: 'konrad@tapfeed.dk',
      link: 'mailto:konrad@tapfeed.dk'
    },
    {
      icon: <PhoneIcon sx={{ fontSize: 40, color: '#001F3F' }} />,
      title: 'Telefon',
      content: '+45 51 95 56 99',
      link: 'tel:+4551955699'
    },
    {
      icon: <LocationOnIcon sx={{ fontSize: 40, color: '#001F3F' }} />,
      title: 'Adresse',
      content: 'Andebakkesti 6, st\n2000 Frederiksberg',
      link: 'https://maps.google.com/?q=Andebakkesti+6+2000+Frederiksberg'
    }
  ];

  return (
    <Box sx={{ bgcolor: 'white', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h2" component="h1" align="center" gutterBottom sx={{ 
          color: '#001F3F',
          fontSize: '2.5rem',
          fontWeight: 'bold',
          mb: 2
        }}>
          Kontakt Os
        </Typography>
        
        <Typography variant="h5" align="center" paragraph sx={{ 
          mb: 6,
          color: '#001F3F',
          opacity: 0.8
        }}>
          Har du spørgsmål? Vi er her for at hjælpe!
        </Typography>

        {/* Kontakt information */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {contactInfo.map((info, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper 
                sx={{ 
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  bgcolor: 'white',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <Box sx={{ mb: 2 }}>
                  {info.icon}
                </Box>
                <Typography variant="h6" gutterBottom sx={{ color: '#001F3F' }}>
                  {info.title}
                </Typography>
                <Typography 
                  component="a" 
                  href={info.link}
                  target={info.title === 'Adresse' ? '_blank' : '_self'}
                  rel={info.title === 'Adresse' ? 'noopener noreferrer' : ''}
                  sx={{ 
                    color: '#001F3F',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  {info.content.split('\\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      {i !== info.content.split('\\n').length - 1 && <br />}
                    </span>
                  ))}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Kontaktformular */}
        <Paper 
          component="form"
          onSubmit={handleSubmit}
          sx={{ 
            p: 4,
            bgcolor: 'white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ 
            color: '#001F3F',
            mb: 4,
            textAlign: 'center',
            fontSize: '2rem',
            fontWeight: 'bold'
          }}>
            Send os en besked
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Navn"
                name="name"
                value={formData.name}
                onChange={handleChange}
                variant="outlined"
                sx={{
                  bgcolor: 'white',
                  '& .MuiOutlinedInput-root': {
                    color: '#001F3F',
                    '& fieldset': {
                      borderColor: 'rgba(0, 31, 63, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0, 31, 63, 0.3)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#001F3F',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#001F3F',
                    '&.Mui-focused': {
                      color: '#001F3F',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                variant="outlined"
                sx={{
                  bgcolor: 'white',
                  '& .MuiOutlinedInput-root': {
                    color: '#001F3F',
                    '& fieldset': {
                      borderColor: 'rgba(0, 31, 63, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0, 31, 63, 0.3)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#001F3F',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#001F3F',
                    '&.Mui-focused': {
                      color: '#001F3F',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Emne"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                variant="outlined"
                sx={{
                  bgcolor: 'white',
                  '& .MuiOutlinedInput-root': {
                    color: '#001F3F',
                    '& fieldset': {
                      borderColor: 'rgba(0, 31, 63, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0, 31, 63, 0.3)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#001F3F',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#001F3F',
                    '&.Mui-focused': {
                      color: '#001F3F',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={4}
                label="Besked"
                name="message"
                value={formData.message}
                onChange={handleChange}
                variant="outlined"
                sx={{
                  bgcolor: 'white',
                  '& .MuiOutlinedInput-root': {
                    color: '#001F3F',
                    '& fieldset': {
                      borderColor: 'rgba(0, 31, 63, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0, 31, 63, 0.3)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#001F3F',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#001F3F',
                    '&.Mui-focused': {
                      color: '#001F3F',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{ 
                  mt: 2,
                  px: 6,
                  py: 1.5,
                  bgcolor: '#001F3F',
                  color: 'white',
                  fontSize: '1.1rem',
                  '&:hover': {
                    bgcolor: 'rgba(0, 31, 63, 0.9)',
                  }
                }}
              >
                Send Besked
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={6000} 
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Contact; 