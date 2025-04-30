import { PermissionLog } from '@/types/permissionLog';

export let mockPermissionLogs: PermissionLog[] = [];

// Function to add a permission log entry
export const addPermissionLog = (logEntry: Omit<PermissionLog, 'id' | 'timestamp'>): PermissionLog => {
  const newLog: PermissionLog = {
    ...logEntry,
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, // Simple unique ID
    timestamp: new Date().toISOString(),
  };
  // Add to the beginning of the array to show newest first
  mockPermissionLogs = [newLog, ...mockPermissionLogs];
  console.log('Added permission log:', newLog);
  console.log('Current logs:', mockPermissionLogs);
  return newLog;
};

// Example of adding initial logs if needed (e.g., for admin creation)
// This might be called from where admins are initially created or modified.
// For simplicity, we'll primarily call this from the edit/create/delete actions.
