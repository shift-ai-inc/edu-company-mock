/**
 * Represents the basic information about an available survey template.
 */
export interface AvailableSurvey {
  id: string;
  title: string;
  description: string;
  category: string; // e.g., 'エンゲージメント', '満足度調査', '研修後アンケート'
  estimatedTime: number; // minutes
  createdAt: Date;
  // Add other relevant survey template fields if needed
}
