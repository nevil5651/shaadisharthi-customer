'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { toast } from 'react-toastify';
import AuthCard from '@/components/cards/AuthCard';
import { FaUser, FaEnvelope, FaPhone, FaPhoneAlt, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import SocialLogin from '@/components/ui/SocialLogin';

// Updated validation schema with token (optional for now)
export const registerSchema = z.object({
  name: z.string().min(1, { message: 'Full name is required.' }),
  email: z.string().min(1, { message: 'Email is required.' }).email({ message: 'Invalid email address.' }),
  phone: z.string().length(10, { message: 'Phone number must be 10 digits.' }).regex(/^\d+$/, { message: 'Invalid phone number.' }),
  altPhone: z.string().length(10, { message: 'Alternate phone must be 10 digits.' }).regex(/^\d+$/, { message: 'Invalid phone number.' }).optional().or(z.literal('')),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  confirmPassword: z.string().min(6, { message: 'Please confirm your password.' }),
  termsAccepted: z.boolean().refine(val => val === true, { message: 'You must accept the Terms & Conditions.' }),
  token: z.string().min(1, { message: 'Verification token is required.' }).optional(), // Make required in Zod if strictly enforcing
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type RegisterFormInputs = z.infer<typeof registerSchema>;

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [isVerified, setIsVerified] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    if (!token) {
      router.push('/verify-email');
      return;
    }

    const verifyToken = async () => {
      setIsLoading(true);
      setApiError(null);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await axios.get(`${apiUrl}/Customer/cstmr-email-verification?token=${token}`);
        if (response.data.email) {
          setValue('email', response.data.email);
          setValue('token', token);
          setIsVerified(true);
        } else {
          throw new Error('Invalid response');
        }
      } catch (err) {
        setApiError('Invalid or expired verification token. Redirecting...');
        setTimeout(() => router.push('/verify-email'), 3000);
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token, router, setValue]);

  const onSubmit = async (data: RegisterFormInputs) => {
    setIsLoading(true);
    setApiError(null);
    const toastId = toast.loading("Creating your account...");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error("API URL is not configured.");
      }

      const { confirmPassword, termsAccepted, ...payload } = data;

      await axios.post(`${apiUrl}/Customer/cstmr-rgt`, payload);

      toast.update(toastId, {
        render: 'Registration successful! Redirecting to login...',
        type: 'success',
        isLoading: false,
        autoClose: 2000,
      });

      // Redirect after a short delay to allow the user to see the toast.
      // The form remains disabled via the `isLoading` state.
      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (err) {
      console.error('Registration failed:', err);
      let errorMessage = 'An unexpected error occurred.';
      if (axios.isAxiosError(err) && err.response) {
        errorMessage = err.response.data.error || 'Registration failed. Please try again.';
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setApiError(errorMessage);
      toast.update(toastId, { render: errorMessage, type: 'error', isLoading: false, autoClose: 5000 });
      // Only re-enable the form on failure
      setIsLoading(false);
    }
  };

  if (!isVerified && token) {
    return (
      <div className="auth-page">
        <AuthCard title="Verifying..." subtitle="Please wait while we verify your email">
          {apiError && <p className="text-red-500 text-center">{apiError}</p>}
        </AuthCard>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <AuthCard title="Create Your Account" subtitle="Join us to begin your journey">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {apiError && (
            <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
              {apiError}
            </div>
          )}

          {/* Hidden Token Field */}
          <input type="hidden" {...register('token')} />

          {/* Name Field */}
          <div>
            <div className="relative">
              <div className="input-icon"><FaUser /></div>
              <input type="text" {...register('name')} placeholder="Full Name" className="form-input" disabled={isLoading} />
            </div>
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* Email Field (prefilled and disabled if verified) */}
          <div>
            <div className="relative">
              <div className="input-icon"><FaEnvelope /></div>
              <input
                type="email"
                {...register('email')}
                placeholder="Email Address"
                className="form-input bg-gray-100 cursor-not-allowed"
                disabled={isVerified || isLoading}
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Phone Field */}
          <div>
            <div className="relative">
              <div className="input-icon"><FaPhone /></div>
              <input type="tel" {...register('phone')} placeholder="Phone Number" className="form-input" disabled={isLoading} />
            </div>
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
          </div>

          {/* Alternate Phone Field */}
          <div>
            <div className="relative">
              <div className="input-icon"><FaPhoneAlt /></div>
              <input type="tel" {...register('altPhone')} placeholder="Alternate Phone Number (Optional)" className="form-input" disabled={isLoading} />
            </div>
            {errors.altPhone && <p className="text-red-500 text-sm mt-1">{errors.altPhone.message}</p>}
          </div>

          {/* Password Field */}
          <div>
            <div className="relative">
              <div className="input-icon"><FaLock /></div>
              <input type={showPassword ? "text" : "password"} {...register('password')} placeholder="Password" className="form-input" disabled={isLoading} />
              <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Confirm Password Field */}
          <div>
            <div className="relative">
              <div className="input-icon"><FaLock /></div>
              <input type={showConfirmPassword ? "text" : "password"} {...register('confirmPassword')} placeholder="Confirm Password" className="form-input" disabled={isLoading} />
              <button type="button" className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start mb-6">
            <div className="flex items-center h-5">
              <input
                id="terms"
                type="checkbox"
                {...register('termsAccepted')}
                className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                disabled={isLoading}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="text-gray-700">
                I agree to the{' '}
                <Link href="/terms" className="text-pink-600 hover:underline">
                  Terms & Conditions
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-pink-600 hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>
          </div>
          {errors.termsAccepted && <p className="text-red-500 text-sm -mt-4 mb-4">{errors.termsAccepted.message}</p>}

          {/* Submit Button */}
          <button type="submit" className="gradient-btn" disabled={isLoading || isSubmitting}>
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registering...
              </div>
            ) : 'Register Now'}
          </button>

          <SocialLogin />
          
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
};