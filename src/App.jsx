import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryProvider } from './providers/QueryProvider'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import SuperAdminDashboard from './pages/SuperAdminDashboard'
import Companies from './pages/Companies'
import Users from './pages/Users'
import Employees from './pages/employees/Employees'
import PayRuns from './pages/PayRuns'
import Payslips from './pages/Payslips'
import Payments from './pages/Payments'
import Documents from './pages/Documents'
import useAuthStore from './store/auth'

function DashboardRedirect() {
  const { user } = useAuthStore()
  if (user?.role === 'SUPER_ADMIN') {
    return <Navigate to="/super-admin-dashboard" replace />
  }
  return <Navigate to="/dashboard" replace />
}

function App() {
  return (
    <QueryProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardRedirect />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="super-admin-dashboard" element={<SuperAdminDashboard />} />
            <Route path="companies" element={<Companies />} />
            <Route path="users" element={<Users />} />
            <Route path="employees" element={<Employees />} />
            <Route path="payruns" element={<PayRuns />} />
            <Route path="payslips" element={<Payslips />} />
            <Route path="payments" element={<Payments />} />
            <Route path="documents" element={<Documents />} />
          </Route>
        </Routes>
      </Router>
    </QueryProvider>
  )
}

export default App
