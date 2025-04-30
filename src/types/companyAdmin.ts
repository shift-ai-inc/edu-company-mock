import { Group } from './group';

export type AdminAuthority = 'system_admin' | 'results_viewer'; // システム管理 or 結果閲覧

export interface CompanyAdministrator {
  id: string;
  email: string;
  name: string;
  authority: AdminAuthority;
  affiliatedGroupIds: string[]; // 所属するグループのIDリスト
  createdAt: string; // ISO 8601 format date string
  // Optional: Add last login or status if needed later
}

// Helper function to get display text for authority
export const getAuthorityDisplayName = (authority: AdminAuthority): string => {
  switch (authority) {
    case 'system_admin':
      return 'システム管理';
    case 'results_viewer':
      return '結果閲覧';
    default:
      return '不明';
  }
};
