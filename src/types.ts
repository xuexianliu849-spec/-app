export interface Task {
  id: string;
  name: string;
  category: '阅读' | '练字' | '口算' | '科学' | '运动' | '家务' | string;
  icon: string;
  status: 'todo' | 'completed';
  coins: number;
  diamonds: number;
  duration: number; // in minutes
  period: '每天' | '指定日期';
  days?: string[]; // ['M', 'T', 'W', 'T', 'F']
  photoRequired: boolean;
  timerRequired: boolean;
  reflectionRequired: boolean;
  logic: 'AND' | 'OR';
  verifier: string;
  verifiers?: string[];
  verifierLogic?: 'AND' | 'OR';
}

export interface RewardItem {
  id: string;
  name: string;
  description: string;
  costCoins: number;
  costDiamonds: number;
  image: string;
  stock: number;
}

export type ScreenId = 'today-tasks' | 'task-punch' | 'timer' | 'rewards' | 'stats' | 'planning';

export interface AppState {
  screen: ScreenId;
  transitionDirection: 'forward' | 'backward' | 'none';
  coins: number;
  diamonds: number;
  tasks: Task[];
  rewards: RewardItem[];
  activeTaskId: string | null;
}
