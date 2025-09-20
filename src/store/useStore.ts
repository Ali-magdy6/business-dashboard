import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Product, SalesData, KPIData, AuthUser } from '../types';

interface AppState {
  // Auth state
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;

  // UI state
  darkMode: boolean;
  toggleDarkMode: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  language: 'en' | 'ar';
  setLanguage: (language: 'en' | 'ar') => void;

  // Data state
  users: User[];
  products: Product[];
  salesData: SalesData[];
  kpiData: KPIData;
  
  // Actions
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  setSalesData: (sales: SalesData[]) => void;
  setKPIData: (kpi: KPIData) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, _get) => ({
      // Auth state
      user: null,
      isAuthenticated: false,
      login: (user: AuthUser) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),

      // UI state
      darkMode: false,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      sidebarOpen: true,
      setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
      language: 'en',
      setLanguage: (language: 'en' | 'ar') => set({ language }),

      // Data state
      users: [],
      products: [],
      salesData: [],
      kpiData: {
        totalSales: 0,
        totalUsers: 0,
        totalRevenue: 0,
        growthRate: 0,
      },

      // User actions
      setUsers: (users: User[]) => set({ users }),
      addUser: (user: User) => set((state) => ({ users: [...state.users, user] })),
      updateUser: (id: string, userData: Partial<User>) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id ? { ...user, ...userData } : user
          ),
        })),
      deleteUser: (id: string) =>
        set((state) => ({
          users: state.users.filter((user) => user.id !== id),
        })),

      // Product actions
      setProducts: (products: Product[]) => set({ products }),
      addProduct: (product: Product) => set((state) => ({ products: [...state.products, product] })),
      updateProduct: (id: string, productData: Partial<Product>) =>
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id ? { ...product, ...productData } : product
          ),
        })),
      deleteProduct: (id: string) =>
        set((state) => ({
          products: state.products.filter((product) => product.id !== id),
        })),

      // Sales and KPI actions
      setSalesData: (salesData: SalesData[]) => set({ salesData }),
      setKPIData: (kpiData: KPIData) => set({ kpiData }),
    }),
    {
      name: 'business-dashboard-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        darkMode: state.darkMode,
        language: state.language,
      }),
    }
  )
);
