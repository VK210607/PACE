// src/components/shared/Sidebar.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Navigation sidebar with brand maroon header, nav links, and user profile.

import { BookOpen, Home, LogOut, Upload } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const STUDENT_NAV: NavItem[] = [
  { to: '/dashboard', icon: <Home className="h-4 w-4" />,     label: 'Dashboard'  },
];

const ADMIN_NAV: NavItem[] = [
  { to: '/admin',        icon: <Home className="h-4 w-4" />,     label: 'Overview'    },
  { to: '/admin/upload', icon: <Upload className="h-4 w-4" />,   label: 'Upload PDF'  },
];

export default function Sidebar() {
  const { user, clearSession } = useAuth();
  const navigate = useNavigate();

  const navItems = user?.role === 'admin' ? ADMIN_NAV : STUDENT_NAV;

  const handleLogout = () => {
    clearSession();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="flex flex-col w-56 min-h-screen bg-navy-800 text-white shadow-sidebar flex-shrink-0">
      {/* Brand header */}
      <div className="px-5 py-5 border-b border-navy-700">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-md bg-gold-400 flex items-center justify-center">
            <BookOpen className="h-4 w-4 text-maroon-900" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-none text-white">College</p>
            <p className="text-xs text-gold-300 leading-tight mt-0.5">Portal</p>
          </div>
        </div>
      </div>

      {/* User profile chip */}
      <div className="px-4 py-3 border-b border-navy-700 bg-navy-900/30">
        <p className="text-xs font-medium text-white truncate">
          {user?.full_name || 'User'}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className={`inline-block h-1.5 w-1.5 rounded-full ${user?.role === 'admin' ? 'bg-gold-400' : 'bg-green-400'}`} />
          <p className="text-xs text-gray-400 capitalize">
            {user?.role}
            {user?.department ? ` · ${user.department.split(' ')[0]}` : ''}
            {user?.year ? ` Y${user.year}` : ''}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="section-header text-gray-500 px-2 mb-2">Navigation</p>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 text-sm rounded-md transition-colors duration-100
               ${isActive
                 ? 'bg-maroon-800 text-white font-medium'
                 : 'text-gray-300 hover:bg-navy-700 hover:text-white'
               }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-navy-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-gray-300
                     hover:bg-navy-700 hover:text-white rounded-md transition-colors duration-100"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
