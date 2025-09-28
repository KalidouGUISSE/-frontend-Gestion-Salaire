import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryProvider } from './providers/QueryProvider'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Employees from './pages/employees/Employees'
import PayRuns from './pages/PayRuns'
import Payslips from './pages/Payslips'
import Payments from './pages/Payments'
import Documents from './pages/Documents'

function App() {
  return (
    <QueryProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
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
