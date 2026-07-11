import React, { useState, useRef } from 'react';
import { Task, ScreenId } from '../types';
import { 
  ArrowLeft, 
  ClipboardList, 
  BookOpen, 
  Calculator, 
  Activity, 
  Home, 
  Hourglass, 
  Timer, 
  Camera, 
  FileText, 
  ShieldCheck, 
  CheckCircle, 
  Calendar, 
  Sparkles, 
  Trophy 
} from 'lucide-react';

interface TaskPunchProps {
  activeTask: Task | null;
  coins: number;
  diamonds: number;
  onNavigate: (screen: ScreenId, transition?: 'forward' | 'backward' | 'none') => void;
  onCompleteTask: (taskId: string) => void;
}

const getTaskIcon = (iconName: string) => {
  const className = "w-6 h-6 text-[#00658d]";
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

export default function TaskPunch({
  activeTask,
  coins,
  diamonds,
  onNavigate,
  onCompleteTask
}: TaskPunchProps) {
  // Use "练字" task as default fallback if null
  const task = activeTask || {
    id: 'task-1',
    name: '练字',
    category: '练字',
    icon: 'edit_note',
    status: 'todo',
    coins: 15,
    diamonds: 1,
    duration: 15,
    period: '每天',
    days: ['M', 'T', 'W', 'T', 'F'],
    photoRequired: true,
    timerRequired: true,
    reflectionRequired: false,
    logic: 'AND',
    verifier: '妈妈'
  };

  // State
  const [photo, setPhoto] = useState<string | null>(null);
  const [reflection, setReflection] = useState('');
  const [isCompletedSuccess, setIsCompletedSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Verification requirements state
  const [criteriaChecked, setCriteriaChecked] = useState({
    photo: false,
    timer: false,
    reflection: false
  });

  // Photo uploading simulation
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setPhoto(uploadEvent.target.result as string);
          setCriteriaChecked(prev => ({ ...prev, photo: true }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setPhoto(uploadEvent.target.result as string);
          setCriteriaChecked(prev => ({ ...prev, photo: true }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = () => {
    // If logic is AND, ensure required ones are satisfied
    if (task.photoRequired && !photo) {
      alert('请先拍照上传打卡凭证哦！📸');
      return;
    }
    
    setIsCompletedSuccess(true);
    setTimeout(() => {
      onCompleteTask(task.id);
      setIsCompletedSuccess(false);
      onNavigate('today-tasks', 'backward');
    }, 2500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f6fafe] text-[#171c1f] font-sans pb-32 relative">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#f6fafe]/90 backdrop-blur-md px-6 py-4 border-b-4 border-[#dfe3e7] flex items-center justify-between">
        {/* Back button matched by xpath: //header//button */}
        <button
          onClick={() => onNavigate('today-tasks', 'backward')}
          className="p-2.5 rounded-full border-2 border-[#bdc8d1] bg-white hover:bg-[#eaeef2] transition-all duration-200 active:scale-90 flex items-center justify-center cursor-pointer"
          title="返回今日任务"
        >
          <ArrowLeft className="w-5 h-5 text-[#00658d]" />
        </button>
        
        <h1 className="font-headline text-lg font-bold text-[#171c1f] tracking-tight">
          打卡: {task.name}
        </h1>

        {/* Currency Display */}
        <div className="flex items-center gap-1.5 bg-white border-2 border-[#dfe3e7] rounded-full px-3 py-1 shadow-sm">
          <span className="text-[#755b00] text-sm">🪙</span>
          <span className="text-xs font-bold text-[#3e4850]">{coins}</span>
        </div>
      </header>

      {/* Celebration Success Popup */}
      {isCompletedSuccess && (
        <div className="fixed inset-0 bg-[#00658d]/60 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          <div className="bg-white border-4 border-[#77cb16] rounded-3xl p-8 max-w-sm w-full shadow-2xl space-y-4 float-slow transform scale-100 transition-transform">
            <span className="text-6xl block">🎉</span>
            <h2 className="font-headline text-2xl font-bold text-[#3a6a00]">打卡完成！</h2>
            <p className="text-sm font-semibold text-[#3e4850]">
              太棒了！你完成了今天的「{task.name}」任务。
            </p>
            <div className="bg-[#77cb16]/10 border-2 border-dashed border-[#77cb16] rounded-2xl p-4 flex justify-around items-center">
              <div className="flex items-center gap-2">
                <span className="text-3xl">🪙</span>
                <div>
                  <div className="text-xs text-[#6e7881] font-bold">金币奖励</div>
                  <div className="text-lg font-bold text-[#755b00]">+{task.coins}</div>
                </div>
              </div>
              <div className="w-[1px] h-8 bg-[#bdc8d1]"></div>
              <div className="flex items-center gap-2">
                <span className="text-3xl">💎</span>
                <div>
                  <div className="text-xs text-[#6e7881] font-bold">钻石奖励</div>
                  <div className="text-lg font-bold text-[#00658d]">+{task.diamonds}</div>
                </div>
              </div>
            </div>
            <p className="text-xs text-[#6e7881] font-bold">正在返回主页面...</p>
          </div>
        </div>
      )}

      {/* Main Punch Content */}
      <main className="flex-1 w-full max-w-lg mx-auto px-6 py-6 space-y-6">
        {/* Task Details Card */}
        <div className="plush-card p-5 bg-gradient-to-br from-white to-[#f0f4f8] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#00658d]/10 border-2 border-[#00658d] flex items-center justify-center text-[#00658d]">
              {getTaskIcon(task.icon)}
            </div>
            <div>
              <h2 className="font-headline text-lg font-bold text-[#171c1f]">{task.name}</h2>
              <p className="text-xs text-[#6e7881] font-semibold">
                今日设定: 完成获得 🪙{task.coins} & 💎{task.diamonds}
              </p>
            </div>
          </div>
          <span className="bg-[#00658d] text-white text-xs font-bold px-3 py-1 rounded-full">
            ⏱️ {task.duration} 分钟
          </span>
        </div>

        {/* Timer Simulation Section */}
        {task.timerRequired && (
          <div className="plush-card p-5 border-l-8 border-l-[#00658d]">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-headline font-bold text-base text-[#171c1f] flex items-center gap-1.5">
                <Hourglass className="w-5 h-5 text-[#00658d]" />
                专注计时
              </h3>
              <span className="text-xs text-[#6e7881] font-semibold">建议专注: {task.duration} 分钟</span>
            </div>
            <p className="text-xs text-[#3e4850] mb-4 font-medium leading-relaxed">
              在极简计时器中进行专注可以帮助你更高效地练习哦。点击下方按钮即可进入极简计时器页面。
            </p>
            <button
              onClick={() => onNavigate('timer', 'forward')}
              className="w-full bg-[#c6e7ff] text-[#004d6c] border-2 border-[#00658d] hover:bg-[#81cfff] font-bold rounded-2xl py-3 text-sm flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Timer className="w-4 h-4 text-[#004d6c]" />
              进入极简计时器界面 ⏱️
            </button>
          </div>
        )}

        {/* Photo Uploader Simulation (Drag and Drop / Manual Select) */}
        {task.photoRequired && (
          <div className="plush-card p-5 space-y-3">
            <h3 className="font-headline font-bold text-base text-[#171c1f] flex items-center gap-1.5">
              <Camera className="w-5 h-5 text-[#00658d]" />
              拍照凭证录入
            </h3>
            
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
            />

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={triggerFileInput}
              className={`border-4 border-dashed rounded-3xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                photo 
                  ? 'border-[#77cb16] bg-[#77cb16]/5' 
                  : isDragging
                    ? 'border-[#00658d] bg-[#c6e7ff]/20'
                    : 'border-[#bdc8d1] hover:border-[#00658d] bg-[#f0f4f8]'
              }`}
            >
              {photo ? (
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-[#77cb16]">
                  <img
                    src={photo}
                    alt="Uploaded Proof"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-bold bg-[#00658d] px-3 py-1.5 rounded-full">
                      重新选择
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <span className="text-4xl mb-2">📸</span>
                  <p className="text-sm font-bold text-[#00658d]">
                    拖拽图片到这里，或点击这里进行拍照
                  </p>
                  <p className="text-xs text-[#6e7881] mt-1 font-semibold">
                    支持拖放、双击或单击，上传您的字帖或成果照片
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Reflection Notes Text input */}
        <div className="plush-card p-5 space-y-3">
          <h3 className="font-headline font-bold text-base text-[#171c1f] flex items-center gap-1.5">
            <FileText className="w-5 h-5 text-[#00658d]" />
            完成心得与收获 (选填)
          </h3>
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="今天练习有什么体会？写写自己写得最好的字，或者有哪些进步吧..."
            className="w-full min-h-[100px] bg-[#f0f4f8] border-2 border-[#bdc8d1] focus:border-[#00658d] rounded-2xl p-4 text-sm outline-none font-medium text-[#171c1f] transition-all resize-none"
          />
        </div>

        {/* Verification Checklist */}
        <div className="bg-white border-4 border-[#dfe3e7] rounded-3xl p-5 space-y-3">
          <h4 className="font-headline font-bold text-sm text-[#00658d]">验收标准与规则</h4>
          <div className="space-y-2.5">
            <div className="flex items-center gap-3">
              <CheckCircle className={`w-5 h-5 ${task.photoRequired && !photo ? 'text-[#6e7881]' : 'text-[#77cb16]'}`} />
              <span className="text-xs font-bold text-[#3e4850]">
                必须上传照片作为练字练习成果证明
              </span>
            </div>
            {task.timerRequired && (
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-[#77cb16]" />
                <span className="text-xs font-bold text-[#3e4850]">
                  计时需至少运行，辅助提高专注力
                </span>
              </div>
            )}
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#00658d] mt-0.5" />
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-[#3e4850] block">
                  认证审核人
                </span>
                <div className="flex flex-wrap items-center gap-1">
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
                  {task.verifiers && task.verifiers.length > 1 && (
                    <span className="bg-[#f0f4f8] text-[#55606a] border border-[#bdc8d1]/50 px-1.5 py-0.5 rounded-full text-[8.5px] font-bold">
                      {task.verifierLogic === 'AND' ? '双方认证 (且)' : '任一人认证 (或)'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Confirm Submit Action Button */}
        <button
          onClick={handleSubmit}
          className="w-full bubble-button-primary py-4 text-base font-bold tracking-wide flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-5 h-5 text-white" />
          确认打卡并领取奖励 ✨
        </button>
      </main>

      {/* Navigation Footer */}
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
