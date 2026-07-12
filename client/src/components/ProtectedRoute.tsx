import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  // Optional array of allowed roles. If empty, any authenticated user can enter.
  allowedRoles?: ('USER' | 'ADMIN' | 'SUPERADMIN')[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // 1. System is verifying credentials; display a high-contrast terminal loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center gap-3 font-mono">
        <Loader2 className="w-8 h-8 text-[#D0FD1B] animate-spin" />
        <p className="text-xs text-zinc-500 uppercase tracking-widest animate-pulse">
          Authenticating Terminal Access...
        </p>
      </div>
    );
  }

  // 2. User is not authenticated; redirect to terminal login while preserving intent path
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. User account is compromised or locked out from the triage network
  if (user.status === 'Suspended' || user.status === 'Inactive') {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center p-4 font-mono">
        <div className="max-w-md w-full bg-[#18181B] border border-red-950/40 p-6 rounded-xl text-center shadow-xl">
          <h1 className="text-red-500 font-bold text-sm tracking-wide uppercase mb-2">
            Terminal Access Revoked
          </h1>
          <p className="text-xs text-zinc-400 leading-relaxed mb-4">
            Your network account profile status is currently listed as <span className="text-red-400 font-bold">{user.status}</span>. Contact a Super Admin system node for clearance adjustments.
          </p>
          <Navigate to="/login" replace />
        </div>
      </div>
    );
  }

  // 4. Role-check guard; user lacks sufficient clearance metrics for this layout branch
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 5. Clearance confirmed; render guarded route nodes
  return <>{children}</>;
};