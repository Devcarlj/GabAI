import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { KeyRound, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

export const VerifyOtp: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    const focusIdx = Math.min(pasted.length, 5);
    inputRefs.current[focusIdx]?.focus();
  };

  const otpString = otp.join('');
  const isComplete = otpString.length === 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isComplete) return;
    setError(null);
    setIsLoading(true);

    try {
      const response = await axiosInstance.post('/auth/verify-otp', {
        email,
        otp: otpString,
      });

      if (response.data?.error) {
        setError(response.data.message || 'Invalid OTP.');
        return;
      }

      if (response.data?.success) {
        navigate('/reset-password', { state: { email } });
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'isAxiosError' in err) {
        const axiosErr = err as any;
        setError(axiosErr.response?.data?.message || 'Verification failed.');
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
            <KeyRound style={{ width: '24px', height: '24px', color: '#D0FD1B' }} />
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
            Verify OTP
          </h1>
          <p style={{ fontSize: '13px', color: '#A1A1AA', margin: 0 }}>
            Enter the 6-digit code sent to <span style={{ color: '#D0FD1B' }}>{email}</span>
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
          {/* OTP Inputs */}
          <div
            style={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'center',
              marginBottom: '28px',
            }}
            onPaste={handlePaste}
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                style={{
                  width: '48px',
                  height: '56px',
                  textAlign: 'center',
                  fontSize: '22px',
                  fontWeight: 700,
                  backgroundColor: '#09090B',
                  border: `2px solid ${digit ? '#D0FD1B' : '#3F3F46'}`,
                  color: '#FFFFFF',
                  borderRadius: '10px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#D0FD1B')}
                onBlur={(e) => { if (!digit) e.target.style.borderColor = '#3F3F46'; }}
              />
            ))}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || !isComplete}
            style={{
              width: '100%',
              backgroundColor: isLoading || !isComplete ? '#A1A1AA' : '#FFFFFF',
              color: '#09090B',
              fontWeight: 700,
              fontSize: '14px',
              padding: '14px',
              borderRadius: '10px',
              border: 'none',
              cursor: isLoading || !isComplete ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background-color 0.2s',
              opacity: isLoading || !isComplete ? 0.6 : 1,
            }}
            onMouseEnter={(e) => { if (!isLoading && isComplete) e.currentTarget.style.backgroundColor = '#D0FD1B'; }}
            onMouseLeave={(e) => { if (!isLoading && isComplete) e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
          >
            {isLoading ? (
              <Loader2 style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} />
            ) : (
              <span>Verify Code</span>
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
            to="/forgot-password"
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
            Try different email
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

export default VerifyOtp;
