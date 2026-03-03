import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import SchoolsManagement from "./pages/admin/SchoolsManagement";
import SubscriptionsManagement from "./pages/admin/SubscriptionsManagement";
import UsersManagement from "./pages/admin/UsersManagement";
import AnalyticsDashboard from "./pages/admin/AnalyticsDashboard";
import SupportTickets from "./pages/admin/SupportTickets";
import AuditLogs from "./pages/admin/AuditLogs";
import PlatformSettings from "./pages/admin/PlatformSettings";

// School pages
import SchoolDashboard from "./pages/school/SchoolDashboard";
import StudentsManagement from "./pages/school/StudentsManagement";
import TeachersManagement from "./pages/school/TeachersManagement";
import StaffManagement from "./pages/school/StaffManagement";
import ParentsManagement from "./pages/school/ParentsManagement";
import ClassesManagement from "./pages/school/ClassesManagement";
import SubjectsManagement from "./pages/school/SubjectsManagement";
import AcademicYears from "./pages/school/AcademicYears";
import TimetableManagement from "./pages/school/TimetableManagement";
import AttendanceManagement from "./pages/school/AttendanceManagement";
import ExamsManagement from "./pages/school/ExamsManagement";
import FeesManagement from "./pages/school/FeesManagement";
import AnnouncementsManagement from "./pages/school/AnnouncementsManagement";
import ReportsManagement from "./pages/school/ReportsManagement";
import SchoolSettings from "./pages/school/SchoolSettings";

// Teacher pages
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import MyClasses from "./pages/teacher/MyClasses";
import Gradebook from "./pages/teacher/Gradebook";
import TeacherAttendance from "./pages/teacher/TeacherAttendance";
import Assignments from "./pages/teacher/Assignments";
import LessonPlans from "./pages/teacher/LessonPlans";

// Student pages
import StudentDashboard from "./pages/student/StudentDashboard";
import MyCourses from "./pages/student/MyCourses";
import StudentAssignments from "./pages/student/StudentAssignments";
import StudentGrades from "./pages/student/StudentGrades";
import StudentAttendance from "./pages/student/StudentAttendance";
import StudentTimetable from "./pages/student/StudentTimetable";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />

              {/* Super Admin routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/schools" element={<SchoolsManagement />} />
              <Route path="/admin/subscriptions" element={<SubscriptionsManagement />} />
              <Route path="/admin/users" element={<UsersManagement />} />
              <Route path="/admin/analytics" element={<AnalyticsDashboard />} />
              <Route path="/admin/support" element={<SupportTickets />} />
              <Route path="/admin/audit" element={<AuditLogs />} />
              <Route path="/admin/settings" element={<PlatformSettings />} />

              {/* School Admin routes */}
              <Route path="/dashboard" element={<SchoolDashboard />} />
              <Route path="/school/students" element={<StudentsManagement />} />
              <Route path="/school/teachers" element={<TeachersManagement />} />
              <Route path="/school/staff" element={<StaffManagement />} />
              <Route path="/school/parents" element={<ParentsManagement />} />
              <Route path="/school/classes" element={<ClassesManagement />} />
              <Route path="/school/subjects" element={<SubjectsManagement />} />
              <Route path="/school/academic-years" element={<AcademicYears />} />
              <Route path="/school/timetable" element={<TimetableManagement />} />
              <Route path="/school/attendance" element={<AttendanceManagement />} />
              <Route path="/school/exams" element={<ExamsManagement />} />
              <Route path="/school/fees" element={<FeesManagement />} />
              <Route path="/school/announcements" element={<AnnouncementsManagement />} />
              <Route path="/school/reports" element={<ReportsManagement />} />
              <Route path="/school/settings" element={<SchoolSettings />} />

              {/* Teacher routes */}
              <Route path="/teacher" element={<TeacherDashboard />} />
              <Route path="/teacher/classes" element={<MyClasses />} />
              <Route path="/teacher/gradebook" element={<Gradebook />} />
              <Route path="/teacher/attendance" element={<TeacherAttendance />} />
              <Route path="/teacher/assignments" element={<Assignments />} />
              <Route path="/teacher/lesson-plans" element={<LessonPlans />} />

              {/* Student routes */}
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/student/courses" element={<MyCourses />} />
              <Route path="/student/assignments" element={<StudentAssignments />} />
              <Route path="/student/grades" element={<StudentGrades />} />
              <Route path="/student/attendance" element={<StudentAttendance />} />
              <Route path="/student/timetable" element={<StudentTimetable />} />

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
