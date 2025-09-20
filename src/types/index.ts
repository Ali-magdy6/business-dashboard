export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'manager';
  status: 'active' | 'inactive';
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string | undefined;
  stock: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface SalesData {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
  customerId: string;
  customerName: string;
  date: string;
}

export interface KPIData {
  totalSales: number;
  totalUsers: number;
  totalRevenue: number;
  growthRate: number;
}

export interface ChartData {
  name: string;
  value: number;
  date?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'manager';
}

export interface LoginForm {
  name: string;
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
  total: number;
}

export interface FilterState {
  search: string;
  status?: string;
  role?: string;
  category?: string;
}
