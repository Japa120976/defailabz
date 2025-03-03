import React from 'react';
import { WagmiConfig } from 'wagmi';
import { config } from './wagmi';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

// Importando todas as páginas
import Home from './pages/Home';
import ProjectList from './pages/ProjectList';
import ProjectAnalysis from './pages/ProjectAnalysis';
import FundamentalAnalysis from './pages/FundamentalAnalysis';
import TechnicalAnalysis from './pages/TechnicalAnalysis';
import ProjectRanking from './pages/ProjectRanking';
import SubmitProject from './pages/SubmitProject';
import DexAI from './pages/DexAI';
import Navbar from './components/Navbar';
import MvpAccess from './pages/MvpAccess';
import AdminAccess from './pages/AdminAccess';
import AdminDashboard from './pages/AdminDashboard';

// Importando serviços
import { projectService } from './services/projectService';
import { dexService } from './services/dexService';


// Componente de Proteção MVP
const ProtectedRoute = () => {
  const navigate = useNavigate();
  const hasAccess = localStorage.getItem('mvp_access_token');
  
  React.useEffect(() => {
    if (!hasAccess) {
      navigate('/mvp-access');
    }
  }, [hasAccess, navigate]);

  return hasAccess ? <Outlet /> : null;
};

// Componente de Proteção Admin
const AdminRoute = () => {
  const navigate = useNavigate();
  const hasAccess = localStorage.getItem('admin_token');
  
  React.useEffect(() => {
    if (!hasAccess) {
      navigate('/mvp/admin');
    }
  }, [hasAccess, navigate]);

  return hasAccess ? <Outlet /> : null;
};

function App() {
  return (
    <WagmiConfig config={config}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div style={{ paddingTop: '64px' }}>
            <img 
              src="/rocket-12318_256.gif" 
              alt="Rocket"
              style={{
                position: 'fixed',
                width: '100px',
                zIndex: 9999,
                animation: 'flyAround 20s linear infinite',
                pointerEvents: 'none'
              }}
            />
            <style>
              {`
                @keyframes flyAround {
                  0% { top: 100%; left: 0; }
                  25% { top: 0; left: 100%; }
                  50% { top: 100%; left: 100%; }
                  75% { top: 0; left: 0; }
                  100% { top: 100%; left: 0; }
                }
              `}
            </style>
            <Navbar />
            <Routes>
              {/* Redireciona / para /mvp-access se não estiver autenticado */}
              <Route 
                path="/" 
                element={
                  localStorage.getItem('mvp_access_token') 
                    ? <Navigate to="/home" replace /> 
                    : <Navigate to="/mvp-access" replace />
                } 
              />

              {/* Página de acesso MVP */}
              <Route path="/mvp-access" element={<MvpAccess />} />

              {/* Rotas Admin */}
              <Route path="/mvp/admin" element={<AdminAccess />} />
              <Route element={<AdminRoute />}>
                <Route path="/mvp/admin/dashboard" element={<AdminDashboard />} />
              </Route>

              {/* Rotas Protegidas MVP */}
              <Route element={<ProtectedRoute />}>
                <Route path="/home" element={<Home />} />
                <Route path="/projects" element={<ProjectList />} />
                <Route path="/project-analysis" element={<ProjectAnalysis />} />
                <Route path="/fundamental-analysis" element={<FundamentalAnalysis />} />
                <Route path="/technical-analysis" element={<TechnicalAnalysis />} />
                <Route path="/project-ranking" element={<ProjectRanking />} />
                <Route path="/submit-project" element={<SubmitProject />} />
                <Route path="/dex" element={<DexAI />} />
              </Route>

              {/* Rota 404 */}
              <Route path="*" element={
                <Navigate to="/" replace />
              } />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </WagmiConfig>
  );
}

export default App;