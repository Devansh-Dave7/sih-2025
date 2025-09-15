import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";

import CreateFeeSubmissionForm from "./pages/Forms/CreateFeeSubmissionForm";
import FeeSubmissions from "./pages/Forms/FeeSubmissions";
import CreateAdminForms from "./pages/Forms/CreateAdminForms";
import CreateHostelForms from "./pages/Forms/CreateHostelForms";
import AvailableForms from "./pages/Forms/AvailableForms";
import AdminSubmissionView from "./pages/Forms/AdminSubmissionView";
import HostelSubmissionView from "./pages/Forms/HostelSubmissionView";
import StudentSubmissionView from "./pages/Forms/StudentSubmissionView";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import { AuthProvider } from "./context/AuthContext";
import { EventsProvider } from "./context/EventsContext";
import { FeeFormsProvider } from "./context/FeeFormsContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import StudentGrades from "./pages/Student/StudentGrades";
import AdminSettings from "./pages/Admin/AdminSettings";
// import AdminStudentGradesEditor from "./pages/Admin/AdminStudentGradesEditor";
import ClerkRecords from "./pages/Clerk/ClerkRecords";
import HostelManagement from "./pages/Hostel/HostelManagement";
import AdminStudentGradesEditor from "./pages/Admin/AdminStudentGradesEditor";

export default function App() {
  return (
    <AuthProvider>
    <EventsProvider>
    <FeeFormsProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Auth Layout - Default routes */}
          <Route index path="/" element={<SignIn />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected Dashboard Layout */}
          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Home />} />

            {/* Role-based pages */}
            <Route path="/student/grades" element={<StudentGrades />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/student-grades" element={<AdminStudentGradesEditor />} />
            <Route path="/clerk/records" element={<ClerkRecords />} />
            <Route path="/hostel/rooms" element={<HostelManagement />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/create-fee-submission" element={<CreateFeeSubmissionForm />} />
            <Route path="/fee-submissions" element={<FeeSubmissions />} />
            <Route path="/create-admin-forms" element={<CreateAdminForms />} />
            <Route path="/create-hostel-forms" element={<CreateHostelForms />} />
            <Route path="/available-forms" element={<AvailableForms />} />
            <Route path="/my-form-submissions" element={<StudentSubmissionView />} />
            <Route path="/all-form-submissions" element={<AdminSubmissionView />} />
            <Route path="/hostel-form-submissions" element={<HostelSubmissionView />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </FeeFormsProvider>
    </EventsProvider>
    </AuthProvider>
  );
}
