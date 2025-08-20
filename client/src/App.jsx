// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Sidebar from "./components/Sidebar.jsx";
// import Dashboard from "./pages/Dashboard.jsx";
// import WriterHome from "./pages/Writer/WriterHome.jsx";
// import FeedNewUser from "./pages/Writer/FeedNewUser.jsx";
// import LookForUser from "./pages/Writer/LookForUser.jsx";
// import AvailabilityOnDateModal from "./pages/Writer/AvailabilityOnDate.jsx";
// import ChmPage from "./pages/ChmPage.jsx";
// import CompanyCommanderPage from "./pages/CompanyCommanderPage.jsx";
// import { Toaster } from "react-hot-toast";   // ✅ Added
// import BackToRoleSelect from "./pages/BackToRoleSelect.jsx";

// function Layout() {
//   return (
//     <div className="flex">
//       <Sidebar />
//       <main className="flex-1 min-h-screen">
//         <Routes>
//           <Route path="/" element={<Dashboard />} />
//           <Route path="/writer" element={<WriterHome />} />
//           <Route path="/writer/new" element={<FeedNewUser />} />
//           <Route path="/writer/search" element={<LookForUser />} />
//           <Route path="/writer/availability" element={<AvailabilityOnDateModal />} />
//           <Route path="/chm" element={<ChmPage />} />
//           <Route path="/company-commander" element={<CompanyCommanderPage />} />
//           <Route path="/back" element={<BackToRoleSelect/>} />

//           {/* <Route path="/messso" element={<MessSOPage />} /> */}
//         </Routes>
//       </main>
//     </div>
//   );
// }

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Layout />
//       <Toaster position="top-right" />
//     </BrowserRouter>
//   );
// }

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Home from "./pages/HomePage.jsx";
import WriterHome from "./pages/Writer/WriterHome.jsx";
import FeedNewUser from "./pages/Writer/FeedNewUser.jsx";
import LookForUser from "./pages/Writer/LookForUser.jsx";
import AvailabilityOnDateModal from "./pages/Writer/AvailabilityOnDate.jsx";
import ChmPage from "./pages/ChmPage.jsx";
import CQMH from "./pages/CQMH.jsx";
import CompanyCommanderPage from "./pages/CompanyCommanderPage.jsx";
import BackToRoleSelect from "./pages/BackToRoleSelect.jsx";
import NotFound from "./pages/NotFound.jsx";
import { Toaster } from "react-hot-toast";
import ResponsiveWrapper from "./components/ResponsiveWrapper.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import LoginForm from "./components/LoginForm.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminManagement from "./pages/AdminManagement.jsx";

function Layout() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 min-h-screen">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginForm />} />
          
          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <ResponsiveWrapper />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          {/* Writer routes */}
          <Route path="/writer" element={
            <ProtectedRoute allowedRoles={["Writer", "CompanyCommander", "CHM", "CQMH", "MessSO", "Commander", "SuperAdmin"]}>
              <WriterHome />
            </ProtectedRoute>
          } />
          <Route path="/writer/new" element={
            <ProtectedRoute allowedRoles={["Writer", "CompanyCommander", "CHM", "CQMH", "MessSO", "Commander", "SuperAdmin"]}>
              <FeedNewUser />
            </ProtectedRoute>
          } />
          <Route path="/writer/search" element={
            <ProtectedRoute allowedRoles={["Writer", "CompanyCommander", "CHM", "CQMH", "MessSO", "Commander", "SuperAdmin"]}>
              <LookForUser />
            </ProtectedRoute>
          } />
          <Route path="/writer/availability" element={
            <ProtectedRoute allowedRoles={["Writer", "CompanyCommander", "CHM", "CQMH", "MessSO", "Commander", "SuperAdmin"]}>
              <AvailabilityOnDateModal />
            </ProtectedRoute>
          } />

          {/* CHM routes */}
          <Route path="/chm" element={
            <ProtectedRoute allowedRoles={["CHM", "CompanyCommander", "Commander", "SuperAdmin"]}>
              <ChmPage />
            </ProtectedRoute>
          } />
          
          {/* CQMH routes */}
          <Route path="/cqmh" element={
            <ProtectedRoute allowedRoles={["CQMH", "CompanyCommander", "Commander", "SuperAdmin"]}>
              <CQMH />
            </ProtectedRoute>
          } />
          
          {/* Company Commander routes */}
          <Route path="/company-commander" element={
            <ProtectedRoute allowedRoles={["CompanyCommander", "Commander", "SuperAdmin"]}>
              <CompanyCommanderPage />
            </ProtectedRoute>
          } />
          
          {/* Admin Management - SuperAdmin only */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={["SuperAdmin"]}>
              <AdminManagement />
            </ProtectedRoute>
          } />
          
          <Route path="/back" element={<BackToRoleSelect />} />
          
          {/* 404 - Catch all unmatched routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout />
        <Toaster position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  );
}
