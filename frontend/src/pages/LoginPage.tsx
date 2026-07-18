// src/pages/LoginPage.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Split-panel login page with maroon left panel and clean white form on right.

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Eye, EyeOff } from 'lucide-react';
import { login } from '../services/authService';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setSession } = useAuth();

  const [studentId, setStudentId] = useState('');
  const [password,  setPassword]  = useState('');
  const [showPwd,   setShowPwd]   = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await login({ student_id: studentId, password });
      setSession(response);
      navigate(response.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { detail?: string } } }).response?.data?.detail
          : undefined;
      setError(message ?? 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel — brand */}
      <div className="flex-col justify-between hidden w-2/5 px-12 py-10 lg:flex bg-maroon-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-md h-9 w-9 bg-gold-400">
            <BookOpen className="w-5 h-5 text-maroon-900" />
          </div>
          <div>
            <p className="text-base font-bold leading-none text-white">College Portal</p>
            <p className="text-xs text-maroon-200 mt-0.5">Information & AI Assistant</p>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold leading-tight text-white">
            Your personalized
            <br />
            college hub.
          </h1>
          <p className="max-w-xs mt-4 text-sm leading-relaxed text-maroon-200">
            Stay on top of exams, events, and announcements — filtered specifically for your department and year.
          </p>

          <div className="mt-10 space-y-3">
            {[
              'Personalized event feed by dept & year',
              'AI assistant with verified college data',
              'Real-time exam & workshop updates',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2.5 text-sm text-maroon-100">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-400 flex-shrink-0" />
                {feature}
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-maroon-300">
          © {new Date().getFullYear()} College Portal. Internal system.
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex items-center justify-center flex-1 px-6 py-12 bg-white">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-maroon-800">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <p className="text-sm font-semibold text-gray-900">College Portal</p>
          </div>

          <h2 className="mb-1 text-xl font-semibold text-gray-900">Sign in</h2>
          <p className="mb-6 text-sm text-gray-500">Use your student ID and portal password.</p>

          {/* Error */}
          {error && (
            <div className="p-3 mb-4 text-sm text-red-700 border border-red-200 rounded-md bg-red-50 animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Student ID */}
            <div>
              <label htmlFor="student-id" className="block mb-1 text-xs font-medium text-gray-700">
                Student ID / Username
              </label>
              <input
                id="student-id"
                type="text"
                required
                autoComplete="username"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="e.g. CS2024001 or admin001"
                className="input-field"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="block mb-1 text-xs font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPwd ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pr-10 input-field"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 transition-colors hover:text-gray-600"
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full mt-2 btn-primary">
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-4 text-sm text-center text-gray-500">
            Don&apos;t have an account?{' '}
            <Link
              to="/signup"
              className="font-medium text-maroon-800 hover:underline"
            >
              Sign up
            </Link>
          </p>

          {/* Demo hint */}
          <div className="p-3 mt-6 border border-gray-200 rounded-md bg-gray-50">
            <p className="mb-1 text-xs font-medium text-gray-600">Demo credentials</p>
            <div className="space-y-1 font-mono text-xs text-gray-500">
              <p>Student: CS2024001 / student123</p>
              <p>Admin: &nbsp; admin001 &nbsp; / admin@portal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
