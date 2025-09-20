import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Sidebar from './Sidebar';
import Header from './Header';
import { useStore } from '../../store/useStore';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { sidebarOpen, setSidebarOpen, darkMode } = useStore();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="flex h-screen layout-container layout-background">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'hsl(var(--card))',
            color: 'hsl(var(--card-foreground))',
            border: '1px solid hsl(var(--border))',
          },
        }}
      />
      
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="main-content flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
          <div className="px-3 py-4 lg:px-4 lg:py-5">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
