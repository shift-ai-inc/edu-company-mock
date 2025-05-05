import { SurveyDelivery, RecurrenceFrequency, DeliveryStatus } from '@/types/surveyDelivery'; // Import DeliveryStatus
import { addDays, subDays, setHours, setMinutes, addMonths, addWeeks, subMonths } from 'date-fns'; // Import subMonths
import { mockAvailableSurveys } from './mockSurveys';

const now = new Date();

// Find mock surveys to link
const engagementSurvey = mockAvailableSurveys.find(s => s.id === 'survey-001');
const trainingSurvey = mockAvailableSurveys.find(s => s.id === 'survey-002');
const environmentSurvey = mockAvailableSurveys.find(s => s.id === 'survey-003');
const remoteWorkSurvey = mockAvailableSurveys.find(s => s.id === 'survey-004');

const getSurveyDetails = (survey: typeof mockAvailableSurveys[0] | undefined) => {
  if (!survey) {
    console.error("Referenced survey not found in mockAvailableSurveys");
    return { id: 'unknown', title: 'Unknown Survey', estimatedTime: 0 };
  }
  return { id: survey.id, title: survey.title, estimatedTime: survey.estimatedTime };
};

// Helper to set time for dates
const setTime = (date: Date, hours: number, minutes: number): Date => {
  return setMinutes(setHours(date, hours), minutes);
};

// Define the extended status type locally for the mock data array
type ExtendedStatus = DeliveryStatus | 'paused' | 'cancelled';

