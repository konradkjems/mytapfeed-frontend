import React, { useState, useEffect } from 'react';
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
  Error as ErrorIcon,
  Business as BusinessIcon,
  Google as GoogleIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import Layout from './Layout';
import API_URL from '../config';

const Settings = () => {
  const { userData, fetchUserData, error: authError, isLoading: authLoading } = useAuth();
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [isUploading, setIsUploading] = useState(false);
  const [profileImage, setProfileImage] = useState(userData?.profileImage);
  const [imageTimestamp, setImageTimestamp] = useState(Date.now());

  useEffect(() => {
    setProfileImage(userData?.profileImage);
    setImageTimestamp(Date.now());
  }, [userData]);

  const handleGoogleLogin = async () => {
    try {
      // Åbn Google OAuth vindue
      window.location.href = `${API_URL}/api/auth/google-business`;
    } catch (error) {
      setAlert({
        open: true,
        message: 'Der opstod en fejl ved login med Google',
        severity: 'error'
      });
    }
  };

  const handleGoogleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/google-business/logout`, {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        await fetchUserData();
        setAlert({
          open: true,
          message: 'Du er nu logget ud af Google My Business',
          severity: 'success'
        });
      } else {
        throw new Error('Kunne ikke logge ud af Google My Business');
      }
    } catch (error) {
      setAlert({
        open: true,
        message: error.message || 'Der opstod en fejl ved logout af Google',
        severity: 'error'
      });
    }
  };

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
      const response = await fetch(`${API_URL}/api/user/change-password`, {
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
      const response = await fetch(`${API_URL}/api/user/profile-image`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Kunne ikke uploade billede');
      }
      
      const responseData = await response.json();
      await fetchUserData();
      
      setProfileImage(responseData.user.profileImage);
      setImageTimestamp(Date.now());
      
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
      <Layout title="Indstillinger">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (authError) {
    return (
      <Layout title="Indstillinger">
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
      <Layout title="Indstillinger">
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
    <Layout title="Indstillinger">
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                  src={`${profileImage || userData?.profileImage}?t=${imageTimestamp}`}
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

          {/* Google My Business Integration */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Google My Business Integration
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {userData.googleAccessToken ? (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <BusinessIcon color="success" sx={{ mr: 1 }} />
                    <Typography color="success.main">
                      Forbundet med Google My Business
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleGoogleLogout}
                    startIcon={<GoogleIcon />}
                    fullWidth
                  >
                    Log ud af Google
                  </Button>
                </>
              ) : (
                <>
                  <Typography color="text.secondary" paragraph>
                    Forbind din Google My Business konto for at kunne se og svare på anmeldelser direkte fra dashboardet.
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={handleGoogleLogin}
                    startIcon={<GoogleIcon />}
                    fullWidth
                  >
                    Log ind med Google
                  </Button>
                </>
              )}
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

export default Settings; 