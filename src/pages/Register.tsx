import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Shield } from 'lucide-react';
import { useAuthContext } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
}

export function Register() {
  const { signUp } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>({
    mode: 'onChange'
  });
  const password = watch('password');

  // Get the intended destination from location state, default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';
  const onSubmit = async (data: RegisterForm) => {
    try {
      setLoading(true);
      
      const result = await signUp(data.email, data.password);
      
      if (result?.needsConfirmation) {
        toast.success('Account created! Please check your email to confirm your account before signing in.');
        navigate('/login');
      } else {
        toast.success('Account created successfully! You are now signed in.');
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      
      if (error.message?.includes('User already registered') || 
          error.message?.includes('already registered') ||
          error.message?.includes('User already exists')) {
        toast.error('This email is already registered. Please try signing in instead.');
      } else if (error.message?.includes('Password should be at least')) {
        toast.error('Password must be at least 6 characters long.');
      } else if (error.message?.includes('Unable to validate email address') || 
                 error.message?.includes('Invalid email')) {
        toast.error('Please enter a valid email address.');
      } else {
        toast.error(error.message || 'Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              required
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              error={errors.email?.message}
            />

            <Input
              label="Password"
              type="password"
              autoComplete="new-password"
              required
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              error={errors.password?.message}
            />

            <Input
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              required
              {...register('confirmPassword', { 
                required: 'Please confirm your password',
                validate: (value) => 
                  value === password || 'Passwords do not match'
              })}
              error={errors.confirmPassword?.message}
            />

            <Button
              type="submit"
              className="w-full"
              loading={loading}
              disabled={loading || Object.keys(errors).length > 0}
            >
              Create account
            </Button>
          </form>

          <div className="mt-6">
            <div className="text-center text-sm text-gray-600">
              By creating an account, you agree to our{' '}
              <Link to="/terms" className="text-blue-600 hover:text-blue-500">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
                Privacy Policy
              </Link>
            </div>
            
            <div className="mt-4 text-center">
              <Link
                to="/"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}