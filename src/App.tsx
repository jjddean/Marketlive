import React, { useEffect } from 'react';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  ClerkProvider,
  useAuth
} from '@clerk/clerk-react';
import { Routes, Route, Navigate, useLocation, BrowserRouter } from 'react-router-dom';
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { Toaster } from 'sonner';

// Components
import Navbar from './components/Navbar';
import MobileNavigation from './components/mobile/MobileNavigation';
import { AIAssistant } from './components/ai/AIAssistant';
import AdminLayout from './components/layout/admin/AdminLayout';

// Pages
import {
  HomePage, ServicesPage, SolutionsPage, PlatformPage,
  ResourcesPage, AboutPage, ContactPage, DashboardPage,
  ShipmentsPage, PaymentsPage, CompliancePage, DocumentsPage,
  ReportsPage, AccountPage, ClientQuotesPage,
} from './pages';
import ClientBookingsPage from './pages/client/ClientBookingsPage';
import ApiDocsPage from './pages/ApiDocsPage';
import SharedDocumentPage from './pages/SharedDocumentPage';
import DocusignCallbackPage from './pages/DocusignCallbackPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import AdminShipmentsPage from './pages/admin/AdminShipmentsPage';
import AdminCarriersPage from './pages/admin/AdminCarriersPage';
import AdminDocumentsPage from './pages/admin/AdminDocumentsPage';
import AdminCompliancePage from './pages/admin/AdminCompliancePage';
import AdminCustomersPage from './pages/admin/AdminCustomersPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

// Initialization
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key');
}

// --- Helper Components ---

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW failed', err));
    }
    console.log("MARKET LIVE: Version 8080");
  }, []);

  return (
    <>
      {!isAdmin && <Navbar />}
      {!isAdmin && <MobileNavigation />}
      <AIAssistant />
      <Toaster richColors position="bottom-right" />
      <main className="min-h-screen">{children}</main>
    </>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h2>
            <div className="space-x-4">
              <SignInButton mode="modal">
                <button className="px-4 py-2 bg-blue-600 text-white rounded">Sign In</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-4 py-2 border border-gray-300 rounded">Sign Up</button>
              </SignUpButton>
            </div>
          </div>
        </div>
      </SignedOut>
    </>
  );
}

// --- Main App Component ---

export default function App() {
  // Setup view if key is placeholder
  if (PUBLISHABLE_KEY === 'pk_test_placeholder_key') {
    return <div className="p-20"><h1>Please update your .env with a real Clerk Key</h1></div>;
  }

  return (
    <BrowserRouter>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/solutions" element={<SolutionsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/api" element={<ApiDocsPage />} />
              <Route path="/shared/:token" element={<SharedDocumentPage />} />
              <Route path="/api/docusign/callback" element={<DocusignCallbackPage />} />

              {/* Admin Routes (Wrapped in ProtectedRoute & AdminLayout) */}
              <Route path="/admin/*" element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Routes>
                      <Route index element={<AdminDashboardPage />} />
                      <Route path="bookings" element={<AdminBookingsPage />} />
                      <Route path="shipments" element={<AdminShipmentsPage />} />
                      <Route path="carriers" element={<AdminCarriersPage />} />
                      <Route path="documents" element={<AdminDocumentsPage />} />
                      <Route path="settings" element={<AdminSettingsPage />} />
                    </Routes>
                  </AdminLayout>
                </ProtectedRoute>
              } />

              {/* Protected User Routes */}
              {/* Protected User Routes - TEMPORARILY UNPROTECTED FOR DEMO */}
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/shipments" element={<ShipmentsPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/quotes" element={<ClientQuotesPage />} />
              <Route path="/bookings" element={<ClientBookingsPage />} />
              <Route path="/payments" element={<PaymentsPage />} />
              <Route path="/documents" element={<DocumentsPage />} />
              <Route path="/compliance" element={<CompliancePage />} />
              <Route path="/reports" element={<ReportsPage />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </ConvexProviderWithClerk>
      </ClerkProvider>
    </BrowserRouter>
  );
}  