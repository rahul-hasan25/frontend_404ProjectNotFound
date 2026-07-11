'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Eye, EyeOff, Loader2, Cpu, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/utils/api';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [uid, setUid] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setUid(searchParams.get('uid'));
    setToken(searchParams.get('token'));
  }, [searchParams]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!uid || !token) {
      toast.error('Cryptographic signature missing from URL parameters.', {
        style: { border: '1px solid #fee2e2', padding: '16px', color: '#991b1b', borderRadius: '0px' },
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Security keys mismatch. Passwords must be identical.', {
        style: { border: '1px solid #fee2e2', padding: '16px', color: '#991b1b', borderRadius: '0px' },
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/auth/reset-password/', {
        uidb64: uid,
        token: token,
        password: password,
        confirm_password: confirmPassword
      });

      if (response.status === 200) {
        toast.success('New Password Upadated successfully!', {
          style: { border: '1px solid #e2e8f0', padding: '16px', color: '#0f172a', borderRadius: '0px' },
        });
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }
    } catch (err: any) {
      const errorData = err.response?.data;
      let errorMsg = 'Failed to rewrite master parameters.';
      if (errorData?.confirm_password) errorMsg = errorData.confirm_password[0];
      if (errorData?.token) errorMsg = errorData.token[0];
      
      toast.error(errorMsg, {
        style: { border: '1px solid #fee2e2', padding: '16px', color: '#991b1b', borderRadius: '0px' },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-105 bg-white border border-slate-200 p-8 md:p-10 shadow-[0_20px_50px_rgba(15,23,42,0.04)] relative z-10 transition-all duration-300">
      <div className="absolute top-0 left-0 right-0 h-0.75 bg-slate-950" />
      <div className="flex items-center gap-2 mb-8">
        <div className="flex items-center justify-center w-6 h-6 border border-slate-900 bg-slate-950 text-white">
          <Cpu className="w-3.5 h-3.5" />
        </div>
        <span className="font-semibold text-[10px] tracking-widest uppercase text-slate-900">
          404 Update Password
        </span>
      </div>

      <div className="mb-8">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight uppercase text-[18px] flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-slate-900" /> Reset Password
        </h1>
        <p className="text-xs text-slate-400 mt-2 leading-relaxed font-medium">
          Enter a new and confirm password to secure your account.
        </p>
      </div>

      <form onSubmit={handleResetPassword} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block pl-0.5">
            New Password
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-950 transition-colors">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <input type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="•••••••• (Min. 6 chars)" className="w-full pl-10 pr-11 py-3 bg-slate-50/50 border border-slate-200 text-slate-900 placeholder-slate-300 text-xs focus:outline-none focus:border-slate-950 focus:bg-white focus:ring-0 transition-all rounded-none"/>
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-950 transition-colors cursor-pointer">
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block pl-0.5">
            Confirm Password
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-950 transition-colors">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <input type={showPassword ? 'text' : 'password'} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 text-slate-900 placeholder-slate-300 text-xs focus:outline-none focus:border-slate-950 focus:bg-white focus:ring-0 transition-all rounded-none"/>
          </div>
        </div>

        <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center py-3 px-4 bg-slate-950 hover:bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest transition-all duration-150 disabled:opacity-50 rounded-none cursor-pointer mt-2 shadow-sm">
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            'Save New Password'
          )}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC] font-sans antialiased p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.4] bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-size-[32px_32px]" />
      <div className="absolute top-[-30%] left-[-20%] w-150 h-150 bg-blue-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-30%] right-[-20%] w-150 h-150 bg-slate-400/10 blur-[130px] rounded-full pointer-events-none" />

      <Suspense fallback={
        <div className="relative z-10 flex flex-col items-center gap-3 bg-white border border-slate-200 p-8 shadow-sm">
          <Loader2 className="w-6 h-6 animate-spin text-slate-950" />
          <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Validating Handshake...</span>
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}