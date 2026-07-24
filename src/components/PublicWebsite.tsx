/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { Play, Calendar, MapPin, Clock, ArrowRight, Heart, Send, CheckCircle, Search, Sparkles, Phone, Mail, Award } from 'lucide-react';
import { Sermon, Event, GivingCategory, User } from '../types';
import { IMAGES, GALLERY_ITEMS } from '../data';

interface PublicWebsiteProps {
  activeSection: string;
  setActiveSection: (sec: string) => void;
  sermons: Sermon[];
  events: Event[];
  currentUser: User | null;
  onPlaySermon: (sermon: Sermon) => void;
  onOpenLogin: () => void;
  onRegisterForEvent: (eventId: string) => void;
  onAddGiving: (amount: number, category: GivingCategory, method: string) => void;
}

export default function PublicWebsite({
  activeSection,
  setActiveSection,
  sermons,
  events,
  currentUser,
  onPlaySermon,
  onOpenLogin,
  onRegisterForEvent,
  onAddGiving
}: PublicWebsiteProps) {
  // Give tab state
  const [giveAmount, setGiveAmount] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [giveCategory, setGiveCategory] = useState<GivingCategory>('Tithe');
  const [paymentMethod, setPaymentMethod] = useState<string>('Credit Card');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [givingCompleted, setGivingCompleted] = useState(false);
  const [generatedReceipt, setGeneratedReceipt] = useState<any>(null);

  // Sermons state
  const [sermonSearch, setSermonSearch] = useState('');
  const [selectedSermonTag, setSelectedSermonTag] = useState<string>('All');

  // Contact state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Home Quick Registration CTA State
  const [ctaName, setCtaName] = useState('');
  const [ctaEmail, setCtaEmail] = useState('');

  // Handle Giving submission
  const handleGiveSubmit = (e: FormEvent) => {
    e.preventDefault();
    const finalAmount = customAmount ? parseFloat(customAmount) : giveAmount;
    if (isNaN(finalAmount) || finalAmount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    if (!currentUser) {
      alert('Please log in first to record your giving in your giving history profile.');
      onOpenLogin();
      return;
    }

    onAddGiving(finalAmount, giveCategory, paymentMethod);
    setGeneratedReceipt({
      id: `REC-${Date.now()}`,
      amount: finalAmount,
      category: giveCategory,
      date: new Date().toLocaleDateString(),
      method: paymentMethod,
      name: currentUser.name
    });
    setGivingCompleted(true);
    // Reset inputs
    setCustomAmount('');
    setCardName('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
  };

  // Handle Quick Contact submission
  const handleContactSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMsg) return;
    setContactSubmitted(true);
    setTimeout(() => {
      setContactName('');
      setContactEmail('');
      setContactMsg('');
    }, 1000);
  };

  // Filter Sermons
  const filteredSermons = sermons.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(sermonSearch.toLowerCase()) || 
                          s.speaker.toLowerCase().includes(sermonSearch.toLowerCase());
    const matchesTag = selectedSermonTag === 'All' || s.tags.includes(selectedSermonTag);
    return matchesSearch && matchesTag;
  });

  // Extract all unique sermon tags
  const allTags = ['All', ...Array.from(new Set(sermons.flatMap(s => s.tags)))];

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      {/* 1. HOME SECTION */}
      {activeSection === 'home' && (
        <div id="home-view" className="space-y-20 pb-20">
          {/* Hero Section */}
          <section 
            className="relative min-h-[85vh] flex items-center justify-center bg-cover bg-center text-center px-4"
            style={{ 
              backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.45), rgba(2, 6, 23, 0.95)), url(${IMAGES.heroBg})` 
            }}
          >
            <div className="absolute inset-0 bg-slate-950/25 backdrop-blur-[1px]" />
            <div className="relative max-w-4xl mx-auto space-y-8 py-12 z-10">
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider animate-pulse">
                <Sparkles className="h-3.5 w-3.5" />
                Welcome to Our Family
              </div>

              <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1] drop-shadow-lg font-sans">
                Growing in Faith. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">
                  Building Community.
                </span> <br />
                Changing Lives.
              </h1>

              <p className="text-lg md:text-xl text-slate-200 font-medium max-w-2xl mx-auto drop-shadow-md leading-relaxed">
                We are a vibrant, Bible-believing church that loves God, loves people, and seeks to make a positive impact in our local neighborhood and across the globe.
              </p>

              {/* Call to Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button
                  onClick={() => setActiveSection('about')}
                  className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-8 py-4 rounded-full shadow-xl hover:shadow-amber-500/20 text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2"
                >
                  I'm New Here
                  <ArrowRight className="h-4 w-4" />
                </button>
                {sermons.length > 0 && (
                  <button
                    onClick={() => onPlaySermon(sermons[0])}
                    className="w-full sm:w-auto bg-slate-900/60 hover:bg-slate-900 border border-slate-700 hover:border-amber-500 text-amber-400 font-bold px-8 py-4 rounded-full text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-sm"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    Watch Latest Sermon
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* Latest Sermons Section (Exactly like screenshot bottom section) */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-8">
              <div>
                <span className="text-xs font-bold text-amber-500 uppercase tracking-widest block">Inspirational Messages</span>
                <h2 className="text-3xl font-extrabold tracking-tight text-white mt-1">Latest Sermons</h2>
              </div>
              <button
                onClick={() => setActiveSection('sermons')}
                className="text-amber-400 hover:text-amber-300 text-sm font-semibold flex items-center gap-1.5 group transition-colors"
              >
                View All Sermons
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {sermons.slice(0, 3).map((sermon) => (
                <div
                  key={sermon.id}
                  className="group relative bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
                >
                  <div className="relative aspect-video overflow-hidden bg-slate-950">
                    <img
                      src={sermon.thumbnail}
                      alt={sermon.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60" />
                    <button
                      onClick={() => onPlaySermon(sermon)}
                      className="absolute inset-0 flex items-center justify-center"
                      aria-label={`Play sermon: ${sermon.title}`}
                    >
                      <div className="h-14 w-14 rounded-full bg-amber-500/90 text-slate-950 flex items-center justify-center shadow-2xl scale-95 group-hover:scale-100 group-hover:bg-amber-500 transition-all duration-300">
                        <Play className="h-6 w-6 fill-current translate-x-0.5" />
                      </div>
                    </button>
                    <span className="absolute bottom-3 right-3 text-[10px] bg-slate-950/80 text-slate-300 px-2 py-0.5 rounded font-mono">
                      {sermon.duration}
                    </span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-amber-500 bg-amber-500/10 font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                        {sermon.speaker}
                      </span>
                      <h3 className="text-lg font-bold text-slate-100 mt-3 group-hover:text-amber-300 transition-colors line-clamp-1">
                        {sermon.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Recorded on {new Date(sermon.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-4">
                      {sermon.tags.slice(0, 2).map((tag, idx) => (
                        <span key={idx} className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Upcoming Events Section (Exactly like screenshot middle section) */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-8">
              <div>
                <span className="text-xs font-bold text-amber-500 uppercase tracking-widest block font-sans">Fellowship & Community</span>
                <h2 className="text-3xl font-extrabold tracking-tight text-white mt-1">Upcoming Events</h2>
              </div>
              <button
                onClick={() => setActiveSection('events')}
                className="text-amber-400 hover:text-amber-300 text-sm font-semibold flex items-center gap-1.5 group transition-colors"
              >
                View Event Calendar
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {events.slice(0, 3).map((event) => {
                const isRegistered = currentUser && event.registeredUsers.includes(currentUser.id);
                return (
                  <div
                    key={event.id}
                    className="bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg hover:border-amber-500/20 transition-all duration-300 flex flex-col h-full"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-slate-950/40" />
                      <span className="absolute top-3 left-3 text-[10px] bg-amber-500 text-slate-950 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {event.category}
                      </span>
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex flex-col space-y-1.5 text-xs text-slate-400">
                          <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            {event.time}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-100 mt-2.5 line-clamp-1">{event.title}</h3>
                        <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">{event.description}</p>
                      </div>

                      <div className="border-t border-slate-800/60 pt-4 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-500" />
                          <span className="truncate max-w-[120px]">{event.location}</span>
                        </span>

                        <button
                          onClick={() => onRegisterForEvent(event.id)}
                          className={`text-xs font-bold px-4 py-2 rounded-lg transition-all ${
                            isRegistered
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                          }`}
                        >
                          {isRegistered ? 'Registered ✓' : 'Register Now'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Quick Registration CTA Section */}
          <section className="bg-slate-900 border-y border-amber-500/10 py-16 px-4">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <h2 className="text-3xl font-extrabold text-white">Join our Faith Community Weekly Letter</h2>
              <p className="text-sm text-slate-300 max-w-xl mx-auto">
                Get scripture devotionals, news about fellowship opportunities, sermon digests, and upcoming events delivered straight to your mailbox.
              </p>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!ctaEmail) return;
                  alert(`Thank you! ${ctaEmail} has been added to our digital list.`);
                  setCtaEmail('');
                  setCtaName('');
                }}
                className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2"
              >
                <input
                  type="text"
                  placeholder="First name"
                  value={ctaName}
                  onChange={(e) => setCtaName(e.target.value)}
                  className="w-full sm:flex-1 bg-slate-950 border border-slate-800 rounded-full px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
                />
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={ctaEmail}
                  onChange={(e) => setCtaEmail(e.target.value)}
                  className="w-full sm:flex-1 bg-slate-950 border border-slate-800 rounded-full px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-3 rounded-full text-xs uppercase tracking-wider transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </section>

          {/* Gallery Section */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Our Shared Moments</span>
              <h2 className="text-3xl font-extrabold text-white mt-1">Church Gallery</h2>
              <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto">
                A glimpse into our worship services, youth fellowships, and missionary outings serving our community.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {GALLERY_ITEMS.map((item) => (
                <div
                  key={item.id}
                  className="relative group aspect-square rounded-xl overflow-hidden bg-slate-900 shadow-md border border-slate-800"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3" />
                  <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 text-left">
                    <span className="text-[8px] bg-amber-500 text-slate-950 font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider block w-fit">
                      {item.category}
                    </span>
                    <h4 className="text-[10px] font-bold text-slate-100 mt-1 truncate">{item.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* 2. ABOUT SECTION */}
      {activeSection === 'about' && (
        <div id="about-view" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
          <div className="text-center space-y-4">
            <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Our Mission & Identity</span>
            <h1 className="text-4xl font-extrabold text-white">About Faith Community Church</h1>
            <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
              We stand as a lighthouse of God's grace in our city, preaching the solid foundation of Jesus Christ and gathering to grow in spirit.
            </p>
          </div>

          {/* Beliefs & Statements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl space-y-4">
              <div className="h-10 w-10 bg-amber-500/10 text-amber-400 rounded-lg flex items-center justify-center font-bold text-lg">01</div>
              <h3 className="text-lg font-bold text-slate-100">Our Beliefs</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                We believe the Bible is the inspired, infallible Word of God. We believe in the Father, Son, and Holy Spirit, and that salvation is found through personal faith in Jesus Christ alone.
              </p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl space-y-4">
              <div className="h-10 w-10 bg-amber-500/10 text-amber-400 rounded-lg flex items-center justify-center font-bold text-lg">02</div>
              <h3 className="text-lg font-bold text-slate-100">Our Vision</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                To build a modern, inclusive family of disciples who active worship, authentic fellowship, compassionate outreach, and deep maturity of spirit, touching lives everywhere.
              </p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl space-y-4">
              <div className="h-10 w-10 bg-amber-500/10 text-amber-400 rounded-lg flex items-center justify-center font-bold text-lg">03</div>
              <h3 className="text-lg font-bold text-slate-100">Our Core Values</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Grace-centered fellowship, Biblical faithfulness, active spiritual growth, selfless service to our neighbors, and raising the next generation in God's purposeful walk.
              </p>
            </div>
          </div>

          {/* Detailed History & Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Our Journey of Faith</h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Established in 2004 with a small living room prayer circle of just eight families, Faith Community Church has grown into a spiritual home for over a thousand members. Under the guidance of Pastor James Andrew, we expanded our main worship sanctuary and instituted multiple community outreaches, food banks, and youth scholarships.
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">
                Through all our seasons, our core focus has never wavered: to know Jesus, and to make Him known with humility, active hospitality, and profound biblical truth.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-xl max-h-[350px]">
              <img
                src={IMAGES.churchInterior}
                alt="Church Worship Sanctuary"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Leaders section */}
          <div className="space-y-10">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white">Our Pastoral & Leadership Staff</h2>
              <p className="text-xs text-slate-400 mt-1">Devoted shepherds and administrators committed to serving our local flock.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl text-center space-y-4">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200"
                  alt="Pastor James Andrew"
                  className="w-24 h-24 rounded-full object-cover mx-auto border border-amber-500/30"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-bold text-slate-100 text-lg">Pastor James Andrew</h4>
                  <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider mt-1">Lead Pastor</p>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Serving Faith Community for over 12 years. Passionate about expositional teaching and family counseling.
                </p>
              </div>

              <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl text-center space-y-4">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200"
                  alt="Brother Thomas"
                  className="w-24 h-24 rounded-full object-cover mx-auto border border-amber-500/30"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-bold text-slate-100 text-lg">Brother Thomas</h4>
                  <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider mt-1">Associate Pastor</p>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Focusing on global missions, community food programs, and young adult discipleship.
                </p>
              </div>

              <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl text-center space-y-4">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200"
                  alt="Sarah Johnson"
                  className="w-24 h-24 rounded-full object-cover mx-auto border border-amber-500/30"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-bold text-slate-100 text-lg">Sarah Johnson</h4>
                  <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider mt-1">Church Administrator</p>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Managing operations, registrations, ministries coordination, and weekly schedules with precision.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. MINISTRIES SECTION */}
      {activeSection === 'ministries' && (
        <div id="ministries-view" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
          <div className="text-center space-y-4">
            <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Connect & Serve</span>
            <h1 className="text-4xl font-extrabold text-white">Our Ministries</h1>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              We have a place for everyone. Discover our weekly group gatherings and ministries designed to help you grow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Worship Ministry */}
            <div className="bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg flex flex-col sm:flex-row">
              <div className="sm:w-2/5 relative h-48 sm:h-auto overflow-hidden">
                <img
                  src={IMAGES.worshipHands}
                  alt="Worship Ministry"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 sm:w-3/5 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-100">Praise & Worship</h3>
                  <p className="text-xs text-amber-500 font-semibold mt-1">Rehearsals: Thursdays at 7:00 PM</p>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Leading the congregation in dynamic, spirit-filled worship during Sunday services. Join our choir, band, or audio/visual media team.
                  </p>
                </div>
                <button 
                  onClick={() => setActiveSection('contact')} 
                  className="text-amber-400 hover:text-amber-300 font-bold text-xs flex items-center gap-1 group self-start"
                >
                  Inquire to Join
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Youth Ministry */}
            <div className="bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg flex flex-col sm:flex-row">
              <div className="sm:w-2/5 relative h-48 sm:h-auto overflow-hidden">
                <img
                  src={IMAGES.youthGroup}
                  alt="Youth Ministry"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 sm:w-3/5 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-100">Faith Youth Catalyst</h3>
                  <p className="text-xs text-amber-500 font-semibold mt-1">Fridays at 6:30 PM (Ages 12-18)</p>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    A vibrant space for high school students to gather for high-energy fellowship, peer groups, and relevant scriptures guidance.
                  </p>
                </div>
                <button 
                  onClick={() => setActiveSection('contact')} 
                  className="text-amber-400 hover:text-amber-300 font-bold text-xs flex items-center gap-1 group self-start"
                >
                  Inquire to Join
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Men's Ministry */}
            <div className="bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg flex flex-col sm:flex-row">
              <div className="sm:w-2/5 relative h-48 sm:h-auto overflow-hidden">
                <img
                  src={IMAGES.fellowshipMen}
                  alt="Men's Ministry"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 sm:w-3/5 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-100">Men's Fellowship</h3>
                  <p className="text-xs text-amber-500 font-semibold mt-1">1st Saturday Breakfast at 8:00 AM</p>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Empowering men to grow in spiritual leadership, integrity, and authentic brotherly support through prayer and accountability.
                  </p>
                </div>
                <button 
                  onClick={() => setActiveSection('contact')} 
                  className="text-amber-400 hover:text-amber-300 font-bold text-xs flex items-center gap-1 group self-start"
                >
                  Inquire to Join
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Women's Ministry */}
            <div className="bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg flex flex-col sm:flex-row">
              <div className="sm:w-2/5 relative h-48 sm:h-auto overflow-hidden">
                <img
                  src={IMAGES.womenConference}
                  alt="Women's Ministry"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 sm:w-3/5 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-100">Grace Women's Circle</h3>
                  <p className="text-xs text-amber-500 font-semibold mt-1">Tuesdays at 10:00 AM & 7:00 PM</p>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    A multi-generational circle of ladies dedicated to studying God's Word, praying for our families, and organizing church outreaches.
                  </p>
                </div>
                <button 
                  onClick={() => setActiveSection('contact')} 
                  className="text-amber-400 hover:text-amber-300 font-bold text-xs flex items-center gap-1 group self-start"
                >
                  Inquire to Join
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. SERMONS SECTION */}
      {activeSection === 'sermons' && (
        <div id="sermons-view" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
          <div className="text-center space-y-4">
            <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Inspirational Teaching</span>
            <h1 className="text-4xl font-extrabold text-white">Sermon Archives</h1>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              Watch Sunday service streams, listen to past audio recordings, or download study notes for your personal devotionals.
            </p>
          </div>

          {/* Search & Tag filter */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search by sermon title or speaker..."
                value={sermonSearch}
                onChange={(e) => setSermonSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Tag filters */}
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedSermonTag(tag)}
                  className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition-all ${
                    selectedSermonTag === tag
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Sermons Grid */}
          {filteredSermons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredSermons.map((sermon) => (
                <div
                  key={sermon.id}
                  className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:border-amber-500/20 transition-all flex flex-col h-full"
                >
                  <div className="relative aspect-video bg-slate-950 overflow-hidden">
                    <img
                      src={sermon.thumbnail}
                      alt={sermon.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60" />
                    <button
                      onClick={() => onPlaySermon(sermon)}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="h-12 w-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg transform scale-95 group-hover:scale-100 transition-all duration-300">
                        <Play className="h-5 w-5 fill-current translate-x-0.5" />
                      </div>
                    </button>
                    <span className="absolute bottom-3 right-3 text-[10px] bg-slate-950/80 text-slate-300 px-2 py-0.5 rounded font-mono">
                      {sermon.duration}
                    </span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                        <span>{sermon.speaker}</span>
                        <span>{new Date(sermon.date).toLocaleDateString()}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-100 mt-2 line-clamp-2 hover:text-amber-400 cursor-pointer transition-colors" onClick={() => onPlaySermon(sermon)}>
                        {sermon.title}
                      </h3>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-800/50 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {sermon.tags.slice(0, 2).map((tag, idx) => (
                          <span key={idx} className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => onPlaySermon(sermon)}
                        className="text-xs font-bold text-amber-400 hover:underline"
                      >
                        Listen Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl">
              <p className="text-slate-400 text-sm">No sermons found matching your search. Please try another tag or keywords.</p>
            </div>
          )}
        </div>
      )}

      {/* 5. EVENTS SECTION */}
      {activeSection === 'events' && (
        <div id="events-view" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
          <div className="text-center space-y-4">
            <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Gathering Together</span>
            <h1 className="text-4xl font-extrabold text-white">Event Calendar</h1>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              Discover and register for upcoming gatherings, conferences, seminars, and special services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {events.map((event) => {
              const isRegistered = currentUser && event.registeredUsers.includes(currentUser.id);
              return (
                <div
                  key={event.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:border-amber-500/20 transition-all duration-300 flex flex-col sm:flex-row h-full"
                >
                  <div className="sm:w-2/5 relative h-48 sm:h-auto overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-slate-950/40" />
                    <span className="absolute top-3 left-3 text-[9px] bg-amber-500 text-slate-950 font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                      {event.category}
                    </span>
                  </div>

                  <div className="p-6 sm:w-3/5 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="space-y-1 text-xs text-slate-400">
                        <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-slate-500" />
                          {event.time}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-100 mt-2">{event.title}</h3>
                      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{event.description}</p>
                    </div>

                    <div className="border-t border-slate-800/60 pt-4 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="truncate max-w-[100px]">{event.location}</span>
                      </span>

                      <button
                        onClick={() => onRegisterForEvent(event.id)}
                        className={`text-xs font-bold px-4 py-2 rounded-lg transition-all ${
                          isRegistered
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                        }`}
                      >
                        {isRegistered ? 'Registered ✓' : 'Register Now'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. GIVE SECTION */}
      {activeSection === 'give' && (
        <div id="give-view" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
          <div className="text-center space-y-4">
            <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Generosity & Support</span>
            <h1 className="text-4xl font-extrabold text-white">Digital Giving Portal</h1>
            <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
              "Every man shall give as he is able, according to the blessing of the Lord your God which He has given you." — Deuteronomy 16:17
            </p>
          </div>

          {!givingCompleted ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl">
              {/* Form details */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-100">Select Offering Amount</h3>
                  <p className="text-xs text-slate-400 mt-1">Choose a preset amount or type your custom gift value.</p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[25, 50, 100, 250, 500, 1000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setGiveAmount(preset);
                        setCustomAmount('');
                      }}
                      className={`py-3.5 px-4 rounded-xl text-sm font-bold border transition-all ${
                        giveAmount === preset && !customAmount
                          ? 'bg-amber-500 text-slate-950 border-amber-500'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      ${preset}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                    Or Enter Custom Amount ($)
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 150"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setGiveAmount(0);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                      Allocation Category
                    </label>
                    <select
                      value={giveCategory}
                      onChange={(e) => setGiveCategory(e.target.value as GivingCategory)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
                    >
                      <option value="Tithe">Tithe (10%)</option>
                      <option value="Offering">General Offering</option>
                      <option value="Missions">Missions & Global Support</option>
                      <option value="Building Fund">Building Renovations</option>
                      <option value="Other">Special Project</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                      Payment Option
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
                    >
                      <option value="Credit Card">Credit / Debit Card</option>
                      <option value="Bank Transfer">Direct Bank Transfer</option>
                      <option value="Apple Pay">Apple Pay</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment simulation info */}
              <form onSubmit={handleGiveSubmit} className="space-y-5 border-t md:border-t-0 md:border-l border-slate-800 pt-6 md:pt-0 md:pl-8 flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-slate-200">Secure Payment Information</h3>
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] rounded-lg">
                    🛡️ This is a simulated checkout demo representing a real checkout screen. Gifts will write instantly to your member profile's private ledger logs!
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">Cardholder Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Johnathan Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">Card Number</label>
                    <input
                      type="text"
                      required
                      placeholder="4111 2222 3333 4444"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5">Expiration (MM/YY)</label>
                      <input
                        type="text"
                        required
                        placeholder="12/28"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5">CVV Code</label>
                      <input
                        type="password"
                        required
                        placeholder="•••"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold py-3.5 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all mt-4"
                >
                  <Heart className="h-4.5 w-4.5 fill-current" />
                  SUBMIT GIFT OF ${customAmount ? parseFloat(customAmount).toLocaleString() : giveAmount.toLocaleString()}
                </button>
              </form>
            </div>
          ) : (
            /* Giving Completed Confirmation */
            <div className="max-w-md mx-auto bg-slate-900 border border-amber-500/20 p-8 rounded-3xl shadow-2xl text-center space-y-6">
              <div className="h-16 w-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle className="h-8 w-8" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">Generosity Received!</h2>
                <p className="text-xs text-slate-400">
                  Your gift has been recorded in our ledgers and applied immediately. We thank you for supporting the Lord's house.
                </p>
              </div>

              {/* Gilded Certificate receipt */}
              <div className="border border-amber-500/30 bg-slate-950/60 p-5 rounded-2xl text-left space-y-3.5 relative overflow-hidden">
                <div className="absolute right-3 top-3 opacity-10">
                  <Award className="h-20 w-20 text-amber-500" />
                </div>
                <div className="text-center pb-2 border-b border-slate-800/80">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">Faith Community Church</span>
                  <span className="text-[8px] text-slate-500 uppercase block mt-0.5">Donation Receipt Certificate</span>
                </div>

                <div className="grid grid-cols-2 gap-y-2.5 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Contributor</span>
                    <strong className="text-slate-300 font-semibold">{generatedReceipt?.name}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Receipt ID</span>
                    <strong className="text-slate-300 font-mono text-[10px]">{generatedReceipt?.id}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Gift Amount</span>
                    <strong className="text-amber-400 font-extrabold text-sm">${generatedReceipt?.amount.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Allocation Category</span>
                    <strong className="text-slate-300 font-semibold">{generatedReceipt?.category}</strong>
                  </div>
                </div>

                <div className="pt-2 text-[9px] text-center text-slate-500 italic">
                  A copy of this statement is stored in your private dashboard for tax compilation.
                </div>
              </div>

              <button
                type="button"
                onClick={() => setGivingCompleted(false)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-colors"
              >
                Make Another Gift
              </button>
            </div>
          )}
        </div>
      )}

      {/* 7. CONTACT SECTION */}
      {activeSection === 'contact' && (
        <div id="contact-view" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
          <div className="text-center space-y-4">
            <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Connect with Us</span>
            <h1 className="text-4xl font-extrabold text-white">We'd Love to Hear From You</h1>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              Do you need prayer? Have questions about our ministries? Or want to schedule counseling? Reach out using the form.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Form */}
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl">
              {!contactSubmitted ? (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-100">Send an Inquiry</h3>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Sarah Jenkins"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="sarah@example.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">How can we help you?</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Write your message, prayer request, or question here..."
                      value={contactMsg}
                      onChange={(e) => setContactMsg(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold py-3 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <Send className="h-4 w-4" />
                    SEND MESSAGE
                  </button>
                </form>
              ) : (
                <div className="py-12 text-center space-y-4">
                  <div className="h-14 w-14 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                    <CheckCircle className="h-7 w-7" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-100">Inquiry Sent!</h3>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                    Thank you! We received your message and our administrative staff or Pastor will get back to you within 48 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setContactSubmitted(false)}
                    className="bg-slate-800 hover:bg-slate-700 text-xs px-4 py-2 rounded-lg font-semibold text-slate-300 transition-colors mt-2"
                  >
                    Send another message
                  </button>
                </div>
              )}
            </div>

            {/* General Info & map */}
            <div className="space-y-8 flex flex-col justify-between">
              <div className="space-y-6 text-slate-300">
                <h3 className="text-xl font-bold text-white">Faith Community Center</h3>

                <div className="space-y-4 text-xs">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-100 block">Our Location</strong>
                      <span>777 Grace Avenue, Sanctuary Hill, CA 90210</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-100 block">Phone Line</strong>
                      <span>+1 (555) PRAY-NOW &nbsp;/&nbsp; +1 (555) 772-9669</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-100 block">Administrative Email</strong>
                      <span>office@faithcommunity.org</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service times card */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <h4 className="font-bold text-slate-200 text-sm mb-3">Service Gathering Hours</h4>
                <ul className="space-y-2 text-xs text-slate-400">
                  <li className="flex justify-between border-b border-slate-800 pb-2">
                    <strong>Sunday Worship & Sermon:</strong>
                    <span className="text-amber-400 font-semibold">10:00 AM — 11:45 AM</span>
                  </li>
                  <li className="flex justify-between border-b border-slate-800 pb-2">
                    <strong>Sunday School (Kids):</strong>
                    <span>10:30 AM — 11:30 AM</span>
                  </li>
                  <li className="flex justify-between">
                    <strong>Wednesday Midweek Prayer:</strong>
                    <span>7:30 PM — 8:30 PM (Zoom)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
