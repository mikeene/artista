import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore, useUIStore } from '@/store';
import Navbar from '@/components/layout/Navbar';
import UploadModal from '@/components/upload/UploadModal';

// Pages
import Landing from '@/pages/Landing';
import { Login, Signup } from '@/pages/Auth';
import Feed from '@/pages/Feed';
import Explore from '@/pages/Explore';
import Profile from '@/pages/Profile';
import Messages from '@/pages/Messages';
import Notifications from '@/pages/Notifications';
import Admin from '@/pages/Admin';

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const { uploadModalOpen } = useUIStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />
      {children}
      {uploadModalOpen && <UploadModal />}
    </div>
  );
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) return <Navigate to="/feed" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Global toast notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1A1209',
            color: '#F9F4EC',
            fontSize: '13px',
            fontFamily: '"DM Sans", sans-serif',
            borderRadius: '8px',
            padding: '12px 16px',
          },
          success: {
            iconTheme: { primary: '#C0532B', secondary: '#F9F4EC' },
          },
        }}
      />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

        {/* Protected */}
        <Route path="/feed" element={<ProtectedLayout><Feed /></ProtectedLayout>} />
        <Route path="/explore" element={<ProtectedLayout><Explore /></ProtectedLayout>} />
        <Route path="/profile/:id" element={<ProtectedLayout><Profile /></ProtectedLayout>} />
        <Route path="/messages" element={<ProtectedLayout><Messages /></ProtectedLayout>} />
        <Route path="/notifications" element={<ProtectedLayout><Notifications /></ProtectedLayout>} />
        <Route path="/admin" element={<ProtectedLayout><Admin /></ProtectedLayout>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
