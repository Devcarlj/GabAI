import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { ShieldCheck, ShieldAlert, Mail, Loader2, Terminal } from 'lucide-react';

type VerifyState = 'pending' | 'verifying' | 'success' | 'error';

export const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  const email = searchParams.get('email');
  const [state, setState] = useState<VerifyState>('pending');
  const [message, setMessage] = useState('');
  const hasVerified = useRef(false);

  useEffect(() => {
    // If code exists and is not a placeholder, verify it
    if (code && code !== 'pending' && !hasVerified.current) {
      hasVerified.current = true;
      verifyEmail(code);
    }
  }, [code]);

  const verifyEmail = async (verificationCode: string) => {
    setState('verifying');
    try {
      const response = await axiosInstance.post('/auth/verify-email', {
        code: verificationCode
      });

      if (response.data?.success) {
        setState('success');
        setMessage(response.data.message || 'Email verified successfully.');
      } else {
        setState('error');
        setMessage(response.data?.message || 'Verification failed.');
      }
    } catch (err: unknown) {
      setState('error');
      if (err && typeof err === 'object' && 'isAxiosError' in err) {
        const axiosErr = err as any;
        setMessage(axiosErr.response?.data?.message || 'Verification request failed.');
      } else {
        setMessage('Verification request failed. Please try again.');
      }
    }
  };

  // "Check your email" screen — shown after registration
  if (!code || code === 'pending') {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4 selection:bg-brand-teal selection:text-brand-dark">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-brand-teal/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md bg-brand-surface border border-brand-border rounded-2xl p-8 shadow-2xl relative z-10">
          <div className="flex flex-col items-center text-center">
            {/* Animated mail icon */}
            <div className="w-16 h-16 bg-brand-dark border border-brand-teal/30 rounded-2xl flex items-center justify-center mb-6 relative">
              <Mail className="w-7 h-7 text-brand-teal" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-brand-teal rounded-full flex items-center justify-center">
                <span className="text-[8px] font-bold text-brand-dark">1</span>
              </div>
            </div>

            <h1 className="text-xl font-bold tracking-wider text-white uppercase mb-2">
              Verification Dispatched
            </h1>
            <p className="text-xs text-brand-muted tracking-widest uppercase mb-6">
              Email Confirmation Required
            </p>

            <div className="w-12 h-px bg-brand-border mb-6" />

            <p className="text-sm text-brand-muted leading-relaxed mb-2">
              A verification link has been transmitted to
            </p>
            {email && (
              <p className="text-sm text-white font-mono bg-brand-dark border border-brand-border rounded-lg px-4 py-2 mb-6">
                {email}
              </p>
            )}
            <p className="text-xs text-brand-muted leading-relaxed mb-8">
              Open the email and click the verification button to activate your Command Center terminal access. The link will remain active until used.
            </p>

            <Link
              to="/login"
              className="w-full bg-white hover:bg-brand-teal text-brand-dark font-bold text-sm tracking-wide uppercase py-3.5 rounded-xl transition-colors duration-300 flex items-center justify-center gap-2 group"
            >
              <span>Return to Login Terminal</span>
              <Terminal className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <p className="text-[11px] text-zinc-600 mt-6">
              Didn't receive the email? Check spam folder or register again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Verifying state
  if (state === 'verifying') {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-brand-surface border border-brand-border rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-brand-dark border border-brand-border rounded-2xl flex items-center justify-center mb-6">
              <Loader2 className="w-7 h-7 text-brand-teal animate-spin" />
            </div>
            <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-2">
              Verifying Credentials
            </h2>
            <p className="text-xs text-brand-muted tracking-widest uppercase">
              Processing Authorization Token
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (state === 'success') {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4 selection:bg-brand-teal selection:text-brand-dark">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-brand-teal/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md bg-brand-surface border border-brand-border rounded-2xl p-8 shadow-2xl relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-brand-dark border border-brand-teal/40 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-8 h-8 text-brand-teal" />
            </div>

            <h1 className="text-xl font-bold tracking-wider text-white uppercase mb-2">
              Terminal Verified
            </h1>
            <p className="text-xs text-brand-muted tracking-widest uppercase mb-6">
              Account Authorization Complete
            </p>

            <div className="w-full bg-emerald-950/30 border border-emerald-500/30 rounded-lg p-4 mb-8">
              <p className="text-sm text-emerald-400 font-mono">
                {message}
              </p>
            </div>

            <Link
              to="/login"
              className="w-full bg-white hover:bg-brand-teal text-brand-dark font-bold text-sm tracking-wide uppercase py-3.5 rounded-xl transition-colors duration-300 flex items-center justify-center gap-2 group"
            >
              <span>Proceed to Login Terminal</span>
              <Terminal className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4 selection:bg-brand-teal selection:text-brand-dark">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-brand-teal/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-brand-surface border border-brand-border rounded-2xl p-8 shadow-2xl relative z-10">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-brand-dark border border-red-500/30 rounded-2xl flex items-center justify-center mb-6">
            <ShieldAlert className="w-8 h-8 text-red-400" />
          </div>

          <h1 className="text-xl font-bold tracking-wider text-white uppercase mb-2">
            Verification Failed
          </h1>
          <p className="text-xs text-brand-muted tracking-widest uppercase mb-6">
            Authorization Token Invalid
          </p>

          <div className="w-full bg-red-950/30 border border-red-500/30 rounded-lg p-4 mb-8">
            <p className="text-sm text-red-400 font-mono">
              {message}
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <Link
              to="/register"
              className="w-full bg-white hover:bg-brand-teal text-brand-dark font-bold text-sm tracking-wide uppercase py-3.5 rounded-xl transition-colors duration-300 flex items-center justify-center gap-2 group"
            >
              <span>Register New Account</span>
            </Link>
            <Link
              to="/login"
              className="w-full bg-brand-dark hover:bg-brand-border text-white font-bold text-sm tracking-wide uppercase py-3 rounded-xl transition-colors duration-300 border border-brand-border flex items-center justify-center"
            >
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
