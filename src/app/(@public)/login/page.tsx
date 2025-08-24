'use client'
import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaFacebookF, FaGoogle, FaApple } from 'react-icons/fa';
import { useAuth } from '@/context/useAuth';
import AuthCard from '@/components/cards/AuthCard';

// 1. Define the Zod schema
const loginSchema = z.object({
  email: z.string().min(1, { message: 'Email is required.' }).email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  rememberMe: z.boolean().optional(),
});

// 2. Create a type from the schema
type LoginFormInputs = z.infer<typeof loginSchema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const { login } = useAuth();

  // 3. Set up react-hook-form
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  // 4. Handle form submission
  const onSubmit = async (data: LoginFormInputs) => {
    setApiError(null);
    setIsLoading(true);

    const result = await login({ email: data.email, password: data.password });

    if (!result.success) {
      setApiError(result.error || 'An unknown error occurred.');
      setIsLoading(false); // Stop loading only on failure
    }
  };

  return (
    <div className="auth-page">
      <AuthCard
        title="Welcome Back"
        subtitle="Sign in to continue your journey"
      >
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {apiError && (
            <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
              {apiError}
            </div>
          )}
          <div>
            <div className="relative">
                <div className="input-icon">
                  <FaUser />
                </div>
                <input
                  type="email"
                  {...register('email')}
                  placeholder="Enter your email"
                  className="form-input"
                  disabled={isLoading}
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
          
          <div>
            <div className="relative">
                <div className="input-icon">
                  <FaLock />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register('password')}
                  placeholder="Enter your password"
                  className="form-input"
                  disabled={isLoading}
                />
                <button 
                  type="button" 
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div className="flex justify-between items-center mb-6">
            <label className="flex items-center">
              <input type="checkbox" {...register('rememberMe')} className="form-checkbox" disabled={isLoading} />
              <span className="ml-2 text-gray-700">Remember me</span>
            </label>
            <Link href="/forgot-password" className="text-pink-500 hover:text-pink-700">
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="gradient-btn" disabled={isLoading || isSubmitting}>
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </div>
            ) : 'Sign In'}
          </button>

          <div className="flex items-center my-6">
            <div className="border-t border-gray-300 flex-grow"></div>
            <span className="mx-4 text-gray-500">or continue with</span>
            <div className="border-t border-gray-300 flex-grow"></div>
          </div>

          <div className="flex justify-center space-x-4 mb-6">
            <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-blue-600">
              <FaFacebookF />
            </button>
            <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-red-600">
              <FaGoogle />
            </button>
            <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-black">
              <FaApple />
            </button>
          </div>

          <div className="text-center text-gray-700">
            Don't have an account?{' '}
            <Link href="/verify-email" className="text-pink-500 font-medium hover:underline">
              Register now
            </Link>
          </div>
        </form>
      </AuthCard>
    </div>
  );
}