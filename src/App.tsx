import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout'; // Import the new Layout component
import Dashboard from './pages/Dashboard';
import Companies from './pages/Companies';
import CompanyInfo from './pages/CompanyInfo';
import CompanyAdminList from './pages/CompanyAdminList';
import CompanyAdminCreate from './pages/CompanyAdminCreate';
// import CompanyAdminEdit from './pages/CompanyAdminEdit'; // Removed, edit is now dialog on detail page
import CompanyAdminDetails from './pages/CompanyAdminDetails'; // Import new detail page
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
import AssessmentDeliveryDetails from './pages/AssessmentDeliveryDetails';
import OverallResults from './pages/OverallResults';
import GroupResults from './pages/GroupResults';
import GeneralUserResultsPage from './pages/GeneralUserResultsPage';
import BenchmarkComparison from './pages/BenchmarkComparison';
import ContractManagement from './pages/ContractManagement';
import PermissionLogList from './pages/PermissionLogList';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Survey from './pages/Survey';
import Assessment from './pages/Assessment';

function App() {
  const location = useLocation();
  const isAuthenticated = location.pathname !== '/login';

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {isAuthenticated ? (
        <Route path="/*" element={<Layout />}>
          <Route index element={<Navigate to="general-users" replace />} />
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="company-info" element={<CompanyInfo />} /> 
          <Route path="companies" element={<Companies />} />
          
          {/* Company Admin routes */}
          <Route path="company-admins" element={<CompanyAdminList />} />
          <Route path="company-admins/create" element={<CompanyAdminCreate />} />
          <Route path="company-admins/:adminId" element={<CompanyAdminDetails />} /> {/* New Detail Page Route */}
          {/* <Route path="company-admins/edit/:adminId" element={<CompanyAdminEdit />} /> Removed Edit Page Route */}


          {/* Routes for specific company context (if needed, can be adapted) */}
          <Route path="companies/:companyId/info" element={<CompanyInfo />} />
          {/* The following routes might need adjustment if companyId context is strictly enforced for admins */}
          <Route path="companies/:companyId/admins" element={<CompanyAdminList />} />
          <Route path="companies/:companyId/admins/create" element={<CompanyAdminCreate />} />
          {/* <Route path="companies/:companyId/admins/edit/:adminId" element={<CompanyAdminEdit />} /> Removed */}
          <Route path="companies/:companyId/admins/:adminId" element={<CompanyAdminDetails />} /> {/* New Detail Page Route under company context */}


          <Route path="general-users" element={<GeneralUserList />} />
          <Route path="general-users/:userId" element={<GeneralUserDetail />} />
          <Route path="general-users/bulk-register" element={<BulkUserRegistration />} />

          <Route path="groups" element={<GroupManagement />} />
          <Route path="groups/:groupId" element={<GroupDetail />} />

          <Route path="surveys" element={<SurveyList />} />
          <Route path="surveys/:surveyId" element={<SurveyDetails />} />
          <Route path="surveys/take/:surveyId" element={<Survey />} />
          <Route path="survey-deliveries" element={<SurveyDeliveryManagement />} />
          <Route path="survey-deliveries/:deliveryId" element={<SurveyDeliveryDetails />} />

          <Route path="assessments" element={<AssessmentList />} />
          <Route path="assessments/:assessmentId" element={<AssessmentDetails />} />
          <Route path="assessments/take/:assessmentId" element={<Assessment />} />
          <Route path="assessment-deliveries" element={<AssessmentDeliveryList />} />
          <Route path="assessment-deliveries/:deliveryId" element={<AssessmentDeliveryDetails />} />

          <Route path="results/overall" element={<OverallResults />} />
          <Route path="results/groups" element={<GroupResults />} />
          <Route path="results/users" element={<GeneralUserResultsPage />} />
          <Route path="results/benchmark" element={<BenchmarkComparison />} />

          <Route path="contracts/:contractId" element={<ContractManagement />} />
          
          <Route path="logs/permissions" element={<PermissionLogList />} />
          <Route path="settings" element={<Settings />} />
          
          <Route path="*" element={<Navigate to="general-users" replace />} />
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
  );
}

export default App;
