import { useState, useEffect, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import App from './App';
import Admin from './pages/Admin';
import Register from './pages/Register';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');

const root = createRoot(container);

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/auth/', {
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (response.ok) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                setIsAuthenticated(false);
            }
        };
        checkAuth();
    }, []);

    if (isAuthenticated === null) {
        return <div className='flex justify-center items-center h-screen bg-white'>Authenticating...</div>;
    }

    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

root.render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/onboarding" element={<AuthWrapper><Onboarding /></AuthWrapper>} />
                <Route path="/" element={<AuthWrapper><App /></AuthWrapper>} />
                <Route path="/admin" element={<Admin />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
);
