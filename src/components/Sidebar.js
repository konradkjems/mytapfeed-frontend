import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  IconButton,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assessment as AssessmentIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const drawerWidth = 240;
const closedDrawerWidth = 65;

const Sidebar = ({ open, toggleDrawer }) => {
  const location = useLocation();
  const { userData } = useAuth();
  const { t } = useLanguage();

  const menuItems = [
    {
      text: t('menu.dashboard'),
      icon: <DashboardIcon />,
      path: '/dashboard'
    },
    {
      text: t('menu.statistics'),
      icon: <AssessmentIcon />,
      path: '/statistics'
    },
    {
      text: t('menu.profile'),
      icon: <PersonIcon />,
      path: '/profile'
    }
  ];

  if (userData?.isAdmin) {
    menuItems.push({
      text: t('menu.admin'),
      icon: <AdminIcon />,
      path: '/admin'
    });
  }

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? drawerWidth : closedDrawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : closedDrawerWidth,
          boxSizing: 'border-box',
          whiteSpace: 'nowrap',
          overflowX: 'hidden',
          backgroundColor: 'primary.dark',
          transition: theme => theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
    >
      <Box sx={{ 
        height: 64, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'flex-end',
        pr: 1,
      }}>
        <IconButton 
          onClick={toggleDrawer}
          sx={{ color: 'white' }}
        >
          <MenuIcon />
        </IconButton>
      </Box>
      <List sx={{ mt: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                minHeight: 48,
                justifyContent: 'center',
                px: 2.5,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 0,
                  justifyContent: 'center',
                  color: 'white',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                sx={{ 
                  opacity: open ? 1 : 0,
                  color: 'white',
                  display: open ? 'block' : 'none',
                }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar; 