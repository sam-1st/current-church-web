/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, Sermon, Event, Announcement, PrayerRequest, GivingRecord, Notification } from './types';

// Unsplash church/spirituality images
export const IMAGES = {
  heroBg: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&q=80&w=1600', // Hill and sunset vibe
  crossHill: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&q=80&w=1600', // Cross silhouette
  worshipHands: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=600',
  openBible: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=80&w=600',
  prayerMan: 'https://images.unsplash.com/photo-1544764200-d834df210a22?auto=format&fit=crop&q=80&w=600',
  youthGroup: 'https://images.unsplash.com/photo-1526976734720-ce24896c3f11?auto=format&fit=crop&q=80&w=600',
  fastingBread: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=600',
  womenConference: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=600',
  fellowshipMen: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600',
  churchInterior: 'https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&q=80&w=800',
  preacher: 'https://images.unsplash.com/photo-1489426142537-5a3c0048afab?auto=format&fit=crop&q=80&w=800',
  charity: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800'
};

export const INITIAL_USERS: User[] = [
  {
    id: 'u-1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'member',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    phone: '+1 (555) 123-4567',
    bio: 'Devoted member of Faith Community since 2018. Active in the Men\'s Fellowship and community food drives.',
    dateJoined: '2018-04-12'
  },
  {
    id: 'u-2',
    name: 'Pastor James Andrew',
    email: 'james@example.com',
    role: 'clergy',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    phone: '+1 (555) 234-5678',
    bio: 'Lead Pastor at Faith Community Church. Passionate about expositional teaching of God\'s Word, counseling, and spiritual formation.',
    dateJoined: '2012-09-01'
  },
  {
    id: 'u-3',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    role: 'admin',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    phone: '+1 (555) 345-6789',
    bio: 'Church Operations & Finance Administrator. Connect with me for scheduling, registry, and giving statements.',
    dateJoined: '2015-06-15'
  },
  {
    id: 'u-4',
    name: 'Mary Johnson',
    email: 'mary@example.com',
    role: 'member',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    phone: '+1 (555) 456-7890',
    bio: 'Worship leader and high school teacher. Loves leading people into God\'s presence through song.',
    dateJoined: '2019-11-20'
  },
  {
    id: 'u-5',
    name: 'David Wilson',
    email: 'david@example.com',
    role: 'member',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    phone: '+1 (555) 567-8901',
    bio: 'Young professional seeking to grow spiritually and connect with other believers. Volunteer media tech.',
    dateJoined: '2021-02-05'
  },
  {
    id: 'u-6',
    name: 'Brother Thomas',
    email: 'thomas@example.com',
    role: 'clergy',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    phone: '+1 (555) 678-9012',
    bio: 'Associate Pastor focusing on Outreach Programs, Missions, and Pastoral Care.',
    dateJoined: '2016-10-10'
  },
  {
    id: 'u-7',
    name: 'Rachel Green',
    email: 'rachel@example.com',
    role: 'member',
    status: 'suspended',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    phone: '+1 (555) 789-0123',
    bio: 'Youth Mentor. Temporarily on leave.',
    dateJoined: '2020-01-15'
  }
];

export const INITIAL_SERMONS: Sermon[] = [
  {
    id: 's-1',
    title: 'Faith That Moves Mountains',
    speaker: 'Pastor James Andrew',
    date: '2025-05-18',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Standard dummy embed
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    pdfUrl: 'Faith_Moves_Mountains_Sermon_Notes.pdf',
    duration: '38:45',
    views: 312,
    tags: ['Faith', 'Trust', 'Christian Walk', 'Encouragement'],
    thumbnail: IMAGES.worshipHands
  },
  {
    id: 's-2',
    title: 'The Power of Prayer',
    speaker: 'Pastor James Andrew',
    date: '2025-05-11',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    pdfUrl: 'Power_of_Prayer_Outline.pdf',
    duration: '42:15',
    views: 245,
    tags: ['Prayer', 'Spiritual Discipline', 'Relationship with God'],
    thumbnail: IMAGES.prayerMan
  },
  {
    id: 's-3',
    title: 'Walking in God\'s Purpose',
    speaker: 'Brother Thomas',
    date: '2025-05-04',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    pdfUrl: 'Walking_In_Gods_Purpose.pdf',
    duration: '35:20',
    views: 189,
    tags: ['Purpose', 'Calling', 'Decision Making'],
    thumbnail: IMAGES.openBible
  }
];

