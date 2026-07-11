import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Types & Initial Data
import { Task, RewardItem, ScreenId, AppState } from './types';
import { initialTasks, initialRewards } from './initialData';

// Modular Screen Components
import TodayTasks from './components/TodayTasks';
import TaskPunch from './components/TaskPunch';
import TimerScreen from './components/TimerScreen';
import RewardsStore from './components/RewardsStore';
import StatsDashboard from './components/StatsDashboard';
import GoalPlanning from './components/GoalPlanning';

export default function App() {
  // App states
  const [coins, setCoins] = useState(120);
  const [diamonds, setDiamonds] = useState(15);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [rewards, setRewards] = useState<RewardItem[]>(initialRewards);
  const [screen, setScreen] = useState<ScreenId>('today-tasks');
  const [activeTaskId, setActiveTaskId] = useState<string | null>('task-1'); // Default to "练字"
  const [transitionDirection, setTransitionDirection] = useState<'forward' | 'backward' | 'none'>('none');

  // Handle navigation with animation state transitions
  const handleNavigate = (targetScreen: ScreenId, direction: 'forward' | 'backward' | 'none' = 'none') => {
    setTransitionDirection(direction);
    setScreen(targetScreen);
  };

  // Toggle tasks status directly (Quick Punch in TodayTasks)
  const handleToggleTask = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          const newStatus = task.status === 'completed' ? 'todo' : 'completed';
          if (newStatus === 'completed') {
            // Reward coins and diamonds
            setCoins(c => c + task.coins);
            setDiamonds(d => d + task.diamonds);
          } else {
            // Deduct reward
            setCoins(c => Math.max(0, c - task.coins));
            setDiamonds(d => Math.max(0, d - task.diamonds));
          }
          return { ...task, status: newStatus };
        }
        return task;
      })
    );
  };

  // Detailed punch completion (from TaskPunch screen)
  const handleCompleteTask = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          if (task.status !== 'completed') {
            setCoins(c => c + task.coins);
            setDiamonds(d => d + task.diamonds);
          }
          return { ...task, status: 'completed' };
        }
        return task;
      })
    );
  };

  // Purchase/Exchange reward in RewardStore
  const handlePurchaseReward = (rewardId: string, costCoins: number, costDiamonds: number): boolean => {
    if (coins >= costCoins && diamonds >= costDiamonds) {
      setCoins(c => c - costCoins);
      setDiamonds(d => d - costDiamonds);
      setRewards(prevRewards =>
        prevRewards.map(item =>
          item.id === rewardId ? { ...item, stock: Math.max(0, item.stock - 1) } : item
        )
      );
      return true;
    }
    return false;
  };

  // Add customized planning task in GoalPlanning
  const handleAddTask = (newTask: Task) => {
    setTasks(prev => [newTask, ...prev]);
  };

  // Get active task object
  const activeTaskObj = tasks.find(t => t.id === activeTaskId) || null;

  // Animation Variant maps based on direction
  const variants = {
    enter: (direction: 'forward' | 'backward' | 'none') => {
      if (direction === 'none') return { opacity: 0 };
      return {
        x: direction === 'forward' ? '100%' : '-100%',
        opacity: 0,
      };
    },
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: 'forward' | 'backward' | 'none') => {
      if (direction === 'none') return { opacity: 0 };
      return {
        x: direction === 'forward' ? '-100%' : '100%',
        opacity: 0,
      };
    },
  };

  // Render correct screen component
  const renderScreen = () => {
    switch (screen) {
      case 'today-tasks':
        return (
          <TodayTasks
            tasks={tasks}
            coins={coins}
            diamonds={diamonds}
            onNavigate={handleNavigate}
            onToggleTask={handleToggleTask}
            onSelectTaskToPunch={setActiveTaskId}
          />
        );
      case 'task-punch':
        return (
          <TaskPunch
            activeTask={activeTaskObj}
            coins={coins}
            diamonds={diamonds}
            onNavigate={handleNavigate}
            onCompleteTask={handleCompleteTask}
          />
        );
      case 'timer':
        return <TimerScreen onNavigate={handleNavigate} />;
      case 'rewards':
        return (
          <RewardsStore
            rewards={rewards}
            coins={coins}
            diamonds={diamonds}
            onNavigate={handleNavigate}
            onPurchaseReward={handlePurchaseReward}
          />
        );
      case 'stats':
        return (
          <StatsDashboard
            coins={coins}
            diamonds={diamonds}
            tasks={tasks}
            rewards={rewards}
            setCoins={setCoins}
            setDiamonds={setDiamonds}
            setTasks={setTasks}
            setRewards={setRewards}
            onNavigate={handleNavigate}
          />
        );
      case 'planning':
        return (
          <GoalPlanning
            coins={coins}
            diamonds={diamonds}
            tasks={tasks}
            onNavigate={handleNavigate}
            onAddTask={handleAddTask}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f6fafe] text-[#171c1f] select-none overflow-x-hidden">
      <AnimatePresence mode="wait" custom={transitionDirection}>
        <motion.div
          key={screen}
          custom={transitionDirection}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 350, damping: 35 },
            opacity: { duration: 0.2 },
          }}
          className="w-full min-h-screen"
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
