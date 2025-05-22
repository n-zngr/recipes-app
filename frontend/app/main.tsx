import { useState, useEffect, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './index.css';
import App from './App';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');

const root = createRoot(container);

function getCookie(name: string): string | null {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [key, value] = cookie.trim().split('=');
        if (key === name) return decodeURIComponent(value);
    }
    return null;
}

const RootRedirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const householdId = getCookie('household_id');

        console.log('Household ID from cookie:', householdId);

        if (householdId) {
            navigate(`/${householdId}`, { replace: true });
        } else {
            navigate('/login', { replace: true });
        }
    }, [navigate]);

    return null;
};

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
        return <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
        }}>Authenticating...</div>;
    }

    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

root.render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<RootRedirect />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/onboarding" element={<AuthWrapper><Onboarding /></AuthWrapper>} />
                <Route path="/:householdId" element={<AuthWrapper><App /></AuthWrapper>} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
);
