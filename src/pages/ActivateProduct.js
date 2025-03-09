import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress, Typography, Button } from '@mui/material';

const ActivateProduct = () => {
  const { standerId } = useParams();
  const { userData, login } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const activateProduct = async () => {
      try {
        if (!userData) {
          // Gem standerId i localStorage mens brugeren logger ind
          localStorage.setItem('pendingActivation', standerId);
          return;
        }

        const response = await fetch(`${API_URL}/api/stands/activate/${standerId}`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });

        if (!response.ok) {
          throw new Error('Kunne ikke aktivere produkt');
        }

        // Fjern pending activation
        localStorage.removeItem('pendingActivation');
        navigate('/dashboard');
      } catch (error) {
        console.error('Fejl ved aktivering:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    activateProduct();
  }, [userData, standerId, navigate]);

  if (!userData) {
    return (
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Typography variant="h5" gutterBottom>
          Du skal logge ind for at aktivere produktet
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            const currentUrl = window.location.href;
            login(null, null, currentUrl); // Redirect tilbage efter login
          }}
        >
          Log ind
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <CircularProgress />
        <Typography variant="body1" style={{ marginTop: '1rem' }}>
          Aktiverer produkt...
        </Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Typography variant="h5" color="error" gutterBottom>
          Der opstod en fejl
        </Typography>
        <Typography variant="body1">
          {error}
        </Typography>
      </div>
    );
  }

  return null;
};

export default ActivateProduct; 