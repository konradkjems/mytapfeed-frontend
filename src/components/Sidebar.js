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
  useTheme,
  AppBar,
  Toolbar,
  Typography,
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
  const theme = useTheme();

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
    <>
      <AppBar
        position="fixed"
        sx={{
          width: open ? `calc(100% - ${drawerWidth}px)` : `calc(100% - ${closedDrawerWidth}px)`,
          ml: open ? `${drawerWidth}px` : `${closedDrawerWidth}px`,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={toggleDrawer}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {menuItems.find(item => item.path === location.pathname)?.text || ''}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: open ? drawerWidth : closedDrawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : closedDrawerWidth,
            boxSizing: 'border-box',
            whiteSpace: 'nowrap',
            overflowX: 'hidden',
            backgroundColor: theme.palette.mode === 'dark' ? '#001e3c' : '#fff',
            borderRight: `1px solid ${theme.palette.divider}`,
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
        open={open}
      >
        <Box sx={{ height: 64 }} /> {/* Spacer for AppBar */}
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={RouterLink}
                to={item.path}
                selected={location.pathname === item.path}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : theme.palette.action.selected,
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.2)'
                        : theme.palette.action.hover,
                    },
                  },
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.1)'
                      : theme.palette.action.hover,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 0,
                    justifyContent: 'center',
                    color: theme.palette.mode === 'dark' ? 'white' : 'inherit',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ 
                    opacity: open ? 1 : 0,
                    color: theme.palette.mode === 'dark' ? 'white' : 'inherit',
                    display: open ? 'block' : 'none',
                  }} 
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar; 