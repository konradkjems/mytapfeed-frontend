import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  CssBaseline,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useMediaQuery,
  useTheme as useMuiTheme,
  Tooltip,
} from '@mui/material';
import {
  Person as PersonIcon,
  Logout as LogoutIcon,
  AdminPanelSettings as AdminIcon,
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
  Language as LanguageIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [open, setOpen] = useState(true);
  const { userData, setIsAuthenticated } = useAuth();
  const theme = useMuiTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const { mode, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    try {
      const response = await fetch('http://localhost:3000/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      if (response.ok) {
        setIsAuthenticated(false);
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout fejl:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Sidebar 
        open={open}
        toggleDrawer={toggleDrawer}
      />
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
          pt: 9,
          px: 3,
        }}
      >
        <Box sx={{ 
          position: 'fixed', 
          right: 24, 
          top: 12,
          zIndex: theme.zIndex.drawer + 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <Tooltip title={language === 'da' ? 'Switch to English' : 'Skift til dansk'}>
            <IconButton 
              onClick={toggleLanguage}
              sx={{ 
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <LanguageIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={mode === 'dark' ? 'Skift til lyst tema' : 'Skift til mørkt tema'}>
            <IconButton 
              onClick={toggleTheme}
              sx={{ 
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              {mode === 'dark' ? <LightIcon /> : <DarkIcon />}
            </IconButton>
          </Tooltip>
          <Avatar
            src={userData?.profileImage}
            sx={{ 
              width: 40, 
              height: 40,
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8
              }
            }}
            onClick={handleClick}
          />
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                }
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={() => {
              handleClose();
              navigate('/profile');
            }}>
              <PersonIcon sx={{ mr: 2 }} />
              Min Profil
            </MenuItem>
            {userData?.isAdmin && (
              <MenuItem onClick={() => {
                handleClose();
                navigate('/admin');
              }}>
                <AdminIcon sx={{ mr: 2 }} />
                Admin Panel
              </MenuItem>
            )}
            <Divider />
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 2 }} />
              Log ud
            </MenuItem>
          </Menu>
        </Box>
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 