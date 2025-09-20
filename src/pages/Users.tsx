import React, { useEffect, useState } from 'react';
import { Plus, Users as UsersIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import UserTable from '../components/users/UserTable';
import UserModal from '../components/users/UserModal';
import { useStore } from '../store/useStore';
import { User } from '../types';
import toast from 'react-hot-toast';

const Users: React.FC = () => {
  const { users, setUsers, addUser, updateUser, deleteUser } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockUsers: User[] = [
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
      {
        id: '3',
        name: 'Bob Johnson',
        email: 'bob@example.com',
        role: 'user',
        status: 'inactive',
        createdAt: '2024-01-05',
        lastLogin: '2024-01-18',
      },
      {
        id: '4',
        name: 'Alice Brown',
        email: 'alice@example.com',
        role: 'user',
        status: 'active',
        createdAt: '2024-01-12',
        lastLogin: '2024-01-20',
      },
      {
        id: '5',
        name: 'Charlie Wilson',
        email: 'charlie@example.com',
        role: 'manager',
        status: 'active',
        createdAt: '2024-01-08',
        lastLogin: '2024-01-19',
      },
    ];

    setUsers(mockUsers);
  }, [setUsers]);

  const handleAddUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(id);
      toast.success('User deleted successfully');
    }
  };

  const handleSubmitUser = async (userData: Partial<User>) => {
    try {
      if (editingUser) {
        updateUser(editingUser.id, userData);
        toast.success('User updated successfully');
      } else {
        const newUser: User = {
          id: Date.now().toString(),
          name: userData.name || '',
          email: userData.email || '',
          role: userData.role || 'user',
          status: userData.status || 'active',
          createdAt: new Date().toISOString().split('T')[0] as string,
        };
        addUser(newUser);
        toast.success('User created successfully');
      }
    } catch (error) {
      toast.error('Failed to save user');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center">
            <UsersIcon className="w-8 h-8 mr-3 text-brand-primary" />
            User Management
          </h1>
          <p className="text-text-secondary mt-1">
            Manage your users and their permissions
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddUser}
          className="btn-primary flex items-center mt-4 sm:mt-0"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add User
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6"
        >
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <UsersIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{users.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <div className="flex items-center">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <div className="w-6 h-6 bg-green-600 dark:bg-green-400 rounded-full"></div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {users.filter(user => user.status === 'active').length}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <div className="w-6 h-6 bg-purple-600 dark:bg-purple-400 rounded-full"></div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Admins</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {users.filter(user => user.role === 'admin').length}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* User Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <UserTable
          users={users}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
        />
      </motion.div>

      {/* User Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitUser}
        user={editingUser}
        title={editingUser ? 'Edit User' : 'Add New User'}
      />
    </div>
  );
};

export default Users;
