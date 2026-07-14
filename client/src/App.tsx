import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';
import { VerifyEmail } from './pages/Auth/VerifyEmail';
import { ForgotPassword } from './pages/Auth/ForgotPassword';
import { VerifyOtp } from './pages/Auth/VerifyOtp';
import { ResetPassword } from './pages/Auth/ResetPassword';

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

      {/* 🔄 Fallback Catch-All Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};


export default App;