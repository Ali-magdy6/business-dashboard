import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { User } from '../../types';
import { X, User as UserIcon, Mail, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

type UserFormData = {
  name: string;
  email: string;
  role: 'admin' | 'user' | 'manager';
  status: 'active' | 'inactive';
};

const schema = yup.object({
  name: yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  role: yup.string().oneOf(['admin', 'user', 'manager']).required('Role is required'),
  status: yup.string().oneOf(['active', 'inactive']).required('Status is required'),
});

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<User>) => void;
  user?: User | null;
  title: string;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSubmit, user, title }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UserFormData>({
    resolver: yupResolver(schema),
    defaultValues: user ? {
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    } : {
      name: '',
      email: '',
      role: 'user',
      status: 'active',
    },
  });

  React.useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      });
    } else {
      reset({
        name: '',
        email: '',
        role: 'user',
        status: 'active',
      });
    }
  }, [user, reset]);

  const handleFormSubmit = async (data: UserFormData) => {
    const formData: Partial<User> = {
      ...data,
    };
    await onSubmit(formData);
    onClose();
    reset();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              title="Close modal"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  {...register('name')}
                  type="text"
                  className="input-field pl-10"
                  placeholder="Enter full name"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  {...register('email')}
                  type="email"
                  className="input-field pl-10"
                  placeholder="Enter email address"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Role
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  {...register('role')}
                  className="input-field pl-10"
                >
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.role.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                {...register('status')}
                className="input-field"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.status.message}</p>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default UserModal;
