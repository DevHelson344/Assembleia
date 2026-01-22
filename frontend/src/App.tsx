import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Growth from './pages/Growth';
import Financial from './pages/Financial';
import Reports from './pages/Reports';

// Configura axios para sempre enviar cookies
axios.defaults.withCredentials = true;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // Verifica se o usuário está autenticado consultando o backend
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/auth/me');
        setUserData(response.data);
        setIsAuthenticated(true);
        
        // Atualiza localStorage com dados não sensíveis
        localStorage.setItem('role', response.data.role);
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('church_name', response.data.church_name || 'Sistema');
      } catch (error) {
        setIsAuthenticated(false);
        // Limpa localStorage se não autenticado
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        localStorage.removeItem('church_name');
      }
    };

    checkAuth();
  }, []);

  const handleLogin = (data: any) => {
    setUserData(data);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
    setIsAuthenticated(false);
    setUserData(null);
    localStorage.clear();
  };

  // Mostra loading enquanto verifica autenticação
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Carregando...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" /> : <Login onLogin={handleLogin} />
        } />
        <Route
          path="/"
          element={isAuthenticated ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/members"
          element={isAuthenticated ? <Members onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/growth"
          element={isAuthenticated ? <Growth onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/financial"
          element={isAuthenticated ? <Financial onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/reports"
          element={isAuthenticated ? <Reports onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
