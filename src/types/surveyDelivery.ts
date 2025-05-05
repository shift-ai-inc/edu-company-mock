import { AvailableSurvey } from './survey';

// Re-use DeliveryStatus from assessmentDelivery or define specifically if needed
// Keep the original statuses, 'cancelled' will be handled in the component state or potentially added later if needed backend-side
export type DeliveryStatus = 'scheduled' | 'in-progress' | 'completed' | 'expired';
export type RecurrenceFrequency = 'none' | 'daily' | 'weekly' | 'monthly' | 'quarterly';

/**
 * Represents a specific delivery instance of a survey,
 * potentially augmented with schedule info if it's part of a recurring series.
 */
export interface SurveyDelivery {
  deliveryId: string; // Could represent a single instance or the schedule ID
  survey: Pick<AvailableSurvey, 'id' | 'title' | 'estimatedTime'>; // Link to the survey template
  targetGroup: string; // Department or group name
  deliveryStartDate: Date; // Start date of the first/current instance or the schedule start
  deliveryEndDate: Date;   // End date of the first/current instance or the schedule end (if applicable)
  // Future Enhancement: Add timezone field e.g., timeZone?: string;
  status: DeliveryStatus | 'paused'; // Add 'paused' status for recurring schedules
  totalDelivered: number; // For a single instance or total across recurring? Needs clarification. Assume single for now.
  completedCount: number; // Assume single for now.
  incompleteCount: number; // Assume single for now.
  createdBy: string; // User who scheduled it
  createdAt: Date;
  // Future Enhancement: Audit Log - Add fields like modifiedBy?: string; modifiedAt?: Date;

  // --- Fields for Recurring Schedule Management (Added for Details Page) ---
  isRecurring?: boolean;
  frequency?: RecurrenceFrequency;
  // recurrenceDetails?: any; // For specific day of week/month etc.
  dynamicGroup?: boolean; // Option to auto-include new members
  // pausedAt?: Date | null; // When the schedule was paused
  // nextRunDate?: Date | null; // Calculated next delivery date for recurring
}

// Helper function to get display text and variant for status (can reuse from assessment if identical)
// Updated to include 'paused' and 'cancelled' (handled in component state)
export const getSurveyDeliveryStatusInfo = (status: DeliveryStatus | 'paused' | 'cancelled'): { text: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' } => {
  switch (status) {
    case 'scheduled':
      return { text: '予定', variant: 'default' };
    case 'in-progress':
      return { text: '進行中', variant: 'secondary' };
    case 'completed':
      return { text: '完了', variant: 'outline' };
    case 'expired':
       return { text: '期限切れ', variant: 'destructive' };
    case 'paused':
       return { text: '一時停止中', variant: 'outline' }; // Example style for paused
    case 'cancelled': // Handled in component state, but added here for completeness
       return { text: 'キャンセル済', variant: 'destructive' };
    default:
      // Ensure exhaustive check or handle unknown status
      const exhaustiveCheck: never = status;
      console.warn(`Unknown status encountered: ${exhaustiveCheck}`);
      return { text: '不明', variant: 'outline' };
  }
};

// Helper for frequency display text
export const getFrequencyText = (frequency: RecurrenceFrequency | undefined): string => {
  if (!frequency) return 'なし';
  switch (frequency) {
    case 'none': return 'なし';
    case 'daily': return '毎日';
    case 'weekly': return '毎週';
    case 'monthly': return '毎月';
    case 'quarterly': return '四半期ごと';
    default: return '不明';
  }
};
