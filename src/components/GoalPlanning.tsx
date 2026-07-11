import React, { useState } from 'react';
import { Task, ScreenId } from '../types';
import { 
  PlusCircle, 
  ShieldCheck, 
  CheckCircle, 
  User, 
  Check, 
  X, 
  ClipboardList, 
  Calendar, 
  Sparkles, 
  Trophy 
} from 'lucide-react';

interface GoalPlanningProps {
  coins: number;
  diamonds: number;
  tasks: Task[];
  onNavigate: (screen: ScreenId, transition?: 'forward' | 'backward' | 'none') => void;
  onAddTask: (newTask: Task) => void;
}

export default function GoalPlanning({
  coins,
  diamonds,
  tasks,
  onNavigate,
  onAddTask
}: GoalPlanningProps) {
  // Local form states
  const [taskName, setTaskName] = useState('');
  const [category, setCategory] = useState('阅读');
  const [period, setPeriod] = useState<'每天' | '指定日期'>('每天');
  const [selectedDays, setSelectedDays] = useState<string[]>(['M', 'T', 'W', 'T', 'F']);
  const [duration, setDuration] = useState(30);
  const [photoRequired, setPhotoRequired] = useState(true);
  const [timerRequired, setTimerRequired] = useState(false);
  const [reflectionRequired, setReflectionRequired] = useState(false);
  const [logic, setLogic] = useState<'AND' | 'OR'>('AND');
  const [selectedVerifiers, setSelectedVerifiers] = useState<string[]>(['妈妈']);
  const [verifierLogic, setVerifierLogic] = useState<'AND' | 'OR'>('OR');
  const [planType, setPlanType] = useState<'daily' | 'weekly'>('daily');

  const daysList = [
    { label: 'M', name: '周一' },
    { label: 'T', name: '周二' },
    { label: 'W', name: '周三' },
    { label: 'T', name: '周四' },
    { label: 'F', name: '周五' },
    { label: 'S', name: '周六' },
    { label: 'S', name: '周日' }
  ];

  const handleToggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()) {
      alert('请先填写任务名称哦！✏️');
      return;
    }

    // Set icon based on category
    let icon = 'menu_book';
    if (category === '练字') icon = 'edit_note';
    else if (category === '口算') icon = 'calculate';
    else if (category === '运动') icon = 'directions_run';
    else if (category === '家务') icon = 'dry_cleaning';
    else if (category === '科学') icon = 'science';

    const newTask: Task = {
      id: `task-${Date.now()}`,
      name: taskName,
      category,
      icon,
      status: 'todo',
      coins: Math.round(duration * 0.5 + 5), // dynamic coins based on duration
      diamonds: duration >= 30 ? 2 : 1,
      duration,
      period,
      days: selectedDays,
      photoRequired,
      timerRequired,
      reflectionRequired,
      logic,
      verifier: selectedVerifiers[0] || '妈妈',
      verifiers: selectedVerifiers,
      verifierLogic
    };

    onAddTask(newTask);
    alert('🎉 恭喜！新任务创建成功，开始你的挑战之旅吧！');
    onNavigate('today-tasks', 'backward');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f6fafe] text-[#171c1f] font-sans pb-32">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#f6fafe]/90 backdrop-blur-md px-6 py-4 border-b-4 border-[#dfe3e7] flex items-center justify-between shadow-[0_4px_0_0_rgba(0,101,141,0.06)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#00658d]">
            <img
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCH1xKNfD5AoIJevfKiyFD4Ax2IVXJZlPz0CYuGX8zkmjOnN1fATnXr95yH16R5H2sUbwWCBz5ktaOi6eJqj9moqEw6EMNZd9mt8kmccNLqTRLAAkOUbynFaHF_AUe_ubBi3zvtum72NinuRMMQbXhad2uEYlJ2LvPEUngFTZmNJf7vd5QsNzdStdflVOuTkhR9ytRrg5pH9-ckRmVZKEw3xzwuSIJAK0JEqO6qiJ0Q3GcQgoolET9Liw"
              alt="User Logo Avatar"
              referrerPolicy="no-referrer"
            />
          </div>
          <h1 className="font-headline text-lg font-bold text-[#00658d] tracking-tight">习惯小勇士</h1>
        </div>
        
        {/* Account balance displays */}
        <div className="flex items-center gap-2 bg-[#eaeef2] border-2 border-[#dfe3e7] rounded-full px-4 py-1.5 shadow-sm">
          <span className="text-sm font-bold text-[#3e4850]">{coins} 🪙 {diamonds} 💎</span>
        </div>
      </header>

      {/* Main Form content */}
      <main className="flex-1 w-full max-w-lg mx-auto px-6 py-6 space-y-6">
        
        {/* Left Side Toggler Mock (View Toggle in bento grid design) */}
        <div className="space-y-4">
          <div className="bg-[#eaeef2] p-1.5 rounded-2xl flex gap-1 border-2 border-[#dfe3e7]">
            <button
              onClick={() => setPlanType('daily')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all ${
                planType === 'daily'
                  ? 'bg-gradient-to-r from-[#47c1ff] to-[#00658d] text-white border-b-4 border-[#004d6c] shadow-sm'
                  : 'text-[#3e4850] hover:bg-white/50'
              }`}
            >
              今日计划
            </button>
            <button
              onClick={() => setPlanType('weekly')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all ${
                planType === 'weekly'
                  ? 'bg-gradient-to-r from-[#47c1ff] to-[#00658d] text-white border-b-4 border-[#004d6c] shadow-sm'
                  : 'text-[#3e4850] hover:bg-white/50'
              }`}
            >
              周计划
            </button>
          </div>

          {/* Goal Overview Overview Panel */}
          <div className="plush-card p-5 bg-white space-y-3.5">
            <h3 className="font-headline font-bold text-[#00658d] text-base">目标规划概览</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex justify-between items-center p-3 bg-[#f6fafe] border-2 border-[#dfe3e7] rounded-2xl">
                <span className="text-xs text-[#6e7881] font-bold">进行中的任务</span>
                <span className="text-xs font-bold bg-[#ffcf44] text-[#725800] px-2.5 py-1 rounded-full">
                  {tasks.length + 3}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[#f6fafe] border-2 border-[#dfe3e7] rounded-2xl">
                <span className="text-xs text-[#6e7881] font-bold">预计总计时</span>
                <span className="text-xs font-bold bg-[#77cb16] text-white px-2.5 py-1 rounded-full">
                  120m
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Create Task Form panel matching screenshot exactly */}
        <section className="bg-white border-4 border-[#00658d] rounded-[32px] p-6 shadow-md space-y-6">
          <div className="flex items-center gap-3 pb-2 border-b-2 border-[#eaeef2]">
            <PlusCircle className="w-6 h-6 text-[#00658d]" />
            <h2 className="font-headline text-lg font-bold text-[#171c1f]">创建新任务</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Task Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#3e4850] ml-1">任务名称</label>
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="例如：阅读20分钟"
                className="w-full h-14 px-5 rounded-2xl border-2 border-[#dfe3e7] focus:border-[#00658d] outline-none text-sm font-semibold transition-all"
              />
            </div>

            {/* Category selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#3e4850] ml-1">类别</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-14 px-5 rounded-2xl border-2 border-[#dfe3e7] focus:border-[#00658d] outline-none text-sm font-semibold bg-white cursor-pointer transition-all appearance-none bg-no-repeat bg-[right_1.5rem_center]"
              >
                <option value="阅读">阅读</option>
                <option value="练字">练字</option>
                <option value="口算">口算</option>
                <option value="科学">科学</option>
                <option value="运动">运动</option>
                <option value="家务">家务</option>
              </select>
            </div>

            {/* Period settings */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-[#3e4850] ml-1 block">周期设定</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPeriod('每天')}
                  className={`flex-1 py-2.5 rounded-2xl font-bold text-xs border-2 transition-all cursor-pointer ${
                    period === '每天'
                      ? 'border-[#00658d] bg-[#c6e7ff]/30 text-[#00658d]'
                      : 'border-[#dfe3e7] bg-white text-[#3e4850]'
                  }`}
                >
                  每天
                </button>
                <button
                  type="button"
                  onClick={() => setPeriod('指定日期')}
                  className={`flex-1 py-2.5 rounded-2xl font-bold text-xs border-2 transition-all cursor-pointer ${
                    period === '指定日期'
                      ? 'border-[#00658d] bg-[#c6e7ff]/30 text-[#00658d]'
                      : 'border-[#dfe3e7] bg-white text-[#3e4850]'
                  }`}
                >
                  指定日期
                </button>
              </div>

              {/* Days display indicator */}
              <div className="flex justify-between px-1 pt-1">
                {daysList.map((day) => {
                  const isSelected = selectedDays.includes(day.label);
                  return (
                    <button
                      key={day.name}
                      type="button"
                      onClick={() => handleToggleDay(day.label)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#00658d] text-white shadow-sm'
                          : 'bg-[#e4e9ed] text-[#6e7881]'
                      }`}
                    >
                      {day.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Range Slider for Duration */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#3e4850] ml-1 block">
                打卡时长 (分钟)
              </label>
              <div className="flex items-center gap-4 bg-[#f0f4f8] p-3.5 border-2 border-[#dfe3e7] rounded-2xl">
                <input
                  type="range"
                  min="5"
                  max="120"
                  step="5"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="flex-1 h-2 bg-[#bdc8d1] rounded-lg appearance-none cursor-pointer accent-[#00658d]"
                />
                <span className="w-14 text-right font-headline text-lg font-bold text-[#00658d]">
                  {duration}m
                </span>
              </div>
            </div>

            {/* Certification Criteria */}
            <div className="space-y-4 pt-4 border-t-2 border-[#eaeef2]">
              <h3 className="font-headline font-bold text-sm text-[#171c1f]">认证规则</h3>
              
              <div className="bg-[#f6fafe] border-2 border-[#dfe3e7] p-4 rounded-2xl space-y-3.5">
                <span className="text-xs font-bold text-[#00658d] block">验收标准</span>
                
                {/* Need Photo checkbox */}
                <label className="flex items-center gap-3 cursor-pointer select-none group">
                  <input
                    type="checkbox"
                    checked={photoRequired}
                    onChange={(e) => setPhotoRequired(e.target.checked)}
                    className="w-5 h-5 rounded border-2 border-[#dfe3e7] text-[#00658d] focus:ring-[#00658d]/25 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-[#3e4850] group-hover:text-[#00658d] transition-colors">
                    需要拍照录入
                  </span>
                </label>

                {/* Need Timer checkbox */}
                <label className="flex items-center gap-3 cursor-pointer select-none group">
                  <input
                    type="checkbox"
                    checked={timerRequired}
                    onChange={(e) => setTimerRequired(e.target.checked)}
                    className="w-5 h-5 rounded border-2 border-[#dfe3e7] text-[#00658d] focus:ring-[#00658d]/25 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-[#3e4850] group-hover:text-[#00658d] transition-colors">
                    计时必须结束
                  </span>
                </label>

                {/* Need notes reflection checkbox */}
                <label className="flex items-center gap-3 cursor-pointer select-none group">
                  <input
                    type="checkbox"
                    checked={reflectionRequired}
                    onChange={(e) => setReflectionRequired(e.target.checked)}
                    className="w-5 h-5 rounded border-2 border-[#dfe3e7] text-[#00658d] focus:ring-[#00658d]/25 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-[#3e4850] group-hover:text-[#00658d] transition-colors">
                    完成心得体会
                  </span>
                </label>

                {/* Logic Toggle */}
                <div className="pt-1.5">
                  <div className="flex bg-[#eaeef2] rounded-full p-1 border border-[#bdc8d1] text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setLogic('AND')}
                      className={`flex-1 rounded-full py-1.5 transition-all cursor-pointer ${
                        logic === 'AND' ? 'bg-white shadow-sm text-[#171c1f]' : 'text-[#6e7881]'
                      }`}
                    >
                      逻辑：且
                    </button>
                    <button
                      type="button"
                      onClick={() => setLogic('OR')}
                      className={`flex-1 rounded-full py-1.5 transition-all cursor-pointer ${
                        logic === 'OR' ? 'bg-white shadow-sm text-[#171c1f]' : 'text-[#6e7881]'
                      }`}
                    >
                      逻辑：或
                    </button>
                  </div>
                </div>
              </div>

              {/* Verifier selection details */}
              <div className="bg-[#f6fafe] border-2 border-[#dfe3e7] p-4 rounded-2xl space-y-3.5">
                <span className="text-xs font-bold text-[#00658d] block">认证人</span>
                
                <div className="space-y-2">
                  <div
                    onClick={() => {
                      if (selectedVerifiers.includes('妈妈')) {
                        if (selectedVerifiers.length > 1) {
                          setSelectedVerifiers(selectedVerifiers.filter(v => v !== '妈妈'));
                        } else {
                          alert('至少需要选择一个认证人哦！🛡️');
                        }
                      } else {
                        setSelectedVerifiers([...selectedVerifiers, '妈妈']);
                      }
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl border-2 bg-white cursor-pointer transition-all ${
                      selectedVerifiers.includes('妈妈') ? 'border-[#00658d] bg-[#00658d]/5' : 'border-[#dfe3e7] opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-[#00658d]" />
                      <span className="text-xs font-bold text-[#171c1f]">妈妈</span>
                    </div>
                    {selectedVerifiers.includes('妈妈') && (
                      <CheckCircle className="w-5 h-5 text-[#00658d]" />
                    )}
                  </div>

                  <div
                    onClick={() => {
                      if (selectedVerifiers.includes('爸爸')) {
                        if (selectedVerifiers.length > 1) {
                          setSelectedVerifiers(selectedVerifiers.filter(v => v !== '爸爸'));
                        } else {
                          alert('至少需要选择一个认证人哦！🛡️');
                        }
                      } else {
                        setSelectedVerifiers([...selectedVerifiers, '爸爸']);
                      }
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl border-2 bg-white cursor-pointer transition-all ${
                      selectedVerifiers.includes('爸爸') ? 'border-[#00658d] bg-[#00658d]/5' : 'border-[#dfe3e7] opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-[#6e7881]" />
                      <span className="text-xs font-bold text-[#171c1f]">爸爸</span>
                    </div>
                    {selectedVerifiers.includes('爸爸') && (
                      <CheckCircle className="w-5 h-5 text-[#00658d]" />
                    )}
                  </div>

                  {/* Logic Toggle for Multiple Verifiers */}
                  {selectedVerifiers.length > 1 && (
                    <div className="pt-2.5 border-t border-[#dfe3e7]/60 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-bold text-[#6e7881]">认证逻辑关系</span>
                        <span className="text-[10px] font-bold text-[#00658d] bg-[#c6e7ff] px-2.5 py-0.5 rounded-full">
                          {verifierLogic === 'AND' ? '且（需双方都认证）' : '或（任一方认证即可）'}
                        </span>
                      </div>
                      <div className="flex bg-[#eaeef2] rounded-full p-1 border border-[#bdc8d1] text-[11px] font-bold">
                        <button
                          type="button"
                          onClick={() => setVerifierLogic('AND')}
                          className={`flex-1 rounded-full py-1.5 transition-all cursor-pointer ${
                            verifierLogic === 'AND' ? 'bg-white shadow-sm text-[#171c1f]' : 'text-[#6e7881]'
                          }`}
                        >
                          且关系 (AND)
                        </button>
                        <button
                          type="button"
                          onClick={() => setVerifierLogic('OR')}
                          className={`flex-1 rounded-full py-1.5 transition-all cursor-pointer ${
                            verifierLogic === 'OR' ? 'bg-white shadow-sm text-[#171c1f]' : 'text-[#6e7881]'
                          }`}
                        >
                          或关系 (OR)
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => alert('请在“我的档案”设置中绑定并授权更多的家庭成员认证账号哦！👨‍👩‍👧')}
                    className="w-full py-2.5 border-2 border-dashed border-[#bdc8d1] rounded-xl text-[#6e7881] text-xs font-bold hover:bg-[#eaeef2] transition-all cursor-pointer"
                  >
                    + 增加认证人
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bubble-button-primary py-4 text-sm font-bold flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4 text-white" />
                保存任务
              </button>
              <button
                type="button"
                onClick={() => onNavigate('today-tasks', 'backward')}
                className="flex-1 bubble-button-neutral py-4 text-sm font-bold flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4 text-[#3e4850]" />
                取消
              </button>
            </div>
          </form>
        </section>
      </main>

      {/* Bottom Nav bar matched by xpath targets: */}
      {/* a containing span[text()='今日'] -> TodayTasks */}
      {/* a containing span[text()='计划'] -> active (this screen) */}
      {/* a containing span[text()='奖励'] -> RewardsStore */}
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
          className="flex flex-col items-center justify-center text-[#00658d] px-4 py-1.5 cursor-pointer"
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
