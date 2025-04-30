import { AvailableAssessment } from './assessment';

export type DeliveryStatus = 'scheduled' | 'in-progress' | 'completed' | 'expired';

export interface AssessmentDelivery {
  deliveryId: string;
  assessment: Pick<AvailableAssessment, 'id' | 'title' | 'estimatedTime'>; // Link to the assessment
  targetGroup: string; // Department or group name
  deliveryStartDate: Date;
  deliveryEndDate: Date;
  status: DeliveryStatus;
  totalDelivered: number;
  completedCount: number;
  incompleteCount: number; // Calculated or stored
  createdBy: string; // User who scheduled it
  createdAt: Date;
}

// Helper function to get display text and variant for status
export const getDeliveryStatusInfo = (status: DeliveryStatus): { text: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' } => {
  switch (status) {
    case 'scheduled':
      return { text: '予定', variant: 'outline' }; // Gray outline
    case 'in-progress':
      return { text: '進行中', variant: 'default' }; // Blue/Primary
    case 'completed':
      return { text: '完了', variant: 'secondary' }; // Green or another distinct color - using secondary (gray) for now
    case 'expired':
       return { text: '期限切れ', variant: 'destructive' }; // Red
    default:
      return { text: '不明', variant: 'outline' };
  }
};
