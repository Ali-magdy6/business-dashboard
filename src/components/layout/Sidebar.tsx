import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  FileText, 
  Settings, 
  LogOut,
  X
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useLanguage } from '../../contexts/LanguageContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, logout } = useStore();
  const { t, isRTL } = useLanguage();

  const navigation = [
    { name: t('dashboard'), href: '/', icon: LayoutDashboard },
    { name: t('users'), href: '/users', icon: Users },
    { name: t('products'), href: '/products', icon: Package },
    { name: t('reports'), href: '/reports', icon: FileText },
    { name: t('settings'), href: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className={`fixed inset-0 bg-surface-0 bg-opacity-75 z-40 lg:hidden ${isRTL ? 'right-0' : 'left-0'}`}
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`
          sidebar backdrop-blur-sm transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
          ${isRTL ? 'right-0' : 'left-0'}
          ${isOpen ? 'translate-x-0' : isRTL ? 'translate-x-full' : '-translate-x-full'}
          ${isOpen ? 'open' : ''}
        `}
      >
        <div className="flex items-center justify-between h-14 px-3 border-b sidebar-header">
          <h1 className="text-base font-bold truncate text-text-primary">Dashboard</h1>
          <button
            onClick={onClose}
            className="lg:hidden btn-ghost btn-sm text-text-secondary hover:text-text-primary transition-colors duration-200 sidebar-button"
            title="Close sidebar"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-5 px-2">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`nav-item ${isActive ? 'active text-brand-primary border-r-2 border-brand-primary' : 'text-text-secondary hover:text-text-primary'} transition-all duration-200`}
                  onClick={onClose}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User info and logout */}
        <div className="absolute bottom-0 left-0 right-0 p-2 border-t sidebar-user-section">
          <div className="flex items-center mb-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0 bg-gradient-brand">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="ml-2 min-w-0 flex-1">
              <p className="text-xs font-medium truncate text-text-primary">{user?.name}</p>
              <p className="text-xs truncate text-text-muted">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn-ghost w-full justify-start text-xs text-text-secondary hover:text-text-primary transition-colors duration-200 sidebar-button"
          >
            <LogOut className="w-3 h-3" />
            <span className="truncate">{t('signOut')}</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
