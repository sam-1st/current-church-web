/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'member' | 'clergy' | 'admin';
export type UserStatus = 'active' | 'suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  phone?: string;
  bio?: string;
  dateJoined: string;
}

export interface Sermon {
  id: string;
  title: string;
  speaker: string;
  date: string;
  videoUrl: string;
  audioUrl: string;
  pdfUrl?: string;
  duration: string;
  views: number;
  tags: string[];
  thumbnail: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  location: string;
  image: string;
  registeredUsers: string[]; // User IDs of members who registered
  category: 'Worship' | 'Youth' | 'Community' | 'Conference' | 'Prayer';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'General' | 'Youth' | 'Events' | 'Urgent' | 'Ministries';
}

export interface PrayerRequest {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  date: string;
  status: 'pending' | 'approved' | 'prayed_for' | 'archived';
  prayersCount: number;
  prayingUsers: string[]; // User IDs of people praying
  isAnonymous?: boolean;
}

export type GivingCategory = 'Tithe' | 'Offering' | 'Missions' | 'Building Fund' | 'Other';

export interface GivingRecord {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  category: GivingCategory;
  date: string;
  paymentMethod: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  content: string;
  date: string;
  isRead: boolean;
  type: 'info' | 'success' | 'alert';
}
