import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { useAuthStore } from './store/auth'
import { Layout } from './components/Layout'
import { ToastContainer } from './components/Toast'

import { Login } from './pages/Login'
import { StudentDashboard } from './pages/student/Dashboard'
import { TeacherDashboard } from './pages/teacher/Dashboard'
import { CoordinatorDashboard } from './pages/coordinator/Dashboard'
import { GradeTable } from './pages/teacher/GradeTable'
import { StudentReportCard } from './pages/student/ReportCard'
import { CalendarPage } from './pages/Calendar'
import { SubmitActivity } from './pages/student/SubmitActivity'
import { CorrectSubmission } from './pages/teacher/CorrectSubmission'
import { Messages } from './pages/Messages'
import { Settings } from './pages/Settings'
import { TeacherClassView } from './pages/teacher/ClassView'
import { StudentClassView } from './pages/student/ClassView'
import { StudentActivities } from './pages/student/Activities'
import { TeacherClassList } from './pages/teacher/ClassList'
import { StudentClassList } from './pages/student/ClassList'
import { CoordinatorClassList } from './pages/coordinator/ClassList'
import { CoordinatorAnalytics } from './pages/coordinator/Analytics'
import { AdminDashboard } from './pages/admin/Dashboard'
import { AdminSchools } from './pages/admin/Schools'
import { AdminSchoolDetails } from './pages/admin/SchoolDetails'
import { AdminSettings } from './pages/admin/AdminSettings'
import { GuardianDashboard } from './pages/guardian/Dashboard'
import { GuardianStudentDetail } from './pages/guardian/StudentDetail'
import { Profile } from './pages/Profile'
import { NotFound } from './pages/NotFound'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const user = useAuthStore(s => s.user)
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

function DefaultRedirect() {
  const user = useAuthStore(s => s.user)
  if (user?.role === 'student')  return <Navigate to="/student"  replace />
  if (user?.role === 'teacher')  return <Navigate to="/teacher"  replace />
  if (user?.role === 'admin')    return <Navigate to="/admin"    replace />
  if (user?.role === 'guardian') return <Navigate to="/guardian" replace />
  return <Navigate to="/coordinator" replace />
}

export default function App() {
  const restoreSession = useAuthStore(s => s.restoreSession)

  useEffect(() => {
    restoreSession()
  }, [restoreSession])

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          <Route index element={<DefaultRedirect />} />

          <Route path="student" element={<StudentDashboard />} />
          <Route path="student/classes" element={<StudentClassList />} />
          <Route path="student/class/:classId" element={<StudentClassView />} />
          <Route path="student/activities" element={<StudentActivities />} />
          <Route path="student/report-card" element={<StudentReportCard />} />
          <Route path="student/submit/:id" element={<SubmitActivity />} />

          <Route path="teacher" element={<TeacherDashboard />} />
          <Route path="teacher/classes" element={<TeacherClassList />} />
          <Route path="teacher/class/:classId" element={<TeacherClassView />} />
          <Route path="teacher/grades" element={<GradeTable />} />
          <Route path="teacher/correct/:id" element={<CorrectSubmission />} />

          <Route path="coordinator" element={<CoordinatorDashboard />} />
          <Route path="coordinator/classes" element={<CoordinatorClassList />} />
          <Route path="coordinator/analytics" element={<CoordinatorAnalytics />} />

          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/schools" element={<AdminSchools />} />
          <Route path="admin/schools/:schoolId" element={<AdminSchoolDetails />} />
          <Route path="admin/settings" element={<AdminSettings />} />

          <Route path="guardian" element={<GuardianDashboard />} />
          <Route path="guardian/student/:studentId" element={<GuardianStudentDetail />} />

          <Route path="profile" element={<Profile />} />

          <Route path="calendar" element={<CalendarPage />} />
          <Route path="messages" element={<Messages />} />
          <Route path="settings" element={<Settings />} />

          {/* 404 dentro do layout autenticado */}
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* 404 fora do layout (rotas não autenticadas desconhecidas) */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer />
      <SpeedInsights />
    </>
  )
}
