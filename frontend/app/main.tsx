import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App';
import SignUp from './pages/Signup'; // Pfad basierend auf deiner Struktur

// 1. Router konfigurieren
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // Haupt-App
  },
  {
    path: '/signup',
    element: <SignUp />, // Signup-Seite
  },
]);

// 2. Rendern
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} /> {/* Router bereitstellen */}
  </StrictMode>
);