/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useChurchStore } from './useChurchStore';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import PublicWebsite from './components/PublicWebsite';
import MemberPortal from './components/MemberPortal';
import AdminPortal from './components/AdminPortal';
import AuthModal from './components/AuthModal';
import SermonPlayerModal from './components/SermonPlayerModal';
import { User, Sermon, GivingCategory } from './types';
import { LayoutDashboard, Globe, HelpCircle, User as UserIcon } from 'lucide-react';

export default function App() {
  const store = useChurchStore();

  const [activeSection, setActiveSection] = useState<string>('home'); // Public website active page
  const [portalMode, setPortalMode] = useState<'public' | 'portal'>('public'); // public website vs logged-in portal
  const [activePortalTab, setActivePortalTab] = useState<string>('dashboard'); // member or admin tabs
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeSermonForPlayer, setActiveSermonForPlayer] = useState<Sermon | null>(null);
  const [showSandboxHelper, setShowSandboxHelper] = useState(true);

  // Auto set active tabs on user changes
  useEffect(() => {
    if (store.currentUser) {
      if (store.currentUser.role === 'member') {
        setActivePortalTab('dashboard');
      } else {
        setActivePortalTab('admin-dashboard');
      }
    } else {
      setPortalMode('public');
    }
  }, [store.currentUser]);

  // Handle Event registration check
  const handleRegisterForEvent = (eventId: string, userId?: string) => {
    const activeUserId = userId || store.currentUser?.id;
    if (!activeUserId) {
      alert('Please sign in or register to join fellowship events.');
      setIsAuthModalOpen(true);
      return;
    }
    store.registerForEvent(eventId, activeUserId);
  };

  // Handle Giving checkout
  const handleAddGiving = (amount: number, category: GivingCategory, method: string, userId?: string) => {
    const activeUserId = userId || store.currentUser?.id;
    if (!activeUserId) {
      alert('Please log in first to track donations in your personal dashboard history.');
      setIsAuthModalOpen(true);
      return;
    }
    store.addGiving(amount, category, method, activeUserId);
  };

  // Helper for quick sandbox switcher
  const handleSandboxLogin = (email: string) => {
    const result = store.login(email);
    if (result.success && result.user) {
      setPortalMode('portal');
    }
  };

  // Count unread notifications
  const unreadNotifCount = store.currentUser 
    ? store.notifications.filter(n => n.userId === store.currentUser?.id && !n.isRead).length 
    : 0;

  return (
    <div id="church-cms-app" className="bg-slate-950 text-slate-100 font-sans min-h-screen flex flex-col selection:bg-amber-500 selection:text-slate-950">
      
      {portalMode === 'public' ? (
        /* ========================================================
            PUBLIC WEBSITE ARCHITECTURE
            ======================================================== */
        <div className="flex flex-col min-h-screen">
          <Header
            currentUser={store.currentUser}
            onOpenLogin={() => setIsAuthModalOpen(true)}
            onLogout={store.logout}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            setPortalMode={setPortalMode}
          />
          
          <main className="flex-1">
            <PublicWebsite
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              sermons={store.sermons}
              events={store.events}
              currentUser={store.currentUser}
              onPlaySermon={(s) => setActiveSermonForPlayer(s)}
              onOpenLogin={() => setIsAuthModalOpen(true)}
              onRegisterForEvent={(id) => handleRegisterForEvent(id)}
              onAddGiving={(amt, cat, method) => handleAddGiving(amt, cat, method)}
            />
          </main>

          <footer className="bg-slate-950 border-t border-slate-900 py-8 text-center text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4 space-y-3">
              <p className="font-semibold text-slate-400">Faith Community Church © {new Date().getFullYear()}</p>
              <p className="max-w-md mx-auto leading-relaxed text-[11px]">
                Built with love, faith, and dedication. Certified Member of the Global Alliance of Community Churches. 
                All rights reserved. Simulated digital banking and ledgers.
              </p>
            </div>
          </footer>
        </div>
      ) : (
        /* ========================================================
            LOGGED-IN MEMBER / ADMIN PORTALS ARCHITECTURE
            ======================================================== */
        <div className="flex h-screen overflow-hidden">
          {/* Left Sidebar Navigation */}
          <Sidebar
            role={store.currentUser?.role || 'member'}
            activeTab={activePortalTab}
            setActiveTab={setActivePortalTab}
            onLogout={() => {
              store.logout();
              setPortalMode('public');
            }}
            onGoBackToPublic={() => setPortalMode('public')}
            notificationsCount={unreadNotifCount}
          />

          {/* Core Content Area */}
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Top portal header bar */}
            <header className="h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-6 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Active Session:</span>
                <span className="text-xs bg-slate-900 border border-slate-800 text-slate-300 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {store.currentUser?.role}
                </span>
              </div>

              {/* Quick portal actions */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setPortalMode('public')}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800"
                >
                  <Globe className="h-3.5 w-3.5" />
                  View Public Site
                </button>

                <div className="flex items-center gap-2.5">
                  <img
                    src={store.currentUser?.avatar}
                    alt={store.currentUser?.name}
                    className="h-8 w-8 rounded-full object-cover border border-amber-500/30"
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-xs font-bold text-slate-200 hidden sm:inline">{store.currentUser?.name}</span>
                </div>
              </div>
            </header>

            {/* Sub View loaders */}
            <div className="flex-1 overflow-hidden">
              {store.currentUser?.role === 'member' ? (
                <MemberPortal
                  currentUser={store.currentUser}
                  users={store.users}
                  sermons={store.sermons}
                  events={store.events}
                  announcements={store.announcements}
                  prayerRequests={store.prayerRequests}
                  giving={store.giving}
                  notifications={store.notifications}
                  activeTab={activePortalTab}
                  setActiveTab={setActivePortalTab}
                  onUpdateProfile={store.updateProfile}
                  onRegisterForEvent={store.registerForEvent}
                  onUnregisterFromEvent={store.unregisterFromEvent}
                  onAddPrayerRequest={store.addPrayerRequest}
                  onAddPrayerCount={store.addPrayerCount}
                  onAddGiving={store.addGiving}
                  onPlaySermon={(s) => setActiveSermonForPlayer(s)}
                  onMarkNotificationRead={store.markNotificationRead}
                />
              ) : (
                <AdminPortal
                  currentUser={store.currentUser!}
                  users={store.users}
                  sermons={store.sermons}
                  events={store.events}
                  announcements={store.announcements}
                  prayerRequests={store.prayerRequests}
                  giving={store.giving}
                  activeTab={activePortalTab}
                  onAddSermon={store.addSermon}
                  onAddEvent={store.addEvent}
                  onAddAnnouncement={store.addAnnouncement}
                  onUpdatePrayerStatus={store.updatePrayerStatus}
                  onAddUser={store.addUser}
                  onEditUser={store.editUser}
                  onDeleteUser={store.deleteUser}
                  onPlaySermon={(s) => setActiveSermonForPlayer(s)}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL OVERLAYS & SANDBOX WIDGETS
          ======================================================== */}
      
      {/* 1. Authentic Login Form Overlay */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => {
          setIsAuthModalOpen(false);
          setPortalMode('portal');
        }}
        loginFn={store.login}
        registerFn={store.register}
        users={store.users}
      />

      {/* 2. Interactive Sermon Media Player Modal */}
      <SermonPlayerModal
        sermon={activeSermonForPlayer}
        onClose={() => setActiveSermonForPlayer(null)}
      />

      {/* 3. Global Floating sandbox role switcher for easier evaluation */}
      {showSandboxHelper && (
        <div id="sandbox-widget" className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-amber-500/30 p-4 rounded-2xl shadow-2xl max-w-[280px] text-slate-200 text-xs animate-bounce hover:animate-none">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800 mb-2.5">
            <span className="font-extrabold text-amber-400 flex items-center gap-1">
              <HelpCircle className="h-3.5 w-3.5" />
              Role Switcher Sandbox
            </span>
            <button 
              onClick={() => setShowSandboxHelper(false)} 
              className="text-slate-400 hover:text-white font-bold"
              aria-label="Dismiss sandbox helper"
            >
              &times;
            </button>
          </div>
          <p className="text-[10px] text-slate-400 leading-normal mb-2.5">
            Instantly switch accounts to review Public, Member, and Clergy/Admin dashboard screens shown in your screenshots.
          </p>
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => {
                store.logout();
                setPortalMode('public');
              }}
              className="w-full text-left py-1 px-2.5 rounded bg-slate-950 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-between"
            >
              <span>1. Public Guest Website</span>
              <span className="text-[8px] uppercase tracking-wider font-semibold text-amber-500">Public</span>
            </button>
            <button
              onClick={() => handleSandboxLogin('john@example.com')}
              className="w-full text-left py-1 px-2.5 rounded bg-slate-950 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-between"
            >
              <span>2. Member (John Doe)</span>
              <span className="text-[8px] uppercase tracking-wider font-semibold text-emerald-400">Member</span>
            </button>
            <button
              onClick={() => handleSandboxLogin('james@example.com')}
              className="w-full text-left py-1 px-2.5 rounded bg-slate-950 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-between"
            >
              <span>3. Clergy (Pastor James)</span>
              <span className="text-[8px] uppercase tracking-wider font-semibold text-purple-400">Clergy</span>
            </button>
            <button
              onClick={() => handleSandboxLogin('sarah@example.com')}
              className="w-full text-left py-1 px-2.5 rounded bg-slate-950 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-between"
            >
              <span>4. Admin (Sarah Johnson)</span>
              <span className="text-[8px] uppercase tracking-wider font-semibold text-blue-400">Admin</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
