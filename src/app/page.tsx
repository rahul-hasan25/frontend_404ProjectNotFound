'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, Mail, Lock, Eye, EyeOff, Loader2, CheckCircle2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/utils/api';
import Cookies from 'js-cookie';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post('api/auth/login/', { 
        username: email,
        email   : email,
        password: password 
      });
      
      if (response.status === 200) {
        const { access, refresh } = response.data;
        
        Cookies.set('access_token', access, { expires: 1 / 24, secure: true, sameSite: 'none' }); // 1 hour expiration
        Cookies.set('refresh_token', refresh, { expires: 7, secure: true, sameSite: 'none' });

        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);

        toast.success('Login Successful!', {
          style: { border: '1px solid #e2e8f0', padding: '16px', color: '#0f172a', borderRadius: '0px' },
        });
        
        setTimeout(() => {
          window.location.href = '/tasks';
        }, 1000);
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Authentication failed. Access Denied.';
      toast.error(errorMsg, {
        style: { border: '1px solid #fee2e2', padding: '16px', color: '#991b1b', borderRadius: '0px' },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#FAFBFD] font-sans antialiased overflow-hidden">
      <div className="hidden lg:flex lg:col-span-5 relative bg-slate-900 overflow-hidden flex-col justify-between p-12 text-white">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-size-[24px_24px]" />
        <div className="absolute top-[-20%] left-[-20%] w-125 h-125 rounded-full bg-blue-500/20 blur-[100px]" />
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 shadow-lg shadow-blue-600/30">
            <LogIn className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-linear-to-r from-white to-slate-300 bg-clip-text text-transparent">
            404 Project Not Found
          </span>
        </div>

        <div className="relative z-10 my-auto max-w-sm space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-400">
            <Sparkles className="w-3.5 h-3.5" /> Core Feature Enabled
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white leading-tight">
            Manage tasks and annotate assets in one unified platform.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Boost your productivity with our intuitive Kanban board and advanced pixel-perfect image annotation tools.
          </p>
          
          <ul className="space-y-3 pt-2 text-sm text-slate-300">
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Dynamic Date-Filtered Kanban
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Precision Polygon Annotation
            </li>
          </ul>
        </div>

        <div className="relative z-10 text-xs text-slate-500">
          © 2026 404 Workspace. All rights reserved.
        </div>
      </div>

      <div className="col-span-1 lg:col-span-7 flex items-center justify-center p-6 md:p-12 relative bg-linear-to-tr from-slate-50 via-white to-blue-50/30">
        <div className="absolute top-[-10%] right-[-10%] w-100 h-100 bg-blue-200/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[10%] w-87.5 h-87.5 bg-indigo-100/30 rounded-full blur-[100px] pointer-events-none" />
        <div className="w-full max-w-110 bg-white/80 backdrop-blur-md border border-white/80 p-8 md:p-10 rounded-none shadow-[0_20px_50px_rgba(15,23,42,0.04)] ring-1 ring-slate-200/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <div className="mb-8">
            <div className="flex lg:hidden items-center justify-center w-10 h-10 rounded-xl bg-blue-600 text-white shadow-sm mb-4">
              <LogIn className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Welcome back
            </h1>
            <p className="text-sm text-slate-500 mt-2 font-medium">
              Enter your credentials to access your secure workspace.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block pl-0.5">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="w-full pl-10 pr-4 py-3 bg-slate-50/60 border border-slate-200/80 rounded-none text-slate-900 placeholder-slate-400/80 text-sm focus:outline-none focus:border-blue-600/80 focus:bg-white focus:ring-4 focus:ring-blue-600/5 shadow-inner-sm transition-all"/>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-0.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block">
                  Password
                </label>
                <Link href="/forget-password" className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Lock className="w-4.5 h-4.5" />
                </div>
                <input type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-10 pr-11 py-3 bg-slate-50/60 border border-slate-200/80 rounded-none text-slate-900 placeholder-slate-400/80 text-sm focus:outline-none focus:border-blue-600/80 focus:bg-white focus:ring-4 focus:ring-blue-600/5 shadow-inner-sm transition-all"/>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors">
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center py-2.5 px-4 bg-slate-950 hover:bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest transition-all duration-150 disabled:opacity-50 mt-3 rounded-none cursor-pointer shadow-sm">
              {isLoading ? (
                <Loader2 className="w-4.5 h-4.5 animate-spin" />
              ) : (
                <span className="flex items-center gap-2 tracking-wide">
                  Sign In to Platform <LogIn className="w-4 h-4" />
                </span>
              )}
            </button>
          </form>
          
          <div className="text-center mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-500 font-medium tracking-wide mb-3">
              Do you have any User Account?{' '}
              <Link href="/signup" className="text-slate-900 hover:underline font-bold transition-colors">
                SignUp
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}