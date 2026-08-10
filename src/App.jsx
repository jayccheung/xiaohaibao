import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, RequireAuth, RequireAdmin } from './lib/auth'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import CreatePage from './pages/CreatePage'
import WorksPage from './pages/WorksPage'
import SettingsPage from './pages/SettingsPage'
import AdminOverview from './pages/admin/AdminOverview'
import AdminUsers from './pages/admin/AdminUsers'
import AdminInviteCodes from './pages/admin/AdminInviteCodes'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<RequireAuth><Layout /></RequireAuth>}>
          <Route path="/" element={<Navigate to="/create" replace />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/works" element={<WorksPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/admin" element={<RequireAdmin><AdminOverview /></RequireAdmin>} />
          <Route path="/admin/users" element={<RequireAdmin><AdminUsers /></RequireAdmin>} />
          <Route path="/admin/codes" element={<RequireAdmin><AdminInviteCodes /></RequireAdmin>} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
