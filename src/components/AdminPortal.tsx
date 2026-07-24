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
  GivingCategory,
  UserRole,
  UserStatus
} from '../types';
import {
  Users,
  BookOpen,
  Calendar,
  Megaphone,
  Heart,
  DollarSign,
  Plus,
  Trash2,
  Check,
  X,
  UserCheck,
  UserX,
  TrendingUp,
  Award,
  ChevronRight,
  Filter,
  Search,
  Upload,
  CalendarDays,
  FileText
} from 'lucide-react';
import { IMAGES } from '../data';

interface AdminPortalProps {
  currentUser: User;
  users: User[];
  sermons: Sermon[];
  events: Event[];
  announcements: Announcement[];
  prayerRequests: PrayerRequest[];
  giving: GivingRecord[];
  activeTab: string;
  onAddSermon: (sermon: Omit<Sermon, 'id' | 'views'>) => void;
  onAddEvent: (event: Omit<Event, 'id' | 'registeredUsers'>) => void;
  onAddAnnouncement: (ann: Omit<Announcement, 'id' | 'date'>) => void;
  onUpdatePrayerStatus: (requestId: string, status: PrayerRequest['status']) => void;
  onAddUser: (user: Omit<User, 'id' | 'dateJoined'>) => void;
  onEditUser: (userId: string, updates: Partial<User>) => void;
  onDeleteUser: (userId: string) => void;
  onPlaySermon: (sermon: Sermon) => void;
}

