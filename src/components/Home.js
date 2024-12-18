import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/tapfeed logo white wide transparent.svg';

function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div style={{ 
      padding: '20px', 
      textAlign: 'center',
      backgroundColor: '#001F3F',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <img 
        src={logo} 
        alt="TapFeed Logo" 
        style={{ 
          maxWidth: '80%',
          width: '400px',
          marginBottom: '40px'
        }} 
      />
      <div style={{ marginTop: '20px' }}>
        <Link 
          to="/login" 
          style={{ 
            marginRight: '20px',
            color: 'white',
            textDecoration: 'none',
            padding: '10px 20px',
            border: '2px solid white',
            borderRadius: '5px',
            transition: 'all 0.3s ease'
          }}
        >
          Log ind
        </Link>
        <Link 
          to="/register"
          style={{ 
            color: 'white',
            textDecoration: 'none',
            padding: '10px 20px',
            border: '2px solid white',
            borderRadius: '5px',
            transition: 'all 0.3s ease'
          }}
        >
          Registrer
        </Link>
      </div>
    </div>
  );
}

export default Home;