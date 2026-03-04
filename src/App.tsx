import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useAuthStore, useUIStore } from '@/store';
import Navbar from '@/components/layout/Navbar';
import UploadModal from '@/components/upload/UploadModal';

import Landing from '@/pages/Landing';
import { Login, Signup } from '@/pages/Auth';
import Feed from '@/pages/Feed';
import Explore from '@/pages/Explore';
import Profile from '@/pages/Profile';
import Messages from '@/pages/Messages';
import Notifications from '@/pages/Notifications';
import Admin from '@/pages/Admin';

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuthStore();
  const { uploadModalOpen } = useUIStore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 bg-terracotta rounded-lg flex items-center justify-center animate-pulse-soft">
            <span className="text-white font-serif font-black text-xl">A</span>
          </div>
          <p className="text-sm text-ink/50 font-medium">Loading Artista…</p>
        </div>
      </div>
    );
  }

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
  const { isAuthenticated, loading } = useAuthStore();
  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/feed" replace />;
  return <>{children}</>;
}

export default function App() {
  const { initAuth } = useAuthStore();

  // Listen for Firebase auth state changes on app start
  useEffect(() => {
    const unsubscribe = initAuth();
    return unsubscribe;
  }, [initAuth]);

  return (
    <BrowserRouter>
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
          success: { iconTheme: { primary: '#C0532B', secondary: '#F9F4EC' } },
        }}
      />
      <Routes>
        <Route path="/"        element={<Landing />} />
        <Route path="/login"   element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup"  element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/feed"    element={<ProtectedLayout><Feed /></ProtectedLayout>} />
        <Route path="/explore" element={<ProtectedLayout><Explore /></ProtectedLayout>} />
        <Route path="/profile/:id" element={<ProtectedLayout><Profile /></ProtectedLayout>} />
        <Route path="/messages"    element={<ProtectedLayout><Messages /></ProtectedLayout>} />
        <Route path="/notifications" element={<ProtectedLayout><Notifications /></ProtectedLayout>} />
        <Route path="/admin"   element={<ProtectedLayout><Admin /></ProtectedLayout>} />
        <Route path="*"        element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
