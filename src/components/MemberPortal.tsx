/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import {
  User,
  Sermon,
  Event,
  Announcement,
  PrayerRequest,
  GivingRecord,
  Notification,
  GivingCategory
} from '../types';
import {
  Calendar as CalIcon,
  Clock,
  MapPin,
  Megaphone,
  Heart,
  DollarSign,
  Bell,
  CheckCircle,
  FileText,
  UserCheck,
  Award,
  Video,
  Play,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { IMAGES } from '../data';

interface MemberPortalProps {
  currentUser: User;
  users: User[];
  sermons: Sermon[];
  events: Event[];
  announcements: Announcement[];
  prayerRequests: PrayerRequest[];
  giving: GivingRecord[];
  notifications: Notification[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onUpdateProfile: (userId: string, updates: Partial<User>) => void;
  onRegisterForEvent: (eventId: string, userId: string) => void;
  onUnregisterFromEvent: (eventId: string, userId: string) => void;
  onAddPrayerRequest: (content: string, isAnonymous: boolean, userId: string) => void;
  onAddPrayerCount: (requestId: string, userId: string) => void;
  onAddGiving: (amount: number, category: GivingCategory, method: string, userId: string) => void;
  onPlaySermon: (sermon: Sermon) => void;
  onMarkNotificationRead: (id: string) => void;
}

export default function MemberPortal({
  currentUser,
  users,
  sermons,
  events,
  announcements,
  prayerRequests,
  giving,
  notifications,
  activeTab,
  setActiveTab,
  onUpdateProfile,
  onRegisterForEvent,
  onUnregisterFromEvent,
  onAddPrayerRequest,
  onAddPrayerCount,
  onAddGiving,
  onPlaySermon,
  onMarkNotificationRead
}: MemberPortalProps) {
  
  // Profile state
  const [profileName, setProfileName] = useState(currentUser.name);
  const [profilePhone, setProfilePhone] = useState(currentUser.phone || '');
  const [profileBio, setProfileBio] = useState(currentUser.bio || '');
  const [profileSaved, setProfileSaved] = useState(false);

  // Prayer Request state
  const [prayerContent, setPrayerContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [prayerSubmitted, setPrayerSubmitted] = useState(false);

  // Giving Form state
  const [quickGiveAmount, setQuickGiveAmount] = useState<number>(50);
  const [customGiveAmount, setCustomGiveAmount] = useState<string>('');
  const [giveCategory, setGiveCategory] = useState<GivingCategory>('Tithe');
  const [giveMethod, setGiveMethod] = useState('Credit Card');
  const [giveSuccess, setGiveSuccess] = useState(false);

  // Calendar State
  const [selectedDay, setSelectedDay] = useState<number | null>(28); // Focus on Sunday by default

  // Filter lists specific to logged in user
  const userNotifications = notifications.filter(n => n.userId === currentUser.id);
  const userUnreadNotifications = userNotifications.filter(n => !n.isRead);
  const userGiving = giving.filter(g => g.userId === currentUser.id);
  const userTotalGiving = userGiving.reduce((sum, g) => sum + g.amount, 0);
  const userRegisteredEvents = events.filter(e => e.registeredUsers.includes(currentUser.id));

  // Approved prayers for the wall
  const approvedPrayers = prayerRequests.filter(p => p.status === 'approved' || p.status === 'prayed_for');

  const handleProfileSubmit = (e: FormEvent) => {
    e.preventDefault();
    onUpdateProfile(currentUser.id, {
      name: profileName,
      phone: profilePhone,
      bio: profileBio
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const handlePrayerSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!prayerContent.trim()) return;
    onAddPrayerRequest(prayerContent, isAnonymous, currentUser.id);
    setPrayerContent('');
    setPrayerSubmitted(true);
    setTimeout(() => setPrayerSubmitted(false), 2500);
  };

  const handleGivingSubmit = (e: FormEvent) => {
    e.preventDefault();
    const finalAmount = customGiveAmount ? parseFloat(customGiveAmount) : quickGiveAmount;
    if (isNaN(finalAmount) || finalAmount <= 0) return;
    onAddGiving(finalAmount, giveCategory, giveMethod, currentUser.id);
    setCustomGiveAmount('');
    setGiveSuccess(true);
    setTimeout(() => setGiveSuccess(false), 2500);
  };

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 p-6 md:p-8 overflow-y-auto h-full">
      
      {/* ========================================================
          1. DASHBOARD TAB
          ======================================================== */}
      {activeTab === 'dashboard' && (
        <div id="member-dashboard-view" className="space-y-8 animate-in fade-in duration-300">
          {/* Header Card */}
          <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-amber-500/10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 h-40 w-40 bg-amber-500/5 rounded-full blur-3xl -z-10" />
            <div className="flex items-center gap-4">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="h-16 w-16 rounded-full object-cover border-2 border-amber-500/40"
                referrerPolicy="no-referrer"
              />
              <div>
                <h1 className="text-2xl font-extrabold text-white">Welcome back, {currentUser.name}! 👋</h1>
                <p className="text-xs text-slate-400 mt-1">We are glad to have you with us today. Let's grow together in grace.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-slate-950 border border-slate-800 px-5 py-3 rounded-xl text-center">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold tracking-wider">Total Contributed</span>
                <strong className="text-amber-400 text-lg font-black">${userTotalGiving.toLocaleString()}</strong>
              </div>
              <div className="bg-slate-950 border border-slate-800 px-5 py-3 rounded-xl text-center">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold tracking-wider">Events Registered</span>
                <strong className="text-emerald-400 text-lg font-black">{userRegisteredEvents.length}</strong>
              </div>
            </div>
          </div>

          {/* Core Info Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Upcoming Service Card */}
            <div className="bg-slate-900 border border-slate-800/80 p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] bg-amber-500/10 text-amber-400 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Upcoming Service
                </span>
                <CalIcon className="h-4.5 w-4.5 text-slate-500" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-100 text-base">Sunday Morning Worship</h3>
                <p className="text-xs text-slate-400 mt-1">Join the community in-person or live stream online.</p>
              </div>
              <div className="text-xs space-y-1.5 text-slate-400 border-t border-slate-800/80 pt-3">
                <p className="flex items-center gap-2">
                  <CalIcon className="h-4 w-4 text-amber-500/80" />
                  Every Sunday
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-500/80" />
                  10:00 AM — 11:45 AM
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-amber-500/80" />
                  Main Sanctuary
                </p>
              </div>
            </div>

            {/* Latest Announcements */}
            <div className="bg-slate-900 border border-slate-800/80 p-6 rounded-2xl space-y-4 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-purple-500/10 text-purple-400 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Latest Announcement
                  </span>
                  <Megaphone className="h-4.5 w-4.5 text-slate-500" />
                </div>
                {announcements.length > 0 ? (
                  <div className="mt-3">
                    <h3 className="font-extrabold text-slate-100 text-sm line-clamp-1">{announcements[0].title}</h3>
                    <p className="text-xs text-slate-400 mt-1.5 line-clamp-3 leading-relaxed">
                      {announcements[0].content}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 mt-3">No announcements posted yet.</p>
                )}
              </div>
              <button
                onClick={() => setActiveTab('announcements')}
                className="text-xs font-bold text-amber-500 hover:underline flex items-center gap-1 mt-2"
              >
                View Announcements Board <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            {/* Next Registered Event */}
            <div className="bg-slate-900 border border-slate-800/80 p-6 rounded-2xl space-y-4 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Next Registered Event
                  </span>
                  <CalIcon className="h-4.5 w-4.5 text-slate-500" />
                </div>
                {userRegisteredEvents.length > 0 ? (
                  <div className="mt-3">
                    <h3 className="font-extrabold text-slate-100 text-sm line-clamp-1">{userRegisteredEvents[0].title}</h3>
                    <div className="space-y-1 mt-2.5 text-xs text-slate-400">
                      <p className="text-emerald-400 font-semibold">{userRegisteredEvents[0].date}</p>
                      <p>{userRegisteredEvents[0].time} @ {userRegisteredEvents[0].location}</p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 text-center py-2">
                    <p className="text-xs text-slate-500">You haven't registered for any events yet.</p>
                  </div>
                )}
              </div>
              <button
                onClick={() => setActiveTab('events')}
                className="text-xs font-bold text-amber-500 hover:underline flex items-center gap-1 mt-2"
              >
                Browse Event Schedule <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Lower Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Latest Sermon to Watch */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h2 className="text-sm uppercase text-slate-400 font-bold tracking-widest">Featured Sermon</h2>
              {sermons.length > 0 ? (
                <div className="bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex flex-col sm:flex-row shadow-md">
                  <div className="sm:w-2/5 relative h-32 sm:h-auto">
                    <img
                      src={sermons[0].thumbnail}
                      alt={sermons[0].title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <button
                      onClick={() => onPlaySermon(sermons[0])}
                      className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
                      aria-label="Play featured sermon"
                    >
                      <Play className="h-8 w-8 text-amber-500 fill-current" />
                    </button>
                  </div>
                  <div className="p-4 sm:w-3/5 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] bg-amber-500/10 text-amber-400 font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                        {sermons[0].speaker}
                      </span>
                      <h4 className="font-bold text-slate-100 text-sm mt-1.5 line-clamp-1">{sermons[0].title}</h4>
                      <p className="text-[10px] text-slate-500 mt-1">Released {sermons[0].date}</p>
                    </div>
                    <button
                      onClick={() => onPlaySermon(sermons[0])}
                      className="text-xs font-semibold text-amber-400 flex items-center gap-1 mt-3"
                    >
                      Listen Now <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500">No sermons published.</p>
              )}
            </div>

            {/* Quick Prayer Wall summary */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 flex flex-col justify-between">
              <div>
                <h2 className="text-sm uppercase text-slate-400 font-bold tracking-widest">Active Prayer Requests</h2>
                <div className="space-y-3 mt-4">
                  {approvedPrayers.slice(0, 2).map((prayer) => (
                    <div key={prayer.id} className="p-3 bg-slate-950 rounded-xl border border-slate-850 flex justify-between items-center text-xs">
                      <div className="flex-1 pr-4">
                        <span className="font-bold text-slate-300 block mb-0.5">{prayer.userName}</span>
                        <p className="text-slate-400 line-clamp-1">{prayer.content}</p>
                      </div>
                      <button
                        onClick={() => onAddPrayerCount(prayer.id, currentUser.id)}
                        className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-colors ${
                          prayer.prayingUsers.includes(currentUser.id)
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-slate-900 text-amber-400 hover:bg-slate-850'
                        }`}
                      >
                        <Heart className="h-3 w-3 fill-current" />
                        <span>{prayer.prayersCount}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setActiveTab('prayers')}
                className="text-xs font-bold text-amber-500 hover:underline flex items-center gap-1 mt-3"
              >
                Go to Prayer Wall <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          2. PROFILE TAB
          ======================================================== */}
      {activeTab === 'profile' && (
        <div id="member-profile-view" className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 p-8 rounded-2xl space-y-6 animate-in fade-in duration-300">
          <div className="text-center pb-4 border-b border-slate-800">
            <h1 className="text-xl font-bold text-white">My Account Profile</h1>
            <p className="text-xs text-slate-400 mt-1">Review your registration details and update your contact bio.</p>
          </div>

          {profileSaved && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs rounded-lg text-center font-semibold">
              Profile details updated successfully!
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="flex items-center gap-4 justify-center pb-4">
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="h-24 w-24 rounded-full object-cover border-2 border-amber-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-1 right-1 h-5 w-5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
              </div>
              <div className="text-left">
                <span className="text-[10px] bg-amber-500/10 text-amber-400 font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                  {currentUser.role}
                </span>
                <p className="text-sm text-slate-400 mt-1 font-mono">Member ID: {currentUser.id}</p>
                <p className="text-xs text-slate-500">Joined on {currentUser.dateJoined}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1">Email Address (Read Only)</label>
                <input
                  type="email"
                  disabled
                  value={currentUser.email}
                  className="w-full bg-slate-950 border border-slate-800/60 text-slate-500 cursor-not-allowed rounded-lg px-3.5 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1">Phone Number</label>
              <input
                type="text"
                value={profilePhone}
                onChange={(e) => setProfilePhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1">Short Biography</label>
              <textarea
                value={profileBio}
                onChange={(e) => setProfileBio(e.target.value)}
                placeholder="Share a short bio about yourself..."
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors mt-6 shadow-md"
            >
              <UserCheck className="h-4.5 w-4.5" />
              SAVE PROFILE DETAILS
            </button>
          </form>
        </div>
      )}

      {/* ========================================================
          3. ANNOUNCEMENTS TAB
          ======================================================== */}
      {activeTab === 'announcements' && (
        <div id="member-announcements-view" className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
          <div className="pb-4 border-b border-slate-800">
            <h1 className="text-2xl font-bold text-white">Announcements Board</h1>
            <p className="text-xs text-slate-400 mt-1">Keep updated with church renovations, weekly bible study calendars, and outreach sponsorships.</p>
          </div>

          <div className="space-y-4">
            {announcements.map((ann) => (
              <div key={ann.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-start gap-4 shadow-md">
                <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl shrink-0 mt-1">
                  <Megaphone className="h-5 w-5" />
                </div>
                <div className="space-y-1.5 flex-1">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <span className="text-[10px] bg-purple-500/15 text-purple-300 font-extrabold px-2.5 py-0.5 rounded uppercase tracking-wider">
                      {ann.category}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">{ann.date}</span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-100">{ann.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{ann.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          4. EVENTS TAB
          ======================================================== */}
      {activeTab === 'events' && (
        <div id="member-events-view" className="space-y-6 animate-in fade-in duration-300">
          <div className="pb-4 border-b border-slate-800 flex justify-between items-end flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Community Events</h1>
              <p className="text-xs text-slate-400 mt-1">Register for upcoming events or cancel registration from this panel.</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setSelectedDay(28)} 
                className="bg-slate-900 border border-slate-800 hover:border-amber-500 text-amber-400 text-xs px-3 py-1.5 rounded-lg"
              >
                Go to Calendar View
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event) => {
              const isRegistered = event.registeredUsers.includes(currentUser.id);
              return (
                <div
                  key={event.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col sm:flex-row h-full shadow-lg"
                >
                  <div className="sm:w-2/5 relative h-36 sm:h-auto">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-2 left-2 text-[8px] bg-amber-500 text-slate-950 font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                      {event.category}
                    </span>
                  </div>

                  <div className="p-5 sm:w-3/5 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex flex-col text-[10px] text-slate-400 space-y-0.5">
                        <span className="text-amber-400 font-bold">{event.date}</span>
                        <span>{event.time}</span>
                      </div>
                      <h3 className="font-extrabold text-slate-100 text-sm mt-1.5 line-clamp-1">{event.title}</h3>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">{event.description}</p>
                    </div>

                    <div className="flex justify-between items-center pt-2.5 border-t border-slate-800/80">
                      <span className="text-[9px] text-slate-500 truncate max-w-[80px]">@{event.location}</span>
                      <button
                        onClick={() => {
                          if (isRegistered) onUnregisterFromEvent(event.id, currentUser.id);
                          else onRegisterForEvent(event.id, currentUser.id);
                        }}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                          isRegistered
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                            : 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                        }`}
                      >
                        {isRegistered ? 'Unregister' : 'Register✓'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================
          5. SERMONS TAB
          ======================================================== */}
      {activeTab === 'sermons' && (
        <div id="member-sermons-view" className="space-y-6 animate-in fade-in duration-300">
          <div className="pb-4 border-b border-slate-800">
            <h1 className="text-2xl font-bold text-white">Sermon Library</h1>
            <p className="text-xs text-slate-400 mt-1">Select and listen to recent recordings and download outline pamphlets.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sermons.map((sermon) => (
              <div key={sermon.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col h-full shadow-md">
                <div className="relative aspect-video">
                  <img
                    src={sermon.thumbnail}
                    alt={sermon.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    onClick={() => onPlaySermon(sermon)}
                    className="absolute inset-0 bg-black/35 flex items-center justify-center hover:bg-black/45 transition-colors"
                  >
                    <div className="h-10 w-10 bg-amber-500 text-slate-950 rounded-full flex items-center justify-center shadow-lg">
                      <Play className="h-4.5 w-4.5 fill-current translate-x-0.5" />
                    </div>
                  </button>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center text-[9px] text-slate-400 uppercase tracking-widest font-semibold">
                      <span>{sermon.speaker}</span>
                      <span>{sermon.duration}</span>
                    </div>
                    <h3 className="font-extrabold text-slate-100 text-sm mt-2 line-clamp-2 hover:text-amber-400 transition-colors cursor-pointer" onClick={() => onPlaySermon(sermon)}>
                      {sermon.title}
                    </h3>
                  </div>
                  <div className="pt-3 border-t border-slate-800 mt-4 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Released {sermon.date}</span>
                    <button
                      onClick={() => onPlaySermon(sermon)}
                      className="text-amber-400 hover:underline font-bold"
                    >
                      Study Notes
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          6. PRAYERS TAB
          ======================================================== */}
      {activeTab === 'prayers' && (
        <div id="member-prayers-view" className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
          {/* Form Side */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
              <h2 className="text-base font-extrabold text-white mb-1.5">Submit Prayer Request</h2>
              <p className="text-xs text-slate-400 mb-4">Your requests will be forwarded to the clerical queue for review and posting.</p>

              {prayerSubmitted && (
                <div className="mb-4 p-3 bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs rounded-lg text-center font-semibold">
                  Submitted! Pending pastor review. 🙏
                </div>
              )}

              <form onSubmit={handlePrayerSubmit} className="space-y-4">
                <div>
                  <textarea
                    required
                    value={prayerContent}
                    onChange={(e) => setPrayerContent(e.target.value)}
                    placeholder="Enter what we can pray with you about..."
                    rows={4}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center text-xs text-slate-400 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="mr-2 rounded border-slate-850 bg-slate-950 text-amber-500 focus:ring-0"
                    />
                    Submit anonymously
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Heart className="h-4 w-4" />
                  SUBMIT TO PRAYER WAILING
                </button>
              </form>
            </div>

            <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl text-xs text-amber-400 leading-relaxed">
              <strong>Biblical Fellowship:</strong> "For where two or three are gathered together in my name, there am I in the midst of them." — Matthew 18:20
            </div>
          </div>

          {/* Wall Side */}
          <div className="lg:col-span-2 space-y-6">
            <div className="pb-3 border-b border-slate-800">
              <h1 className="text-xl font-extrabold text-white">Community Prayer Wall</h1>
              <p className="text-xs text-slate-400 mt-1">Intercede for active needs. Click the heart to let them know you are praying.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {approvedPrayers.map((prayer) => {
                const userHasPrayed = prayer.prayingUsers.includes(currentUser.id);
                return (
                  <div key={prayer.id} className="bg-slate-900 border border-slate-800/80 p-5 rounded-2xl flex flex-col justify-between gap-4 shadow-md hover:border-slate-700 transition-colors">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2.5">
                        {prayer.userAvatar ? (
                          <img
                            src={prayer.userAvatar}
                            alt={prayer.userName}
                            className="h-8 w-8 rounded-full object-cover border border-slate-700"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-slate-950 border border-slate-850 flex items-center justify-center text-xs text-slate-500 font-bold font-mono">
                            {prayer.userName[0]}
                          </div>
                        )}
                        <div>
                          <span className="font-extrabold text-slate-200 text-xs block">{prayer.userName}</span>
                          <span className="text-[10px] text-slate-500 font-mono block">{prayer.date}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 italic leading-relaxed">
                        "{prayer.content}"
                      </p>
                    </div>

                    <div className="flex justify-between items-center border-t border-slate-800/60 pt-3 flex-wrap gap-2">
                      <span className="text-[9px] bg-slate-950 text-slate-400 px-2 py-0.5 rounded uppercase font-semibold">
                        {prayer.status === 'prayed_for' ? '✓ Heavily Prayed' : 'Active Intercession'}
                      </span>
                      <button
                        onClick={() => onAddPrayerCount(prayer.id, currentUser.id)}
                        className={`text-xs px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                          userHasPrayed
                            ? 'bg-amber-500 text-slate-950 hover:bg-amber-600'
                            : 'bg-slate-950 border border-slate-800 text-amber-400 hover:bg-slate-900'
                        }`}
                      >
                        <Heart className="h-3.5 w-3.5 fill-current" />
                        <span>I Prayed ({prayer.prayersCount})</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          7. GIVING HISTORY TAB
          ======================================================== */}
      {activeTab === 'giving' && (
        <div id="member-giving-view" className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
          {/* Quick Gift form side */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
              <h2 className="text-base font-extrabold text-white mb-1.5">Direct Online Giving</h2>
              <p className="text-xs text-slate-400 mb-4">Your donations are logged immediately to your public statements.</p>

              {giveSuccess && (
                <div className="mb-4 p-3 bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs rounded-lg text-center font-semibold">
                  Thank you! Donation added to your ledger. 🤝
                </div>
              )}

              <form onSubmit={handleGivingSubmit} className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  {[20, 50, 100].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setQuickGiveAmount(amt);
                        setCustomGiveAmount('');
                      }}
                      className={`py-2 rounded-xl text-xs font-extrabold border transition-colors ${
                        quickGiveAmount === amt && !customGiveAmount
                          ? 'bg-amber-500 text-slate-950 border-amber-500'
                          : 'bg-slate-950 text-slate-400 border-slate-850 hover:border-slate-800'
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Custom Amount ($)</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 250"
                    value={customGiveAmount}
                    onChange={(e) => {
                      setCustomGiveAmount(e.target.value);
                      setQuickGiveAmount(0);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Allocation</label>
                    <select
                      value={giveCategory}
                      onChange={(e) => setGiveCategory(e.target.value as GivingCategory)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-[10px] text-slate-300 focus:outline-none focus:border-amber-500"
                    >
                      <option value="Tithe">Tithe (10%)</option>
                      <option value="Offering">Offering</option>
                      <option value="Missions">Missions</option>
                      <option value="Building Fund">Building Fund</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Method</label>
                    <select
                      value={giveMethod}
                      onChange={(e) => setGiveMethod(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-[10px] text-slate-300 focus:outline-none focus:border-amber-500"
                    >
                      <option value="Credit Card">Credit Card</option>
                      <option value="Bank Transfer">Bank Wire</option>
                      <option value="Apple Pay">Apple Pay</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Heart className="h-4 w-4 fill-current" />
                  SUBMIT $ {customGiveAmount ? parseFloat(customGiveAmount) : quickGiveAmount}
                </button>
              </form>
            </div>
          </div>

          {/* Table list side */}
          <div className="lg:col-span-2 space-y-6">
            <div className="pb-3 border-b border-slate-800 flex justify-between items-center">
              <div>
                <h1 className="text-xl font-extrabold text-white">Giving Logs Directory</h1>
                <p className="text-xs text-slate-400 mt-1">Audit trail of all your charitable gifts recorded this financial year.</p>
              </div>
            </div>

            {userGiving.length > 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="bg-slate-950 border-b border-slate-850 text-slate-400 uppercase tracking-wider font-semibold">
                        <th className="px-5 py-4">Receipt Date</th>
                        <th className="px-5 py-4">Allocation Category</th>
                        <th className="px-5 py-4">Payment Method</th>
                        <th className="px-5 py-4 text-right">Contributed Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {userGiving.map((record) => (
                        <tr key={record.id} className="hover:bg-slate-900/40">
                          <td className="px-5 py-3.5 text-slate-300 font-mono">{record.date}</td>
                          <td className="px-5 py-3.5">
                            <span className="inline-block px-2 py-0.5 rounded bg-slate-950 text-amber-500 font-semibold border border-slate-850">
                              {record.category}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-slate-400">{record.paymentMethod}</td>
                          <td className="px-5 py-3.5 text-right font-bold text-slate-100">${record.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 text-xs">
                No giving history found. Enter a quick gift to start your ledger history!
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          8. CALENDAR TAB
          ======================================================== */}
      {activeTab === 'calendar' && (
        <div id="member-calendar-view" className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
          {/* Calendar grid side */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h2 className="text-base font-extrabold text-white">Interactive Church Calendar</h2>
              <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">May 2025</span>
            </div>

            {/* Simulated Grid of month */}
            <div className="grid grid-cols-7 gap-2 text-center">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <span key={d} className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold pb-1.5">
                  {d}
                </span>
              ))}

              {/* Pad first days */}
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={`pad-${i}`} className="aspect-square bg-slate-950/20 text-slate-700 text-xs flex items-center justify-center border border-transparent" />
              ))}

              {/* Days of May 2025 */}
              {Array.from({ length: 31 }).map((_, i) => {
                const day = i + 1;
                // Highlight important days in our seed:
                // 18th (Sermon Mountain), 28th (Prayer Fasting), 30th (Youth Conv), 7th (Men's Breakfast)
                const isSpecial = [7, 18, 28, 30].includes(day);
                const isSelected = selectedDay === day;

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`aspect-square rounded-xl border text-xs relative flex flex-col items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 border-amber-500 font-extrabold'
                        : isSpecial
                        ? 'bg-slate-950 text-amber-400 border-amber-500/20 font-bold hover:border-amber-500'
                        : 'bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span>{day}</span>
                    {isSpecial && !isSelected && (
                      <span className="absolute bottom-1 h-1.5 w-1.5 bg-amber-500 rounded-full animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Details side */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl h-fit space-y-4">
            <h3 className="text-sm uppercase text-slate-400 font-bold tracking-widest pb-2 border-b border-slate-800">
              Details for May {selectedDay || 'Select a day'}
            </h3>

            {selectedDay === 28 && (
              <div className="space-y-3.5 text-xs">
                <span className="inline-block px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold uppercase tracking-wider">
                  Corporate Prayer Event
                </span>
                <h4 className="font-extrabold text-slate-100 text-sm">Prayer & Fasting</h4>
                <p className="text-slate-400 leading-relaxed">
                  Join us at 6:00 PM in the Main Sanctuary as we humble ourselves in corporate intercessions.
                </p>
                <div className="border-t border-slate-800/80 pt-3 flex flex-col gap-1.5 text-slate-400 text-[11px]">
                  <span>🕒 Hours: 6:00 PM — 7:30 PM</span>
                  <span>📍 Host Location: Main Sanctuary</span>
                </div>
              </div>
            )}

            {selectedDay === 30 && (
              <div className="space-y-3.5 text-xs">
                <span className="inline-block px-2.5 py-0.5 rounded bg-purple-500/10 text-purple-400 font-bold uppercase tracking-wider">
                  Youth Convention
                </span>
                <h4 className="font-extrabold text-slate-100 text-sm">Youth Convention 2025 Starts</h4>
                <p className="text-slate-400 leading-relaxed">
                  The power-packed weekend begins! Registration desk opens at 8:00 AM. Keynote begins at 9:00 AM.
                </p>
                <div className="border-t border-slate-800/80 pt-3 flex flex-col gap-1.5 text-slate-400 text-[11px]">
                  <span>🕒 Hours: All Day (4 Days)</span>
                  <span>📍 Host Location: Fellowship Hall</span>
                </div>
              </div>
            )}

            {selectedDay === 18 && (
              <div className="space-y-3.5 text-xs">
                <span className="inline-block px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold uppercase tracking-wider">
                  Worship Sermon
                </span>
                <h4 className="font-extrabold text-slate-100 text-sm">Sunday Worship Service</h4>
                <p className="text-slate-400 leading-relaxed">
                  Weekly message titled "Faith That Moves Mountains" taught live by Pastor James Andrew.
                </p>
                <div className="border-t border-slate-800/80 pt-3 flex flex-col gap-1.5 text-slate-400 text-[11px]">
                  <span>🕒 Hours: 10:00 AM — 11:45 AM</span>
                  <span>📍 Host Location: Main Sanctuary</span>
                </div>
              </div>
            )}

            {![18, 28, 30].includes(selectedDay || 0) && (
              <div className="py-8 text-center text-xs text-slate-500 space-y-1.5">
                <p>No major corporate church events plotted on this day.</p>
                <p className="text-[10px] text-slate-600">Click highlighted days (18th, 28th, 30th) to inspect schedule.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          9. NOTIFICATIONS TAB
          ======================================================== */}
      {activeTab === 'notifications' && (
        <div id="member-notifications-view" className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
          <div className="pb-4 border-b border-slate-800 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">Notifications center</h1>
              <p className="text-xs text-slate-400 mt-1">Review critical system alerts, transaction receipts, and prayer status reviews.</p>
            </div>
            {userUnreadNotifications.length > 0 && (
              <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full animate-pulse">
                {userUnreadNotifications.length} Unread
              </span>
            )}
          </div>

          <div className="space-y-4">
            {userNotifications.length > 0 ? (
              userNotifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => onMarkNotificationRead(n.id)}
                  className={`p-5 rounded-2xl border transition-colors cursor-pointer flex gap-3.5 items-start ${
                    n.isRead
                      ? 'bg-slate-900/40 border-slate-800/60'
                      : 'bg-slate-900 border-amber-500/20 shadow-md'
                  }`}
                >
                  <div className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                    n.type === 'success' 
                      ? 'bg-emerald-500/10 text-emerald-400' 
                      : n.type === 'alert' 
                      ? 'bg-red-500/10 text-red-400' 
                      : 'bg-blue-500/10 text-blue-400'
                  }`}>
                    <Bell className="h-4 w-4" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <h4 className="font-extrabold text-slate-200 text-sm leading-tight">{n.title}</h4>
                      <span className="text-[10px] text-slate-500 font-mono shrink-0">{n.date}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{n.content}</p>
                    {!n.isRead && (
                      <span className="inline-block text-[9px] text-amber-500 font-bold uppercase tracking-wider mt-1.5 underline">
                        Mark as read
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 text-xs">
                No notifications received in your private panel.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          10. SETTINGS TAB
          ======================================================== */}
      {activeTab === 'settings' && (
        <div id="member-settings-view" className="max-w-xl mx-auto bg-slate-900 border border-slate-800 p-8 rounded-2xl space-y-8 animate-in fade-in duration-300">
          <div className="text-center pb-4 border-b border-slate-800">
            <h1 className="text-xl font-bold text-white">System & Portal Settings</h1>
            <p className="text-xs text-slate-400 mt-1">Configure your email notifications, privacy settings, and security.</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Email Alerts</h3>
              <div className="space-y-3 text-xs">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-300">Sermon updates weekly digests</span>
                  <input type="checkbox" defaultChecked className="rounded border-slate-800 bg-slate-950 text-amber-500" />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-300">New fellowship event announcements</span>
                  <input type="checkbox" defaultChecked className="rounded border-slate-800 bg-slate-950 text-amber-500" />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-300">Donation receipt certificates email copies</span>
                  <input type="checkbox" defaultChecked className="rounded border-slate-800 bg-slate-950 text-amber-500" />
                </label>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Privacy Settings</h3>
              <div className="space-y-3 text-xs">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-300">Anonymize my name from giving logs</span>
                  <input type="checkbox" className="rounded border-slate-800 bg-slate-950 text-amber-500" />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-300">Make my prayer request content private (clergy only)</span>
                  <input type="checkbox" className="rounded border-slate-800 bg-slate-950 text-amber-500" />
                </label>
              </div>
            </div>

            <button
              onClick={() => alert('Settings configuration preferences successfully persisted in local cache!')}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider"
            >
              PERSIST PREFERENCES
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
