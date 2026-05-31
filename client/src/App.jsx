import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import Authentication from './pages/Authentication';
import ResetPassword from './pages/ResetPassword';
import PortfolioView from './pages/PortfolioView';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/authentication" element={<Authentication />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/u/:username" element={<PortfolioView />} />
          <Route path="/:username" element={<PortfolioView />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;