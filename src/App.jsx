import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryProvider } from './providers/QueryProvider'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import ErrorBoundary from './components/ErrorBoundary'
import PWAInstallBanner from './components/PWAInstallBanner'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import SuperAdminDashboard from './pages/SuperAdminDashboard'
import Companies from './pages/Companies'
import Users from './pages/Users'
import Employees from './pages/employees/Employees'
import EmployeeDetails from './pages/employees/EmployeeDetails'
import PayRuns from './pages/PayRuns'
import Payslips from './pages/Payslips'
import Payments from './pages/Payments'
import Documents from './pages/Documents'
import QRScanner from './pages/QRScanner'
import Kiosk from './pages/Kiosk'
import useAuthStore from './store/auth'
import { validateConfig } from './config/app'
import { useEffect } from 'react'
import { usersApi } from './api/users'

// Role-based route guard component
function RoleBasedRoute({ children, allowedRoles }) {
  const { user } = useAuthStore()

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function DashboardRedirect() {
  const { user } = useAuthStore()
  if (user?.role === 'SUPER_ADMIN') {
    return <Navigate to="/super-admin-dashboard" replace />
  }
  return <Navigate to="/dashboard" replace />
}

function App() {
  // Valider la configuration au démarrage
  try {
    validateConfig()
  } catch (error) {
    console.error('❌ Configuration invalide:', error.message)
  }

  // Ajouter l'appel périodique au backend
  useEffect(() => {
    const callBackend = async () => {
      try {
        const user = await usersApi.getById(1)
        console.log('✅ Backend appelé avec succès:', user)
      } catch (error) {
        console.error('❌ Erreur appel backend:', error)
      }
    }

    // Appeler immédiatement au montage
    callBackend()

    // Puis toutes les 5 secondes
    // const interval = setInterval(callBackend, 780_000)

    // Nettoyer l'intervalle quand le composant se démonte
    // return () => clearInterval(interval)
  }, [])

  return (
    <ErrorBoundary>
      <QueryProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/kiosk" element={<Kiosk />} />
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
              <Route path="employees" element={
                <RoleBasedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
                  <Employees />
                </RoleBasedRoute>
              } />
              <Route path="employees/company/:companyId" element={
                <RoleBasedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
                  <Employees />
                </RoleBasedRoute>
              } />
              <Route path="employees/:id" element={
                <RoleBasedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN', 'CASHIER']}>
                  <EmployeeDetails />
                </RoleBasedRoute>
              } />
              <Route path="payruns" element={
                <RoleBasedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
                  <PayRuns />
                </RoleBasedRoute>
              } />
              <Route path="payslips" element={<Payslips />} />
              <Route path="payments" element={<Payments />} />
              <Route path="qr-scanner" element={
                <RoleBasedRoute allowedRoles={['CASHIER', 'ADMIN', 'SUPER_ADMIN']}>
                  <QRScanner />
                </RoleBasedRoute>
              } />
              <Route path="documents" element={
                <RoleBasedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
                  <Documents />
                </RoleBasedRoute>
              } />
            </Route>
          </Routes>
          <PWAInstallBanner />
        </Router>
      </QueryProvider>
    </ErrorBoundary>
  )
}

export default App
