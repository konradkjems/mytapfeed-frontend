import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import RedirectHandler from './components/RedirectHandler';
import Pricing from './components/Pricing';
import About from './components/About';
import Contact from './components/Contact';
import Navigation from './components/Navigation';

const NavigationWrapper = () => {
  const location = useLocation();
  const publicPaths = ['/', '/login', '/register', '/pricing', '/about', '/contact', '/reset-password'];
  
  const shouldShowNavigation = publicPaths.includes(location.pathname) || 
    location.pathname.startsWith('/reset-password/');

  return shouldShowNavigation ? <Navigation /> : null;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <NavigationWrapper />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/reset-password" element={<RequestReset />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              
              {/* Product status routes */}
              <Route path="/unclaimed/:standerId" element={<Unclaimed />} />
              <Route path="/not-configured/:standerId" element={<NotConfigured />} />
              <Route path="/claim/:standerId" element={<ClaimProduct />} />
              
              {/* Protected routes */}
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
              
              {/* Landing page routes */}
              <Route path="/landing/:id" element={<LandingPageView />} />
              
              {/* Product redirect handler - skal være før catch-all routen */}
              <Route path="/:standerId([A-Z0-9]+)" element={<RedirectHandler />} />
              
              {/* Catch-all route for custom landing page URLs */}
              <Route path="/:urlPath" element={<LandingPageView />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
