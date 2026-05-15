import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="bg-white border-b border-gray-200 border-t-4 border-t-brand-600">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="font-semibold text-lg text-brand-700">
          🗓️ Agendamento de Visitas
        </Link>
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {user.name} {user.role === 'ADMIN' && '(admin)'}
            </span>
            <Link
              to="/novo"
              className="text-sm bg-brand-600 text-white px-3 py-1.5 rounded hover:bg-brand-700"
            >
              + Novo agendamento
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-red-600"
            >
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
