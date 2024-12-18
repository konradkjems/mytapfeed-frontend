import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/700.css';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('theme');
    return savedMode || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = createTheme({
    typography: {
      fontFamily: 'Inter, sans-serif',
      h1: {
        fontFamily: 'Inter, sans-serif',
      },
      h2: {
        fontFamily: 'Inter, sans-serif',
      },
      h3: {
        fontFamily: 'Inter, sans-serif',
      },
      h4: {
        fontFamily: 'Inter, sans-serif',
      },
      h5: {
        fontFamily: 'Inter, sans-serif',
      },
      h6: {
        fontFamily: 'Inter, sans-serif',
      },
      subtitle1: {
        fontFamily: 'Inter, sans-serif',
      },
      subtitle2: {
        fontFamily: 'Inter, sans-serif',
      },
      body1: {
        fontFamily: 'Inter, sans-serif',
      },
      body2: {
        fontFamily: 'Inter, sans-serif',
      },
      button: {
        fontFamily: 'Inter, sans-serif',
        textTransform: 'none',
      },
      caption: {
        fontFamily: 'Inter, sans-serif',
      },
      overline: {
        fontFamily: 'Inter, sans-serif',
      },
    },
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            primary: {
              main: '#001F3F',
            },
            background: {
              default: '#f5f5f5',
              paper: '#ffffff',
            },
          }
        : {
            primary: {
              main: '#90caf9',
            },
            background: {
              default: '#001F3F',
              paper: 'rgba(255, 255, 255, 0.1)',
            },
          }),
    },
  });

  const value = {
    mode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}; 