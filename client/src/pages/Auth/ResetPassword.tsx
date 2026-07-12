import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { Lock, Eye, EyeOff, ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;
  const mismatch = confirmPassword && newPassword !== confirmPassword;
  const isValid = passwordsMatch && newPassword.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setError(null);
    setIsLoading(true);

    try {
      const response = await axiosInstance.patch('/auth/reset-password', {
        email,
        newPassword,
        confirmPassword,
      });

      if (response.data?.error) {
        setError(response.data.message || 'Failed to reset password.');
        return;
      }

      if (response.data?.success) {
        navigate('/login', { state: { passwordReset: true } });
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'isAxiosError' in err) {
        const axiosErr = err as any;
        setError(axiosErr.response?.data?.message || 'Failed to reset password.');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#09090B' }}>
      {/* Background glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(208,253,27,0.06) 0%, transparent 70%)',
          borderRadius: '50%',
        }}
      />

      <div
        className="w-full relative"
        style={{
          maxWidth: '420px',
          backgroundColor: '#18181B',
          border: '1px solid #27272A',
          borderRadius: '16px',
          padding: '40px 32px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#09090B',
              border: '1px solid #27272A',
              borderRadius: '12px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
            }}
          >
            <Lock style={{ width: '24px', height: '24px', color: '#D0FD1B' }} />
          </div>
          <h1
            style={{
              fontSize: '20px',
              fontWeight: 700,
              color: '#FFFFFF',
              letterSpacing: '1px',
              textTransform: 'uppercase' as const,
              margin: '0 0 4px 0',
            }}
          >
            Reset Password
          </h1>
          <p style={{ fontSize: '13px', color: '#A1A1AA', margin: 0 }}>
            Create a new secure password for your account
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              marginBottom: '20px',
              padding: '12px 16px',
              backgroundColor: 'rgba(127,29,29,0.3)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
            }}
          >
            <AlertCircle style={{ width: '16px', height: '16px', color: '#F87171', flexShrink: 0, marginTop: '1px' }} />
            <span style={{ fontSize: '13px', color: '#F87171', lineHeight: 1.4 }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* New Password */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: '#D4D4D8',
                marginBottom: '8px',
              }}
            >
              New Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                minLength={6}
                style={{
                  width: '100%',
                  backgroundColor: '#09090B',
                  border: '1px solid #3F3F46',
                  color: '#FFFFFF',
                  padding: '12px 44px 12px 16px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box' as const,
                }}
                onFocus={(e) => (e.target.style.borderColor = '#D0FD1B')}
                onBlur={(e) => (e.target.style.borderColor = '#3F3F46')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#71717A',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {showPassword ? <EyeOff style={{ width: '18px', height: '18px' }} /> : <Eye style={{ width: '18px', height: '18px' }} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: '#D4D4D8',
                marginBottom: '8px',
              }}
            >
              Confirm Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                minLength={6}
                style={{
                  width: '100%',
                  backgroundColor: '#09090B',
                  border: `1px solid ${mismatch ? '#EF4444' : '#3F3F46'}`,
                  color: '#FFFFFF',
                  padding: '12px 44px 12px 16px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box' as const,
                }}
                onFocus={(e) => (e.target.style.borderColor = mismatch ? '#EF4444' : '#D0FD1B')}
                onBlur={(e) => (e.target.style.borderColor = mismatch ? '#EF4444' : '#3F3F46')}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#71717A',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {showConfirmPassword ? <EyeOff style={{ width: '18px', height: '18px' }} /> : <Eye style={{ width: '18px', height: '18px' }} />}
              </button>
            </div>
            {/* Mismatch / Match indicator */}
            {confirmPassword && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
                {mismatch ? (
                  <>
                    <AlertCircle style={{ width: '14px', height: '14px', color: '#EF4444' }} />
                    <span style={{ fontSize: '12px', color: '#EF4444' }}>Passwords do not match</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 style={{ width: '14px', height: '14px', color: '#22C55E' }} />
                    <span style={{ fontSize: '12px', color: '#22C55E' }}>Passwords match</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || !isValid}
            style={{
              width: '100%',
              backgroundColor: isLoading || !isValid ? '#A1A1AA' : '#FFFFFF',
              color: '#09090B',
              fontWeight: 700,
              fontSize: '14px',
              padding: '14px',
              borderRadius: '10px',
              border: 'none',
              cursor: isLoading || !isValid ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background-color 0.2s',
              opacity: isLoading || !isValid ? 0.6 : 1,
            }}
            onMouseEnter={(e) => { if (!isLoading && isValid) e.currentTarget.style.backgroundColor = '#D0FD1B'; }}
            onMouseLeave={(e) => { if (!isLoading && isValid) e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
          >
            {isLoading ? (
              <Loader2 style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} />
            ) : (
              <span>Reset Password</span>
            )}
          </button>
        </form>

        {/* Back */}
        <div
          style={{
            marginTop: '28px',
            paddingTop: '20px',
            borderTop: '1px solid #27272A',
            textAlign: 'center',
          }}
        >
          <Link
            to="/login"
            style={{
              fontSize: '13px',
              color: '#A1A1AA',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#D0FD1B')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#A1A1AA')}
          >
            <ArrowLeft style={{ width: '14px', height: '14px' }} />
            Back to Sign In
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ResetPassword;