import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Button,
  TextField,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import Layout from './Layout';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import API_URL from '../config';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_URL}/user/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        updateUser(updatedUser);
        setSuccess(t('profile.updateSuccess'));
        setIsEditing(false);
      } else {
        const data = await response.json();
        setError(data.message || t('profile.updateError'));
      }
    } catch (err) {
      setError(t('profile.updateError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout title={t('profile.title')}>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Avatar
                src={user?.picture}
                alt={user?.name}
                sx={{ width: 100, height: 100, mr: 3 }}
              />
              <Box>
                <Typography variant="h4" gutterBottom>
                  {user?.name}
                </Typography>
                <Typography color="textSecondary">
                  {user?.email}
                </Typography>
                {user?.isAdmin && (
                  <Typography color="primary" sx={{ mt: 1 }}>
                    {t('profile.adminStatus')}
                  </Typography>
                )}
              </Box>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('profile.name')}
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('profile.email')}
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                      <Button
                        variant="outlined"
                        onClick={() => setIsEditing(false)}
                        disabled={isLoading}
                      >
                        {t('profile.cancel')}
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <CircularProgress size={24} />
                        ) : (
                          t('profile.save')
                        )}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  onClick={() => setIsEditing(true)}
                >
                  {t('profile.edit')}
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Profile; 