export default function AdminPortal({
  currentUser,
  users,
  sermons,
  events,
  announcements,
  prayerRequests,
  giving,
  activeTab,
  onAddSermon,
  onAddEvent,
  onAddAnnouncement,
  onUpdatePrayerStatus,
  onAddUser,
  onEditUser,
  onDeleteUser,
  onPlaySermon
}: AdminPortalProps) {
  
  // Member directory state
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  
  // Add Member Form State
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemName, setNewMemName] = useState('');
  const [newMemEmail, setNewMemEmail] = useState('');
  const [newMemPhone, setNewMemPhone] = useState('');
  const [newMemRole, setNewMemRole] = useState<UserRole>('member');
  const [newMemBio, setNewMemBio] = useState('');

  // Add Sermon Form State
  const [newSermonTitle, setNewSermonTitle] = useState('');
  const [newSermonSpeaker, setNewSermonSpeaker] = useState('Pastor James Andrew');
  const [newSermonTags, setNewSermonTags] = useState('Faith, Trust, Encouragement');
  const [newSermonVideo, setNewSermonVideo] = useState('https://www.youtube.com/embed/dQw4w9WgXcQ');
  const [newSermonAudio, setNewSermonAudio] = useState('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
  const [newSermonThumbnail, setNewSermonThumbnail] = useState('worshipHands'); // Preset key
  const [sermonAddedMsg, setSermonAddedMsg] = useState(false);

  // Add Event Form State
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('2025-06-20');
  const [newEventTime, setNewEventTime] = useState('18:00');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newEventLoc, setNewEventLoc] = useState('Main Sanctuary');
  const [newEventCat, setNewEventCat] = useState<'Worship' | 'Youth' | 'Community' | 'Conference' | 'Prayer'>('Prayer');
  const [newEventImg, setNewEventImg] = useState('fastingBread'); // Preset key
  const [eventAddedMsg, setEventAddedMsg] = useState(false);

  // Add Announcement State
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnContent, setNewAnnContent] = useState('');
  const [newAnnCat, setNewAnnCat] = useState<Announcement['category']>('General');
  const [annAddedMsg, setAnnAddedMsg] = useState(false);

  // Attendance Tracker State
  const [attendanceDate, setAttendanceDate] = useState('2025-05-25');
  const [attendanceCount, setAttendanceCount] = useState<number>(356);
  const [attendanceService, setAttendanceService] = useState('Sunday First Service');
  const [attendanceLogs, setAttendanceLogs] = useState<any[]>([
    { date: '2025-05-18', count: 342, service: 'Sunday First Service' },
    { date: '2025-05-11', count: 320, service: 'Sunday First Service' },
    { date: '2025-05-04', count: 310, service: 'Sunday First Service' }
  ]);
  const [attendanceAddedMsg, setAttendanceAddedMsg] = useState(false);

  // Calculated Stats
  const baseMembers = 1240;
  const totalMembersCount = baseMembers + users.length;
  const totalOfferingsValue = 18000 + giving.reduce((sum, r) => sum + r.amount, 0);

  // Pending prayers
  const pendingPrayers = prayerRequests.filter(p => p.status === 'pending');

  // Filtered members list
  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
                          u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Submit new member
  const handleAddMemberSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newMemName || !newMemEmail) return;
    onAddUser({
      name: newMemName,
      email: newMemEmail.toLowerCase().trim(),
      role: newMemRole,
      status: 'active',
      phone: newMemPhone,
      bio: newMemBio,
      avatar: `https://images.unsplash.com/photo-${1535713875002 + Math.floor(Math.random() * 1000)}?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`
    });
    // Reset
    setNewMemName('');
    setNewMemEmail('');
    setNewMemPhone('');
    setNewMemBio('');
    setNewMemRole('member');
    setShowAddMember(false);
  };

  // Submit new sermon
  const handleAddSermonSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newSermonTitle) return;
    
    // Choose thumbnail preset
    let thumb = IMAGES.worshipHands;
    if (newSermonThumbnail === 'openBible') thumb = IMAGES.openBible;
    if (newSermonThumbnail === 'prayerMan') thumb = IMAGES.prayerMan;

    onAddSermon({
      title: newSermonTitle,
      speaker: newSermonSpeaker,
      date: new Date().toISOString().split('T')[0],
      videoUrl: newSermonVideo,
      audioUrl: newSermonAudio,
      tags: newSermonTags.split(',').map(t => t.trim()),
      thumbnail: thumb,
      duration: '35:20'
    });

    setNewSermonTitle('');
    setSermonAddedMsg(true);
    setTimeout(() => setSermonAddedMsg(false), 2000);
  };

  // Submit new event
  const handleAddEventSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newEventTitle) return;

    let img = IMAGES.fastingBread;
    if (newEventImg === 'youthGroup') img = IMAGES.youthGroup;
    if (newEventImg === 'womenConference') img = IMAGES.womenConference;
    if (newEventImg === 'fellowshipMen') img = IMAGES.fellowshipMen;

    onAddEvent({
      title: newEventTitle,
      date: newEventDate,
      time: newEventTime,
      description: newEventDesc,
      location: newEventLoc,
      image: img,
      category: newEventCat
    });

    setNewEventTitle('');
    setNewEventDesc('');
    setEventAddedMsg(true);
    setTimeout(() => setEventAddedMsg(false), 2000);
  };

  // Submit new announcement
  const handleAddAnnouncementSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle || !newAnnContent) return;

    onAddAnnouncement({
      title: newAnnTitle,
      content: newAnnContent,
      category: newAnnCat
    });

    setNewAnnTitle('');
    setNewAnnContent('');
    setAnnAddedMsg(true);
    setTimeout(() => setAnnAddedMsg(false), 2000);
  };

  // Submit new attendance record
  const handleAddAttendanceSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!attendanceCount || isNaN(attendanceCount)) return;

    const newLog = {
      date: attendanceDate,
      count: attendanceCount,
      service: attendanceService
    };

    setAttendanceLogs([newLog, ...attendanceLogs]);
    setAttendanceAddedMsg(true);
    setTimeout(() => setAttendanceAddedMsg(false), 2000);
  };

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 p-6 md:p-8 overflow-y-auto h-full">
      
      {/* ========================================================
          1. DASHBOARD OVERVIEW TAB
          ======================================================== */}
      {activeTab === 'admin-dashboard' && (
        <div id="admin-dashboard-view" className="space-y-8 animate-in fade-in duration-300">
          
          {/* Stats Bar (Dynamic counting) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-extrabold block">Total Members</span>
                <strong className="text-white text-xl font-black mt-1.5 block">{totalMembersCount.toLocaleString()}</strong>
                <span className="text-[9px] text-emerald-400 font-bold block mt-1">+12% this month</span>
              </div>
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl">
                <Users className="h-6 w-6" />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-extrabold block">Sunday Attendance</span>
                <strong className="text-white text-xl font-black mt-1.5 block">{attendanceLogs[0]?.count || 356}</strong>
                <span className="text-[9px] text-emerald-400 font-bold block mt-1">+8% than last week</span>
              </div>
              <div className="p-3 bg-purple-500/10 text-purple-400 rounded-2xl">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-extrabold block">Total Offerings (June)</span>
                <strong className="text-white text-xl font-black mt-1.5 block">${totalOfferingsValue.toLocaleString()}</strong>
                <span className="text-[9px] text-emerald-400 font-bold block mt-1">+16% than last month</span>
              </div>
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-extrabold block">New Registrations</span>
                <strong className="text-white text-xl font-black mt-1.5 block">28</strong>
                <span className="text-[9px] text-emerald-400 font-bold block mt-1">+5% this week</span>
              </div>
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Custom SVG Attendance Trend (Curved line representing attendance overview) */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-extrabold text-white text-sm uppercase tracking-wider">Attendance Overview Trend</h3>
                  <span className="text-xs text-slate-400 font-semibold bg-slate-950 px-2.5 py-1 rounded-lg">Last 6 Months</span>
                </div>

                {/* SVG curved trend line */}
                <div className="h-48 relative w-full pt-4">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150">
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#d97706" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {/* Grid lines */}
                    <line x1="0" y1="20" x2="500" y2="20" stroke="#1e293b" strokeDasharray="3" />
                    <line x1="0" y1="60" x2="500" y2="60" stroke="#1e293b" strokeDasharray="3" />
                    <line x1="0" y1="100" x2="500" y2="100" stroke="#1e293b" strokeDasharray="3" />
                    <line x1="0" y1="140" x2="500" y2="140" stroke="#1e293b" strokeDasharray="3" />

                    {/* Gradient area */}
                    <path
                      d="M 10,130 C 80,110 130,50 200,70 C 270,90 330,30 400,45 C 450,55 490,30 500,30 L 500,140 L 10,140 Z"
                      fill="url(#chartGradient)"
                    />

                    {/* Curved line path */}
                    <path
                      d="M 10,130 C 80,110 130,50 200,70 C 270,90 330,30 400,45 C 450,55 490,30 500,30"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />

                    {/* Dots on points */}
                    <circle cx="10" cy="130" r="5" fill="#f59e0b" className="hover:scale-125 transition-transform" />
                    <circle cx="130" cy="50" r="5" fill="#f59e0b" />
                    <circle cx="200" cy="70" r="5" fill="#f59e0b" />
                    <circle cx="330" cy="30" r="5" fill="#f59e0b" />
                    <circle cx="400" cy="45" r="5" fill="#f59e0b" />
                    <circle cx="500" cy="30" r="5" fill="#f59e0b" />
                  </svg>
                  
                  {/* Tooltip labels */}
                  <div className="absolute top-4 left-6 bg-slate-950 px-2 py-1 border border-amber-500/20 rounded text-[9px] font-mono text-amber-400">
                    Easter: 450 Peak
                  </div>
                </div>
              </div>

              {/* Chart legend */}
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-4 pt-4 border-t border-slate-800">
                <span>Jan (180)</span>
                <span>Feb (220)</span>
                <span>Mar (350)</span>
                <span>Apr (420)</span>
                <span>May (356)</span>
                <span>Jun (380)</span>
              </div>
            </div>

            {/* Custom SVG Member Growth Donut */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-white text-sm uppercase tracking-wider mb-6">Member Demographics</h3>
                
                {/* SVG Donut */}
                <div className="relative h-40 flex items-center justify-center">
                  <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 36 36">
                    {/* Background circle */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#1e293b" strokeWidth="3" />
                    
                    {/* Segment 1: Members (70%) */}
                    <circle
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="3.5"
                      strokeDasharray="70 30"
                      strokeDashoffset="100"
                    />
                    {/* Segment 2: Youth (20%) */}
                    <circle
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="none"
                      stroke="#a855f7"
                      strokeWidth="3.5"
                      strokeDasharray="20 80"
                      strokeDashoffset="30"
                    />
                    {/* Segment 3: Children (10%) */}
                    <circle
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3.5"
                      strokeDasharray="10 90"
                      strokeDashoffset="10"
                    />
                  </svg>
                  
                  {/* Center Text */}
                  <div className="absolute text-center">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Total</span>
                    <strong className="text-slate-100 text-lg font-black block leading-tight">{totalMembersCount}</strong>
                    <span className="text-[8px] text-slate-500 uppercase block">Registered</span>
                  </div>
                </div>
              </div>

              {/* Donut Legend */}
              <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] text-slate-400 mt-4 pt-4 border-t border-slate-800">
                <div className="space-y-0.5">
                  <span className="inline-block h-2 w-2 rounded-full bg-amber-500 mr-1" />
                  <span className="font-semibold block">Adults (70%)</span>
                </div>
                <div className="space-y-0.5">
                  <span className="inline-block h-2 w-2 rounded-full bg-purple-500 mr-1" />
                  <span className="font-semibold block">Youth (20%)</span>
                </div>
                <div className="space-y-0.5">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 mr-1" />
                  <span className="font-semibold block">Kids (10%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lower Row: Recent Activities & Pending Prayers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activities list */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
              <h3 className="font-extrabold text-white text-sm uppercase tracking-wider">Recent System Audit Activities</h3>
              
              <div className="space-y-4">
                {giving.slice(0, 2).map((record, idx) => (
                  <div key={record.id} className="flex items-start gap-3 text-xs border-l-2 border-amber-500/50 pl-3 py-1">
                    <div className="flex-1">
                      <span className="text-slate-400">Offering received from </span>
                      <strong className="text-slate-200">{record.userName}</strong>
                      <span className="text-amber-400 font-bold ml-1.5">${record.amount} for {record.category}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">Today</span>
                  </div>
                ))}
                {users.slice(-2).reverse().map((user) => (
                  <div key={user.id} className="flex items-start gap-3 text-xs border-l-2 border-purple-500/50 pl-3 py-1">
                    <div className="flex-1">
                      <span className="text-slate-400">New member profile registered: </span>
                      <strong className="text-slate-200">{user.name}</strong>
                      <span className="text-purple-400 font-semibold ml-1.5">({user.role})</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{user.dateJoined}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Prayer Requests approval list */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-white text-sm uppercase tracking-wider mb-4">Pending Prayer Requests ({pendingPrayers.length})</h3>
                
                {pendingPrayers.length > 0 ? (
                  <div className="space-y-3.5 max-h-[250px] overflow-y-auto pr-1">
                    {pendingPrayers.map((prayer) => (
                      <div key={prayer.id} className="p-4 bg-slate-950 rounded-xl border border-slate-850 flex items-start gap-4 justify-between">
                        <div className="space-y-1.5 flex-1 pr-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-200">{prayer.userName}</span>
                            <span className="text-[9px] text-slate-500 font-mono">{prayer.date}</span>
                          </div>
                          <p className="text-xs text-slate-300 italic leading-relaxed">"{prayer.content}"</p>
                        </div>

                        {/* Quick action triggers */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => onUpdatePrayerStatus(prayer.id, 'approved')}
                            className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 border border-emerald-500/20 rounded-lg transition-all"
                            title="Approve & Post"
                            aria-label="Approve prayer request"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onUpdatePrayerStatus(prayer.id, 'archived')}
                            className="p-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 rounded-lg transition-all"
                            title="Archive request"
                            aria-label="Archive prayer request"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-10 text-center text-slate-500 text-xs">
                    No pending prayer requests awaiting administrative vetting. Good job!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          2. MEMBERS DIRECTORY TAB
          ======================================================== */}
      {activeTab === 'admin-members' && (
        <div id="admin-members-view" className="space-y-6 animate-in fade-in duration-300">
          <div className="pb-4 border-b border-slate-800 flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Members & Clergy Registry</h1>
              <p className="text-xs text-slate-400 mt-1">Manage statuses, edit roles, suspend accounts, or add new members directly.</p>
            </div>
            <button
              onClick={() => setShowAddMember(!showAddMember)}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md"
            >
              <Plus className="h-4 w-4" />
              ADD NEW USER
            </button>
          </div>

          {/* Add member form section */}
          {showAddMember && (
            <form onSubmit={handleAddMemberSubmit} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl shadow-xl">
              <div className="sm:col-span-3 pb-2 border-b border-slate-800 flex justify-between items-center">
                <h3 className="font-extrabold text-amber-400 text-sm">Create New Account Registry</h3>
                <button type="button" onClick={() => setShowAddMember(false)} className="text-slate-400 hover:text-white font-bold">&times;</button>
              </div>

              <div>
                <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newMemName}
                  onChange={(e) => setNewMemName(e.target.value)}
                  placeholder="Sister Martha"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newMemEmail}
                  onChange={(e) => setNewMemEmail(e.target.value)}
                  placeholder="martha@example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1">Phone Number</label>
                <input
                  type="text"
                  value={newMemPhone}
                  onChange={(e) => setNewMemPhone(e.target.value)}
                  placeholder="+1 (555) 777-8888"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1">Role Allocation</label>
                <select
                  value={newMemRole}
                  onChange={(e) => setNewMemRole(e.target.value as UserRole)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
                >
                  <option value="member">Church Member</option>
                  <option value="clergy">Clergy / Pastor</option>
                  <option value="admin">Operations Admin</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1">Short Biography</label>
                <input
                  type="text"
                  value={newMemBio}
                  onChange={(e) => setNewMemBio(e.target.value)}
                  placeholder="A bit about their spiritual focus..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-200"
                />
              </div>

              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2.5 rounded-lg text-xs uppercase tracking-wider sm:col-span-3 justify-self-end mt-2"
              >
                COMMIT ACCOUNT
              </button>
            </form>
          )}

          {/* Directory Search & Filters */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row gap-4 items-center justify-between shadow-md">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-2 text-slate-500 h-4 w-4" />
              <input
                type="text"
                placeholder="Search directory name/email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 focus:outline-none"
              />
            </div>

            <div className="flex gap-4 w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-slate-500" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-[11px] text-slate-300 rounded-lg px-3 py-1 focus:outline-none"
                >
                  <option value="All">All Roles</option>
                  <option value="member">Member</option>
                  <option value="clergy">Clergy</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-[11px] text-slate-300 rounded-lg px-3 py-1 focus:outline-none"
                >
                  <option value="All">All Status</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
          </div>

          {/* Members Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-850 text-slate-400 uppercase tracking-widest font-semibold">
                    <th className="px-5 py-4">User Details</th>
                    <th className="px-5 py-4">Security Role</th>
                    <th className="px-5 py-4">Phone Line</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Registered Date</th>
                    <th className="px-5 py-4 text-center">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-905/30 transition-colors">
                      <td className="px-5 py-3 flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-9 w-9 rounded-full object-cover border border-slate-800"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <strong className="text-slate-200 text-sm font-semibold block">{user.name}</strong>
                          <span className="text-[10px] text-slate-500 font-mono block">{user.email}</span>
                        </div>
                      </td>

                      <td className="px-5 py-3">
                        <span className={`inline-block px-2.5 py-0.5 rounded uppercase text-[9px] font-bold tracking-wider ${
                          user.role === 'admin'
                            ? 'bg-blue-500/10 text-blue-400'
                            : user.role === 'clergy'
                            ? 'bg-purple-500/10 text-purple-400'
                            : 'bg-slate-950 text-slate-400 border border-slate-850'
                        }`}>
                          {user.role}
                        </span>
                      </td>

                      <td className="px-5 py-3 text-slate-400">{user.phone || 'N/A'}</td>

                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase ${
                          user.status === 'active' ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                          {user.status}
                        </span>
                      </td>

                      <td className="px-5 py-3 text-slate-400 font-mono">{user.dateJoined}</td>

                      <td className="px-5 py-3">
                        <div className="flex items-center justify-center gap-3">
                          {user.id !== currentUser.id && (
                            <>
                              <button
                                onClick={() => {
                                  const targetStatus: UserStatus = user.status === 'active' ? 'suspended' : 'active';
                                  onEditUser(user.id, { status: targetStatus });
                                }}
                                className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${
                                  user.status === 'active'
                                    ? 'bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white'
                                    : 'bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950'
                                }`}
                              >
                                {user.status === 'active' ? 'Suspend' : 'Activate'}
                              </button>

                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete ${user.name}?`)) {
                                    onDeleteUser(user.id);
                                  }
                                }}
                                className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                                aria-label="Delete user"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          3. MANAGE SERMONS TAB
          ======================================================== */}
      {activeTab === 'admin-sermons' && (
        <div id="admin-sermons-view" className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
          {/* Form Column */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl h-fit">
            <h2 className="text-base font-extrabold text-white mb-2">Publish New Sermon</h2>
            <p className="text-xs text-slate-400 mb-6">Published sermons immediately refresh the public library list index.</p>

            {sermonAddedMsg && (
              <div className="mb-4 p-3 bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs rounded-lg text-center font-semibold animate-pulse">
                Sermon Published Successfully! ✓
              </div>
            )}

            <form onSubmit={handleAddSermonSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Sermon Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Walking by Faith"
                  value={newSermonTitle}
                  onChange={(e) => setNewSermonTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Preacher Speaker</label>
                <input
                  type="text"
                  required
                  value={newSermonSpeaker}
                  onChange={(e) => setNewSermonSpeaker(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Topic tags (Comma separated)</label>
                <input
                  type="text"
                  value={newSermonTags}
                  onChange={(e) => setNewSermonTags(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">YouTube Embed Url</label>
                <input
                  type="text"
                  value={newSermonVideo}
                  onChange={(e) => setNewSermonVideo(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Audio MP3 Source</label>
                <input
                  type="text"
                  value={newSermonAudio}
                  onChange={(e) => setNewSermonAudio(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Art Thumbnail preset</label>
                <select
                  value={newSermonThumbnail}
                  onChange={(e) => setNewSermonThumbnail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300"
                >
                  <option value="worshipHands">Hands in Worship</option>
                  <option value="openBible">Open Holy Bible</option>
                  <option value="prayerMan">Praying Devotee</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
              >
                <Upload className="h-4 w-4" />
                PUBLISH OUTLINE SERMON
              </button>
            </form>
          </div>

          {/* List Column */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-sm font-bold uppercase text-slate-400 tracking-wider">Active Published Sermons</h2>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-850 text-slate-400 uppercase tracking-widest font-semibold">
                    <th className="px-5 py-4">Thumbnail & Title</th>
                    <th className="px-5 py-4">Speaker</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4 text-center">Preview</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {sermons.map((ser) => (
                    <tr key={ser.id} className="hover:bg-slate-905/20">
                      <td className="px-5 py-3 flex items-center gap-3.5">
                        <img
                          src={ser.thumbnail}
                          alt={ser.title}
                          className="h-10 w-10 rounded-lg object-cover border border-slate-800 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <strong className="text-slate-200 text-xs font-semibold line-clamp-1">{ser.title}</strong>
                      </td>
                      <td className="px-5 py-3 text-slate-400">{ser.speaker}</td>
                      <td className="px-5 py-3 text-slate-400 font-mono">{ser.date}</td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => onPlaySermon(ser)}
                          className="text-amber-400 hover:underline font-bold text-[11px] block mx-auto"
                        >
                          Launch Player
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          4. MANAGE EVENTS TAB
          ======================================================= */}
      {activeTab === 'admin-events' && (
        <div id="admin-events-view" className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
          {/* Form Side */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl h-fit">
            <h2 className="text-base font-extrabold text-white mb-2">Schedule New Event</h2>
            <p className="text-xs text-slate-400 mb-6">Create fellowship breakfasts, conventions, or corporate prayers.</p>

            {eventAddedMsg && (
              <div className="mb-4 p-3 bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs rounded-lg text-center font-semibold animate-pulse">
                Event Added Successfully! ✓
              </div>
            )}

            <form onSubmit={handleAddEventSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Summer Outreach"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-xs text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Time</label>
                  <input
                    type="text"
                    required
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-xs text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Location Venue</label>
                <input
                  type="text"
                  required
                  value={newEventLoc}
                  onChange={(e) => setNewEventLoc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Category</label>
                  <select
                    value={newEventCat}
                    onChange={(e) => setNewEventCat(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-xs text-slate-300"
                  >
                    <option value="Worship">Worship</option>
                    <option value="Youth">Youth</option>
                    <option value="Community">Community</option>
                    <option value="Conference">Conference</option>
                    <option value="Prayer">Prayer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Image Theme</label>
                  <select
                    value={newEventImg}
                    onChange={(e) => setNewEventImg(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-xs text-slate-300"
                  >
                    <option value="fastingBread">Fasting (Bread)</option>
                    <option value="youthGroup">Youth group gathering</option>
                    <option value="womenConference">Women lecture panel</option>
                    <option value="fellowshipMen">Men breakfast roundtable</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Detailed Description</label>
                <textarea
                  required
                  rows={3}
                  value={newEventDesc}
                  onChange={(e) => setNewEventDesc(e.target.value)}
                  placeholder="Schedule timings, highlights..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-200 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
              >
                <CalendarDays className="h-4 w-4" />
                CREATE EVENT LOG
              </button>
            </form>
          </div>

          {/* List Column */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-sm font-bold uppercase text-slate-400 tracking-wider">Active Calendared Events</h2>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-850 text-slate-400 uppercase tracking-widest font-semibold">
                    <th className="px-5 py-4">Title & Venue</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Date / Hour</th>
                    <th className="px-5 py-4 text-center">Registrants</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {events.map((ev) => (
                    <tr key={ev.id} className="hover:bg-slate-905/20">
                      <td className="px-5 py-3">
                        <strong className="text-slate-200 text-xs font-semibold block">{ev.title}</strong>
                        <span className="text-[10px] text-slate-500 block mt-0.5">@{ev.location}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="inline-block px-2 py-0.5 bg-amber-500/10 text-amber-400 font-bold rounded text-[9px] uppercase">
                          {ev.category}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-slate-400">
                        <span className="block font-mono text-xs">{ev.date}</span>
                        <span className="text-[10px] text-slate-500 block">{ev.time}</span>
                      </td>
                      <td className="px-5 py-3 text-center font-bold text-slate-300">
                        {ev.registeredUsers.length}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          5. MANAGE ANNOUNCEMENTS TAB
          ======================================================= */}
      {activeTab === 'admin-announcements' && (
        <div id="admin-announcements-view" className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
          {/* Form */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl h-fit">
            <h2 className="text-base font-extrabold text-white mb-2">Publish Announcement</h2>
            <p className="text-xs text-slate-400 mb-6">Blasts push alerts to all member portal notification docks.</p>

            {annAddedMsg && (
              <div className="mb-4 p-3 bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs rounded-lg text-center font-semibold">
                Announcement Posted! Blasted to everyone. ✓
              </div>
            )}

            <form onSubmit={handleAddAnnouncementSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Headline Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Summer Renovations"
                  value={newAnnTitle}
                  onChange={(e) => setNewAnnTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Target Category</label>
                <select
                  value={newAnnCat}
                  onChange={(e) => setNewAnnCat(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-xs text-slate-300"
                >
                  <option value="General">General</option>
                  <option value="Youth">Youth ministry</option>
                  <option value="Events">Fellowship Events</option>
                  <option value="Urgent">Urgent Bulletins</option>
                  <option value="Ministries">Specialized groups</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Detailed Content</label>
                <textarea
                  required
                  rows={4}
                  value={newAnnContent}
                  onChange={(e) => setNewAnnContent(e.target.value)}
                  placeholder="Write clear descriptions..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-200 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
              >
                <Megaphone className="h-4 w-4" />
                POST BULLETIN BLAST
              </button>
            </form>
          </div>

          {/* List Column */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-sm font-bold uppercase text-slate-400 tracking-wider">Active Bulletins History</h2>
            <div className="space-y-4">
              {announcements.map((ann) => (
                <div key={ann.id} className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-md space-y-2">
                  <div className="flex justify-between items-center text-[10px] text-slate-500 uppercase font-mono">
                    <span className="font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">{ann.category}</span>
                    <span>{ann.date}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-100">{ann.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          6. MANAGE PRAYERS TAB
          ======================================================= */}
      {activeTab === 'admin-prayers' && (
        <div id="admin-prayers-view" className="space-y-6 animate-in fade-in duration-300">
          <div className="pb-3 border-b border-slate-800">
            <h1 className="text-2xl font-bold text-white">Prayer Wall Moderator</h1>
            <p className="text-xs text-slate-400 mt-1">Approve submitted requests to release them to the community prayer wall, or archive outdated ones.</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-850 text-slate-400 uppercase tracking-widest font-semibold">
                  <th className="px-5 py-4">Requestor Name</th>
                  <th className="px-5 py-4">Content</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Intercessors</th>
                  <th className="px-5 py-4 text-center">Action Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {prayerRequests.map((prayer) => (
                  <tr key={prayer.id} className="hover:bg-slate-905/20">
                    <td className="px-5 py-3 font-bold text-slate-300">{prayer.userName}</td>
                    <td className="px-5 py-3 max-w-xs truncate text-slate-400 italic">"{prayer.content}"</td>
                    <td className="px-5 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded font-extrabold uppercase text-[9px] ${
                        prayer.status === 'approved' 
                          ? 'bg-emerald-500/10 text-emerald-400' 
                          : prayer.status === 'pending'
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-slate-950 text-slate-500'
                      }`}>
                        {prayer.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-400 font-bold">{prayer.prayersCount} interceded</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2 justify-center">
                        {prayer.status !== 'approved' && (
                          <button
                            onClick={() => onUpdatePrayerStatus(prayer.id, 'approved')}
                            className="bg-emerald-500 text-slate-950 text-[10px] font-bold px-2 py-1 rounded"
                          >
                            Approve
                          </button>
                        )}
                        {prayer.status !== 'archived' && (
                          <button
                            onClick={() => onUpdatePrayerStatus(prayer.id, 'archived')}
                            className="bg-slate-800 hover:bg-slate-750 text-slate-300 text-[10px] font-bold px-2 py-1 rounded"
                          >
                            Archive
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          7. FINANCE LEDGERS TAB
          ======================================================= */}
      {activeTab === 'admin-finances' && (
        <div id="admin-finances-view" className="space-y-6 animate-in fade-in duration-300">
          <div className="pb-3 border-b border-slate-800 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">Administrative Finance Ledgers</h1>
              <p className="text-xs text-slate-400 mt-1">Audit log records of all digitised contributions, Tithes, and Special Mission funds.</p>
            </div>
            <div className="bg-slate-900 px-4 py-2 border border-slate-800 rounded-xl">
              <span className="text-[9px] text-slate-500 uppercase block font-semibold">Total Revenue Logs (Est)</span>
              <strong className="text-amber-400 text-sm font-black">${totalOfferingsValue.toLocaleString()}</strong>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-850 text-slate-400 uppercase tracking-widest font-semibold">
                  <th className="px-5 py-4">Receipt ID</th>
                  <th className="px-5 py-4">Giver Name</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Payment Option</th>
                  <th className="px-5 py-4">Receipt Date</th>
                  <th className="px-5 py-4 text-right">Contributed Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {giving.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-905/20 font-medium">
                    <td className="px-5 py-3 text-slate-500 font-mono text-[10px]">{g.id}</td>
                    <td className="px-5 py-3 text-slate-300 font-semibold">{g.userName}</td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-0.5 bg-slate-950 border border-slate-850 text-amber-500 rounded font-bold uppercase text-[9px]">
                        {g.category}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-400">{g.paymentMethod}</td>
                    <td className="px-5 py-3 text-slate-400 font-mono">{g.date}</td>
                    <td className="px-5 py-3 text-right font-bold text-white">${g.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          8. ATTENDANCE LOG TAB
          ======================================================= */}
      {activeTab === 'admin-attendance' && (
        <div id="admin-attendance-view" className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
          {/* Form */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl h-fit">
            <h2 className="text-base font-extrabold text-white mb-2">Record Service Attendance</h2>
            <p className="text-xs text-slate-400 mb-6">Manually record Sunday headcount data to feed demographic overview trend graphs.</p>

            {attendanceAddedMsg && (
              <div className="mb-4 p-3 bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs rounded-lg text-center font-semibold">
                Attendance Headcount Recorded! ✓
              </div>
            )}

            <form onSubmit={handleAddAttendanceSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Service Date</label>
                <input
                  type="date"
                  required
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Headcount Value</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={attendanceCount}
                  onChange={(e) => setAttendanceCount(parseInt(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Service Name</label>
                <input
                  type="text"
                  required
                  value={attendanceService}
                  onChange={(e) => setAttendanceService(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-200"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
              >
                <FileText className="h-4 w-4" />
                LOG HEADCOUNT ENTRY
              </button>
            </form>
          </div>

          {/* List Grid */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-sm font-bold uppercase text-slate-400 tracking-wider">Attendance Headcounts Logs</h2>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-850 text-slate-400 uppercase tracking-widest font-semibold">
                    <th className="px-5 py-4">Service Name</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4 text-right">Headcount Count</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {attendanceLogs.map((log, index) => (
                    <tr key={index} className="hover:bg-slate-905/20">
                      <td className="px-5 py-3.5 font-bold text-slate-200">{log.service}</td>
                      <td className="px-5 py-3.5 text-slate-400 font-mono">{log.date}</td>
                      <td className="px-5 py-3.5 text-right font-black text-amber-400">{log.count} heads</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          9. SYSTEM SETTINGS TAB
          ======================================================= */}
      {activeTab === 'admin-settings' && (
        <div id="admin-settings-view" className="max-w-xl mx-auto bg-slate-900 border border-slate-800 p-8 rounded-2xl space-y-8 animate-in fade-in duration-300">
          <div className="text-center pb-4 border-b border-slate-800">
            <h1 className="text-xl font-bold text-white">Global Platform Settings</h1>
            <p className="text-xs text-slate-400 mt-1">Configure registrations constraints, security access levels, and mail relays.</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Access Controls</h3>
              <div className="space-y-3 text-xs">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-300">Allow open registration for general public members</span>
                  <input type="checkbox" defaultChecked className="rounded border-slate-800 bg-slate-950 text-amber-500" />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-300">Require email authentication verification for new signs</span>
                  <input type="checkbox" className="rounded border-slate-800 bg-slate-950 text-amber-500" />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-300">Strict mode (Admins must approve registered clergy roles)</span>
                  <input type="checkbox" defaultChecked className="rounded border-slate-800 bg-slate-950 text-amber-500" />
                </label>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Financial Options</h3>
              <div className="space-y-3 text-xs">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-300">Auto-generate Annual Giving tax statement certificate</span>
                  <input type="checkbox" defaultChecked className="rounded border-slate-800 bg-slate-950 text-amber-500" />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-300">Allow anonymous checkout without account validation</span>
                  <input type="checkbox" defaultChecked className="rounded border-slate-800 bg-slate-950 text-amber-500" />
                </label>
              </div>
            </div>

            <button
              onClick={() => alert('Administrative system preferences successfully updated in persistent configurations.')}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider"
            >
              SAVE PLATFORM CONFIGS
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
