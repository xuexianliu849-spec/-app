import React, { useState } from 'react';
import { RewardItem, ScreenId } from '../types';
import { 
  Store, 
  Sparkles, 
  ClipboardList, 
  Calendar, 
  Trophy 
} from 'lucide-react';

interface RewardsStoreProps {
  rewards: RewardItem[];
  coins: number;
  diamonds: number;
  onNavigate: (screen: ScreenId, transition?: 'forward' | 'backward' | 'none') => void;
  onPurchaseReward: (rewardId: string, costCoins: number, costDiamonds: number) => boolean;
}

export default function RewardsStore({
  rewards,
  coins,
  diamonds,
  onNavigate,
  onPurchaseReward
}: RewardsStoreProps) {
  const [successItem, setSuccessItem] = useState<RewardItem | null>(null);

  const handleExchange = (item: RewardItem) => {
    if (item.stock <= 0) {
      alert('抱歉，该礼品已经被抢光啦！😿');
      return;
    }

    const isSuccess = onPurchaseReward(item.id, item.costCoins, item.costDiamonds);
    if (isSuccess) {
      setSuccessItem(item);
    } else {
      alert('金币或钻石余额不足哦，去努力完成更多任务赚取金币吧！🔥🏃‍♂️');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f6fafe] text-[#171c1f] font-sans pb-32 relative">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#f6fafe]/90 backdrop-blur-md px-6 py-4 border-b-4 border-[#dfe3e7] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Store className="w-6 h-6 text-[#755b00]" />
          <h1 className="font-headline text-xl font-bold text-[#00658d] tracking-tight">奖励商店</h1>
        </div>

        {/* Currency Display widget */}
        <div className="flex items-center gap-2 bg-[#eaeef2] border-2 border-[#dfe3e7] rounded-full px-4 py-1.5 shadow-sm">
          <div className="flex items-center gap-1">
            <span className="text-[#755b00] font-bold">🪙</span>
            <span className="text-sm font-bold text-[#3e4850]">{coins}</span>
          </div>
          <div className="w-[1px] h-4 bg-[#bdc8d1]"></div>
          <div className="flex items-center gap-1">
            <span className="text-[#00658d] font-bold">💎</span>
            <span className="text-sm font-bold text-[#3e4850]">{diamonds}</span>
          </div>
        </div>
      </header>

      {/* Success Redeemed Popup */}
      {successItem && (
        <div className="fixed inset-0 bg-[#00658d]/60 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          <div className="bg-white border-4 border-[#ffcf44] rounded-3xl p-8 max-w-sm w-full shadow-2xl space-y-5 animate-scale-up float-slow">
            <span className="text-6xl block">🎁</span>
            <h2 className="font-headline text-2xl font-bold text-[#725800]">兑换成功！</h2>
            
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-[#dfe3e7]">
              <img
                src={successItem.image}
                alt={successItem.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="space-y-1">
              <h3 className="font-headline font-bold text-lg text-[#171c1f]">
                {successItem.name}
              </h3>
              <p className="text-xs text-[#6e7881] font-semibold leading-relaxed px-4">
                兑换凭证已生成。请找爸爸或妈妈核对并兑现你的奖励哦！
              </p>
            </div>

            <button
              onClick={() => setSuccessItem(null)}
              className="w-full bubble-button-secondary py-3 text-sm font-bold"
            >
              太棒了，收下它！
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 w-full max-w-lg mx-auto px-6 py-6 space-y-6">
        {/* Banner with points overview */}
        <div className="bg-gradient-to-br from-[#00658d] to-[#47c1ff] text-white rounded-3xl p-6 border-b-4 border-[#004d6c] shadow-md relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <h2 className="font-headline text-lg font-bold">勇士奖赏激励计划</h2>
            <p className="text-xs text-white/95 font-medium leading-relaxed">
              付出就有回报！通过认真打卡和坚持专注换取金币，即可在这里兑换专属于你的心愿奖品、零食娱乐和周末时光卡片。
            </p>
          </div>
          {/* Subtle floating background icons */}
          <div className="absolute right-2 bottom-0 text-7xl opacity-15 pointer-events-none select-none">
            🏆
          </div>
        </div>

        {/* Section Header */}
        <h3 className="font-headline text-lg font-bold text-[#171c1f] flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#ffcf44]" />
          心愿兑换列表 ({rewards.length})
        </h3>

        {/* Grid of Reward Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {rewards.map((item) => {
            const canAfford = coins >= item.costCoins && diamonds >= item.costDiamonds;
            const hasStock = item.stock > 0;
            return (
              <div
                key={item.id}
                className={`plush-card flex flex-col overflow-hidden group ${
                  hasStock ? 'hover:border-[#00658d]' : 'opacity-65'
                }`}
              >
                {/* Image panel */}
                <div className="relative aspect-[4/3] overflow-hidden border-b-2 border-[#dfe3e7]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2.5 right-2.5 bg-black/55 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    库存: {item.stock}
                  </div>
                </div>

                {/* Content info */}
                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <h4 className="font-headline font-bold text-sm text-[#171c1f] leading-tight group-hover:text-[#00658d]">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-[#6e7881] font-semibold leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    {/* Cost pills */}
                    <div className="flex flex-col text-xs font-bold space-y-0.5 text-[#3e4850]">
                      <div className="flex items-center gap-1">
                        <span>🪙</span>
                        <span className="text-[#755b00]">{item.costCoins}</span>
                      </div>
                      {item.costDiamonds > 0 && (
                        <div className="flex items-center gap-1">
                          <span>💎</span>
                          <span className="text-[#00658d]">{item.costDiamonds}</span>
                        </div>
                      )}
                    </div>

                    {/* Redeeming trigger action */}
                    <button
                      onClick={() => handleExchange(item)}
                      disabled={!hasStock}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                        !hasStock
                          ? 'bg-[#e4e9ed] text-[#6e7881] border-b-2 border-slate-300 cursor-not-allowed'
                          : canAfford
                            ? 'bg-[#ffcf44] text-[#725800] border-b-2 border-[#755b00] hover:brightness-105 active:translate-y-0.5 active:border-b-0'
                            : 'bg-[#e4e9ed] text-[#6e7881] border-b-2 border-[#bdc8d1] hover:bg-[#dfe3e7]'
                      }`}
                    >
                      {hasStock ? (canAfford ? '立即兑换' : '额度不足') : '已售罄'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer Nav containing xpath elements: */}
      {/* a containing span[text()='今日'] */}
      {/* a containing span[text()='计划'] */}
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
          className="flex flex-col items-center justify-center text-[#00658d] px-4 py-1.5 cursor-pointer"
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
