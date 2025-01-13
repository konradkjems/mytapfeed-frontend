import React from 'react';
import { Container, Typography, Box, Grid, Paper } from '@mui/material';
import QrCodeIcon from '@mui/icons-material/QrCode';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SupportIcon from '@mui/icons-material/Support';

const About = () => {
  return (
    <Box sx={{ bgcolor: 'white', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h2" component="h1" align="center" gutterBottom sx={{ color: '#001F3F', fontFamily: 'Inter' }}>
          Om TapFeed
        </Typography>
        
        <Typography variant="h5" align="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
          Vi gør det nemt at forbinde den fysiske og digitale verden gennem smarte QR-kode løsninger
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Paper sx={{ p: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', bgcolor: 'white' }}>
              <Typography variant="h4" gutterBottom sx={{ color: '#001F3F' }}>
                Vores Mission
              </Typography>
              <Typography paragraph sx={{ color: '#001F3F' }}>
              Velkommen til TapFeed, hvor vi tror på værdien af ægte kundeanmeldelser. 
              Vores mission er at gøre det nemt for virksomheder at indsamle feedback og skabe tillid gennem innovative løsninger. 
              Uanset om du er en butiksejer, serviceudbyder eller restauratør, hjælper TapFeeds produkter dig med at øge synligheden, opbygge troværdighed og tiltrække flere kunder.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ 
              p: 3, 
              height: '100%',
              bgcolor: 'white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)'
              }
            }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                <QrCodeIcon sx={{ fontSize: 60, mb: 2, color: '#001F3F' }} />
                <Typography variant="h5" gutterBottom align="center" sx={{ color: '#001F3F' }}>
                  Smart QR-Teknologi
                </Typography>
              </Box>
              <Typography align="center" sx={{ color: '#001F3F' }}>
                Vores dynamiske QR-koder giver dig mulighed for at opdatere indholdet når som helst, 
                uden at skulle ændre den fysiske kode.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ 
              p: 3, 
              height: '100%',
              bgcolor: 'white', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)'
              }
            }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                <AnalyticsIcon sx={{ fontSize: 60, mb: 2, color: '#001F3F' }} />
                <Typography variant="h5" gutterBottom align="center" sx={{ color: '#001F3F' }}>
                  Detaljeret Indsigt
                </Typography>
              </Box>
              <Typography align="center" sx={{ color: '#001F3F' }}>
                Få værdifuld indsigt i hvordan dine kunder interagerer med dine produkter gennem 
                vores avancerede analyseværktøjer.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ 
              p: 3,
              height: '100%',
              bgcolor: 'white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)'
              }
            }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                <SupportIcon sx={{ fontSize: 60, mb: 2, color: '#001F3F' }} />
                <Typography variant="h5" gutterBottom align="center" sx={{ color: '#001F3F' }}>
                  Dedikeret Support
                </Typography>
              </Box>
              <Typography align="center" sx={{ color: '#001F3F' }}>
                Vores engagerede supportteam står klar til at hjælpe dig med at få mest muligt ud af 
                din TapFeed-løsning.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default About; 