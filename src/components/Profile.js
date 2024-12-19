import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress
} from '@mui/material';
import {
  Key as KeyIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  AdminPanelSettings as AdminIcon,
  PhotoCamera as PhotoCameraIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import Layout from './Layout';
import API_URL from '../config';

const Profile = () => {
  const { userData, fetchUserData, error: authError, isLoading: authLoading } = useAuth();
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [isUploading, setIsUploading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setAlert({
        open: true,
        message: 'De nye adgangskoder matcher ikke',
        severity: 'error'
      });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/user/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      if (response.ok) {
        setAlert({
          open: true,
          message: 'Adgangskode ændret succesfuldt',
          severity: 'success'
        });
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Kunne ikke ændre adgangskode');
      }
    } catch (error) {
      setAlert({
        open: true,
        message: error.message || 'Der opstod en fejl ved ændring af adgangskode',
        severity: 'error'
      });
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`${API_URL}/user/profile-image`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Kunne ikke uploade billede');
      }
      
      await fetchUserData(); // Genindlæs brugerdata efter upload
      
      setAlert({
        open: true,
        message: 'Profilbillede opdateret succesfuldt',
        severity: 'success'
      });
    } catch (error) {
      console.error('Fejl ved upload:', error);
      setAlert({
        open: true,
        message: 'Der opstod en fejl ved upload af billede',
        severity: 'error'
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (authLoading) {
    return (
      <Layout title="Min Profil">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (authError) {
    return (
      <Layout title="Min Profil">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 4 }}>
          <ErrorIcon color="error" sx={{ fontSize: 60 }} />
          <Typography variant="h6" color="error">
            Der opstod en fejl
          </Typography>
          <Typography color="text.secondary">
            {authError}
          </Typography>
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
            sx={{ mt: 2 }}
          >
            Prøv igen
          </Button>
        </Box>
      </Layout>
    );
  }

  if (!userData) {
    return (
      <Layout title="Min Profil">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 4 }}>
          <ErrorIcon color="warning" sx={{ fontSize: 60 }} />
          <Typography variant="h6">
            Ingen brugerdata fundet
          </Typography>
          <Button
            variant="contained"
            onClick={() => fetchUserData()}
            sx={{ mt: 2 }}
          >
            Genindlæs data
          </Button>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout title="Min Profil">
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                  src={userData.profileImage}
                  sx={{ 
                    width: 150, 
                    height: 150, 
                    mb: 2,
                    mx: 'auto',
                    border: '4px solid',
                    borderColor: 'primary.main'
                  }}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                  id="profile-image-upload"
                  disabled={isUploading}
                />
                <label htmlFor="profile-image-upload">
                  <Button
                    component="span"
                    variant="contained"
                    disabled={isUploading}
                    sx={{ 
                      position: 'absolute',
                      bottom: 10,
                      right: -10,
                      minWidth: 'auto',
                      width: 40,
                      height: 40,
                      borderRadius: '50%'
                    }}
                  >
                    {isUploading ? <CircularProgress size={24} /> : <PhotoCameraIcon />}
                  </Button>
                </label>
              </Box>
              
              <Typography variant="h5" gutterBottom>
                {userData.username}
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Email"
                    secondary={userData.email}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CalendarIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Medlem siden"
                    secondary={new Date(userData.createdAt).toLocaleDateString('da-DK')}
                  />
                </ListItem>
                {userData.isAdmin && (
                  <ListItem>
                    <ListItemIcon>
                      <AdminIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Administrator"
                      secondary="Du har administratorrettigheder"
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Skift adgangskode
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <form onSubmit={handlePasswordChange}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Nuværende adgangskode"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({
                        ...passwordForm,
                        currentPassword: e.target.value
                      })}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Ny adgangskode"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value
                      })}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Bekræft ny adgangskode"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value
                      })}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      startIcon={<KeyIcon />}
                    >
                      Skift adgangskode
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert
          onClose={() => setAlert({ ...alert, open: false })}
          severity={alert.severity}
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default Profile; 