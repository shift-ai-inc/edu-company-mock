import { Group } from '@/types/group';

export const mockGroups: Group[] = [
  { id: 'group-1', name: '本社人事部', memberCount: 15, createdAt: '2023-01-10T10:00:00Z' },
  { id: 'group-2', name: '開発部Aチーム', memberCount: 8, createdAt: '2023-02-15T11:30:00Z' },
  { id: 'group-3', name: '営業部東日本', memberCount: 25, createdAt: '2023-03-20T14:00:00Z' },
  { id: 'group-4', name: '新卒研修グループ', memberCount: 30, createdAt: '2024-04-01T09:00:00Z' },
  { id: 'group-5', name: '大阪支社総務', memberCount: 5, createdAt: '2023-05-10T16:45:00Z' },
];

// Function to get group names from IDs, useful for display
export const getGroupNamesByIds = (groupIds: string[]): string[] => {
  return groupIds.map(id => mockGroups.find(g => g.id === id)?.name).filter((name): name is string => !!name);
};
