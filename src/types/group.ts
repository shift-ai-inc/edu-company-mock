// This file might become redundant if GroupManagement.tsx exports the primary type.
// For now, keep it simple or align it with the type in GroupManagement.tsx if needed globally.
export interface GroupMinimal { // Renamed to avoid conflict if importing from GroupManagement
  id: string;
  name: string;
  memberCount?: number; // Optional: Number of members in the group
  createdAt?: string; // Optional: Creation date
}
