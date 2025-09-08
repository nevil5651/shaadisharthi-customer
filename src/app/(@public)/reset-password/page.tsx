'use client'
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { UseFormRegister, FieldError } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import AuthCard from '@/components/cards/AuthCard';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Validation schema
const resetPasswordSchema = z.object({
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter.' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter.' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number.' })
    .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character.' }),
  confirmPassword: z.string().min(8, { message: 'Please confirm your password.' }),
  token: z.string().min(1, { message: 'Verification token is required.' }).optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ResetPasswordFormInputs = z.infer<typeof resetPasswordSchema>;

interface PasswordInputProps {
  register: ReturnType<UseFormRegister<any>>;
  error?: FieldError;
  disabled?: boolean;
  showPassword: boolean;
  onTogglePassword: () => void;
  placeholder?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  register,
  error,
  disabled,
  showPassword,
  onTogglePassword,
  placeholder,
}) => (
  <div>
    <div className="relative">
      <div className="input-icon"><FaLock /></div>
      <input 
        type={showPassword ? "text" : "password"}
        {...register}
        placeholder={placeholder}
        className="form-input w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
        disabled={disabled}
      />
      <button
        type="button"
        className="password-toggle absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        onClick={onTogglePassword}
        disabled={disabled}
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>
    {error && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{error.message}</p>}
  </div>
);

// Loading spinner component
const LoadingSpinner = ({ text = "Resetting..." }: { text?: string }) => (
  <div className="flex items-center justify-center">
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    {text}
  </div>
);

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isValidToken, setIsValidToken] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<ResetPasswordFormInputs>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange'
  });

  const verifyToken = useCallback(async () => {
    if (!token) {
      setApiError('Invalid or missing reset token. Redirecting...');
      setTimeout(() => router.push('/forgot-password'), 3000);
      return;
    }

    setIsLoading(true);
    setApiError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.get(`${apiUrl}/Customer/cstmr-reset-password-verify?token=${token}`);
      if (response.data.valid) {
        setValue('token', token);
        setIsValidToken(true);
      } else {
        throw new Error('Invalid token');
      }
    } catch (err) {
      setApiError('Invalid or expired reset token. Redirecting...');
      setTimeout(() => router.push('/forgot-password'), 3000);
    } finally {
      setIsLoading(false);
    }
  }, [token, router, setValue]);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  const onSubmit = useCallback(async (data: ResetPasswordFormInputs) => {
    setIsLoading(true);
    setApiError(null);
    const toastId = toast.loading("Resetting your password...");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error("API URL is not configured.");
      }

      const { confirmPassword, ...payload } = data;

      await axios.post(`${apiUrl}/Customer/cstmr-reset-password`, payload);

      toast.update(toastId, {
        render: 'Password reset successful! Redirecting to login...',
        type: 'success',
        isLoading: false,
        autoClose: 2000,
      });

      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (err) {
      console.error('Reset password failed:', err);
      let errorMessage = 'An unexpected error occurred.';
      if (axios.isAxiosError(err) && err.response) {
        errorMessage = err.response.data.error || 'Password reset failed. Please try again.';
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setApiError(errorMessage);
      toast.update(toastId, { render: errorMessage, type: 'error', isLoading: false, autoClose: 5000 });
      setIsLoading(false);
    }
  }, [router]);

  const togglePassword = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const toggleConfirmPassword = useCallback(() => {
    setShowConfirmPassword(prev => !prev);
  }, []);

  if (!isValidToken && token) {
    return (
      <div className="auth-page min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
        <AuthCard title="Verifying..." subtitle="Please wait while we verify your reset link">
          {apiError && <p className="text-red-500 dark:text-red-400 text-center">{apiError}</p>}
        </AuthCard>
        <ToastContainer position="bottom-right" />
      </div>
    );
  }

  return (
    <div className="auth-page min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <AuthCard title="Reset Password" subtitle="Enter your new password">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {apiError && (
            <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:bg-opacity-20 dark:text-red-300" role="alert">
              {apiError}
            </div>
          )}

          {/* Hidden Token Field */}
          <input type="hidden" {...register('token')} />

          {/* Password Field */}
          <PasswordInput
            register={register('password')}
            error={errors.password}
            disabled={isLoading}
            showPassword={showPassword}
            onTogglePassword={togglePassword}
            placeholder="New Password"
          />

          {/* Confirm Password Field */}
          <PasswordInput
            register={register('confirmPassword')}
            error={errors.confirmPassword}
            disabled={isLoading}
            showPassword={showConfirmPassword}
            onTogglePassword={toggleConfirmPassword}
            placeholder="Confirm New Password"
          />

          {/* Submit Button */}
          <button type="submit" className="gradient-btn w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition duration-150 ease-in-out disabled:opacity-50 dark:focus:ring-offset-gray-800" disabled={isLoading}>
            {isLoading ? <LoadingSpinner /> : 'Reset Password'}
          </button>

          <div className="text-center text-gray-700 dark:text-gray-300">
            <p>
              Remember your password?{' '}
              <Link href="/login" className="text-pink-600 dark:text-pink-400 font-medium hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </AuthCard>
      <ToastContainer position="bottom-right" />
    </div>
  );
}