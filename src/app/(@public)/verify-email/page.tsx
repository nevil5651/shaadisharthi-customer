'use client'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import AuthCard from '@/components/cards/AuthCard';
import { FaEnvelope } from 'react-icons/fa';
import Link from 'next/link';

const verifyEmailSchema = z.object({
  email: z.string().min(1, { message: 'Email is required.' }).email({ message: 'Invalid email address.' }),
});

type VerifyEmailFormInputs = z.infer<typeof verifyEmailSchema>;

export default function VerifyEmail() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<VerifyEmailFormInputs>({
    resolver: zodResolver(verifyEmailSchema),
  });

  const onSubmit = async (data: VerifyEmailFormInputs) => {
    setIsLoading(true);
    setApiError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error("API URL is not configured.");
      }

      await axios.post(`${apiUrl}/Customer/cstmr-verify-email`, data);
      setIsSent(true);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 409) {
          setApiError('Email already in use. Please log in or use a different email.');
        } else if (err.response.status === 429) {
          setApiError('Too many requests. Please try again later.');
        } else {
          setApiError(err.response.data.error || 'Failed to send verification email. Please try again.');
        }
      } else {
        setApiError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="auth-page">
        <AuthCard title="Verification Sent" subtitle="Check your inbox">
          <p className="text-center text-gray-700 mb-4">
            A verification link has been sent to your email. Please click the link to complete registration.
          </p>
          <p className="text-center text-gray-700">
            Already have an account?{' '}
            <Link href="/login" className="text-pink-600 font-medium hover:underline">
              Sign In
            </Link>
          </p>
        </AuthCard>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <AuthCard title="Verify Your Email" subtitle="Enter your email to get started">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {apiError && (
            <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
              {apiError}
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
            ) : 'Send Verification Link'}
          </button>

          <div className="text-center text-gray-700">
            <p>
              Already have an account?{' '}
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