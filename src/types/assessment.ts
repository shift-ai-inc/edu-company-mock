// Define shared types for assessments

export interface AvailableAssessment {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string; // Keep this for list/card view
  type: 'スキル評価' | '360度評価' | '自己評価' | 'エンゲージメント';
  difficulty: 'easy' | 'medium' | 'hard';
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'all';
  estimatedTime: number; // minutes
  isPopular: boolean;
  isRecommended: boolean;
  tags: string[];
  category: string; // Keep category for filtering/display
  createdAt: string; // ISO date string
  usageCount: number; // Keep usage count
}

export interface AssessmentCategory {
  name: string;
  questionCount: number;
}

export interface DifficultyDistribution {
  easy: number;
  medium: number;
  hard: number;
}

export interface SampleQuestion {
  id: string;
  text: string;
  type: 'multiple-choice' | 'text' | 'rating'; // Example types
}

export interface AssessmentStatistics {
  totalDeliveries: number;
  averageScore?: number; // Optional, might not apply to all types
  completionRate?: number; // Optional
  lastDelivered?: string; // ISO date string or formatted date
}

// Detailed Assessment type extending the base AvailableAssessment
export interface AssessmentDetail extends AvailableAssessment {
  structureDescription: string; // e.g., "全20問: 選択式15問、簡単なコーディング問題5問。"
  categories: AssessmentCategory[]; // Breakdown by category/section
  difficultyDistribution: DifficultyDistribution;
  sampleQuestions: SampleQuestion[];
  targetSkills: string[]; // Skills this assessment targets
  measurableAbilities: string[]; // Abilities measured
  statistics: AssessmentStatistics; // Delivery stats
}


// Helper function to get display text for difficulty
export const getDifficultyText = (difficulty: AvailableAssessment['difficulty']) => {
  switch (difficulty) {
    case 'easy': return '易しい';
    case 'medium': return '普通';
    case 'hard': return '難しい';
    default: return '';
  }
};

// Helper function to get display text for skill level
export const getSkillLevelText = (level: AvailableAssessment['skillLevel']) => {
  switch (level) {
    case 'beginner': return '初級';
    case 'intermediate': return '中級';
    case 'advanced': return '上級';
    case 'all': return '全レベル';
    default: return '';
  }
};
