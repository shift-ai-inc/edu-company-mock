import { AssessmentDelivery } from '@/types/assessmentDelivery';
import { addDays, subDays } from 'date-fns';

const now = new Date();

export const mockAssessmentDeliveries: AssessmentDelivery[] = [
  {
    deliveryId: 'del-001',
    assessment: { id: 'assess-001', title: '基礎プログラミングスキル評価', estimatedTime: 30 },
    targetGroup: '新人研修グループA',
    deliveryStartDate: subDays(now, 5),
    deliveryEndDate: addDays(now, 10), // Ends in 10 days
    status: 'in-progress',
    totalDelivered: 25,
    completedCount: 10,
    incompleteCount: 15,
    createdBy: '田中 太郎',
    createdAt: subDays(now, 6),
  },
  {
    deliveryId: 'del-002',
    assessment: { id: 'assess-002', title: 'リーダーシップ360度評価', estimatedTime: 45 },
    targetGroup: '管理職層',
    deliveryStartDate: subDays(now, 30),
    deliveryEndDate: subDays(now, 2), // Ended 2 days ago, but maybe not all completed? Let's make it expired
    status: 'expired', // Changed status
    totalDelivered: 15,
    completedCount: 12,
    incompleteCount: 3,
    createdBy: '佐藤 花子',
    createdAt: subDays(now, 31),
  },
  {
    deliveryId: 'del-003',
    assessment: { id: 'assess-003', title: 'コミュニケーションスタイル自己診断', estimatedTime: 20 },
    targetGroup: '全社',
    deliveryStartDate: subDays(now, 15),
    deliveryEndDate: addDays(now, 2), // Ends in 2 days (near expiry)
    status: 'in-progress',
    totalDelivered: 250,
    completedCount: 180,
    incompleteCount: 70,
    createdBy: '鈴木 一郎',
    createdAt: subDays(now, 16),
  },
  {
    deliveryId: 'del-004',
    assessment: { id: 'assess-006', title: 'プロジェクトマネジメント基礎', estimatedTime: 40 },
    targetGroup: 'PMO候補',
    deliveryStartDate: addDays(now, 7), // Starts in 7 days
    deliveryEndDate: addDays(now, 21),
    status: 'scheduled',
    totalDelivered: 10, // Might be 0 if not sent yet, but let's assume target count
    completedCount: 0,
    incompleteCount: 10,
    createdBy: '田中 太郎',
    createdAt: subDays(now, 1),
  },
   {
    deliveryId: 'del-005',
    assessment: { id: 'assess-005', title: 'チームエンゲージメントサーベイ', estimatedTime: 25 },
    targetGroup: '開発部',
    deliveryStartDate: subDays(now, 40),
    deliveryEndDate: subDays(now, 10), // Completed 10 days ago
    status: 'completed',
    totalDelivered: 40,
    completedCount: 38,
    incompleteCount: 2, // Maybe 2 didn't respond
    createdBy: '佐藤 花子',
    createdAt: subDays(now, 41),
  },
   {
    deliveryId: 'del-006',
    assessment: { id: 'assess-001', title: '基礎プログラミングスキル評価', estimatedTime: 30 },
    targetGroup: '新人研修グループB',
    deliveryStartDate: subDays(now, 5),
    deliveryEndDate: addDays(now, 1), // Ends tomorrow (near expiry)
    status: 'in-progress',
    totalDelivered: 20,
    completedCount: 5,
    incompleteCount: 15,
    createdBy: '田中 太郎',
    createdAt: subDays(now, 6),
  },
];

// Mock function to simulate fetching data
export const getAssessmentDeliveries = async (): Promise<AssessmentDelivery[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 50));
  // In a real app, you might update statuses based on current date here
  // For now, return the static mock data
  return mockAssessmentDeliveries;
};
