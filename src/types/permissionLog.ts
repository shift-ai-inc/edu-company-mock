export interface PermissionLog {
  id: string;
  timestamp: string; // ISO 8601 format date string
  adminId: string; // ID of the admin whose permissions were changed
  adminName: string; // Name of the admin
  changedBy: string; // ID or name of the user who made the change (mock: "System")
  action: 'authority_changed' | 'groups_changed' | 'admin_created' | 'admin_deleted' | 'password_reset'; // Type of change
  details: string; // Description of the change (e.g., "Authority changed from Viewer to Admin", "Groups added: Sales", "Admin created", "Admin deleted", "Temporary password issued")
}
