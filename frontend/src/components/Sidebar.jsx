import { NavLink } from 'react-router-dom';
import { 
  Dashboard, 
  Person, 
  AccountBalanceWallet, 
  MoneyOff, 
  SwapHoriz, 
  ReceiptLong, 
  Close 
} from '@mui/icons-material';

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const links = [
    { name: 'Dashboard', path: '/', icon: <Dashboard /> },
    { name: 'Profile', path: '/profile', icon: <Person /> },
    { name: 'Deposit', path: '/deposit', icon: <AccountBalanceWallet /> },
    { name: 'Withdraw', path: '/withdraw', icon: <MoneyOff /> },
    { name: 'Transfer', path: '/transfer', icon: <SwapHoriz /> },
    { name: 'Statement', path: '/statement', icon: <ReceiptLong /> },
  ];

  return (
    <div>
      {/* Sidebar backdrop (mobile only) */}
      <div
        className={`fixed inset-0 bg-gray-900 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <div
        id="sidebar"
        className={`flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-screen overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-72 lg:sidebar-expanded:!w-72 2xl:!w-72 shrink-0 bg-blue-900 p-4 transition-all duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-64'
        }`}
      >
        {/* Sidebar header */}
        <div className="flex justify-between items-center pr-3 sm:px-2 mb-10">
          <div className="flex items-center text-white">
            <AccountBalanceWallet className="w-8 h-8 mr-2" />
            <span className="text-xl font-bold">Banking System</span>
          </div>
          <button
            className="lg:hidden text-gray-300 hover:text-white"
            onClick={() => setSidebarOpen(false)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">Close sidebar</span>
            <Close />
          </button>
        </div>

        {/* Links */}
        <div className="space-y-2 flex-1">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md transition ${
                  isActive
                    ? 'bg-blue-800 text-white font-medium'
                    : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <div className="flex items-center">
                <span className="mr-3">{link.icon}</span>
                <span>{link.name}</span>
              </div>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}
