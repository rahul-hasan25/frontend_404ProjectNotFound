'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Loader2, ArrowLeft, ShieldCheck, Cpu } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/utils/api';

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleRequestLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post('/auth/forget-password/', { email });
      if (response.status === 200) {
        setIsSent(true);
        toast.success('Check your email to reset your password!', {
          style: { border: '1px solid #e2e8f0', padding: '16px', color: '#0f172a', borderRadius: '0px' },
        });
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.email?.[0] || err.response?.data?.error || 'Subsystem request failed.';
      toast.error(errorMsg, {
        style: { border: '1px solid #fee2e2', padding: '16px', color: '#991b1b', borderRadius: '0px' },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC] font-sans antialiased p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.4] bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-size-[32px_32px]" />
      <div className="absolute top-[-30%] left-[-20%] w-150 h-150 bg-blue-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-30%] right-[-20%] w-150 h-150 bg-slate-400/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="w-full max-w-105 bg-white border border-slate-200 p-8 md:p-10 shadow-[0_20px_50px_rgba(15,23,42,0.04)] relative z-10 transition-all duration-300">
        <div className="absolute top-0 left-0 right-0 h-0.75 bg-slate-950" />
        <div className="flex items-center gap-2 mb-8">
          <div className="flex items-center justify-center w-6 h-6 border border-slate-900 bg-slate-950 text-white">
            <Cpu className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-[10px] tracking-widest uppercase text-slate-900">
            404 Authentication
          </span>
        </div>

        {!isSent ? (
          <>
            <div className="mb-8">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight uppercase text-[18px]">
                Password Recovery
              </h1>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed font-medium">
                Enter your registered email. The system controller will transmit a temporary, cryptographic reset blueprint.
              </p>
            </div>

            <form onSubmit={handleRequestLink} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block pl-0.5">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-950 transition-colors">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@gmail.com" className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 text-slate-900 placeholder-slate-300 text-xs focus:outline-none focus:border-slate-950 focus:bg-white focus:ring-0 transition-all rounded-none"/>
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center py-3 px-4 bg-slate-950 hover:bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest transition-all duration-150 disabled:opacity-50 rounded-none cursor-pointer mt-2 shadow-sm">
                {isLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  'Get Verification Link'
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="py-4 space-y-5 text-center animate-fade-in">
            <div className="mx-auto w-12 h-12 border border-emerald-100 bg-emerald-50 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Transmission Success</h2>
              <p className="text-xs text-slate-400 leading-relaxed font-medium max-w-sm mx-auto">
                A verification link has been send to <span className="text-slate-900 font-bold break-all">{email}</span>. Open your email to update password.
              </p>
            </div>
          </div>
        )}

        <div className="text-center mt-8 pt-5 border-t border-slate-100">
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] text-slate-400 hover:text-slate-950 font-bold transition-colors uppercase tracking-widest">
            <ArrowLeft className="w-3 h-3" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}