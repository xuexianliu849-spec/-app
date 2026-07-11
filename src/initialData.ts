import { Task, RewardItem } from './types';

export const initialTasks: Task[] = [
  {
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
  },
  {
    id: 'task-2',
    name: '英语听力/阅读',
    category: '阅读',
    icon: 'menu_book',
    status: 'todo',
    coins: 20,
    diamonds: 2,
    duration: 30,
    period: '每天',
    days: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    photoRequired: false,
    timerRequired: true,
    reflectionRequired: true,
    logic: 'AND',
    verifier: '爸爸'
  },
  {
    id: 'task-3',
    name: '每日口算训练',
    category: '口算',
    icon: 'calculate',
    status: 'completed',
    coins: 10,
    diamonds: 1,
    duration: 10,
    period: '每天',
    days: ['M', 'T', 'W', 'T', 'F'],
    photoRequired: true,
    timerRequired: false,
    reflectionRequired: false,
    logic: 'OR',
    verifier: '妈妈',
    verifiers: ['爸爸', '妈妈'],
    verifierLogic: 'AND'
  },
  {
    id: 'task-4',
    name: '户外跳绳500下',
    category: '运动',
    icon: 'directions_run',
    status: 'todo',
    coins: 25,
    diamonds: 2,
    duration: 20,
    period: '每天',
    days: ['M', 'W', 'F'],
    photoRequired: true,
    timerRequired: false,
    reflectionRequired: false,
    logic: 'OR',
    verifier: '妈妈'
  },
  {
    id: 'task-5',
    name: '整理个人书桌与房间',
    category: '家务',
    icon: 'dry_cleaning',
    status: 'todo',
    coins: 10,
    diamonds: 1,
    duration: 10,
    period: '指定日期',
    days: ['S', 'S'],
    photoRequired: true,
    timerRequired: false,
    reflectionRequired: false,
    logic: 'OR',
    verifier: '妈妈'
  }
];

export const initialRewards: RewardItem[] = [
  {
    id: 'reward-1',
    name: '看动画片 30 分钟',
    description: '可以用来兑换30分钟的平板/电视看动画片时间。',
    costCoins: 50,
    costDiamonds: 1,
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=300&auto=format&fit=crop',
    stock: 99
  },
  {
    id: 'reward-2',
    name: '双球冰淇淋兑换券',
    description: '周末可以凭此券兑换美味的哈根达斯或甜筒冰淇淋。',
    costCoins: 80,
    costDiamonds: 2,
    image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?q=80&w=300&auto=format&fit=crop',
    stock: 5
  },
  {
    id: 'reward-3',
    name: '周末去游乐园玩一天',
    description: '和爸爸妈妈一起去欢乐谷或迪士尼乐园度过一整天！',
    costCoins: 500,
    costDiamonds: 10,
    image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=300&auto=format&fit=crop',
    stock: 1
  },
  {
    id: 'reward-4',
    name: '精美文具盲盒套装',
    description: '包含炫酷的卡通中性笔、修正带、记事本以及贴纸。',
    costCoins: 120,
    costDiamonds: 3,
    image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=300&auto=format&fit=crop',
    stock: 12
  },
  {
    id: 'reward-5',
    name: '乐高积木超级赛车',
    description: '可拼装的高速跑车模型，培养动手创造力！',
    costCoins: 600,
    costDiamonds: 15,
    image: 'https://images.unsplash.com/photo-1566694271453-390536dd1f0d?q=80&w=300&auto=format&fit=crop',
    stock: 2
  },
  {
    id: 'reward-6',
    name: '和爸爸去野餐钓鱼',
    description: '周末晴天与爸爸一同去郊外公园野餐和静心钓鱼。',
    costCoins: 300,
    costDiamonds: 5,
    image: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?q=80&w=300&auto=format&fit=crop',
    stock: 3
  }
];
