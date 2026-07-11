import React from 'react';
import { Task, ScreenId } from '../types';
import { 
  ClipboardList, 
  BookOpen, 
  Calculator, 
  Activity, 
  Home, 
  Sparkles, 
  Trophy, 
  CalendarDays,
  Calendar
} from 'lucide-react';

interface TodayTasksProps {
  tasks: Task[];
  coins: number;
  diamonds: number;
  onNavigate: (screen: ScreenId, transition?: 'forward' | 'backward' | 'none') => void;
  onToggleTask: (taskId: string) => void;
  onSelectTaskToPunch: (taskId: string) => void;
}

const getTaskIcon = (iconName: string, isCompleted: boolean) => {
  const className = `w-6 h-6 ${isCompleted ? 'text-[#3a6a00]' : 'text-[#00658d]'}`;
  switch (iconName) {
    case 'edit_note':
      return <ClipboardList className={className} />;
    case 'menu_book':
      return <BookOpen className={className} />;
    case 'calculate':
      return <Calculator className={className} />;
    case 'directions_run':
      return <Activity className={className} />;
    case 'dry_cleaning':
      return <Home className={className} />;
    default:
      return <ClipboardList className={className} />;
  }
};

export default function TodayTasks({
  tasks,
  coins,
  diamonds,
  onNavigate,
  onToggleTask,
  onSelectTaskToPunch
}: TodayTasksProps) {
  // Stats
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="flex flex-col min-h-screen bg-[#f6fafe] text-[#171c1f] font-sans pb-32">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#f6fafe]/90 backdrop-blur-md px-6 py-4 border-b-4 border-[#dfe3e7] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#00658d] shadow-sm flex-shrink-0">
            <img
              alt="User Avatar"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLlZlNEg0RA1wCvxuJcPRyY9r_A4rzjKmtggZPFIBCXZCS6G0ruSunSQQT5ZSdskDl-t05AlqnHyd0nxfZ0EhY-yexkUDfAX__5txDAXbKbpcHGUBuBwgygFE11JrrE1xoT01ecjs7NrXqKJfpjgWiDJ95BfkHU3c-RbIX4w0uiHkMwi4zaEJFCDgg-ECp7E7EzwHPGO03DV_ReGd5cDYoA-5KpkN09DePfn2e1PLv0Lk97emcxq2R_w"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h1 className="font-headline text-lg font-bold text-[#00658d] tracking-tight">习惯小勇士</h1>
            <p className="text-xs text-[#3e4850] font-medium">段位: 习惯守护者 🛡️</p>
          </div>
        </div>
        
        {/* Currency Widgets */}
        <div className="flex items-center gap-2 bg-[#eaeef2] border-2 border-[#dfe3e7] rounded-full px-4 py-1.5 shadow-sm">
          <div className="flex items-center gap-1">
            <span className="text-[#755b00] font-bold text-base">🪙</span>
            <span className="text-sm font-bold text-[#3e4850]">{coins}</span>
          </div>
          <div className="w-[2px] h-4 bg-[#bdc8d1]"></div>
          <div className="flex items-center gap-1">
            <span className="text-[#00658d] font-bold text-base">💎</span>
            <span className="text-sm font-bold text-[#3e4850]">{diamonds}</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-lg mx-auto px-6 py-6 space-y-6">
        {/* Hero Level-Up Progress Card */}
        <div className="plush-card p-6 bg-gradient-to-br from-white to-[#f0f4f8] relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-xs font-bold text-[#00658d] uppercase tracking-wider bg-[#c6e7ff] px-2.5 py-1 rounded-full">
                🔥 12天最长连续打卡
              </span>
              <h2 className="font-headline text-2xl font-bold text-[#171c1f] mt-2">今日任务进度</h2>
            </div>
            <div className="text-right">
              <span className="font-headline text-3xl font-bold text-[#00658d]">{completedCount}</span>
              <span className="text-sm text-[#6e7881] font-bold">/{totalCount}</span>
            </div>
          </div>

          {/* Chunky Progress Bar */}
          <div className="w-full bg-[#eaeef2] h-6 rounded-full border-2 border-[#bdc8d1] overflow-hidden p-0.5">
            <div
              className="bg-gradient-to-r from-[#47c1ff] to-[#00658d] h-full rounded-full transition-all duration-500 ease-out border-b-2 border-[#004d6c]"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between items-center mt-3 text-xs text-[#3e4850] font-bold">
            <span>已经完成 {progressPercent}% 啦！</span>
            <span className="text-[#3a6a00]">本周完成率 85% 📈</span>
          </div>
        </div>

        {/* Task List Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-headline text-xl font-bold text-[#171c1f] flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-[#00658d]" />
            今日任务清单
          </h3>
          <span className="text-xs font-bold text-[#6e7881] bg-[#eaeef2] px-2 py-1 rounded-md">
            更新于 04:39
          </span>
        </div>

        {/* Tasks Stack */}
        <div className="space-y-4">
          {tasks.map(task => {
            const isCompleted = task.status === 'completed';
            return (
              <div
                key={task.id}
                className={`flex items-center justify-between p-4 bg-white border-4 rounded-3xl transition-all duration-200 ${
                  isCompleted
                    ? 'border-[#77cb16]/40 opacity-75 shadow-inner bg-stone-50'
                    : 'border-[#dfe3e7] shadow-sm hover:border-[#00658d]/50'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Category circular icon */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-colors ${
                      isCompleted
                        ? 'bg-[#77cb16]/10 border-[#77cb16] text-[#3a6a00]'
                        : 'bg-[#f0f4f8] border-[#bdc8d1] text-[#00658d]'
                    }`}
                  >
                    {getTaskIcon(task.icon, isCompleted)}
                  </div>

                  {/* Task Text info Container */}
                  <div className="flex-1">
                    <h3 className={`font-headline text-base font-bold transition-all ${
                      isCompleted ? 'text-[#6e7881] line-through' : 'text-[#171c1f]'
                    }`}>
                      {task.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#6e7881] font-semibold mt-0.5">
                      <span className="bg-[#eaeef2] px-1.5 py-0.5 rounded text-[#3e4850]">{task.category}</span>
                      <span>⏱️ {task.duration}m</span>
                      {task.photoRequired && <span className="text-[#00658d]">📸 拍照</span>}
                      {task.timerRequired && <span className="text-[#755b00]">⏱️ 计时</span>}
                      
                      {/* Completed verifier capsule tags */}
                      {isCompleted && (
                        <div className="flex flex-wrap items-center gap-1 ml-1">
                          {(task.verifiers && task.verifiers.length > 0 ? task.verifiers : [task.verifier || '妈妈']).map((v) => {
                            const isMom = v === '妈妈';
                            return (
                              <span
                                key={v}
                                className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-0.5 shadow-xs border transition-all ${
                                  isMom
                                    ? 'bg-[#fff0f3] border-[#ffccd5] text-[#ba184c]'
                                    : 'bg-[#eef8ff] border-[#bce3ff] text-[#0369a1]'
                                }`}
                              >
                                <span className="text-[10px] font-bold">
                                  {isMom ? '👩' : '👨'}
                                </span>
                                {v}认证
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sibling Button / Action for Punch In */}
                {task.name === '练字' ? (
                  <button
                    onClick={() => {
                      onSelectTaskToPunch(task.id);
                      onNavigate('task-punch', 'forward');
                    }}
                    className="bubble-button-primary px-5 py-2.5 text-xs font-bold"
                  >
                    {isCompleted ? '重新打卡' : '去打卡 ➔'}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (task.timerRequired || task.photoRequired) {
                        onSelectTaskToPunch(task.id);
                        onNavigate('task-punch', 'forward');
                      } else {
                        onToggleTask(task.id);
                      }
                    }}
                    className={`px-5 py-2.5 text-xs font-bold rounded-full transition-all active:scale-95 ${
                      isCompleted
                        ? 'bg-[#77cb16]/20 text-[#3a6a00] border-2 border-[#77cb16]'
                        : 'bubble-button-neutral'
                    }`}
                  >
                    {isCompleted ? '已完成 ✓' : '快捷打卡'}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Motivational Banner */}
        <div className="p-4 bg-[#ffcf44]/15 border-2 border-dashed border-[#ffcf44] rounded-2xl flex items-center gap-3">
          <span className="text-3xl">🏆</span>
          <div>
            <h4 className="font-headline font-bold text-sm text-[#725800]">勇士小贴士</h4>
            <p className="text-xs text-[#594400] font-medium leading-relaxed">
              完成今日所有打卡，即可额外获得 <span className="font-bold text-[#00658d]">🪙 50 金币</span> 的勇士宝箱奖励哦！加油！
            </p>
          </div>
        </div>
      </main>

      {/* Navigation Footer */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-4 pt-2 bg-white rounded-t-3xl border-t-4 border-[#dfe3e7] shadow-[0_-8px_20px_0_rgba(0,101,141,0.06)]">
        <a
          onClick={() => onNavigate('today-tasks', 'none')}
          className="flex flex-col items-center justify-center text-[#00658d] px-4 py-1.5 cursor-pointer"
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
