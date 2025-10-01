/**
 * Main entry point for the Gestion Salaires (Payroll Management) React application.
 *
 * This file initializes the React application and renders it to the DOM.
 * The application is a comprehensive payroll management system that includes:
 * - Employee management with CRUD operations
 * - Company management for super administrators
 * - Payment processing and tracking
 * - Dashboard analytics and reporting
 * - Role-based access control (Super Admin, Admin, Cashier, Employee)
 * - Modern UI with responsive design
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Create the root React element and render the App component
// StrictMode helps identify potential problems in the application during development
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
