/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  LayoutDashboard,
  User,
  Megaphone,
  Calendar,
  BookOpen,
  Heart,
  DollarSign,
  CalendarDays,
  Bell,
  Settings,
  LogOut,
  Users,
  Shield,
  FileBarChart,
  Grid
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  role: UserRole;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  onGoBackToPublic: () => void;
  notificationsCount: number;
}

export default function Sidebar({
  role,
  activeTab,
  setActiveTab,
  onLogout,
  onGoBackToPublic,
  notificationsCount
}: SidebarProps) {
  
  // Tabs configuration depending on role
  const getTabs = () => {
    if (role === 'member') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'profile', label: 'My Profile', icon: User },
        { id: 'announcements', label: 'Announcements', icon: Megaphone },
        { id: 'events', label: 'Events', icon: Calendar },
        { id: 'sermons', label: 'Sermons', icon: BookOpen },
        { id: 'prayers', label: 'Prayer Requests', icon: Heart },
        { id: 'giving', label: 'Giving History', icon: DollarSign },
        { id: 'calendar', label: 'Calendar', icon: CalendarDays },
        { id: 'notifications', label: 'Notifications', icon: Bell, badgeCount: notificationsCount },
        { id: 'settings', label: 'Settings', icon: Settings }
      ];
    } else {
      // Clergy & Admin
      return [
        { id: 'admin-dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
        { id: 'admin-members', label: 'Members Directory', icon: Users },
        { id: 'admin-sermons', label: 'Manage Sermons', icon: BookOpen },
        { id: 'admin-events', label: 'Manage Events', icon: Calendar },
        { id: 'admin-announcements', label: 'Announcements', icon: Megaphone },
        { id: 'admin-prayers', label: 'Prayer Requests', icon: Heart },
        { id: 'admin-finances', label: 'Finance Ledgers', icon: DollarSign },
        { id: 'admin-attendance', label: 'Attendance Log', icon: FileBarChart },
        { id: 'admin-settings', label: 'System Settings', icon: Settings }
      ];
    }
  };

  const tabs = getTabs();

  return (
    <aside 
      id="portal-sidebar" 
      className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col h-full overflow-y-auto"
    >
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30">
            <Shield className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-white tracking-wide uppercase leading-tight">
              Faith Community
            </h2>
            <p className="text-[10px] text-amber-500 font-bold uppercase tracking-wider -mt-0.5">
              {role === 'member' ? 'Member Portal' : `${role} Admin`}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation list */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/5'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-slate-950' : 'text-slate-400 group-hover:text-slate-200'}`} />
                <span>{tab.label}</span>
              </div>
              {tab.badgeCount !== undefined && tab.badgeCount > 0 && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isActive ? 'bg-slate-950 text-amber-500' : 'bg-amber-500/10 text-amber-400'}`}>
                  {tab.badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <button
          onClick={onGoBackToPublic}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold rounded-lg text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-850 border border-slate-800 transition-colors"
        >
          <Grid className="h-4 w-4 text-amber-400/80" />
          Public Website
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold rounded-lg text-slate-400 hover:text-red-300 hover:bg-red-950/20 transition-colors"
        >
          <LogOut className="h-4 w-4 text-red-400/80" />
          Logout
        </button>
      </div>
    </aside>
  );
}
