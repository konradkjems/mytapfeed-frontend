import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  styled,
  Switch,
  Box
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  AdminPanelSettings as AdminIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Web as WebIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import LogoWhite from '../assets/tapfeed logo white wide transparent.svg';
import LogoDark from '../assets/tapfeed logo dark wide transparent.svg';

const drawerWidth = 240;

const StyledDrawer = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const Sidebar = ({ open }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = useAuth();
  const { mode, toggleTheme } = useTheme();

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
      onClick: () => navigate('/dashboard')
    },
    {
      text: 'Landing Pages',
      icon: <WebIcon />,
      path: '/landing-pages',
      onClick: () => navigate('/landing-pages')
    },
    {
      text: 'Statistik',
      icon: <BarChartIcon />,
      path: '/statistics',
      onClick: () => navigate('/statistics')
    },
    {
      text: 'Indstillinger',
      icon: <SettingsIcon />,
      path: '/settings',
      onClick: () => navigate('/settings')
    }
  ];

  if (userData?.isAdmin) {
    menuItems.push({
      text: 'Admin Panel',
      icon: <AdminIcon />,
      path: '/admin',
      onClick: () => navigate('/admin')
    });
  }

  const handleThemeToggle = (event) => {
    event.stopPropagation();
    toggleTheme();
  };

  return (
    <StyledDrawer variant="permanent" open={open}>
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 56,
        maxHeight: 64
      }}>
        <img 
          src={mode === 'dark' ? LogoWhite : LogoDark} 
          alt="TapFeed Logo" 
          style={{ 
            maxWidth: open ? '80%' : '40px',
            height: 'auto',
            transition: 'max-width 0.2s ease-in-out'
          }} 
        />
      </Box>
      <Divider />
      <List component="nav">
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            selected={location.pathname === item.path}
            onClick={item.onClick}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
        <Divider sx={{ my: 1 }} />
        <ListItemButton onClick={handleThemeToggle}>
          <ListItemIcon>
            {mode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
          </ListItemIcon>
          <ListItemText primary={mode === 'dark' ? 'Mørk tema' : 'Lyst tema'} />
          <Switch
            edge="end"
            checked={mode === 'dark'}
            onChange={handleThemeToggle}
            onClick={(e) => e.stopPropagation()}
          />
        </ListItemButton>
      </List>
    </StyledDrawer>
  );
};

export default Sidebar; 