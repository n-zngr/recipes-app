import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import Signup from './pages/Signup';
import Login from './pages/Login';
 // Pfad basierend auf deiner Struktur

// 2. Rendern
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App/>} />
            <Route path="/signup" element={<Signup/>} />
            <Route path="/login" element={<Login/>} />
        </Routes>
    </BrowserRouter>
  </StrictMode>
);