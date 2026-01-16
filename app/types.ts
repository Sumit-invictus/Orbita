
export interface BiometricData {
  time: string;
  heartRate: number;
  hrv: number;
  respiration: number;
  stress: number;
  fatigue: number; 
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  status: 'recommended' | 'postponed' | 'safe' | 'completed';
  category: string;
  cognitiveLoad: number; // 1-10 scale
  subTasks?: SubTask[];
  predictedFatigueImpact?: number;
}

export interface Message {
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  suggestions?: string[];
}

export enum RiskLevel {
  LOW = 'LOW',
  MODERATE = 'MODERATE',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface Profile {
  id: string;
  name: string;
  role: string;
  avatar: string;
  clearance: 'Alpha' | 'Beta' | 'Gamma';
  status: 'Online' | 'Deploying' | 'Resting';
}
