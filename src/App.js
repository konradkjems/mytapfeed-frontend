import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Statistics from './components/Statistics';
import RequestReset from './components/RequestReset';
import ResetPassword from './components/ResetPassword';
import LandingPages from './components/LandingPages';
import LandingPageView from './components/LandingPageView';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/request-reset" element={<RequestReset />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/landing-pages/view/:id" element={<LandingPageView />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/statistics"
              element={
                <PrivateRoute>
                  <Statistics />
                </PrivateRoute>
              }
            />
            <Route
              path="/landing-pages"
              element={
                <PrivateRoute>
                  <LandingPages />
                </PrivateRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
