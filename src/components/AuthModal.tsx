/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { Mail, Lock, Eye, EyeOff, UserPlus, LogIn, ArrowRight } from 'lucide-react';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  loginFn: (email: string) => { success: boolean; error?: string; user?: User };
  registerFn: (name: string, email: string, role: 'member' | 'clergy', phone?: string, bio?: string) => { success: boolean; error?: string; user?: User };
  users: User[];
}

export default function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
  loginFn,
  registerFn,
  users
}: AuthModalProps) {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password'); // mock password
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [role, setRole] = useState<'member' | 'clergy'>('member');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const result = loginFn(email);
    if (result.success && result.user) {
      onLoginSuccess(result.user);
      onClose();
      // Reset form
      setEmail('');
      setPassword('password');
    } else {
      setError(result.error || 'Authentication failed');
    }
  };

  const handleRegisterSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email) {
      setError('Name and Email are required.');
      return;
    }
    const result = registerFn(name, email, role, phone, bio);
    if (result.success && result.user) {
      onLoginSuccess(result.user);
      onClose();
      // Reset form
      setName('');
      setEmail('');
      setPhone('');
      setBio('');
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  const handleQuickLogin = (quickEmail: string) => {
    setError('');
    const result = loginFn(quickEmail);
    if (result.success && result.user) {
      onLoginSuccess(result.user);
      onClose();
    } else {
      setError(result.error || 'Authentication failed');
    }
  };

  return (
    <div id="auth-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div 
        id="auth-card"
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-amber-500/20 bg-slate-900 text-slate-100 shadow-2xl"
      >
        {/* Top visual gradient line */}
        <div className="h-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1 rounded-full hover:bg-slate-800"
          aria-label="Close auth modal"
        >
          <span className="text-xl font-bold">&times;</span>
        </button>

        <div className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-amber-400">
              {isLoginTab ? 'Welcome Back' : 'Join Our Community'}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              {isLoginTab 
                ? 'Sign in to continue to your church portal' 
                : 'Create your member account to connect and participate'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-950/40 border border-red-500/30 text-red-300 text-xs rounded-lg">
              {error}
            </div>
          )}

          {isLoginTab ? (
            /* Login Form */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. john@example.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Password
                  </label>
                  <button 
                    type="button" 
                    className="text-xs text-amber-500 hover:underline"
                    onClick={() => alert('For this demo, password verification is simulated. Just enter any valid email or click the Quick Login below.')}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-10 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center text-xs text-slate-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="mr-2 rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-0"
                  />
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 px-4 rounded-lg shadow-lg hover:shadow-amber-500/10 flex items-center justify-center gap-2 transition-all"
              >
                <LogIn className="h-4 w-4" />
                LOGIN
              </button>
            </form>
          ) : (
            /* Registration Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
                  Phone (Optional)
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
                  I am registering as:
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center text-sm text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="reg-role"
                      checked={role === 'member'}
                      onChange={() => setRole('member')}
                      className="mr-2 border-slate-700 bg-slate-950 text-amber-500 focus:ring-0"
                    />
                    Church Member
                  </label>
                  <label className="flex items-center text-sm text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="reg-role"
                      checked={role === 'clergy'}
                      onChange={() => setRole('clergy')}
                      className="mr-2 border-slate-700 bg-slate-950 text-amber-500 focus:ring-0"
                    />
                    Clergy / Staff
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
                  Short Bio (Optional)
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us a bit about yourself..."
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 px-4 rounded-lg shadow-lg hover:shadow-amber-500/10 flex items-center justify-center gap-2 transition-all"
              >
                <UserPlus className="h-4 w-4" />
                CREATE ACCOUNT
              </button>
            </form>
          )}

          {/* Quick login helper panel (Very helpful for demonstration!) */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <h3 className="text-xs font-semibold text-amber-500/80 uppercase tracking-wider mb-2.5 text-center">
              Quick Login Sandbox
            </h3>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickLogin('john@example.com')}
                className="text-[10px] bg-slate-950 border border-amber-500/20 hover:border-amber-500/50 py-1.5 px-1 rounded text-slate-300 hover:text-amber-400 transition-colors"
              >
                Member (John)
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('james@example.com')}
                className="text-[10px] bg-slate-950 border border-purple-500/20 hover:border-purple-500/50 py-1.5 px-1 rounded text-slate-300 hover:text-purple-400 transition-colors"
              >
                Clergy (Pastor James)
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('sarah@example.com')}
                className="text-[10px] bg-slate-950 border border-blue-500/20 hover:border-blue-500/50 py-1.5 px-1 rounded text-slate-300 hover:text-blue-400 transition-colors"
              >
                Admin (Sarah)
              </button>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="text-center mt-6">
            <button
              onClick={() => setIsLoginTab(!isLoginTab)}
              className="text-xs text-slate-400 hover:text-amber-400 flex items-center justify-center gap-1 mx-auto transition-colors"
            >
              {isLoginTab ? (
                <>
                  Don't have an account? <span className="text-amber-500 font-semibold underline">Register</span>
                </>
              ) : (
                <>
                  Already have an account? <span className="text-amber-500 font-semibold underline">Login</span>
                </>
              )}
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
