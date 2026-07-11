import React, { useState } from 'react';
import { ScreenId, Task, RewardItem } from '../types';
import { 
  CheckCircle, 
  TrendingUp, 
  Flame, 
  PieChart, 
  ClipboardList, 
  Calendar, 
  Sparkles, 
  Trophy,
  Cloud,
  Download,
  Upload,
  RefreshCw,
  FileJson
} from 'lucide-react';
import { 
  getGoogleAccessToken, 
  uploadToDrive, 
  downloadFromDrive, 
  exportLocalBackup,
  BackupData 
} from '../lib/driveService';

interface StatsDashboardProps {
  coins: number;
  diamonds: number;
  tasks: Task[];
  rewards: RewardItem[];
  setCoins: React.Dispatch<React.SetStateAction<number>>;
  setDiamonds: React.Dispatch<React.SetStateAction<number>>;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setRewards: React.Dispatch<React.SetStateAction<RewardItem[]>>;
  onNavigate: (screen: ScreenId, transition?: 'forward' | 'backward' | 'none') => void;
}

export default function StatsDashboard({
  coins,
  diamonds,
  tasks,
  rewards,
  setCoins,
  setDiamonds,
  setTasks,
  setRewards,
  onNavigate
}: StatsDashboardProps) {
  const [reportType, setReportType] = useState<'weekly' | 'monthly'>('weekly');
  const [gdriveToken, setGdriveToken] = useState<string>('');
  const [clientId, setClientId] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleGoogleLogin = async () => {
    setIsProcessing(true);
    setMessage(null);
    try {
      const token = await getGoogleAccessToken(clientId);
      setGdriveToken(token);
      setMessage({ type: 'success', text: '✅ 成功授权并连接 Google Drive 接口！' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || '连接失败' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDriveBackup = async () => {
    setIsProcessing(true);
    setMessage(null);
    try {
      const backup: BackupData = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        coins,
        diamonds,
        tasks,
        rewards,
      };
      await uploadToDrive(gdriveToken, backup);
      setMessage({ type: 'success', text: '🎉 备份成功！您的习惯状态数据已安全存储在 Google Drive 中。' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || '上传云端失败' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDriveRestore = async () => {
    const confirmed = window.confirm('您确定要从 Google Drive 恢复备份吗？这将完全覆盖当前的所有任务进度、金币与钻石数量！');
    if (!confirmed) return;

    setIsProcessing(true);
    setMessage(null);
    try {
      const data = await downloadFromDrive(gdriveToken);
      if (data.coins !== undefined && data.tasks !== undefined) {
        setCoins(data.coins);
        setDiamonds(data.diamonds);
        setTasks(data.tasks);
        setRewards(data.rewards);
        setMessage({ type: 'success', text: '✨ 云端数据恢复成功！进度已完全同步。' });
      } else {
        setMessage({ type: 'error', text: '备份文件数据格式不正确。' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || '下载恢复失败' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLocalExport = () => {
    try {
      const backup: BackupData = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        coins,
        diamonds,
        tasks,
        rewards,
      };
      exportLocalBackup(backup);
      setMessage({ type: 'success', text: '🎉 本地备份文件下载完成！' });
    } catch (err: any) {
      setMessage({ type: 'error', text: '本地导出失败' });
    }
  };

  const handleLocalImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.coins !== undefined && data.tasks !== undefined) {
          setCoins(data.coins);
          setDiamonds(data.diamonds);
          setTasks(data.tasks);
          setRewards(data.rewards);
          setMessage({ type: 'success', text: '✨ 本地备份数据导入并覆盖成功！' });
        } else {
          setMessage({ type: 'error', text: '无效的备份文件结构。' });
        }
      } catch (err) {
        setMessage({ type: 'error', text: '解析本地 JSON 备份文件失败。' });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f6fafe] text-[#171c1f] font-sans pb-32">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#f6fafe]/90 backdrop-blur-md px-6 py-4 border-b-4 border-[#dfe3e7] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#00658d] shadow-sm">
            <img
              alt="User Avatar"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLlZlNEg0RA1wCvxuJcPRyY9r_A4rzjKmtggZPFIBCXZCS6G0ruSunSQQT5ZSdskDl-t05AlqnHyd0nxfZ0EhY-yexkUDfAX__5txDAXbKbpcHGUBuBwgygFE11JrrE1xoT01ecjs7NrXqKJfpjgWiDJ95BfkHU3c-RbIX4w0uiHkMwi4zaEJFCDgg-ECp7E7EzwHPGO03DV_ReGd5cDYoA-5KpkN09DePfn2e1PLv0Lk97emcxq2R_w"
              referrerPolicy="no-referrer"
            />
          </div>
          <h1 className="font-headline text-lg font-bold text-[#00658d] tracking-tight">HabitQuest</h1>
        </div>

        {/* Level Stats Widget */}
        <div className="flex gap-2">
          <div className="flex items-center gap-1.5 bg-[#eaeef2] border-2 border-[#dfe3e7] rounded-full px-3 py-1 text-xs font-bold text-[#3e4850]">
            <span>🪙</span>
            <span>1,240</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#eaeef2] border-2 border-[#dfe3e7] rounded-full px-3 py-1 text-xs font-bold text-[#3e4850]">
            <span>💎</span>
            <span>85</span>
          </div>
        </div>
      </header>

      {/* Main Stats Panel Container */}
      <main className="flex-1 w-full max-w-lg mx-auto px-6 py-6 space-y-6">
        {/* Title and Switcher */}
        <div className="flex items-center justify-between">
          <h2 className="font-headline text-2xl font-bold text-[#171c1f]">成长统计</h2>
          <div className="bg-[#eaeef2] rounded-full p-1 border-2 border-[#dfe3e7] flex gap-1">
            <button
              onClick={() => setReportType('weekly')}
              className={`px-4 py-1.5 rounded-full font-bold text-xs transition-all ${
                reportType === 'weekly'
                  ? 'bg-[#00658d] text-white shadow-sm'
                  : 'text-[#3e4850] hover:bg-[#dfe3e7]'
              }`}
            >
              周报
            </button>
            <button
              onClick={() => setReportType('monthly')}
              className={`px-4 py-1.5 rounded-full font-bold text-xs transition-all ${
                reportType === 'monthly'
                  ? 'bg-[#00658d] text-white shadow-sm'
                  : 'text-[#3e4850] hover:bg-[#dfe3e7]'
              }`}
            >
              月报
            </button>
          </div>
        </div>

        {/* Summary bento grids (Top Row) */}
        <div className="grid grid-cols-3 gap-3">
          {/* Total Completion */}
          <div className="plush-card p-3.5 flex flex-col items-center text-center justify-center bg-white">
            <div className="w-10 h-10 rounded-full bg-[#47c1ff]/20 text-[#00658d] flex items-center justify-center mb-2.5">
              <CheckCircle className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-[#6e7881] mb-1">本周总计</span>
            <span className="font-headline text-lg font-bold text-[#00658d]">
              {reportType === 'weekly' ? '42' : '178'}
              <span className="text-[10px] ml-0.5 text-[#6e7881]">次</span>
            </span>
          </div>

          {/* Success rate */}
          <div className="plush-card p-3.5 flex flex-col items-center text-center justify-center bg-white">
            <div className="w-10 h-10 rounded-full bg-[#77cb16]/20 text-[#3a6a00] flex items-center justify-center mb-2.5">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-[#6e7881] mb-1">完成率</span>
            <span className="font-headline text-lg font-bold text-[#3a6a00]">
              {reportType === 'weekly' ? '85' : '91'}
              <span className="text-[10px] ml-0.5 text-[#6e7881]">%</span>
            </span>
          </div>

          {/* Longest streak */}
          <div className="plush-card p-3.5 flex flex-col items-center text-center justify-center bg-white">
            <div className="w-10 h-10 rounded-full bg-[#ffcf44]/20 text-[#725800] flex items-center justify-center mb-2.5">
              <Flame className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-[#6e7881] mb-1">最长连续</span>
            <span className="font-headline text-lg font-bold text-[#725800]">
              {reportType === 'weekly' ? '12' : '28'}
              <span className="text-[10px] ml-0.5 text-[#6e7881]">天</span>
            </span>
          </div>
        </div>

        {/* Weekly Trend Line Chart */}
        <div className="plush-card p-5 bg-white space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-headline font-bold text-base text-[#171c1f]">本周完成趋势</h3>
            <span className="text-[10px] font-bold text-[#00658d] bg-[#c6e7ff] px-2.5 py-1 rounded-full">
              太棒了！稳步上升中
            </span>
          </div>

          {/* Responsive SVG Line Chart */}
          <div className="w-full aspect-[2/1] relative pt-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 400 150">
              <defs>
                <linearGradient id="chart-gradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#47c1ff" stopOpacity="0.8"></stop>
                  <stop offset="100%" stopColor="#47c1ff" stopOpacity="0"></stop>
                </linearGradient>
              </defs>
              
              {/* Horizontal grid lines */}
              <line stroke="#dfe3e7" strokeDasharray="4" strokeWidth="1" x1="0" x2="400" y1="20" y2="20"></line>
              <line stroke="#dfe3e7" strokeDasharray="4" strokeWidth="1" x1="0" x2="400" y1="65" y2="65"></line>
              <line stroke="#dfe3e7" strokeDasharray="4" strokeWidth="1" x1="0" x2="400" y1="110" y2="110"></line>
              
              {/* Shaded Area */}
              <path
                fill="url(#chart-gradient)"
                opacity="0.25"
                d="M20,120 L20,90 C50,90 70,60 100,50 C130,40 150,80 180,75 C210,70 230,40 260,35 C290,30 310,60 340,55 C360,51 370,30 380,20 L380,120 Z"
              ></path>
              
              {/* Curved Trend Line */}
              <path
                fill="none"
                stroke="#00658d"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20,90 C50,90 70,60 100,50 C130,40 150,80 180,75 C210,70 230,40 260,35 C290,30 310,60 340,55 C360,51 370,30 380,20"
              ></path>
              
              {/* Point highlights */}
              <circle cx="20" cy="90" r="6" fill="#00658d" stroke="#ffffff" strokeWidth="2.5"></circle>
              <circle cx="100" cy="50" r="6" fill="#00658d" stroke="#ffffff" strokeWidth="2.5"></circle>
              <circle cx="180" cy="75" r="6" fill="#00658d" stroke="#ffffff" strokeWidth="2.5"></circle>
              <circle cx="260" cy="35" r="6" fill="#00658d" stroke="#ffffff" strokeWidth="2.5"></circle>
              <circle cx="340" cy="55" r="6" fill="#00658d" stroke="#ffffff" strokeWidth="2.5"></circle>
              <circle cx="380" cy="20" r="6" fill="#00658d" stroke="#ffffff" strokeWidth="2.5"></circle>
            </svg>
            
            {/* X-Axis labels matching screenshot exactly */}
            <div className="absolute bottom-[-24px] w-full flex justify-between px-1 text-xs font-bold text-[#6e7881]">
              <span>一</span>
              <span>二</span>
              <span>三</span>
              <span>四</span>
              <span>五</span>
              <span>六</span>
              <span>日</span>
            </div>
          </div>
        </div>

        {/* Donut Chart: Task Distribution */}
        <div className="plush-card p-5 flex flex-col items-center bg-white">
          <h3 className="font-headline font-bold text-base text-[#171c1f] self-start mb-4">任务分布</h3>
          
          <div className="relative w-40 h-40 mb-5">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background grey ring */}
              <circle cx="50" cy="50" fill="transparent" r="40" stroke="#eaeef2" strokeWidth="16"></circle>
              
              {/* 1. Study (Blue - 40%) */}
              <circle
                className="fill-none stroke-[#00658d] transition-all duration-300"
                cx="50"
                cy="50"
                r="40"
                strokeWidth="16"
                strokeDasharray="100 151"
                strokeDashoffset="0"
                strokeLinecap="round"
              ></circle>
              
              {/* 2. Sports (Green - 25%) */}
              <circle
                className="fill-none stroke-[#3a6a00] transition-all duration-300"
                cx="50"
                cy="50"
                r="40"
                strokeWidth="16"
                strokeDasharray="62 189"
                strokeDashoffset="-100"
                strokeLinecap="round"
              ></circle>
              
              {/* 3. Life (Yellow - 20%) */}
              <circle
                className="fill-none stroke-[#ffcf44] transition-all duration-300"
                cx="50"
                cy="50"
                r="40"
                strokeWidth="16"
                strokeDasharray="50 201"
                strokeDashoffset="-162"
                strokeLinecap="round"
              ></circle>
              
              {/* 4. Reading (Light Blue - 15%) */}
              <circle
                className="fill-none stroke-[#81cfff] transition-all duration-300"
                cx="50"
                cy="50"
                r="40"
                strokeWidth="16"
                strokeDasharray="39 212"
                strokeDashoffset="-212"
                strokeLinecap="round"
              ></circle>
            </svg>
            
            {/* Center Pie icon decoration */}
            <div className="absolute inset-0 flex items-center justify-center">
              <PieChart className="w-8 h-8 text-[#bdc8d1]" />
            </div>
          </div>

          {/* Color Legend grids matching screenshot exactly */}
          <div className="w-full grid grid-cols-2 gap-3.5">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-[#00658d]"></div>
              <span className="text-xs font-bold text-[#3e4850]">学习 (40%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-[#3a6a00]"></div>
              <span className="text-xs font-bold text-[#3e4850]">运动 (25%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-[#ffcf44]"></div>
              <span className="text-xs font-bold text-[#3e4850]">生活 (20%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-[#81cfff]"></div>
              <span className="text-xs font-bold text-[#3e4850]">阅读 (15%)</span>
            </div>
          </div>
        </div>

        {/* Google Drive Cloud Backup & Export Panel */}
        <div className="plush-card p-5 bg-white space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b-2 border-[#eaeef2]">
            <Cloud className="w-5 h-5 text-[#00658d]" />
            <h3 className="font-headline font-bold text-base text-[#171c1f]">数据备份与 Google Drive 云端同步</h3>
          </div>

          <p className="text-xs text-[#6e7881] leading-relaxed">
            您可以通过此功能将您和孩子的“习惯小勇士”数据（包含金币、钻石、自定义任务状态及奖励商品）安全地备份至您的 <strong>Google Drive 谷歌网盘</strong> 或导出为本地 JSON 文件，以便随时在其他设备中导入恢复。
          </p>

          <div className="space-y-3 pt-1">
            {/* Google Drive Status & Setup */}
            <div className="bg-[#f0f4f8] rounded-2xl p-4 border border-[#bdc8d1]/30">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#3e4850] flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${gdriveToken ? 'bg-[#77cb16] animate-pulse' : 'bg-[#6e7881]'}`} />
                  云端状态: {gdriveToken ? '已连接授权' : '未连接'}
                </span>
                {gdriveToken && (
                  <button
                    onClick={() => setGdriveToken('')}
                    className="text-[10px] text-[#00658d] hover:underline font-bold cursor-pointer"
                  >
                    断开连接
                  </button>
                )}
              </div>

              {!gdriveToken ? (
                <div className="space-y-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-[#6e7881]">自定义 OAuth Client ID (非必填，留空将使用测试 ID):</label>
                    <input
                      type="text"
                      placeholder="客户端 ID (xxxx.apps.googleusercontent.com)"
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value)}
                      className="w-full text-xs font-bold px-3 py-2.5 bg-white border-2 border-[#bdc8d1] rounded-xl focus:border-[#00658d] outline-none"
                    />
                  </div>
                  <button
                    onClick={handleGoogleLogin}
                    disabled={isProcessing}
                    className="w-full flex items-center justify-center gap-2 bg-white hover:bg-[#eaeef2] text-[#3e4850] border-2 border-[#bdc8d1] font-bold rounded-2xl py-3 text-xs transition-all active:scale-95 shadow-sm cursor-pointer"
                  >
                    {isProcessing ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-[#00658d]" />
                    ) : (
                      <>
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.107C18.422 1.925 15.618 1 12.24 1c-6.073 0-11 4.927-11 11s4.927 11 11 11c6.338 0 10.56-4.453 10.56-10.756 0-.724-.078-1.275-.173-1.959h-10.387z"/>
                        </svg>
                        <span>连接并授权 Google Drive</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleDriveBackup}
                    disabled={isProcessing}
                    className="bg-[#00658d] text-white border-2 border-[#004d6c] hover:opacity-95 font-bold rounded-2xl py-2.5 text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                  >
                    {isProcessing ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>上传至云端</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleDriveRestore}
                    disabled={isProcessing}
                    className="bg-white text-[#00658d] border-2 border-[#00658d] hover:bg-[#eef8ff] font-bold rounded-2xl py-2.5 text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                  >
                    {isProcessing ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>从云端恢复</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Local JSON Import / Export */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleLocalExport}
                className="bg-white text-[#3e4850] border-2 border-[#bdc8d1] hover:bg-[#eaeef2] font-bold rounded-2xl py-2.5 text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              >
                <FileJson className="w-4 h-4 text-[#3e4850]" />
                <span>导出本地 JSON</span>
              </button>

              <label className="bg-white text-[#3e4850] border-2 border-[#bdc8d1] hover:bg-[#eaeef2] font-bold rounded-2xl py-2.5 text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer text-center select-none">
                <Upload className="w-4 h-4 text-[#3e4850]" />
                <span>导入本地 JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleLocalImport}
                  className="hidden"
                />
              </label>
            </div>

            {message && (
              <div className={`p-3 rounded-xl text-center text-xs font-bold ${
                message.type === 'success' 
                  ? 'bg-[#77cb16]/10 text-[#3a6a00] border border-[#77cb16]/20' 
                  : 'bg-red-50 text-red-600 border border-red-100'
              }`}>
                {message.text}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Navigation Footer containing xpath targets: */}
      {/* a with text '主页' -> 今日任务 - 详情增强版 */}
      {/* a with text '任务' -> 目标规划 - 中文版 (完整翻译) */}
      {/* a with text '成就' -> active (this dashboard) */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-4 pt-2 bg-white rounded-t-3xl border-t-4 border-[#dfe3e7] shadow-[0_-4px_20px_rgba(0,101,141,0.06)]">
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
          className="flex flex-col items-center justify-center text-[#00658d] px-4 py-1.5 cursor-pointer"
        >
          <Trophy className="w-6 h-6 mb-0.5" />
          <span className="font-sans text-xs font-bold">成就</span>
        </a>
      </nav>
    </div>
  );
}
