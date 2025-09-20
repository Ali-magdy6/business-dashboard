import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useStore } from '../../store/useStore';
import { LoginForm as LoginFormType } from '../../types';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

const schema = yup.object({
  name: yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const { login } = useStore();
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormType>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginFormType) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Use the actual entered name
    const mockUser = {
      id: '1',
      name: data.name,
      email: data.email,
      role: 'admin' as const,
    };
    
    login(mockUser);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-text-primary">Welcome Back</h2>
        <p className="text-text-secondary mt-2">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="name" className="form-label">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              {...register('name')}
              type="text"
              className="form-input pl-10"
              placeholder="Enter your full name"
            />
          </div>
          {errors.name && (
            <p className="form-error">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              {...register('email')}
              type="email"
              className="form-input pl-10"
              placeholder="Enter your email"
            />
          </div>
          {errors.email && (
            <p className="form-error">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              className="form-input pl-10 pr-10"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="form-error">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-brand-primary focus:ring-brand-primary border-surface-3 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-text-secondary">
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <button type="button" className="font-medium text-brand-primary hover:text-brand-primary/80">
              Forgot your password?
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-primary"
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-text-secondary">
          Don't have an account?{' '}
          <button
            onClick={onSwitchToRegister}
            className="font-medium text-brand-primary hover:text-brand-primary/80"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
