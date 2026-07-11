'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, Loader2, User, Cpu, UploadCloud } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/utils/api';

export default function SignupPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.', {
        style: { border: '1px solid #fee2e2', padding: '14px', color: '#991b1b', borderRadius: '0px' },
      });
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('full_name', fullName);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('confirm_password', confirmPassword);
    
    if (selectedImage) {
      formData.append('profile_picture', selectedImage);
    }

    try {
      const response = await api.post('/auth/signup/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        toast.success('Registration successful!', {
          style: { border: '1px solid #e2e8f0', padding: '14px', color: '#0f172a', borderRadius: '0px' },
        });
        
        setTimeout(() => {
          router.push('/');
        }, 1500);
      }
    } catch (err: any) {
      const errorData = err.response?.data;
      let errorMsg = 'Registration failed. Please check your inputs.';
      
      if (errorData) {
        if (errorData.email) errorMsg = errorData.email[0];
        else if (errorData.password) errorMsg = `Password: ${errorData.password[0]}`;
        else if (errorData.confirm_password) errorMsg = errorData.confirm_password[0];
        else if (errorData.profile_picture) errorMsg = `Avatar: ${errorData.profile_picture[0]}`;
      }

      toast.error(errorMsg, {
        style: { border: '1px solid #fee2e2', padding: '14px', color: '#991b1b', borderRadius: '0px' },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full max-h-screen flex items-center justify-center bg-[#F8FAFC] font-sans antialiased p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.4] bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-size-[32px_32px]" />
      <div className="absolute top-[-30%] left-[-20%] w-150 h-150 bg-blue-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-30%] right-[-20%] w-150 h-150 bg-slate-400/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="w-full max-w-97.5 bg-white border border-slate-200 p-6 md:p-8 shadow-[0_20px_50px_rgba(15,23,42,0.04)] relative z-10">
        <div className="absolute top-0 left-0 right-0 h-0.75 bg-slate-950" />
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center justify-center w-5 h-5 border border-slate-900 bg-slate-950 text-white">
            <Cpu className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-[9px] tracking-widest uppercase text-slate-900">
            404 SignUp Page
          </span>
        </div>

        <div className="mb-4">
          <h1 className="text-lg font-bold text-slate-900 tracking-tight uppercase">
            Create New Account
          </h1>
          <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
            Register parameters for terminal initialization.
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block pl-0.5">
              Full Name
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-950 transition-colors">
                <User className="w-3.5 h-3.5" />
              </div>
              <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Rahul Hasan" className="w-full pl-9 pr-4 py-2 bg-slate-50/50 border border-slate-200 text-slate-900 placeholder-slate-300 text-xs focus:outline-none focus:border-slate-950 focus:bg-white transition-all rounded-none"/>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block pl-0.5">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-950 transition-colors">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@gmail.com" className="w-full pl-9 pr-4 py-2 bg-slate-50/50 border border-slate-200 text-slate-900 placeholder-slate-300 text-xs focus:outline-none focus:border-slate-950 focus:bg-white transition-all rounded-none"/>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block pl-0.5">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-950 transition-colors">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <input type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" className="w-full pl-9 pr-10 py-2 bg-slate-50/50 border border-slate-200 text-slate-900 placeholder-slate-300 text-xs focus:outline-none focus:border-slate-950 focus:bg-white transition-all rounded-none"/>
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-950 transition-colors cursor-pointer">
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block pl-0.5">
              Confirm Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-950 transition-colors">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <input type={showPassword ? 'text' : 'password'} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat password" className="w-full pl-9 pr-4 py-2 bg-slate-50/50 border border-slate-200 text-slate-900 placeholder-slate-300 text-xs focus:outline-none focus:border-slate-950 focus:bg-white transition-all rounded-none"/>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block pl-0.5">
              Profile Picture <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <div onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-between pl-3 pr-3 py-2 bg-slate-50/50 border border-slate-200 hover:border-slate-950 hover:bg-white transition-all rounded-none cursor-pointer group">
              <div className="flex items-center gap-2 text-slate-400 group-hover:text-slate-950 transition-colors">
                <UploadCloud className="w-3.5 h-3.5" />
                <span className="text-xs truncate max-w-52.5">
                  {selectedImage ? selectedImage.name : 'Choose your profile picture'}
                </span>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-100 px-2 py-0.5 border border-slate-200 group-hover:bg-slate-950 group-hover:text-white group-hover:border-slate-950 transition-all">
                Browse
              </span>
            </div>
            <input type="file" ref={fileInputRef} accept="image/*" onChange={handleImageChange} className="hidden" />
          </div>

          <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center py-2.5 px-4 bg-slate-950 hover:bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest transition-all duration-150 disabled:opacity-50 mt-3 rounded-none cursor-pointer shadow-sm">
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="text-center mt-4 pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-400 font-medium">
            Already have a user account?{' '}
            <Link href="/" className="text-slate-900 hover:underline font-bold transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}