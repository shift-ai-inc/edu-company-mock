import type { Group } from '@/types/group';

export const mockGroups: Group[] = [
  { id: 1, name: '経営企画部', type: 'department', memberCount: 12, description: '会社の戦略立案と実行を担当。' },
  { id: 2, name: '人事部', type: 'department', memberCount: 8, description: '採用、育成、評価などを担当。' },
  { id: 3, name: 'マーケティング部', type: 'department', memberCount: 15, description: '市場調査、プロモーションを担当。' },
  { id: 4, name: '開発部 - チームA', type: 'team', memberCount: 6, description: '製品Aの開発を担当。' },
  { id: 5, name: '開発部 - チームB', type: 'team', memberCount: 7, description: '製品Bの開発を担当。' },
  { id: 6, name: '営業部 - 第一課', type: 'team', memberCount: 10, description: '首都圏エリアの営業を担当。' },
  { id: 7, name: '営業部 - 第二課', type: 'team', memberCount: 9, description: '西日本エリアの営業を担当。' },
  { id: 8, name: 'カスタマーサポート', type: 'department', memberCount: 11, description: '顧客からの問い合わせ対応。' },
];

// Function to get group names by their IDs
export const getGroupNamesByIds = (groupIds: number[]): string[] => {
  return groupIds
    .map(id => mockGroups.find(group => group.id === id)?.name)
    .filter((name): name is string => name !== undefined); // Filter out undefined results and assert type
};

// Function to get a group by its ID
export const getGroupById = (groupId: number): Group | undefined => {
  return mockGroups.find(group => group.id === groupId);
};

// Function to update a group
export const updateGroup = (updatedGroup: Group): boolean => {
  const index = mockGroups.findIndex(group => group.id === updatedGroup.id);
  if (index !== -1) {
    mockGroups[index] = updatedGroup;
    return true;
  }
  return false;
};

// Function to delete a group
export const deleteGroup = (groupId: number): boolean => {
    const index = mockGroups.findIndex(group => group.id === groupId);
    if (index !== -1) {
        mockGroups.splice(index, 1);
        return true;
    }
    return false;
};
