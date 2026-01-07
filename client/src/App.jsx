import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import useUserStore from './store/userStore';
import Onboarding from './pages/Onboarding';
import Feed from './pages/Feed';
import Chat from './pages/Chat';

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

export default function App() {
    return (
        <BrowserRouter>
            <div className="max-w-md mx-auto min-h-screen bg-white shadow-2xl overflow-hidden relative">
                <Routes>
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
                    {/* Default redirect */}
                    <Route path="*" element={<Navigate to="/feed" replace />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}
