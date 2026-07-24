/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { Play, Pause, Volume2, FileText, X, Video, Headphones, Download, Clock, Eye } from 'lucide-react';
import { Sermon } from '../types';

interface SermonPlayerModalProps {
  sermon: Sermon | null;
  onClose: () => void;
}

export default function SermonPlayerModal({ sermon, onClose }: SermonPlayerModalProps) {
  const [activeTab, setActiveTab] = useState<'video' | 'audio' | 'notes'>('video');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(2325); // ~38:45 in seconds
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Reset player on sermon change
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [sermon]);

  if (!sermon) return null;

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log('Audio playback error:', e));
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 2325);
    }
  };

  const handleSeek = (e: ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div id="sermon-player-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div 
        id="sermon-player-card"
        className="w-full max-w-3xl overflow-hidden rounded-2xl border border-amber-500/20 bg-slate-900 text-slate-100 shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
          <div>
            <span className="text-[10px] uppercase bg-amber-500/10 text-amber-400 font-semibold px-2 py-0.5 rounded">
              {sermon.speaker}
            </span>
            <h3 className="text-lg font-bold text-slate-200 mt-1">{sermon.title}</h3>
          </div>
          <button
            onClick={() => {
              if (audioRef.current) audioRef.current.pause();
              onClose();
            }}
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800"
            aria-label="Close sermon player"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 text-sm">
          <button
            onClick={() => {
              if (audioRef.current && isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
              }
              setActiveTab('video');
            }}
            className={`flex-1 py-3 flex items-center justify-center gap-2 border-b-2 font-medium transition-all ${
              activeTab === 'video' 
                ? 'border-amber-500 text-amber-400 bg-slate-900/50' 
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/20'
            }`}
          >
            <Video className="h-4 w-4" />
            Watch Video
          </button>
          <button
            onClick={() => setActiveTab('audio')}
            className={`flex-1 py-3 flex items-center justify-center gap-2 border-b-2 font-medium transition-all ${
              activeTab === 'audio' 
                ? 'border-amber-500 text-amber-400 bg-slate-900/50' 
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/20'
            }`}
          >
            <Headphones className="h-4 w-4" />
            Listen Audio
          </button>
          <button
            onClick={() => {
              if (audioRef.current && isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
              }
              setActiveTab('notes');
            }}
            className={`flex-1 py-3 flex items-center justify-center gap-2 border-b-2 font-medium transition-all ${
              activeTab === 'notes' 
                ? 'border-amber-500 text-amber-400 bg-slate-900/50' 
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/20'
            }`}
          >
            <FileText className="h-4 w-4" />
            Sermon Notes
          </button>
        </div>

        {/* Media Window */}
        <div className="flex-1 bg-slate-950 flex flex-col justify-center items-center min-h-[300px] overflow-y-auto">
          {activeTab === 'video' && (
            <div className="w-full h-full aspect-video">
              <iframe
                src={`${sermon.videoUrl}?autoplay=1&mute=0`}
                title={sermon.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {activeTab === 'audio' && (
            <div className="w-full p-8 flex flex-col items-center justify-center space-y-6">
              {/* Audio Source (simulated using standard copyright-free mp3s in useChurchStore) */}
              <audio
                ref={audioRef}
                src={sermon.audioUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
              />

              {/* Album art/visualizer */}
              <div className="relative w-40 h-40 rounded-2xl overflow-hidden shadow-xl border border-amber-500/20">
                <img
                  src={sermon.thumbnail}
                  alt="Sermon Thumbnail"
                  className={`w-full h-full object-cover transition-transform duration-1000 ${
                    isPlaying ? 'scale-105 rotate-1' : ''
                  }`}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent flex items-end justify-center p-4">
                  {isPlaying ? (
                    /* Animated EQ wave bars */
                    <div className="flex gap-1 items-end h-8 pb-1">
                      <div className="w-1 bg-amber-500 rounded-full animate-[pulse_1.2s_infinite] h-4" />
                      <div className="w-1 bg-amber-500 rounded-full animate-[pulse_0.8s_infinite] h-6" />
                      <div className="w-1 bg-amber-500 rounded-full animate-[pulse_1.5s_infinite] h-3" />
                      <div className="w-1 bg-amber-500 rounded-full animate-[pulse_1s_infinite] h-5" />
                    </div>
                  ) : (
                    <span className="text-xs text-amber-400 font-semibold tracking-wider uppercase">Audio Mode</span>
                  )}
                </div>
              </div>

              {/* Controls */}
              <div className="w-full max-w-md space-y-4 text-center">
                <div>
                  <h4 className="font-bold text-slate-100">{sermon.title}</h4>
                  <p className="text-sm text-slate-400">{sermon.speaker}</p>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full accent-amber-500 bg-slate-800 rounded-lg h-1.5 cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Audio Buttons */}
                <div className="flex justify-center items-center gap-6">
                  <button
                    onClick={togglePlay}
                    className="h-14 w-14 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                    aria-label={isPlaying ? 'Pause sermon' : 'Play sermon'}
                  >
                    {isPlaying ? <Pause className="h-6 w-6 fill-current" /> : <Play className="h-6 w-6 fill-current translate-x-0.5" />}
                  </button>
                </div>

                {/* Volume bar */}
                <div className="flex items-center justify-center gap-2 max-w-[200px] mx-auto text-slate-400">
                  <Volume2 className="h-4 w-4" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-full accent-amber-500 bg-slate-800 rounded-lg h-1 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="w-full p-8 overflow-y-auto space-y-6 text-slate-300">
              <div className="border-l-4 border-amber-500 pl-4 py-2">
                <h4 className="text-lg font-bold text-slate-100">Sermon Scripture Text</h4>
                <p className="text-sm text-amber-400 italic mt-1">Romans 12:1-2 & Hebrews 11:1-6</p>
              </div>

              <div className="space-y-4 text-sm leading-relaxed">
                <h5 className="font-bold text-amber-400 text-base uppercase tracking-wide">Key Points:</h5>
                <ol className="list-decimal list-inside space-y-3">
                  <li>
                    <strong className="text-slate-100">Faith is active, not passive:</strong> True faith requires us to step out of our comfort zones and trust the promptings of the Holy Spirit, even when we cannot see the final outcome.
                  </li>
                  <li>
                    <strong className="text-slate-100">Renewing the Mind:</strong> The transformation of our lives begins with the alignment of our thoughts with God's absolute truths, separating ourselves from worldly patterns.
                  </li>
                  <li>
                    <strong className="text-slate-100">Spiritual Fellowship & Endurance:</strong> We are not meant to walk this spiritual path in isolation. Building a deep christian community is essential to guarding our faith in times of trial.
                  </li>
                </ol>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl mt-6">
                  <h5 className="font-semibold text-slate-200 mb-2">Personal Study Questions:</h5>
                  <ul className="list-disc list-inside space-y-1.5 text-slate-400">
                    <li>What is one "mountain" in your life that requires you to exercise active faith this week?</li>
                    <li>In what areas are you conforming to the patterns of the world rather than being transformed?</li>
                    <li>How can you encourage another brother or sister in the fellowship this Sunday?</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {sermon.duration}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {sermon.views + (isPlaying ? 1 : 0)} views
            </span>
          </div>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              alert(`Downloading: ${sermon.title}_Study_Notes.pdf`);
            }}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 font-semibold px-3 py-1.5 rounded transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            Download Study Notes (PDF)
          </a>
        </div>
      </div>
    </div>
  );
}
