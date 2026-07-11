import React, { useState, useEffect, useRef } from 'react';
import { ScreenId } from '../types';
import { 
  ArrowLeft, 
  Settings, 
  VolumeX, 
  Leaf, 
  Droplet, 
  Waves, 
  Coffee, 
  Music, 
  Play, 
  Pause, 
  Clock, 
  ClipboardList, 
  Calendar, 
  Sparkles, 
  Trophy 
} from 'lucide-react';

interface TimerScreenProps {
  onNavigate: (screen: ScreenId, transition?: 'forward' | 'backward' | 'none') => void;
}

type AmbientSound = 'none' | 'forest' | 'rain' | 'waves' | 'cafe';

export default function TimerScreen({ onNavigate }: TimerScreenProps) {
  // Timer settings
  const [totalSeconds, setTotalSeconds] = useState(25 * 60); // 25 mins default
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sound, setSound] = useState<AmbientSound>('none');
  const [showSoundsMenu, setShowSoundsMenu] = useState(false);
  const [showDurationMenu, setShowDurationMenu] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Countdown logic
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            if (timerRef.current) clearInterval(timerRef.current);
            // Simulate finished buzzer
            alert('⏰ 专注时间到！太棒了，你坚持下来了！');
            return totalSeconds;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, totalSeconds]);

  // Format MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const progressPercent = ((totalSeconds - secondsLeft) / totalSeconds) * 100;
  const strokeDashoffset = 289 - (289 * progressPercent) / 100;

  const handleSelectDuration = (mins: number) => {
    const secs = mins * 60;
    setTotalSeconds(secs);
    setSecondsLeft(secs);
    setIsRunning(false);
    setShowDurationMenu(false);
  };

  const handleTogglePlay = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(totalSeconds);
  };

  const soundLabels: Record<AmbientSound, { name: string; icon: React.ReactNode }> = {
    none: { name: '无背景音', icon: <VolumeX className="w-4 h-4" /> },
    forest: { name: '森林鸟鸣 🌲', icon: <Leaf className="w-4 h-4" /> },
    rain: { name: '淅淅沥沥 🌧️', icon: <Droplet className="w-4 h-4" /> },
    waves: { name: '深海海浪 🌊', icon: <Waves className="w-4 h-4" /> },
    cafe: { name: '午后咖啡 ☕', icon: <Coffee className="w-4 h-4" /> }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f6fafe] text-[#171c1f] font-sans pb-32 relative overflow-hidden">
      {/* Background soft lavender & sky blue gradient mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f6fafe] via-[#eaeef2] to-[#c6e7ff]/30 -z-10" />

      {/* Header bar styled like ZenFocus top bar in screenshot */}
      <header className="sticky top-0 z-40 bg-transparent px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => onNavigate('today-tasks', 'backward')}
          className="p-2.5 rounded-full border-2 border-[#bdc8d1]/50 bg-white/60 backdrop-blur-md text-[#6e7881] hover:bg-[#eaeef2] active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-[#6e7881]" />
        </button>
        <h1 className="font-headline text-2xl font-bold text-[#00658d] tracking-tight">ZenFocus</h1>
        <button
          onClick={() => alert('设置: 专注振动、专注统计已默认开启 🛡️')}
          className="p-2.5 rounded-full border-2 border-[#bdc8d1]/50 bg-white/60 backdrop-blur-md text-[#6e7881] hover:bg-[#eaeef2] active:scale-95 transition-all cursor-pointer"
        >
          <Settings className="w-5 h-5 text-[#6e7881]" />
        </button>
      </header>

      {/* Main Focus Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 w-full max-w-md mx-auto">
        {/* Timer Bento Card (Glassmorphism style) */}
        <div className="relative w-full flex flex-col items-center justify-center p-8 rounded-[40px] bg-white/60 backdrop-blur-xl border-4 border-[#dfe3e7]/80 shadow-[0_20px_60px_rgba(0,101,141,0.06)]">
          {/* Animated pulsing/rotating Progress Circle */}
          <div className="relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Subtle Track */}
              <circle
                className="stroke-[#eaeef2] fill-none"
                cx="50"
                cy="50"
                r="46"
                strokeWidth="2.5"
              />
              {/* Active Progress */}
              <circle
                className="stroke-[#00658d] fill-none transition-all duration-300"
                cx="50"
                cy="50"
                r="46"
                strokeWidth="3.5"
                strokeDasharray="289"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>

            {/* Core Clock Text Container */}
            <div className="z-10 flex flex-col items-center justify-center text-center">
              <span className="font-headline text-5xl md:text-6xl font-bold text-[#00658d] tracking-tighter drop-shadow-sm">
                {formatTime(secondsLeft)}
              </span>
              <span className="text-xs font-bold text-[#6e7881] tracking-[0.2em] mt-2 uppercase">
                {isRunning ? '专注中' : '已暂停'}
              </span>
            </div>
          </div>

          {/* Settings / Controls Row */}
          <div className="flex items-center justify-center gap-6 mt-8 w-full relative">
            {/* Sound Toggle Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowSoundsMenu(!showSoundsMenu);
                  setShowDurationMenu(false);
                }}
                className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all active:scale-90 cursor-pointer ${
                  sound !== 'none'
                    ? 'bg-[#77cb16]/10 border-[#77cb16] text-[#3a6a00]'
                    : 'bg-white border-[#bdc8d1] text-[#3e4850] hover:bg-[#f0f4f8]'
                }`}
                title="选择背景音"
              >
                {sound === 'none' ? <Leaf className="w-5 h-5 text-[#3e4850]" /> : <Music className="w-5 h-5 text-[#3a6a00]" />}
              </button>

              {/* Ambient Sound Menu */}
              {showSoundsMenu && (
                <div className="absolute bottom-16 left-0 bg-white border-2 border-[#bdc8d1] rounded-2xl p-2 w-44 shadow-xl z-20 space-y-1">
                  <div className="text-xs font-bold text-[#6e7881] px-2.5 py-1 border-b border-[#eaeef2] mb-1">
                    环境白噪音
                  </div>
                  {(Object.keys(soundLabels) as AmbientSound[]).map((snd) => (
                    <button
                      key={snd}
                      onClick={() => {
                        setSound(snd);
                        setShowSoundsMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer ${
                        sound === snd
                          ? 'bg-[#00658d] text-white'
                          : 'text-[#3e4850] hover:bg-[#f0f4f8]'
                      }`}
                    >
                      {soundLabels[snd].icon}
                      <span>{soundLabels[snd].name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Main Play/Pause (Bubble button) */}
            <button
              onClick={handleTogglePlay}
              className="w-20 h-20 rounded-full flex items-center justify-center bg-[#00658d] text-white shadow-lg border-b-4 border-[#004d6c] hover:opacity-95 active:border-b-0 active:translate-y-1 transition-all duration-100 cursor-pointer"
            >
              {isRunning ? <Pause className="w-8 h-8 text-white fill-white" /> : <Play className="w-8 h-8 text-white fill-white translate-x-0.5" />}
            </button>

            {/* Duration select button */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowDurationMenu(!showDurationMenu);
                  setShowSoundsMenu(false);
                }}
                className="w-14 h-14 rounded-full flex items-center justify-center bg-white border-2 border-[#bdc8d1] hover:bg-[#f0f4f8] text-[#3e4850] transition-all active:scale-90 cursor-pointer"
                title="调整时长"
              >
                <Clock className="w-5 h-5 text-[#3e4850]" />
              </button>

              {/* Duration popup selector */}
              {showDurationMenu && (
                <div className="absolute bottom-16 right-0 bg-white border-2 border-[#bdc8d1] rounded-2xl p-2 w-32 shadow-xl z-20 space-y-1">
                  <div className="text-xs font-bold text-[#6e7881] px-2.5 py-1 border-b border-[#eaeef2] mb-1">
                    专注时长
                  </div>
                  {[5, 10, 15, 25, 30, 45, 60].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => handleSelectDuration(mins)}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold flex items-center justify-between cursor-pointer ${
                        totalSeconds / 60 === mins
                          ? 'bg-[#00658d] text-white'
                          : 'text-[#3e4850] hover:bg-[#f0f4f8]'
                      }`}
                    >
                      <span>{mins} 分钟</span>
                      {totalSeconds / 60 === mins && <span className="text-[10px]">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Reset button under controls */}
          <button
            onClick={handleReset}
            className="mt-6 text-xs font-bold text-[#6e7881] hover:text-[#00658d] border border-[#bdc8d1] hover:border-[#00658d] bg-white/80 px-4 py-1.5 rounded-full shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            重置计时器
          </button>
        </div>

        {/* Ambient audio active visualization overlay */}
        {sound !== 'none' && (
          <div className="mt-6 flex items-center gap-1.5 bg-[#77cb16]/10 px-4 py-2 border border-[#77cb16]/30 rounded-2xl animate-pulse">
            <span className="text-[#3a6a00] font-bold text-xs flex items-center gap-1">
              🔊 正在播放: {soundLabels[sound].name}
            </span>
          </div>
        )}
      </main>

      {/* Footer styled bottom bar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-4 pt-2 bg-white rounded-t-3xl border-t-4 border-[#dfe3e7] shadow-[0_-8px_20px_0_rgba(0,101,141,0.06)]">
        <a
          onClick={() => onNavigate('today-tasks', 'none')}
          className="flex flex-col items-center justify-center text-[#3e4850] hover:text-[#00658d] px-4 py-1.5 cursor-pointer"
        >
          <ClipboardList className="w-6 h-6 mb-0.5" />
          <span className="font-sans text-xs font-bold">今日</span>
        </a>
        <a
          onClick={() => onNavigate('planning', 'none')}
          className="flex flex-col items-center justify-center text-[#3e4850] hover:text-[#00658d] px-4 py-1.5 cursor-pointer"
        >
          <Calendar className="w-6 h-6 mb-0.5" />
          <span className="font-sans text-xs font-bold">计划</span>
        </a>
        <a
          onClick={() => onNavigate('rewards', 'none')}
          className="flex flex-col items-center justify-center text-[#3e4850] hover:text-[#00658d] px-4 py-1.5 cursor-pointer"
        >
          <Sparkles className="w-6 h-6 mb-0.5" />
          <span className="font-sans text-xs font-bold">奖励</span>
        </a>
        <a
          onClick={() => onNavigate('stats', 'none')}
          className="flex flex-col items-center justify-center text-[#3e4850] hover:text-[#00658d] px-4 py-1.5 cursor-pointer"
        >
          <Trophy className="w-6 h-6 mb-0.5" />
          <span className="font-sans text-xs font-bold">成就</span>
        </a>
      </nav>
    </div>
  );
}