export const INITIAL_EVENTS: Event[] = [
  {
    id: 'e-1',
    title: 'Prayer & Fasting',
    date: '2025-05-28',
    time: '6:00 PM',
    description: 'Join us in the Main Sanctuary as we humble ourselves before God in corporate prayer and fasting, interceding for our families, the church, and our nation.',
    location: 'Main Sanctuary & Online',
    image: IMAGES.fastingBread,
    registeredUsers: ['u-1', 'u-4', 'u-5'],
    category: 'Prayer'
  },
  {
    id: 'e-2',
    title: 'Youth Convention 2025',
    date: '2025-05-30',
    time: '9:00 AM',
    description: 'A 4-day power-packed encounter for youth and young adults. Dynamic guest speakers, high-energy praise & worship, workshops, and deep community bonding.',
    location: 'Faith Fellowship Hall',
    image: IMAGES.youthGroup,
    registeredUsers: ['u-4', 'u-5'],
    category: 'Youth'
  },
  {
    id: 'e-3',
    title: 'Women\'s Conference',
    date: '2025-06-15',
    time: '10:00 AM',
    description: 'An inspiring day of teaching, fellowship, and renewal for women of all ages. Theme: "Rooted & Grounded in His Love". Catered lunch included.',
    location: 'Grace Community Center',
    image: IMAGES.womenConference,
    registeredUsers: ['u-3', 'u-4'],
    category: 'Conference'
  },
  {
    id: 'e-4',
    title: 'Men\'s Fellowship',
    date: '2025-06-07',
    time: '8:00 AM',
    description: 'A hearty breakfast followed by a vital discussion on authentic biblical manhood and peer accountability. Iron sharpens iron!',
    location: 'Fellowship Hall',
    image: IMAGES.fellowshipMen,
    registeredUsers: ['u-1'],
    category: 'Community'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a-1',
    title: 'Youth Convention 2025 Details',
    content: 'Registration is now fully open! Early bird rates extend until May 15th. Sign up via the Events page or at the foyer desk on Sunday. T-shirt and meals are included.',
    date: '2025-05-10',
    category: 'Youth'
  },
  {
    id: 'a-2',
    title: 'Weekly Bible Study Online',
    content: 'We are starting a new study in the Book of Ephesians. Join Pastor James on Zoom every Wednesday at 7:30 PM. Download the outline from your Member Portal sermons area.',
    date: '2025-05-14',
    category: 'Ministries'
  },
  {
    id: 'a-3',
    title: 'Summer Missions Support',
    content: 'Our short-term missions team is heading to Mexico this July. Please support them in prayer, and if led, mark your next gift category as "Missions" to sponsor their travel expenses.',
    date: '2025-05-20',
    category: 'Events'
  }
];

