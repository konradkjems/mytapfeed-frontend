import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    Grid,
    Divider,
    Stack
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import logo from '../assets/tapfeed logo white wide transparent.svg';
import googleIcon from '../assets/google.svg';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import API_URL from '../config';

const defaultTheme = createTheme({
  typography: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
  },
  palette: {
    primary: {
      main: '#001F3F',
    },
    secondary: {
      main: '#2C4B6E',
    },
  },
});

const Register = () => {
    const navigate = useNavigate();
    const { setIsAuthenticated } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError('Adgangskoderne matcher ikke');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (response.ok) {
                setIsAuthenticated(true);
                navigate('/dashboard');
            } else {
                setError(data.message || 'Der opstod en fejl under registrering');
            }
        } catch (error) {
            console.error('Registreringsfejl:', error);
            setError('Der opstod en fejl under registrering. Prøv igen.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${API_URL}/auth/google`;
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid container sx={{ height: '100vh' }}>
                {/* Logo side */}
                <Grid
                    item
                    xs={12}
                    sm={6}
                    sx={{
                        backgroundColor: '#001F3F',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <img
                        src={logo}
                        alt="TapFeed Logo"
                        style={{
                            width: '50%',
                            maxWidth: '300px'
                        }}
                    />
                </Grid>

                {/* Register form side */}
                <Grid
                    item
                    xs={12}
                    sm={6}
                    sx={{
                        backgroundColor: 'white',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px'
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            maxWidth: '400px',
                            width: '100%'
                        }}
                    >
                        <LockOutlinedIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                        <Typography component="h1" variant="h5" sx={{ color: 'primary.main', mb: 3 }}>
                            Opret konto
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mb: 3 }}>
                            {error && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {error}
                                </Alert>
                            )}
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Brugernavn"
                                name="username"
                                autoComplete="username"
                                autoFocus
                                value={formData.username}
                                onChange={handleChange}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: 'primary.main',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'primary.main',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'primary.main',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'primary.main',
                                    },
                                    '& .MuiOutlinedInput-input': {
                                        color: 'primary.main',
                                    },
                                }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email"
                                name="email"
                                autoComplete="email"
                                value={formData.email}
                                onChange={handleChange}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: 'primary.main',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'primary.main',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'primary.main',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'primary.main',
                                    },
                                    '& .MuiOutlinedInput-input': {
                                        color: 'primary.main',
                                    },
                                }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Adgangskode"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                value={formData.password}
                                onChange={handleChange}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: 'primary.main',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'primary.main',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'primary.main',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'primary.main',
                                    },
                                    '& .MuiOutlinedInput-input': {
                                        color: 'primary.main',
                                    },
                                }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="confirmPassword"
                                label="Bekræft adgangskode"
                                type="password"
                                id="confirmPassword"
                                autoComplete="new-password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: 'primary.main',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'primary.main',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'primary.main',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'primary.main',
                                    },
                                    '& .MuiOutlinedInput-input': {
                                        color: 'primary.main',
                                    },
                                }}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="outlined"
                                disabled={isLoading}
                                sx={{
                                    mt: 3,
                                    mb: 2,
                                    color: 'primary.main',
                                    borderColor: 'primary.main',
                                    '&:hover': {
                                        borderColor: 'primary.main',
                                        backgroundColor: 'rgba(0, 31, 63, 0.1)',
                                    },
                                }}
                            >
                                {isLoading ? 'Opretter konto...' : 'OPRET KONTO'}
                            </Button>
                        </Box>

                        <Divider sx={{ 
                            width: '100%', 
                            mb: 3,
                            color: 'primary.main',
                            '&::before, &::after': {
                                borderColor: 'primary.main',
                            }
                        }}>
                            ELLER
                        </Divider>

                        <Stack spacing={2} sx={{ width: '100%', mb: 3 }}>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleGoogleLogin}
                                startIcon={
                                    <img 
                                        src={googleIcon} 
                                        alt="Google" 
                                        style={{ 
                                            width: '20px', 
                                            height: '20px',
                                            marginRight: '8px' 
                                        }} 
                                    />
                                }
                                sx={{
                                    backgroundColor: '#fff',
                                    color: '#000',
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    fontSize: '16px',
                                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                                    border: '1px solid #dadce0',
                                    '&:hover': {
                                        backgroundColor: '#f5f5f5',
                                        boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.15)',
                                    },
                                }}
                            >
                                Fortsæt med Google
                            </Button>
                        </Stack>

                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            mt: 2
                        }}>
                            <Link
                                to="/login"
                                style={{
                                    color: '#001F3F',
                                    textDecoration: 'none'
                                }}
                            >
                                Har du allerede en konto? Log ind
                            </Link>
                        </Box>
                        <Typography 
                            variant="body2" 
                            color="primary.main" 
                            align="center" 
                            sx={{ mt: 5 }}
                        >
                            Copyright © TapFeed {new Date().getFullYear()}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
};

export default Register;
