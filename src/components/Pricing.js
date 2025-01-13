import React, { useState } from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('Kampagne tilbud!');

  const handlePlanSelect = (planTitle) => {
    setSelectedPlan(planTitle);
  };

  const plans = [
    {
      title: 'Pro',
      label: 'Den professionelle',
      price: '59',
      period: 'kr/md.',
      features: [
        'Præsenterer flere links med landing pages',
        'Adgang til platformen',
        'Få statistik fra dine enheder',
        'Ingen binding'
      ],
      buttonText: 'Vælg',
      action: () => handlePlanSelect('Pro')
    },
    {
      title: 'Kampagne tilbud!',
      label: 'De fleste vælger!', 
      price: '47',
      period: 'kr/md.',
      features: [
        'Alt fra premium',
        'Spar 20% på abonnement',
        'Betales årligt'
      ],
      buttonText: 'Vælg',
      action: () => handlePlanSelect('Kampagne tilbud!'),
      featured: true,
      bgcolor: 'white'
    },
    {
      title: 'Gratis',
      label: 'Kom igang',
      price: '0',
      period: 'kr/md.',
      features: [
        '1 redigerbart Link',
        'Adgang til mobilapp',
        'Ingen binding'
      ],
      buttonText: 'Vælg',
      action: () => handlePlanSelect('Gratis')
    }
  ];

  return (
    <Box sx={{ bgcolor: 'white', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h2" component="h1" align="center" gutterBottom sx={{ 
          color: '#001F3F', 
          fontSize: '2.5rem',
          fontWeight: 'bold',
          mb: 6
        }}>
          Vælg dit abonnement
        </Typography>
        
        <Grid container spacing={3} justifyContent="center" sx={{ mb: 6 }}>
          {plans.map((plan, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                sx={{ 
                  height: '100%',
                  bgcolor: 'white',
                  borderRadius: 2,
                  overflow: 'hidden',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  transform: selectedPlan === plan.title ? 'scale(1.05)' : (plan.featured ? 'scale(1.02)' : 'none'),
                  boxShadow: selectedPlan === plan.title 
                    ? '0 8px 24px rgba(46, 204, 113, 0.25)' 
                    : '0 4px 12px rgba(0,0,0,0.1)',
                  border: selectedPlan === plan.title ? '2px solid #2ecc71' : 'none',
                  '&:hover': {
                    transform: selectedPlan === plan.title 
                      ? 'scale(1.05)' 
                      : (plan.featured ? 'scale(1.02)' : 'translateY(-4px)')
                  }
                }}
              >
                {/* Label */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bgcolor: plan.featured ? '#2ecc71' : 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    py: 1,
                    px: 3,
                    borderRadius: 5,
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    whiteSpace: 'nowrap'
                  }}
                >
                  {plan.label}
                </Box>

                <Box sx={{ p: 4, pt: 8 }}>
                  {/* Title */}
                  <Typography 
                    variant="h4" 
                    align="center"
                    sx={{ 
                      color: '#001F3F',
                      fontSize: '1.75rem',
                      fontWeight: 'bold',
                      mb: 3
                    }}
                  >
                    {plan.title}
                  </Typography>

                  {/* Price */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'baseline',
                    mb: 4
                  }}>
                    <Typography 
                      variant="h2" 
                      component="span"
                      sx={{ 
                        fontSize: '3.5rem',
                        fontWeight: 'bold',
                        color: '#001F3F'
                      }}
                    >
                      {plan.price}
                    </Typography>
                    <Typography 
                      variant="subtitle1" 
                      component="span"
                      sx={{ 
                        fontSize: '1.25rem',
                        color: '#001F3F',
                        ml: 1
                      }}
                    >
                      {plan.period}
                    </Typography>
                  </Box>

                  {/* Features */}
                  <Box sx={{ mb: 4 }}>
                    {plan.features.map((feature, i) => (
                      <Typography 
                        key={i} 
                        sx={{ 
                          color: '#001F3F',
                          py: 1,
                          borderBottom: i !== plan.features.length - 1 ? '1px solid rgba(0, 31, 63, 0.1)' : 'none'
                        }}
                      >
                        {feature}
                      </Typography>
                    ))}
                  </Box>

                  {/* Button */}
                  <Box 
                    component="button"
                    onClick={plan.action}
                    sx={{
                      width: '100%',
                      py: 2,
                      border: 'none',
                      borderRadius: 1,
                      bgcolor: selectedPlan === plan.title ? '#2ecc71' : '#001F3F',
                      color: 'white',
                      fontSize: '1rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: selectedPlan === plan.title ? '#27ae60' : 'rgba(0, 31, 63, 0.9)',
                      }
                    }}
                  >
                    {selectedPlan === plan.title ? 'Du har valgt' : 'Vælg'}
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Continue button below boxes */}
        <Container maxWidth="sm">
          <Box
            component="button"
            onClick={() => navigate('/register')}
            sx={{
              width: '100%',
              py: 3,
              border: 'none',
              borderRadius: 2,
              bgcolor: '#2ecc71',
              color: 'white',
              fontSize: '1.25rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(46, 204, 113, 0.25)',
              '&:hover': {
                bgcolor: '#27ae60',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 16px rgba(46, 204, 113, 0.3)',
              }
            }}
          >
            Fortsæt med dette abonnement
          </Box>
        </Container>
      </Container>
    </Box>
  );
};

export default Pricing; 