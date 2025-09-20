import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { useStore } from './store/useStore';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider } from './components/ThemeProvider';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { ColorThemeProvider } from './contexts/ColorThemeContext';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Products from './pages/Products';
import Reports from './pages/Reports';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppContent: React.FC = () => {
  const { isAuthenticated } = useStore();
  const { isRTL } = useLanguage();

  return (
    <div className={`App ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Routes>
        <Route 
          path="/auth" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <Auth />} 
        />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--card)',
            color: 'var(--card-foreground)',
            border: '1px solid var(--border)',
          },
        }}
      />
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ColorThemeProvider>
        <ThemeProvider defaultTheme="system" storageKey="business-dashboard-theme">
          <LanguageProvider>
            <ErrorBoundary>
              <Router>
                <AppContent />
              </Router>
              <ReactQueryDevtools initialIsOpen={false} />
            </ErrorBoundary>
          </LanguageProvider>
        </ThemeProvider>
      </ColorThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
