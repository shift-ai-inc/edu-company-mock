import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout'; // Import the new Layout component
import Dashboard from './pages/Dashboard';
import Companies from './pages/Companies';
import CompanyInfo from './pages/CompanyInfo';
import CompanyAdminList from './pages/CompanyAdminList';
import CompanyAdminCreate from './pages/CompanyAdminCreate';
import CompanyAdminEdit from './pages/CompanyAdminEdit';
import GeneralUserList from './pages/GeneralUserList';
import GeneralUserDetail from './pages/GeneralUserDetail';
import BulkUserRegistration from './pages/BulkUserRegistration';
import GroupManagement from './pages/GroupManagement';
import GroupDetail from './pages/GroupDetail';
import SurveyList from './pages/SurveyList';
import SurveyDetails from './pages/SurveyDetails';
import SurveyDeliveryManagement from './pages/SurveyDeliveryManagement';
import SurveyDeliveryDetails from './pages/SurveyDeliveryDetails';
import AssessmentList from './pages/AssessmentList';
import AssessmentDetails from './pages/AssessmentDetails';
import AssessmentDeliveryList from './pages/AssessmentDeliveryList';
// CreateAssessmentDeliveryDialog might be used within AssessmentDeliveryList or similar pages
import OverallResults from './pages/OverallResults';
import GroupResults from './pages/GroupResults';
import GeneralUserResultsPage from './pages/GeneralUserResultsPage';
import BenchmarkComparison from './pages/BenchmarkComparison';
import ContractManagement from './pages/ContractManagement'; // Detail page
// ContractList is removed
import PermissionLogList from './pages/PermissionLogList';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Survey from './pages/Survey'; // Page for taking a survey
import Assessment from './pages/Assessment'; // Page for taking an assessment
// Toaster is now part of Layout.tsx

function App() {
  const location = useLocation();
  
  // Simplified authentication check: consider user "authenticated" if not on the login page.
  // In a real application, this would involve checking a token, context, etc.
  const isAuthenticated = location.pathname !== '/login';

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* If authenticated, use Layout which contains Outlet for nested routes.
          Otherwise, redirect all other paths to /login. */}
      {isAuthenticated ? (
        <Route path="/*" element={<Layout />}>
          {/* Default authenticated route */}
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />

          {/* Company related routes */}
          <Route path="company-info" element={<CompanyInfo />} /> 
          <Route path="company-admins" element={<CompanyAdminList />} />
          <Route path="companies" element={<Companies />} />
          <Route path="companies/:companyId/info" element={<CompanyInfo />} />
          <Route path="companies/:companyId/admins" element={<CompanyAdminList />} />
          <Route path="companies/:companyId/admins/create" element={<CompanyAdminCreate />} />
          <Route path="companies/:companyId/admins/edit/:adminId" element={<CompanyAdminEdit />} />

          {/* General User routes */}
          <Route path="general-users" element={<GeneralUserList />} />
          <Route path="general-users/:userId" element={<GeneralUserDetail />} />
          <Route path="general-users/bulk-register" element={<BulkUserRegistration />} />

          {/* Group routes */}
          <Route path="groups" element={<GroupManagement />} />
          <Route path="groups/:groupId" element={<GroupDetail />} />

          {/* Survey routes */}
          <Route path="surveys" element={<SurveyList />} />
          <Route path="surveys/:surveyId" element={<SurveyDetails />} /> {/* Detail page */}
          <Route path="surveys/take/:surveyId" element={<Survey />} /> {/* Taking survey page */}
          <Route path="survey-deliveries" element={<SurveyDeliveryManagement />} />
          <Route path="survey-deliveries/:deliveryId" element={<SurveyDeliveryDetails />} />

          {/* Assessment routes */}
          <Route path="assessments" element={<AssessmentList />} />
          <Route path="assessments/:assessmentId" element={<AssessmentDetails />} /> {/* Detail page */}
          <Route path="assessments/take/:assessmentId" element={<Assessment />} /> {/* Taking assessment page */}
          <Route path="assessment-deliveries" element={<AssessmentDeliveryList />} />

          {/* Results/Analytics routes */}
          <Route path="results/overall" element={<OverallResults />} />
          <Route path="results/groups" element={<GroupResults />} />
          <Route path="results/users" element={<GeneralUserResultsPage />} />
          <Route path="results/benchmark" element={<BenchmarkComparison />} />

          {/* Contract routes */}
          {/* <Route path="contracts" element={<ContractList />} /> Removed route for contract list */}
          <Route path="contracts/:contractId" element={<ContractManagement />} /> {/* Existing route for contract details */}
          
          {/* Other main routes */}
          <Route path="logs/permissions" element={<PermissionLogList />} />
          <Route path="settings" element={<Settings />} />
          
          {/* Fallback for any unmatched authenticated path */}
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>
      ) : (
        // If not authenticated and not on /login, redirect to /login
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
  );
}

export default App;
