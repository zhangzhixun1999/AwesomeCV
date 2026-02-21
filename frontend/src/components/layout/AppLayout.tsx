import { Outlet, Link } from 'react-router-dom';
import { User } from 'lucide-react';

const AppLayout = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
          <Link to="/dashboard" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
            AwesomeCV
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                {user?.full_name?.[0] || <User size={16} />}
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                退出
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
