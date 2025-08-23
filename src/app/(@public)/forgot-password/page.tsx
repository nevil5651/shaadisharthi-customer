'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import AuthCard from '@/components/cards/AuthCard';
import { FaEnvelope } from 'react-icons/fa';
import Link from 'next/link';

// Validation schema
const forgotPasswordSchema = z.object({
  email: z.string().min(1, { message: 'Email is required.' }).email({ message: 'Invalid email address.' }),
});

type ForgotPasswordFormInputs = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormInputs>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormInputs) => {
    setIsLoading(true);
    setApiError(null);
    setApiMessage(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error("API URL is not configured.");
      }

      const response = await axios.post(`${apiUrl}/Customer/cstmr-forgot-password`, data);
      setApiMessage(response.data.message);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setApiMessage(err.response.data.message || 'If the email exists, a reset link has been sent.');
      } else {
        setApiError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <AuthCard title="Forgot Password" subtitle="Enter your email to reset password">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {apiError && (
            <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
              {apiError}
            </div>
          )}
          {apiMessage && (
            <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg" role="alert">
              {apiMessage}
            </div>
          )}

          {/* Email Field */}
          <div>
            <div className="relative">
              <div className="input-icon"><FaEnvelope /></div>
              <input type="email" {...register('email')} placeholder="Email Address" className="form-input" disabled={isLoading} />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Submit Button */}
          <button type="submit" className="gradient-btn" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </div>
            ) : 'Send Reset Link'}
          </button>

          <div className="text-center text-gray-700">
            <p>
              Remember your password?{' '}
              <Link href="/login" className="text-pink-600 font-medium hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </AuthCard>
    </div>
  );
}