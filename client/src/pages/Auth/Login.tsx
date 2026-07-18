import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { AuthContext } from '../../context/AuthContext';
import { Shield, Eye, EyeOff, LogIn, Loader2, AlertCircle } from 'lucide-react';
import type { AxiosError } from 'axios';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await axiosInstance.post('/auth/login', {
        email,
        password
      });

      if (response.data?.error) {
        setError(response.data.message || 'Login failed. Please try again.');
        return;
      }

      if (response.data?.success) {
        await authContext?.checkAuthStatus();
        navigate('/');
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'isAxiosError' in err) {
        const axiosErr = err as AxiosError<{ message?: string }>;
        setError(axiosErr.response?.data?.message || 'Login failed. Please check your credentials.');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--theme-bg)' }}>
      {/* Background glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(255,60,49,0.06) 0%, transparent 70%)',
          borderRadius: '50%',
        }}
      />

      <div
        className="w-full relative"
        style={{
          maxWidth: '420px',
          backgroundColor: 'var(--theme-surface)',
          border: '1px solid var(--theme-border)',
          borderRadius: '16px',
          padding: '40px 32px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
        }}
      >
        {/* Logo / Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'var(--theme-bg)',
              border: '1px solid var(--theme-border)',
              borderRadius: '12px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
            }}
          >
            <Shield style={{ width: '24px', height: '24px', color: 'var(--theme-accent)' }} />
          </div>
          <h1
            style={{
              fontSize: '20px',
              fontWeight: 700,
              color: 'var(--theme-text)',
              letterSpacing: '1px',
              textTransform: 'uppercase' as const,
              margin: '0 0 4px 0',
            }}
          >
            Welcome Back
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--theme-text-muted)', margin: 0 }}>
            Sign in to your account to continue
          </p>
        </div>

        {/* Error Message */}
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
          {/* Email */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--theme-text-secondary)',
                marginBottom: '8px',
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: '100%',
                backgroundColor: 'var(--theme-bg)',
                border: '1px solid var(--theme-input-border)',
                color: 'var(--theme-text)',
                padding: '12px 16px',
                borderRadius: '10px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box' as const,
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--theme-accent)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--theme-input-border)')}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--theme-text-secondary)',
                }}
              >
                Password
              </label>
              <Link
                to="/forgot-password"
                style={{
                  fontSize: '12px',
                  color: 'var(--theme-text-muted)',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--theme-accent)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--theme-text-muted)')}
              >
                Forgot password?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{
                  width: '100%',
                  backgroundColor: 'var(--theme-bg)',
                  border: '1px solid var(--theme-input-border)',
                  color: 'var(--theme-text)',
                  padding: '12px 44px 12px 16px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box' as const,
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--theme-accent)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--theme-input-border)')}
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
                  color: 'var(--theme-text-muted)',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {showPassword ? <EyeOff style={{ width: '18px', height: '18px' }} /> : <Eye style={{ width: '18px', height: '18px' }} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              backgroundColor: isLoading ? 'var(--theme-text-muted)' : 'var(--theme-text)',
              color: 'var(--theme-bg)',
              fontWeight: 700,
              fontSize: '14px',
              padding: '14px',
              borderRadius: '10px',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background-color 0.2s',
              opacity: isLoading ? 0.6 : 1,
            }}
            onMouseEnter={(e) => { if (!isLoading) e.currentTarget.style.backgroundColor = 'var(--theme-accent)'; }}
            onMouseLeave={(e) => { if (!isLoading) e.currentTarget.style.backgroundColor = 'var(--theme-text)'; }}
          >
            {isLoading ? (
              <Loader2 style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} />
            ) : (
              <>
                <span>Sign In</span>
                <LogIn style={{ width: '16px', height: '16px' }} />
              </>
            )}
          </button>
        </form>

        {/* Register Link */}
        <div
          style={{
            marginTop: '28px',
            paddingTop: '20px',
            borderTop: '1px solid var(--theme-border)',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '13px', color: 'var(--theme-text-muted)', margin: 0 }}>
            Don't have an account?{' '}
            <Link
              to="/register"
              style={{
                color: 'var(--theme-text)',
                fontWeight: 600,
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--theme-accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--theme-text)')}
            >
              Register here
            </Link>
          </p>
        </div>
      </div>

      {/* Spin keyframe for loader */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};