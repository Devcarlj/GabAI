import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { Mail, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

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
        const axiosErr = err as any;
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
            <Mail style={{ width: '24px', height: '24px', color: '#D0FD1B' }} />
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
            Forgot Password
          </h1>
          <p style={{ fontSize: '13px', color: '#A1A1AA', margin: 0 }}>
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
                color: '#D4D4D8',
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
                backgroundColor: '#09090B',
                border: '1px solid #3F3F46',
                color: '#FFFFFF',
                padding: '12px 16px',
                borderRadius: '10px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box' as const,
              }}
              onFocus={(e) => (e.target.style.borderColor = '#D0FD1B')}
              onBlur={(e) => (e.target.style.borderColor = '#3F3F46')}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || !email}
            style={{
              width: '100%',
              backgroundColor: isLoading || !email ? '#A1A1AA' : '#FFFFFF',
              color: '#09090B',
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
            onMouseEnter={(e) => { if (!isLoading && email) e.currentTarget.style.backgroundColor = '#D0FD1B'; }}
            onMouseLeave={(e) => { if (!isLoading && email) e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
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

export default ForgotPassword;
