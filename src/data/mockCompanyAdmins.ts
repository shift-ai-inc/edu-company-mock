import { CompanyAdministrator } from '@/types/companyAdmin';

// Initial mock data for company administrators
export let mockCompanyAdmins: CompanyAdministrator[] = [
  {
    id: 'admin-001',
    email: 'admin.tanaka@example.com',
    name: '田中 太郎 (管理者)',
    authority: 'system_admin',
    affiliatedGroupIds: ['group-1', 'group-4'],
    createdAt: '2023-01-15T10:00:00Z',
  },
  {
    id: 'admin-002',
    email: 'viewer.suzuki@example.com',
    name: '鈴木 一郎 (閲覧者)',
    authority: 'results_viewer',
    affiliatedGroupIds: ['group-2'],
    createdAt: '2023-03-20T11:30:00Z',
  },
  {
    id: 'admin-003',
    email: 'sysadmin.sato@example.com',
    name: '佐藤 花子 (システム)',
    authority: 'system_admin',
    affiliatedGroupIds: ['group-1', 'group-3', 'group-5'],
    createdAt: '2023-06-01T14:15:00Z',
  },
];

// Function to add a new admin (simulates backend update)
export const addMockCompanyAdmin = (newAdmin: Omit<CompanyAdministrator, 'id' | 'createdAt'>): CompanyAdministrator => {
  const adminToAdd: CompanyAdministrator = {
    ...newAdmin,
    id: `admin-${Date.now()}`, // Simple unique ID generation
    createdAt: new Date().toISOString(),
  };
  // Create a new array reference to potentially help with re-renders
  mockCompanyAdmins = [...mockCompanyAdmins, adminToAdd];
  console.log('Added new company admin:', adminToAdd);
  console.log('Current admins:', mockCompanyAdmins); // Log current state
  return adminToAdd;
};

// Function to update an existing admin
export const updateMockCompanyAdmin = (updatedAdmin: CompanyAdministrator): boolean => {
  const index = mockCompanyAdmins.findIndex(admin => admin.id === updatedAdmin.id);
  if (index !== -1) {
    // Create a new array reference
    const updatedAdmins = [...mockCompanyAdmins];
    updatedAdmins[index] = updatedAdmin;
    mockCompanyAdmins = updatedAdmins;
    console.log('Updated company admin:', updatedAdmin);
    console.log('Current admins:', mockCompanyAdmins);
    return true;
  }
  console.error(`Admin with ID ${updatedAdmin.id} not found for update.`);
  return false;
};

// Function to delete an admin
export const deleteMockCompanyAdmin = (adminId: string): boolean => {
  const initialLength = mockCompanyAdmins.length;
  // Create a new array reference
  mockCompanyAdmins = mockCompanyAdmins.filter(admin => admin.id !== adminId);
  const success = mockCompanyAdmins.length < initialLength;
  if (success) {
    console.log(`Deleted company admin with ID: ${adminId}`);
    console.log('Current admins:', mockCompanyAdmins);
  } else {
     console.error(`Admin with ID ${adminId} not found for deletion.`);
  }
  return success;
};

// Function to find an admin by ID (needed for edit page)
export const findMockCompanyAdminById = (adminId: string): CompanyAdministrator | undefined => {
  return mockCompanyAdmins.find(admin => admin.id === adminId);
};
