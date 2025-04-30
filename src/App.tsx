import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
// import UserManagement from './pages/UserManagement'; // Keep if needed elsewhere, but GeneralUserList is primary
import GroupManagement from './pages/GroupManagement';
import Settings from './pages/Settings';
import Login from './pages/Login'; // Assuming you have a Login page
import CompanyInfo from './pages/CompanyInfo'; // Import CompanyInfo
import Survey from './pages/Survey';
import DataAnalytics from './pages/DataAnalytics'; // Import DataAnalytics
import Companies from './pages/Companies';
import Assessment from './pages/Assessment'; // Assuming this is for creating/managing assessment templates
import GeneralUserList from './pages/GeneralUserList'; // The enhanced user list
import BulkUserRegistration from './pages/BulkUserRegistration'; // Bulk registration page
import AssessmentList from './pages/AssessmentList'; // Page to browse available assessments
import AssessmentDeliveryList from './pages/AssessmentDeliveryList'; // Page to view/manage deliveries
import CompanyAdminList from './pages/CompanyAdminList'; // Import Company Admin List
import CompanyAdminCreate from './pages/CompanyAdminCreate'; // Import Company Admin Create
import CompanyAdminEdit from './pages/CompanyAdminEdit'; // Import Company Admin Edit
import PermissionLogList from './pages/PermissionLogList'; // Import Permission Log List
import ContractManagement from './pages/ContractManagement'; // Import Contract Management page
import { Toaster } from "@/components/ui/toaster" // Import Toaster

// Mock authentication check (replace with real logic)
const isAuthenticated = true; // Set to true for now, false to test redirect

function App() {
  return (
    <div className="flex h-screen bg-gray-100">
      {isAuthenticated && <Sidebar />}
      <main className={`flex-1 overflow-y-auto ${isAuthenticated ? 'ml-64' : ''}`}> {/* Adjust margin if sidebar is present */}
        <Routes>
          {isAuthenticated ? (
            <>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              {/* Redirect legacy /users to /general-users */}
              <Route path="/users" element={<Navigate to="/general-users" replace />} />
              <Route path="/general-users" element={<GeneralUserList />} />
              <Route path="/bulk-register" element={<BulkUserRegistration />} />
              <Route path="/groups" element={<GroupManagement />} />
              <Route path="/assessments" element={<AssessmentList />} /> {/* List available assessments */}
              <Route path="/assessment-deliveries" element={<AssessmentDeliveryList />} /> {/* Manage deliveries */}
              {/* Keep Assessment page for template management? Or rename? */}
              <Route path="/assessment-templates" element={<Assessment />} />
              {/* Company Admin Routes */}
              <Route path="/company-admins" element={<CompanyAdminList />} />
              <Route path="/company-admins/create" element={<CompanyAdminCreate />} />
              <Route path="/company-admins/edit/:id" element={<CompanyAdminEdit />} /> {/* Add Edit Route */}
              {/* Permission Log Route */}
              <Route path="/permission-logs" element={<PermissionLogList />} />
              {/* Contract Management Route */}
              <Route path="/contracts" element={<ContractManagement />} />
              {/* Company Info Route */}
              <Route path="/company-info" element={<CompanyInfo />} />
              {/* Data Analytics Route */}
              <Route path="/analytics" element={<DataAnalytics />} /> {/* Add Data Analytics Route */}
              {/* Other Routes */}
              <Route path="/companies" element={<Companies />} />
              <Route path="/survey" element={<Survey />} />
              <Route path="/settings" element={<Settings />} />
              {/* Add other authenticated routes here */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} /> {/* Fallback for authenticated users */}
            </>
          ) : (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/login" replace />} /> {/* Redirect all other paths to login */}
            </>
          )}
        </Routes>
         <Toaster /> {/* Add Toaster component here */}
      </main>
    </div>
  );
}

export default App;
