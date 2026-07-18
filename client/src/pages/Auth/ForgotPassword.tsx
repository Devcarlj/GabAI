import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { Mail, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import type { AxiosError } from 'axios';

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await axiosInstance.post('/auth/forgot-password', { email });

      if (response.data?.error) {
        setError(response.data.message || 'Something went wrong.');
        return;
      }

      if (response.data?.success) {
        navigate('/verify-otp', { state: { email } });
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'isAxiosError' in err) {
        const axiosErr = err as AxiosError<{ message?: string }>;
        setError(axiosErr.response?.data?.message || 'Failed to send OTP. Please try again.');
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
        {/* Header */}
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
            <Mail style={{ width: '24px', height: '24px', color: 'var(--theme-accent)' }} />
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
            Forgot Password
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--theme-text-muted)', margin: 0 }}>
            Enter your email and we'll send you a recovery OTP
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
          {/* Email */}
          <div style={{ marginBottom: '24px' }}>
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

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || !email}
            style={{
              width: '100%',
              backgroundColor: isLoading || !email ? 'var(--theme-text-muted)' : 'var(--theme-text)',
              color: 'var(--theme-bg)',
              fontWeight: 700,
              fontSize: '14px',
              padding: '14px',
              borderRadius: '10px',
              border: 'none',
              cursor: isLoading || !email ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background-color 0.2s',
              opacity: isLoading || !email ? 0.6 : 1,
            }}
            onMouseEnter={(e) => { if (!isLoading && email) e.currentTarget.style.backgroundColor = 'var(--theme-accent)'; }}
            onMouseLeave={(e) => { if (!isLoading && email) e.currentTarget.style.backgroundColor = 'var(--theme-text)'; }}
          >
            {isLoading ? (
              <Loader2 style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} />
            ) : (
              <span>Send Recovery OTP</span>
            )}
          </button>
        </form>

        {/* Back to Login */}
        <div
          style={{
            marginTop: '28px',
            paddingTop: '20px',
            borderTop: '1px solid var(--theme-border)',
            textAlign: 'center',
          }}
        >
          <Link
            to="/login"
            style={{
              fontSize: '13px',
              color: 'var(--theme-text-muted)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--theme-accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--theme-text-muted)')}
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

export default ForgotPassword;