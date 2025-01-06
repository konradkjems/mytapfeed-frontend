import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import Settings from './components/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import Admin from './components/Admin';
import Statistics from './components/Statistics';
import RequestReset from './components/RequestReset';
import ResetPassword from './components/ResetPassword';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import LandingPages from './components/LandingPages';
import LandingPageView from './components/LandingPageView';
import ClaimProduct from './components/ClaimProduct';
import NotConfigured from './components/NotConfigured';
import Unclaimed from './components/Unclaimed';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset-password" element={<RequestReset />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/statistics" element={
                <ProtectedRoute>
                  <Statistics />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } />
              <Route path="/landing-pages" element={
                <ProtectedRoute>
                  <LandingPages />
                </ProtectedRoute>
              } />
              <Route path="/landing/:id" element={<LandingPageView />} />
              <Route path="/claim/:standerId" element={<ClaimProduct />} />
              <Route path="/unclaimed/:standerId" element={<Unclaimed />} />
              <Route path="/not-configured/:standerId" element={<NotConfigured />} />
              <Route path="/:urlPath" element={<LandingPageView />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
