import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import useUserStore from './store/userStore';
import useConfigStore from './store/configStore';
import Onboarding from './pages/Onboarding';
import Feed from './pages/Feed';
import Chat from './pages/Chat';
import CommentsDetail from './pages/CommentsDetail';
import AdminDashboard from './pages/AdminDashboard';

function ProtectedRoute({ children }) {
    const { anonId, city } = useUserStore(state => ({
        anonId: state.anonId,
        city: state.city
    }));
    const location = useLocation();

    if (!anonId || !city) {
        return <Navigate to="/onboarding" state={{ from: location }} replace />;
    }

    return children;
}

function AdminRoute({ children }) {
    const [authed, setAuthed] = React.useState(() => !!sessionStorage.getItem('GOGON_ADMIN_JWT'));
    const [denied, setDenied] = React.useState(false);

    React.useEffect(() => {
        if (authed) return;
        const rawToken = window.prompt('Masukkan admin token:');
        if (!rawToken) { setDenied(true); return; }
        const apiUrl = 'https://farkhankhamr-gogon-server.hf.space/api';
        fetch(`${apiUrl}/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: rawToken })
        }).then(r => r.json()).then(data => {
            if (data.jwt) {
                sessionStorage.setItem('GOGON_ADMIN_JWT', data.jwt);
                setAuthed(true);
            } else {
                setDenied(true);
            }
        }).catch(() => setDenied(true));
    }, []);

    if (denied) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'DM Sans, sans-serif', color: '#8C8476' }}>Access denied.</div>;
    if (!authed) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'DM Sans, sans-serif', color: '#8C8476' }}>Authenticating...</div>;
    return children;
}

// Layout for the mobile app experience
const MobileLayout = () => (
    <div className="max-w-md mx-auto min-h-screen shadow-2xl overflow-hidden relative" style={{ backgroundColor: '#F5EFE8', fontFamily: 'DM Sans, sans-serif' }}>
        <Outlet />
    </div>
);

export default function App() {
    const fetchSettings = useConfigStore(state => state.fetchSettings);

    useEffect(() => {
        fetchSettings();
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                {/* Mobile App Routes */}
                <Route element={<MobileLayout />}>
                    <Route path="/onboarding" element={<Onboarding />} />
                    <Route
                        path="/feed"
                        element={
                            <ProtectedRoute>
                                <Feed />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/chat/:chatId"
                        element={
                            <ProtectedRoute>
                                <Chat />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/post/:postId/comments"
                        element={
                            <ProtectedRoute>
                                <CommentsDetail />
                            </ProtectedRoute>
                        }
                    />
                    {/* Default redirect for unknown routes inside app context */}
                    <Route path="*" element={<Navigate to="/feed" replace />} />
                </Route>

                {/* Admin Dashboard - Full Desktop Width */}
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            </Routes>
        </BrowserRouter>
    );
}
