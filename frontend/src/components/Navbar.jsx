import { useAuth } from '../context/AuthContext';
import { Menu, AccountCircle, ExitToApp } from '@mui/icons-material';

export default function Navbar({ sidebarOpen, setSidebarOpen }) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 bg-white border-b border-gray-200 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 -mb-px">
          {/* Header: Left side */}
          <div className="flex">
            {/* Hamburger button */}
            <button
              className="text-gray-500 hover:text-gray-600 lg:hidden"
              aria-controls="sidebar"
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <span className="sr-only">Open sidebar</span>
              <Menu />
            </button>
          </div>

          {/* Header: Right side */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 mr-4 text-gray-700">
                <AccountCircle className="text-gray-500" />
                <span className="font-medium text-sm hidden sm:block">{user?.fullName}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center text-red-500 hover:text-red-700 transition"
            >
              <ExitToApp />
              <span className="ml-1 text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
