import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface LoginProps {
  onLogin: (userData: { role: string; username: string; church_name: string }) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('/api/auth/login', 
        { username, password },
        { withCredentials: true } // Importante para enviar/receber cookies
      );
      
      // Salva apenas dados não sensíveis no localStorage
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('username', response.data.username);
      localStorage.setItem('church_name', response.data.church_name);
      
      onLogin(response.data);
      navigate('/');
    } catch (err) {
      setError('Usuário ou senha inválidos');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-xl p-10 rounded-2xl shadow-2xl w-full max-w-md border border-white/40">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
            <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Sistema Igreja</h1>
          <p className="text-gray-500">Gestão Completa</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Usuário</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Digite seu usuário"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Digite sua senha"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 text-base font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            Entrar no Sistema
          </button>
        </form>
      </div>
    </div>
  );
}
