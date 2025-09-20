import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

// Mock API functions - replace with real API calls
const mockApi = {
  getUsers: async (): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'admin',
        status: 'active',
        createdAt: '2024-01-15',
        lastLogin: '2024-01-20',
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'manager',
        status: 'active',
        createdAt: '2024-01-10',
        lastLogin: '2024-01-19',
      },
    ];
  },

  getProducts: async (): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      {
        id: '1',
        name: 'Product 1',
        price: 99.99,
        category: 'Electronics',
        stock: 50,
        status: 'active',
      },
    ];
  },

  getKPIData: async (): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      totalSales: 12450,
      totalUsers: 1234,
      totalRevenue: 98765,
      growthRate: 12.5,
    };
  },

  createUser: async (user: any): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { ...user, id: Date.now().toString() };
  },

  updateUser: async (id: string, user: any): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { ...user, id };
  },

  deleteUser: async (_id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
  },
};

// Query keys
export const queryKeys = {
  users: ['users'] as const,
  products: ['products'] as const,
  kpiData: ['kpiData'] as const,
};

// Custom hooks
export const useUsers = () => {
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: mockApi.getUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProducts = () => {
  return useQuery({
    queryKey: queryKeys.products,
    queryFn: mockApi.getProducts,
    staleTime: 5 * 60 * 1000,
  });
};

export const useKPIData = () => {
  return useQuery({
    queryKey: queryKeys.kpiData,
    queryFn: mockApi.getKPIData,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: mockApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      toast.success('User created successfully');
    },
    onError: () => {
      toast.error('Failed to create user');
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, user }: { id: string; user: any }) => 
      mockApi.updateUser(id, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      toast.success('User updated successfully');
    },
    onError: () => {
      toast.error('Failed to update user');
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: mockApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      toast.success('User deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete user');
    },
  });
};
