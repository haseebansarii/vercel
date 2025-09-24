import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Browse } from './pages/Browse';
import { SubmitReport } from './pages/SubmitReport';
import { EntityProfile } from './pages/EntityProfile';
import { Admin } from './pages/Admin';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminPages } from './pages/admin/AdminPages';
import { AdminPosts } from './pages/admin/AdminPosts';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminNotifications } from './pages/admin/AdminNotifications';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';
import { AdminContacts } from './pages/admin/AdminContacts';
import { AdminPayment } from './pages/admin/AdminPayment';
import { AdminApproved } from './pages/admin/AdminApproved';
import { AdminRejected } from './pages/admin/AdminRejected';
import { About } from './pages/About';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { Guidelines } from './pages/Guidelines';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminRoute } from './components/auth/AdminRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/entity/:id" element={<EntityProfile />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/guidelines" element={<Guidelines />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/submit-report" 
                element={
                  <ProtectedRoute>
                    <SubmitReport />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <AdminLayout>
                      <AdminDashboard />
                    </AdminLayout>
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/pages" 
                element={
                  <AdminRoute>
                    <AdminLayout>
                      <AdminPages />
                    </AdminLayout>
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/posts" 
                element={
                  <AdminRoute>
                    <AdminLayout>
                      <AdminPosts />
                    </AdminLayout>
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/users" 
                element={
                  <AdminRoute>
                    <AdminLayout>
                      <AdminUsers />
                    </AdminLayout>
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/notifications" 
                element={
                  <AdminRoute>
                    <AdminLayout>
                      <AdminNotifications />
                    </AdminLayout>
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/settings" 
                element={
                  <AdminRoute>
                    <AdminLayout>
                      <AdminSettings />
                    </AdminLayout>
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/reports" 
                element={
                  <AdminRoute>
                    <AdminLayout>
                      <Admin />
                    </AdminLayout>
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/approved" 
                element={
                  <AdminRoute>
                    <AdminLayout>
                      <AdminApproved />
                    </AdminLayout>
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/rejected" 
                element={
                  <AdminRoute>
                    <AdminLayout>
                      <AdminRejected />
                    </AdminLayout>
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/analytics" 
                element={
                  <AdminRoute>
                    <AdminLayout>
                      <AdminAnalytics />
                    </AdminLayout>
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/contacts" 
                element={
                  <AdminRoute>
                    <AdminLayout>
                      <AdminContacts />
                    </AdminLayout>
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/payment" 
                element={
                  <AdminRoute>
                    <AdminLayout>
                      <AdminPayment />
                    </AdminLayout>
                  </AdminRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4ade80',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;