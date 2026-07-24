/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Church, Menu, X, User as UserIcon, LogOut, LayoutDashboard, Shield } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  currentUser: User | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  activeSection: string;
  setActiveSection: (sec: string) => void;
  setPortalMode: (mode: 'public' | 'portal') => void;
}

export default function Header({
  currentUser,
  onOpenLogin,
  onLogout,
  activeSection,
  setActiveSection,
  setPortalMode
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'About', id: 'about' },
    { label: 'Ministries', id: 'ministries' },
    { label: 'Sermons', id: 'sermons' },
    { label: 'Events', id: 'events' },
    { label: 'Give', id: 'give' },
    { label: 'Contact', id: 'contact' }
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setPortalMode('public');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-amber-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 group-hover:bg-amber-500/20 transition-all">
              <Church className="h-7 w-7 text-amber-400" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors block leading-tight">
                Faith Community
              </span>
              <span className="text-xs text-amber-400 tracking-wider uppercase block font-medium -mt-1">
                Church
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                  activeSection === item.id 
                    ? 'text-amber-400 bg-amber-500/10 font-semibold' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Auth Button or User Profile Dropdown */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-amber-500/30 transition-all text-sm text-slate-200"
                >
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="h-7 w-7 rounded-full object-cover border border-amber-500/40"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="h-7 w-7 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400">
                      <UserIcon className="h-4 w-4" />
                    </div>
                  )}
                  <span className="font-semibold text-slate-100 max-w-[120px] truncate">{currentUser.name}</span>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 text-slate-200 text-sm animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-3 py-2 border-b border-slate-800 text-xs mb-1">
                      <p className="font-bold text-slate-100">{currentUser.name}</p>
                      <p className="text-slate-400 truncate">{currentUser.email}</p>
                      <span className="inline-block px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-semibold uppercase tracking-wider text-[9px] mt-1.5">
                        {currentUser.role}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setPortalMode('portal');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 flex items-center gap-2.5 hover:text-amber-400 transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4 text-amber-400/80" />
                      {currentUser.role === 'member' ? 'Member Portal' : 'Clergy/Admin Portal'}
                    </button>

                    {currentUser.role !== 'member' && (
                      <div className="px-3 py-1 text-[10px] text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1.5 mt-1 border-t border-slate-800/60 pt-2">
                        <Shield className="h-3 w-3 text-amber-400" />
                        Admin Access
                      </div>
                    )}

                    <button
                      onClick={() => {
                        onLogout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-950/40 hover:text-red-300 flex items-center gap-2.5 text-slate-300 transition-colors mt-1"
                    >
                      <LogOut className="h-4 w-4 text-red-400/80" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2 rounded-full shadow-lg hover:shadow-amber-500/15 text-sm uppercase tracking-wide transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            {currentUser && (
              <button
                onClick={() => setPortalMode('portal')}
                className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                Portal
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-300 hover:text-white p-2 rounded-lg hover:bg-slate-900 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-lg border-b border-slate-800 px-4 py-4 space-y-2 text-slate-200">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                activeSection === item.id 
                  ? 'text-amber-400 bg-amber-500/10' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}

          <div className="pt-4 border-t border-slate-800">
            {currentUser ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-4 py-2">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="h-10 w-10 rounded-full object-cover border border-amber-500"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="font-bold text-slate-100 text-sm">{currentUser.name}</h4>
                    <span className="text-xs text-amber-400 uppercase tracking-wider font-semibold">{currentUser.role}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setPortalMode('portal');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl bg-amber-500/10 text-amber-400 font-bold text-sm flex items-center gap-2 hover:bg-amber-500/20"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  GO TO PORTAL
                </button>

                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl bg-red-950/30 text-red-400 font-bold text-sm flex items-center gap-2 hover:bg-red-950/50"
                >
                  <LogOut className="h-4 w-4" />
                  LOG OUT
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenLogin();
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 px-4 rounded-xl shadow-lg uppercase text-center tracking-wider text-sm transition-all"
              >
                Login / Register
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
