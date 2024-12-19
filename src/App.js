import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { CategoryProvider } from './context/CategoryContext';
import { Analytics } from '@vercel/analytics/react';
import AppRoutes from './AppRoutes';
import { CssBaseline } from '@mui/material';
import Dashboard from './components/Dashboard';
import Login from './components/Login';

function App() {
  console.log('App rendering'); // Debug log
  return (
    <Router>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <CategoryProvider>
              <CssBaseline />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <React.Suspense fallback={<div>Indlæser...</div>}>
                      <Dashboard />
                    </React.Suspense>
                  } 
                />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Routes>
              <Analytics />
            </CategoryProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
