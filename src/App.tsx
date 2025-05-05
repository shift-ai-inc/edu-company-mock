import { Routes, Route, Navigate, useLocation, matchPath } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Companies from './pages/Companies';
import CompanyInfo from './pages/CompanyInfo';
import CompanyAdminList from './pages/CompanyAdminList';
import CompanyAdminCreate from './pages/CompanyAdminCreate';
import CompanyAdminEdit from './pages/CompanyAdminEdit';
import GeneralUserList from './pages/GeneralUserList';
import GeneralUserDetail from './pages/GeneralUserDetail'; // Import the new detail page
import BulkUserRegistration from './pages/BulkUserRegistration';
import GroupManagement from './pages/GroupManagement';
import GroupDetail from './pages/GroupDetail'; // Import Group Detail page
import SurveyList from './pages/SurveyList';
import SurveyDetails from './pages/SurveyDetails';
import SurveyDeliveryManagement from './pages/SurveyDeliveryManagement';
import SurveyDeliveryDetails from './pages/SurveyDeliveryDetails';
import AssessmentList from './pages/AssessmentList';
import AssessmentDetails from './pages/AssessmentDetails';
import AssessmentDeliveryList from './pages/AssessmentDeliveryList';
import CreateAssessmentDeliveryDialog from './components/CreateAssessmentDeliveryDialog'; // Assuming this is used somewhere
import OverallResults from './pages/OverallResults';
import GroupResults from './pages/GroupResults';
import GeneralUserResultsPage from './pages/GeneralUserResultsPage';
import BenchmarkComparison from './pages/BenchmarkComparison';
// Removed DataAnalytics import as it seems unused now
// import DataAnalytics from './pages/DataAnalytics';
import ContractManagement from './pages/ContractManagement';
import PermissionLogList from './pages/PermissionLogList';
import Settings from './pages/Settings';
import Login from './pages/Login'; // Import Login page
import Survey from './pages/Survey'; // Import Survey page
import Assessment from './pages/Assessment'; // Import Assessment page
import { Toaster } from "@/components/ui/toaster"; // Import Toaster

function App() {
  const location = useLocation(); // Use useLocation hook to get current path

  // Define public paths (exact or patterns)
  const publicPaths = [
    '/login',
    '/survey/:surveyId',
    '/assessment/:assessmentId',
  ];

  // Check if the current path matches any public path pattern
  const isPublicPath = publicPaths.some(path =>
    matchPath(path, location.pathname)
  );

  // Assume authenticated if not on a public path (replace with real auth logic later)
  // For now, let's consider any path not explicitly public as requiring authentication
  const isAuthenticated = !isPublicPath;

  // Separate routes for authenticated and unauthenticated users
  const AuthLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      {/* Added sm:ml-64 to push content right when sidebar is visible */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 sm:ml-64">
        {children}
      </main>
      <Toaster /> {/* Add Toaster here */}
    </div>
  );

  return (
    <Routes>
      {/* Unauthenticated routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/survey/:surveyId" element={<Survey />} /> {/* Example survey route */}
      <Route path="/assessment/:assessmentId" element={<Assessment />} /> {/* Example assessment route */}

      {/* Authenticated routes */}
      <Route
        path="/*"
        element={
          isAuthenticated ? (
            <AuthLayout>
              <Routes> {/* Nested Routes for AuthLayout */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/companies" element={<Companies />} />
                <Route path="/companies/:companyId/info" element={<CompanyInfo />} />
                <Route path="/companies/:companyId/admins" element={<CompanyAdminList />} />
                <Route path="/companies/:companyId/admins/create" element={<CompanyAdminCreate />} />
                <Route path="/companies/:companyId/admins/edit/:adminId" element={<CompanyAdminEdit />} />
                <Route path="/general-users" element={<GeneralUserList />} />
                <Route path="/general-users/:userId" element={<GeneralUserDetail />} />
                <Route path="/general-users/bulk-register" element={<BulkUserRegistration />} />
                <Route path="/groups" element={<GroupManagement />} />
                <Route path="/groups/:groupId" element={<GroupDetail />} /> {/* Add route for Group Detail */}
                <Route path="/surveys" element={<SurveyList />} />
                <Route path="/surveys/:surveyId" element={<SurveyDetails />} />
                <Route path="/survey-deliveries" element={<SurveyDeliveryManagement />} />
                <Route path="/survey-deliveries/:deliveryId" element={<SurveyDeliveryDetails />} />
                <Route path="/assessments" element={<AssessmentList />} />
                <Route path="/assessments/:assessmentId" element={<AssessmentDetails />} />
                <Route path="/assessment-deliveries" element={<AssessmentDeliveryList />} />
                {/* Corrected paths for analytics routes */}
                <Route path="/results/overall" element={<OverallResults />} />
                <Route path="/results/groups" element={<GroupResults />} />
                {/* Adjusted path for user results - assuming it's a general page, not user-specific yet */}
                <Route path="/results/users" element={<GeneralUserResultsPage />} />
                <Route path="/results/benchmark" element={<BenchmarkComparison />} />
                {/* Removed /analytics route as it seems redundant */}
                {/* <Route path="/analytics" element={<DataAnalytics />} /> */}
                <Route path="/contracts" element={<ContractManagement />} />
                <Route path="/logs/permissions" element={<PermissionLogList />} />
                <Route path="/settings" element={<Settings />} />
                {/* Add other authenticated routes here */}
                {/* Fallback for any unmatched authenticated path */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </AuthLayout>
          ) : (
            // If not authenticated and not on a public path already handled, redirect to login
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;
