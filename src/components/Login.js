import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Link,
  Alert,
  CircularProgress
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        setIsAuthenticated(true);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Der opstod en fejl ved login');
      }
    } catch (error) {
      console.error('Login fejl:', error);
      setError('Der opstod en fejl ved login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        p: 3
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: '400px',
          width: '100%'
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom align="center">
          Log ind
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={onSubmit}>
          <TextField
            fullWidth
            label="Brugernavn"
            variant="outlined"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
          />
          <TextField
            fullWidth
            label="Adgangskode"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Log ind'}
          </Button>
        </form>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Link
            component={RouterLink}
            to="/forgot-password"
            variant="body2"
            sx={{ display: 'block', mb: 1 }}
          >
            Glemt adgangskode?
          </Link>
          <Link
            component={RouterLink}
            to="/register"
            variant="body2"
          >
            Har du ikke en konto? Opret dig her
          </Link>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
