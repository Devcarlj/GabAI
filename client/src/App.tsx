import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";


const Home = lazy(() =>
  import("./pages/MapPage").then((module) => ({ default: module.Home })),
);
const Login = lazy(() =>
  import("./pages/Auth/Login").then((module) => ({ default: module.Login })),
);
const Register = lazy(() =>
  import("./pages/Auth/Register").then((module) => ({
    default: module.Register,
  })),
);
const VerifyEmail = lazy(() =>
  import("./pages/Auth/VerifyEmail").then((module) => ({
    default: module.VerifyEmail,
  })),
);
const ForgotPassword = lazy(() =>
  import("./pages/Auth/ForgotPassword").then((module) => ({
    default: module.ForgotPassword,
  })),
);
const VerifyOtp = lazy(() =>
  import("./pages/Auth/VerifyOtp").then((module) => ({
    default: module.VerifyOtp,
  })),
);
const ResetPassword = lazy(() =>
  import("./pages/Auth/ResetPassword").then((module) => ({
    default: module.ResetPassword,
  })),
);
const SosPage = lazy(() =>
  import("./pages/SosPage").then((module) => ({ default: module.SosPage })),
);
const FeedPage = lazy(() =>
  import("./pages/FeedPage").then((module) => ({ default: module.FeedPage })),
);
const ReportPage = lazy(() =>
  import("./pages/ReportPage").then((module) => ({
    default: module.ReportPage,
  })),
);
const ProfilePage = lazy(() =>
  import("./pages/ProfilePage").then((module) => ({
    default: module.ProfilePage,
  })),
);

// 2. Create a minimal loading fallback
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-[var(--theme-bg)] text-slate-400">
    <span className="font-mono text-xs tracking-widest uppercase">
      Loading Triage Protocol...
    </span>
  </div>
);

export const App: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/sos" element={<SosPage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default App;