export const INITIAL_PRAYER_REQUESTS: PrayerRequest[] = [
  {
    id: 'p-1',
    userId: 'u-5',
    userName: 'Anonymous',
    content: 'Please pray for physical healing. Facing a major surgery next Thursday and seeking peace, wisdom for the surgeons, and complete restoration.',
    date: '2025-05-27',
    status: 'pending',
    prayersCount: 14,
    prayingUsers: ['u-1', 'u-2', 'u-4'],
    isAnonymous: true
  },
  {
    id: 'p-2',
    userId: 'u-4',
    userName: 'Mary Johnson',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    content: 'Pray for my family. My grandmother is in the hospital, and we need strength, comfort, and unity during this challenging medical diagnosis.',
    date: '2025-05-26',
    status: 'pending',
    prayersCount: 22,
    prayingUsers: ['u-1', 'u-3', 'u-5', 'u-6'],
    isAnonymous: false
  },
  {
    id: 'p-3',
    userId: 'u-5',
    userName: 'David Wilson',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    content: 'Pray for job opportunity. Have been searching for 3 months after a layoff and have a final-round interview this Friday. Praying for open doors.',
    date: '2025-05-25',
    status: 'approved',
    prayersCount: 18,
    prayingUsers: ['u-2', 'u-6'],
    isAnonymous: false
  },
  {
    id: 'p-4',
    userId: 'u-1',
    userName: 'John Doe',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    content: 'Thanksgiving! Celebrating my daughter\'s successful graduation and safe journey back home. God is indeed faithful.',
    date: '2025-05-20',
    status: 'prayed_for',
    prayersCount: 30,
    prayingUsers: ['u-2', 'u-3', 'u-4', 'u-5', 'u-6'],
    isAnonymous: false
  }
];

export const INITIAL_GIVING: GivingRecord[] = [
  {
    id: 'g-1',
    userId: 'u-1',
    userName: 'John Doe',
    amount: 1250,
    category: 'Tithe',
    date: '2025-05-15',
    paymentMethod: 'Credit Card'
  },
  {
    id: 'g-2',
    userId: 'u-4',
    userName: 'Mary Johnson',
    amount: 350,
    category: 'Offering',
    date: '2025-05-18',
    paymentMethod: 'Bank Transfer'
  },
  {
    id: 'g-3',
    userId: 'u-5',
    userName: 'David Wilson',
    amount: 100,
    category: 'Missions',
    date: '2025-05-20',
    paymentMethod: 'Apple Pay'
  },
  {
    id: 'g-4',
    userId: 'u-1',
    userName: 'John Doe',
    amount: 500,
    category: 'Building Fund',
    date: '2025-05-02',
    paymentMethod: 'Credit Card'
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'n-1',
    userId: 'u-1',
    title: 'Prayer request updated',
    content: 'Your prayer request "Successful Graduation" was marked as Prayed For by 30 members.',
    date: '2025-05-21',
    isRead: false,
    type: 'success'
  },
  {
    id: 'n-2',
    userId: 'u-1',
    title: 'New Event Available',
    content: 'Registration for "Youth Convention 2025" is now officially open.',
    date: '2025-05-12',
    isRead: true,
    type: 'info'
  },
  {
    id: 'n-3',
    userId: 'u-1',
    title: 'Urgent Announcement',
    content: 'Renovations in the Fellowship Hall start next week. Watch your parking spaces.',
    date: '2025-05-19',
    isRead: false,
    type: 'alert'
  }
];

// For the Admin overview
export const SYSTEM_STATS = {
  totalMembers: 1248,
  totalMembersGrowth: '+12% this month',
  todayAttendance: 356,
  todayAttendanceGrowth: '+8% than last week',
  totalOfferings: 18650,
  totalOfferingsGrowth: '+16% than last month',
  newRegistrations: 28,
  newRegistrationsGrowth: '+5% this week'
};

// Simulated gallery items
export const GALLERY_ITEMS = [
  {
    id: 'gal-1',
    title: 'Sunday Praise & Worship',
    image: IMAGES.worshipHands,
    category: 'Worship'
  },
  {
    id: 'gal-2',
    title: 'Youth Night Outdoors',
    image: IMAGES.youthGroup,
    category: 'Youth'
  },
  {
    id: 'gal-3',
    title: 'Main Sanctuary Cross',
    image: IMAGES.crossHill,
    category: 'Sanctuary'
  },
  {
    id: 'gal-4',
    title: 'Community Outreach Meals',
    image: IMAGES.charity,
    category: 'Community'
  },
  {
    id: 'gal-5',
    title: 'Morning Prayer Circle',
    image: IMAGES.prayerMan,
    category: 'Worship'
  },
  {
    id: 'gal-6',
    title: 'The Preacher Pulpit',
    image: IMAGES.preacher,
    category: 'Service'
  }
];