export const mockSurveyDeliveries: (SurveyDelivery & { status: ExtendedStatus })[] = [
  // --- Existing Deliveries (Assume Non-Recurring or represent first instance) ---
  {
    deliveryId: 'sdel-001',
    survey: getSurveyDetails(engagementSurvey),
    targetGroup: '全社',
    deliveryStartDate: setTime(subDays(now, 10), 9, 0),
    deliveryEndDate: setTime(addDays(now, 5), 17, 0),
    status: 'in-progress',
    totalDelivered: 300,
    completedCount: 150,
    incompleteCount: 150,
    createdBy: '人事部',
    createdAt: subDays(now, 11),
    isRecurring: false, // Explicitly non-recurring
    frequency: 'none',
  },
  {
    deliveryId: 'sdel-002',
    survey: getSurveyDetails(trainingSurvey),
    targetGroup: '24卒 新入社員',
    deliveryStartDate: setTime(subDays(now, 3), 10, 0),
    deliveryEndDate: setTime(addDays(now, 1), 18, 0),
    status: 'in-progress',
    totalDelivered: 30,
    completedCount: 5,
    incompleteCount: 25,
    createdBy: '研修担当',
    createdAt: subDays(now, 4),
    isRecurring: false,
    frequency: 'none',
  },
  {
    deliveryId: 'sdel-003',
    survey: getSurveyDetails(environmentSurvey),
    targetGroup: '開発部',
    deliveryStartDate: setTime(subDays(now, 45), 9, 30),
    deliveryEndDate: setTime(subDays(now, 15), 17, 0),
    status: 'completed', // Completed instance
    totalDelivered: 50,
    completedCount: 48,
    incompleteCount: 2,
    createdBy: '人事部',
    createdAt: subDays(now, 46),
    isRecurring: false,
    frequency: 'none',
  },
  {
    deliveryId: 'sdel-004', // One-off Scheduled
    survey: getSurveyDetails(remoteWorkSurvey),
    targetGroup: '全社',
    deliveryStartDate: setTime(addDays(now, 14), 9, 0),
    deliveryEndDate: setTime(addDays(now, 28), 23, 59),
    status: 'scheduled',
    totalDelivered: 310,
    completedCount: 0,
    incompleteCount: 310,
    createdBy: '総務部',
    createdAt: subDays(now, 1),
    isRecurring: false,
    frequency: 'none',
  },
   {
    deliveryId: 'sdel-005', // Expired instance
    survey: getSurveyDetails(engagementSurvey),
    targetGroup: '営業部',
    deliveryStartDate: setTime(subDays(now, 60), 9, 0),
    deliveryEndDate: setTime(subDays(now, 30), 17, 0),
    status: 'expired',
    totalDelivered: 80,
    completedCount: 60,
    incompleteCount: 20,
    createdBy: '人事部',
    createdAt: subDays(now, 61),
    isRecurring: false,
    frequency: 'none',
  },
  {
    deliveryId: 'sdel-006', // Near start, one-off
    survey: getSurveyDetails(trainingSurvey),
    targetGroup: 'マーケティング部',
    deliveryStartDate: setTime(addDays(now, 0), new Date().getHours() + 2 > 23 ? 23 : new Date().getHours() + 2, 0),
    deliveryEndDate: setTime(addDays(now, 7), 17, 0),
    status: 'scheduled',
    totalDelivered: 25,
    completedCount: 0,
    incompleteCount: 25,
    createdBy: 'システム管理者',
    createdAt: subDays(now, 1),
    isRecurring: false,
    frequency: 'none',
  },
   {
    deliveryId: 'sdel-007', // Another one-off scheduled
    survey: getSurveyDetails(environmentSurvey),
    targetGroup: '人事部',
    deliveryStartDate: setTime(addDays(now, 3), 9, 0),
    deliveryEndDate: setTime(addDays(now, 10), 17, 0),
    status: 'scheduled',
    totalDelivered: 15,
    completedCount: 0,
    incompleteCount: 15,
    createdBy: 'システム管理者',
    createdAt: subDays(now, 0),
    isRecurring: false,
    frequency: 'none',
  },
  // --- Recurring Schedule Examples ---
  {
    deliveryId: 'srec-001', // Recurring Schedule ID
    survey: getSurveyDetails(engagementSurvey),
    targetGroup: '全社',
    deliveryStartDate: setTime(subDays(now, 90), 9, 0), // Schedule started 3 months ago
    deliveryEndDate: setTime(addMonths(now, 9), 17, 0), // Schedule ends in 9 months (example)
    status: 'in-progress', // Status of the *schedule* (active)
    totalDelivered: 0, // These might not apply directly to the schedule itself
    completedCount: 0, // Or could be aggregates? Clarify later.
    incompleteCount: 0,
    createdBy: '人事部長',
    createdAt: subDays(now, 91),
    isRecurring: true,
    frequency: 'monthly', // Runs monthly
    dynamicGroup: true, // New members included
    // nextRunDate: calculated next date...
  },
  {
    deliveryId: 'srec-002', // Paused Recurring Schedule
    survey: getSurveyDetails(trainingSurvey),
    targetGroup: '開発部 新メンバー',
    deliveryStartDate: setTime(subDays(now, 30), 10, 0), // Started a month ago
    deliveryEndDate: setTime(addMonths(now, 5), 18, 0), // Ends in 5 months
    status: 'paused', // Schedule is paused
    totalDelivered: 0,
    completedCount: 0,
    incompleteCount: 0,
    createdBy: '研修担当',
    createdAt: subDays(now, 31),
    isRecurring: true,
    frequency: 'weekly', // Runs weekly
    dynamicGroup: false, // Group membership fixed at schedule creation
    // pausedAt: new Date(), // Example: paused now
  },
  {
    deliveryId: 'srec-003', // Completed Recurring Schedule (example)
    survey: getSurveyDetails(environmentSurvey),
    targetGroup: 'リモートワーク実施者',
    deliveryStartDate: setTime(subMonths(now, 6), 9, 0), // Started 6 months ago
    deliveryEndDate: setTime(subDays(now, 10), 17, 0), // Schedule finished 10 days ago
    status: 'completed', // Schedule itself is completed
    totalDelivered: 0,
    completedCount: 0,
    incompleteCount: 0,
    createdBy: '総務部',
    createdAt: subMonths(now, 6), // Use subMonths here
    isRecurring: true,
    frequency: 'quarterly', // Ran quarterly
    dynamicGroup: true,
  },
];

// Mock function to simulate fetching data
// Update function to return the extended type
export const getSurveyDeliveries = async (): Promise<(SurveyDelivery & { status: ExtendedStatus })[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 50));
  // In a real app, you might update statuses based on current date here
  // For now, return the static mock data
  return mockSurveyDeliveries;
};

// Mock function to get single delivery/schedule details
export const getSurveyDeliveryDetails = async (id: string): Promise<(SurveyDelivery & { status: ExtendedStatus }) | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 50));
  return mockSurveyDeliveries.find(d => d.deliveryId === id);
};
