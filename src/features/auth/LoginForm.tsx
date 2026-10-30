import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Lock, Mail, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { DEMO_CREDENTIALS } from '../../services/authService';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setFormError(null);
    try {
      await login(data.email, data.password);
      // Redirect to the originally intended destination or default to dashboard /
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError('An unexpected error occurred during sign in.');
      }
    }
  };

  const handleFillDemo = () => {
    setValue('email', DEMO_CREDENTIALS.email, { shouldValidate: true });
    setValue('password', DEMO_CREDENTIALS.password, { shouldValidate: true });
    setFormError(null);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Brand Header */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 mb-3">
          <svg
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Sign in to Team Task Tracker
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Team Task Tracker & Collaboration Workspace
        </p>
      </div>

      {/* Form Error Banner */}
      {formError && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-sm animate-fadeIn"
        >
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="flex-1 font-medium">{formError}</div>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          label="Email Address"
          type="email"
          autoComplete="email"
          placeholder="name@axionix.dev"
          required
          leftIcon={<Mail className="w-4 h-4" aria-hidden="true" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          placeholder="••••••••"
          required
          leftIcon={<Lock className="w-4 h-4" aria-hidden="true" />}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="p-1 text-slate-400 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" aria-hidden="true" />
              ) : (
                <Eye className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
          }
          error={errors.password?.message}
          {...register('password')}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2 font-semibold"
          isLoading={isSubmitting}
          rightIcon={<ArrowRight className="w-4 h-4" aria-hidden="true" />}
        >
          {isSubmitting ? 'Signing in...' : 'Sign in to workspace'}
        </Button>
      </form>

      {/* Demo Credentials Box */}
      <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50/70 p-4 text-xs text-indigo-950">
        <div className="flex items-center justify-between font-semibold mb-2 text-indigo-900">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-600" aria-hidden="true" />
            <span>Demo Reviewer Credentials</span>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-1"
          >
            Auto-fill
          </button>
        </div>
        <div className="space-y-1 font-mono text-slate-700 bg-white/80 p-2.5 rounded-lg border border-indigo-100/60">
          <div className="flex justify-between">
            <span className="text-slate-400">Email:</span>
            <span className="font-semibold">{DEMO_CREDENTIALS.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Password:</span>
            <span className="font-semibold">{DEMO_CREDENTIALS.password}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
