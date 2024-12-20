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
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Web as WebIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

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
      text: 'Min Profil',
      icon: <PersonIcon />,
      path: '/profile',
      onClick: () => navigate('/profile')
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