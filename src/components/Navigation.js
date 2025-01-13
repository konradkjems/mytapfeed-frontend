import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText,
  useTheme,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../assets/tapfeed logo dark wide transparent.svg';

const Navigation = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const menuItems = [
    { text: 'Hjem', path: '/' },
    { text: 'Priser', path: '/pricing' },
    { text: 'Om os', path: '/about' },
    { text: 'Kontakt', path: '/contact' }
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (mobileOpen) {
      setMobileOpen(false);
    }
  };

  const drawer = (
    <List sx={{ bgcolor: 'white' }}>
      {menuItems.map((item) => (
        <ListItem 
          button 
          key={item.text}
          onClick={() => handleNavigation(item.path)}
          selected={location.pathname === item.path}
          sx={{
            '&.Mui-selected': {
              bgcolor: 'rgba(0, 31, 63, 0.08)',
              '&:hover': {
                bgcolor: 'rgba(0, 31, 63, 0.12)',
              },
            },
            '&:hover': {
              bgcolor: 'rgba(0, 31, 63, 0.04)',
            },
          }}
        >
          <ListItemText 
            primary={item.text} 
            sx={{ 
              color: '#001F3F',
              '.MuiTypography-root': {
                fontWeight: location.pathname === item.path ? 600 : 400
              }
            }}
          />
        </ListItem>
      ))}
      {!isAuthenticated && (
        <>
          <ListItem button onClick={() => handleNavigation('/login')}>
            <ListItemText primary="Log ind" sx={{ color: '#001F3F' }} />
          </ListItem>
          <ListItem button onClick={() => handleNavigation('/register')}>
            <ListItemText primary="Opret konto" sx={{ color: '#white' }} />
          </ListItem>
        </>
      )}
      {isAuthenticated && (
        <ListItem button onClick={() => handleNavigation('/dashboard')}>
          <ListItemText primary="Dashboard" sx={{ color: '#FFFFFF' }} />
        </ListItem>
      )}
    </List>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        sx={{ 
          bgcolor: 'white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box
            component="img"
            src={Logo}
            alt="TapFeed Logo"
            sx={{
              height: 40,
              cursor: 'pointer',
              maxWidth: '180px',
              objectFit: 'contain'
            }}
            onClick={() => handleNavigation('/')}
          />

          {isMobile ? (
            <IconButton
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ color: '#001F3F' }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <>
              <Box sx={{ 
                display: 'flex', 
                gap: 2,
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)'
              }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.text}
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      color: '#001F3F',
                      borderBottom: location.pathname === item.path ? 2 : 0,
                      borderColor: '#001F3F',
                      borderRadius: 0,
                      '&:hover': {
                        backgroundColor: 'rgba(0, 31, 63, 0.04)',
                      }
                    }}
                  >
                    {item.text}
                  </Button>
                ))}
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                {!isAuthenticated ? (
                  <>
                    <Button 
                      onClick={() => handleNavigation('/login')}
                      sx={{
                        color: '#001F3F',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 31, 63, 0.04)',
                        }
                      }}
                    >
                      Log ind
                    </Button>
                    <Button 
                      variant="contained" 
                      onClick={() => handleNavigation('/register')}
                      sx={{
                        bgcolor: '#001F3F',
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'rgba(0, 31, 63, 0.9)',
                        }
                      }}
                    >
                      Opret konto
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="contained" 
                    onClick={() => handleNavigation('/dashboard')}
                    sx={{
                      bgcolor: '#001F3F',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'rgba(0, 31, 63, 0.9)',
                      }
                    }}
                  >
                    Dashboard
                  </Button>
                )}
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 240,
            bgcolor: 'white'
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navigation; 