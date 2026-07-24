/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { User, Sermon, Event, Announcement, PrayerRequest, GivingRecord, Notification } from './types';
import {
  INITIAL_USERS,
  INITIAL_SERMONS,
  INITIAL_EVENTS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_PRAYER_REQUESTS,
  INITIAL_GIVING,
  INITIAL_NOTIFICATIONS
} from './data';

export function useChurchStore() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
  const [giving, setGiving] = useState<GivingRecord[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load from LocalStorage or initialize with mock data
  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem('fcc_users');
      const storedSermons = localStorage.getItem('fcc_sermons');
      const storedEvents = localStorage.getItem('fcc_events');
      const storedAnnouncements = localStorage.getItem('fcc_announcements');
      const storedPrayers = localStorage.getItem('fcc_prayers');
      const storedGiving = localStorage.getItem('fcc_giving');
      const storedNotifications = localStorage.getItem('fcc_notifications');
      const storedCurrentUser = localStorage.getItem('fcc_current_user');

      if (storedUsers) setUsers(JSON.parse(storedUsers));
      else {
        setUsers(INITIAL_USERS);
        localStorage.setItem('fcc_users', JSON.stringify(INITIAL_USERS));
      }

      if (storedSermons) setSermons(JSON.parse(storedSermons));
      else {
        setSermons(INITIAL_SERMONS);
        localStorage.setItem('fcc_sermons', JSON.stringify(INITIAL_SERMONS));
      }

      if (storedEvents) setEvents(JSON.parse(storedEvents));
      else {
        setEvents(INITIAL_EVENTS);
        localStorage.setItem('fcc_events', JSON.stringify(INITIAL_EVENTS));
      }

      if (storedAnnouncements) setAnnouncements(JSON.parse(storedAnnouncements));
      else {
        setAnnouncements(INITIAL_ANNOUNCEMENTS);
        localStorage.setItem('fcc_announcements', JSON.stringify(INITIAL_ANNOUNCEMENTS));
      }

      if (storedPrayers) setPrayerRequests(JSON.parse(storedPrayers));
      else {
        setPrayerRequests(INITIAL_PRAYER_REQUESTS);
        localStorage.setItem('fcc_prayers', JSON.stringify(INITIAL_PRAYER_REQUESTS));
      }

      if (storedGiving) setGiving(JSON.parse(storedGiving));
      else {
        setGiving(INITIAL_GIVING);
        localStorage.setItem('fcc_giving', JSON.stringify(INITIAL_GIVING));
      }

      if (storedNotifications) setNotifications(JSON.parse(storedNotifications));
      else {
        setNotifications(INITIAL_NOTIFICATIONS);
        localStorage.setItem('fcc_notifications', JSON.stringify(INITIAL_NOTIFICATIONS));
      }

      if (storedCurrentUser) {
        setCurrentUser(JSON.parse(storedCurrentUser));
      } else {
        // Default to public (not logged in) on start
        setCurrentUser(null);
      }
    } catch (e) {
      console.error('Error loading church store from localStorage', e);
      // Fallback
      setUsers(INITIAL_USERS);
      setSermons(INITIAL_SERMONS);
      setEvents(INITIAL_EVENTS);
      setAnnouncements(INITIAL_ANNOUNCEMENTS);
      setPrayerRequests(INITIAL_PRAYER_REQUESTS);
      setGiving(INITIAL_GIVING);
      setNotifications(INITIAL_NOTIFICATIONS);
    }
  }, []);

  // Sync helpers
  const saveUsers = (newUsers: User[]) => {
    setUsers(newUsers);
    localStorage.setItem('fcc_users', JSON.stringify(newUsers));
  };

  const saveSermons = (newSermons: Sermon[]) => {
    setSermons(newSermons);
    localStorage.setItem('fcc_sermons', JSON.stringify(newSermons));
  };

  const saveEvents = (newEvents: Event[]) => {
    setEvents(newEvents);
    localStorage.setItem('fcc_events', JSON.stringify(newEvents));
  };

  const saveAnnouncements = (newAnnouncements: Announcement[]) => {
    setAnnouncements(newAnnouncements);
    localStorage.setItem('fcc_announcements', JSON.stringify(newAnnouncements));
  };

  const savePrayers = (newPrayers: PrayerRequest[]) => {
    setPrayerRequests(newPrayers);
    localStorage.setItem('fcc_prayers', JSON.stringify(newPrayers));
  };

  const saveGiving = (newGiving: GivingRecord[]) => {
    setGiving(newGiving);
    localStorage.setItem('fcc_giving', JSON.stringify(newGiving));
  };

  const saveNotifications = (newNotifications: Notification[]) => {
    setNotifications(newNotifications);
    localStorage.setItem('fcc_notifications', JSON.stringify(newNotifications));
  };

  const saveCurrentUser = (user: User | null) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem('fcc_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('fcc_current_user');
    }
  };

  // Auth Operations
  const login = (email: string): { success: boolean; error?: string; user?: User } => {
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!user) {
      return { success: false, error: 'Email address not found. Please try "john@example.com", "james@example.com", or "sarah@example.com".' };
    }
    if (user.status === 'suspended') {
      return { success: false, error: 'This account has been temporarily suspended. Please contact administration.' };
    }
    saveCurrentUser(user);
    return { success: true, user };
  };

  const register = (
    name: string,
    email: string,
    role: 'member' | 'clergy',
    phone?: string,
    bio?: string
  ): { success: boolean; error?: string; user?: User } => {
    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase().trim());
    if (exists) {
      return { success: false, error: 'Email address is already registered.' };
    }

    const newUser: User = {
      id: `u-${Date.now()}`,
      name,
      email: email.toLowerCase().trim(),
      role,
      status: 'active',
      phone: phone || '',
      bio: bio || '',
      avatar: `https://images.unsplash.com/photo-${1535713875002 + Math.floor(Math.random() * 10000)}?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`,
      dateJoined: new Date().toISOString().split('T')[0]
    };

    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);
    saveCurrentUser(newUser);

    // Welcome notification
    addNotificationToUser(newUser.id, 'Welcome to Faith Community!', 'Thank you for registering. You now have access to the Member Portal.', 'success');

    return { success: true, user: newUser };
  };

  const logout = () => {
    saveCurrentUser(null);
  };

  // User Profile Updates
  const updateProfile = (userId: string, updates: Partial<User>) => {
    const updatedUsers = users.map((u) => {
      if (u.id === userId) {
        const updated = { ...u, ...updates };
        if (currentUser && currentUser.id === userId) {
          saveCurrentUser(updated);
        }
        return updated;
      }
      return u;
    });
    saveUsers(updatedUsers);
  };

  // Notification addition
  const addNotificationToUser = (userId: string, title: string, content: string, type: Notification['type'] = 'info') => {
    const newNotif: Notification = {
      id: `n-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      userId,
      title,
      content,
      date: new Date().toISOString().split('T')[0],
      isRead: false,
      type
    };
    saveNotifications([newNotif, ...notifications]);
  };

  // Sermons
  const addSermon = (newSermon: Omit<Sermon, 'id' | 'views'>) => {
    const sermon: Sermon = {
      ...newSermon,
      id: `s-${Date.now()}`,
      views: 0
    };
    saveSermons([sermon, ...sermons]);

    // Send notification to everyone
    users.forEach((u) => {
      addNotificationToUser(u.id, 'New Sermon Posted', `"${sermon.title}" by ${sermon.speaker} is now available to watch/listen.`, 'info');
    });
  };

  // Events
  const addEvent = (newEv: Omit<Event, 'id' | 'registeredUsers'>) => {
    const ev: Event = {
      ...newEv,
      id: `e-${Date.now()}`,
      registeredUsers: []
    };
    saveEvents([ev, ...events]);

    // Send notification to everyone
    users.forEach((u) => {
      addNotificationToUser(u.id, 'New Event Added', `Join us for "${ev.title}" on ${ev.date} at ${ev.time}.`, 'info');
    });
  };

  const registerForEvent = (eventId: string, userId: string) => {
    const updatedEvents = events.map((e) => {
      if (e.id === eventId) {
        if (e.registeredUsers.includes(userId)) return e;
        const registeredUsers = [...e.registeredUsers, userId];
        return { ...e, registeredUsers };
      }
      return e;
    });
    saveEvents(updatedEvents);
    addNotificationToUser(userId, 'Event Registration Success', `You are registered for "${events.find(e => e.id === eventId)?.title}".`, 'success');
  };

  const unregisterFromEvent = (eventId: string, userId: string) => {
    const updatedEvents = events.map((e) => {
      if (e.id === eventId) {
        const registeredUsers = e.registeredUsers.filter((id) => id !== userId);
        return { ...e, registeredUsers };
      }
      return e;
    });
    saveEvents(updatedEvents);
    addNotificationToUser(userId, 'Event Registration Cancelled', `You have cancelled your registration for "${events.find(e => e.id === eventId)?.title}".`, 'info');
  };

  // Announcements
  const addAnnouncement = (newAnn: Omit<Announcement, 'id' | 'date'>) => {
    const ann: Announcement = {
      ...newAnn,
      id: `a-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    saveAnnouncements([ann, ...announcements]);

    // Send notifications to appropriate roles
    users.forEach((u) => {
      addNotificationToUser(u.id, `Announcement: ${ann.title}`, ann.content, 'alert');
    });
  };

  // Prayers
  const addPrayerRequest = (content: string, isAnonymous: boolean, userId: string) => {
    const user = users.find(u => u.id === userId);
    const prayer: PrayerRequest = {
      id: `p-${Date.now()}`,
      userId: isAnonymous ? 'u-anonymous' : userId,
      userName: isAnonymous ? 'Anonymous' : (user?.name || 'Anonymous'),
      userAvatar: isAnonymous ? undefined : user?.avatar,
      content,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      prayersCount: 0,
      prayingUsers: [],
      isAnonymous
    };
    savePrayers([prayer, ...prayerRequests]);

    // Inform Admin and Clergy
    users.filter(u => u.role === 'admin' || u.role === 'clergy').forEach(admin => {
      addNotificationToUser(admin.id, 'New Prayer Request Submitted', `${prayer.userName} submitted a prayer request awaiting review.`, 'info');
    });
  };

  const addPrayerCount = (requestId: string, userId: string) => {
    const updatedPrayers = prayerRequests.map((p) => {
      if (p.id === requestId) {
        if (p.prayingUsers.includes(userId)) {
          // Toggle off
          const prayingUsers = p.prayingUsers.filter(id => id !== userId);
          return { ...p, prayingUsers, prayersCount: Math.max(0, p.prayersCount - 1) };
        } else {
          // Add prayer
          const prayingUsers = [...p.prayingUsers, userId];
          // Notify creator
          if (p.userId !== 'u-anonymous' && p.userId !== userId) {
            addNotificationToUser(p.userId, 'Someone is praying for you', `A church member has prayed for your request.`, 'success');
          }
          return { ...p, prayingUsers, prayersCount: p.prayersCount + 1 };
        }
      }
      return p;
    });
    savePrayers(updatedPrayers);
  };

  const updatePrayerStatus = (requestId: string, status: PrayerRequest['status']) => {
    const updatedPrayers = prayerRequests.map((p) => {
      if (p.id === requestId) {
        // Send status notification to requester
        if (p.userId !== 'u-anonymous') {
          let msg = '';
          if (status === 'approved') msg = 'Your prayer request is approved and posted to the community prayer wall.';
          if (status === 'prayed_for') msg = 'The church has prayed over your request in detail.';
          addNotificationToUser(p.userId, `Prayer Request Update`, msg, 'success');
        }
        return { ...p, status };
      }
      return p;
    });
    savePrayers(updatedPrayers);
  };

  // Giving
  const addGiving = (amount: number, category: GivingRecord['category'], paymentMethod: string, userId: string) => {
    const user = users.find(u => u.id === userId);
    const record: GivingRecord = {
      id: `g-${Date.now()}`,
      userId,
      userName: user?.name || 'Anonymous Giver',
      amount,
      category,
      date: new Date().toISOString().split('T')[0],
      paymentMethod
    };
    saveGiving([record, ...giving]);

    // Receipt notification
    addNotificationToUser(userId, 'Thank you for your giving!', `We received your donation of $${amount.toLocaleString()} for ${category}. God bless your generosity!`, 'success');

    // Notify Admin of offering
    users.filter(u => u.role === 'admin').forEach(admin => {
      addNotificationToUser(admin.id, 'New Offering Received', `${record.userName} donated $${amount.toLocaleString()} for ${category}.`, 'success');
    });
  };

  // Admin User management
  const addUser = (newUser: Omit<User, 'id' | 'dateJoined'>) => {
    const user: User = {
      ...newUser,
      id: `u-${Date.now()}`,
      dateJoined: new Date().toISOString().split('T')[0]
    };
    saveUsers([...users, user]);
  };

  const editUser = (userId: string, updates: Partial<User>) => {
    updateProfile(userId, updates);
  };

  const deleteUser = (userId: string) => {
    const updatedUsers = users.filter(u => u.id !== userId);
    saveUsers(updatedUsers);
    if (currentUser && currentUser.id === userId) {
      saveCurrentUser(null);
    }
  };

  const markNotificationRead = (notificationId: string) => {
    const updated = notifications.map(n => n.id === notificationId ? { ...n, isRead: true } : n);
    saveNotifications(updated);
  };

  const markAllNotificationsRead = (userId: string) => {
    const updated = notifications.map(n => n.userId === userId ? { ...n, isRead: true } : n);
    saveNotifications(updated);
  };

  return {
    currentUser,
    users,
    sermons,
    events,
    announcements,
    prayerRequests,
    giving,
    notifications,
    saveCurrentUser,
    login,
    register,
    logout,
    updateProfile,
    addSermon,
    addEvent,
    registerForEvent,
    unregisterFromEvent,
    addAnnouncement,
    addPrayerRequest,
    addPrayerCount,
    updatePrayerStatus,
    addGiving,
    addUser,
    editUser,
    deleteUser,
    markNotificationRead,
    markAllNotificationsRead
  };
}
