import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/MapPage';
import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';
import { VerifyEmail } from './pages/Auth/VerifyEmail';
import { ForgotPassword } from './pages/Auth/ForgotPassword';
import { VerifyOtp } from './pages/Auth/VerifyOtp';
import { ResetPassword } from './pages/Auth/ResetPassword';
import { SosPage } from './pages/SosPage';
import { FeedPage } from './pages/FeedPage';
import { ReportPage } from './pages/ReportPage';
import { ProfilePage } from './pages/ProfilePage';

export const App: React.FC = () => {
  return (
    <Routes>
      {/* 🟢 Public Landing Interface */}
      <Route path="/" element={<Home />} />

      {/* 🔑 Secure Portal Terminal Interface Access Links */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* 🔐 Password Recovery Flow */}
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Main pages */}
      <Route path="/sos" element={<SosPage />} />
      <Route path="/feed" element={<FeedPage />} />
      <Route path="/report" element={<ReportPage />} />
      <Route path="/profile" element={<ProfilePage />} />

      {/* 🔄 Fallback Catch-All Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};


export default App;