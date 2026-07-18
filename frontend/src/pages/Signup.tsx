// src/pages/SignupPage.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Signup page at /signup.
// Collects: ID, full name, department, year (students only), role, password.
// POSTs { student_id, full_name, department, year, role, password } to
// POST /api/auth/signup and redirects to /login on success.

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Eye, EyeOff, GraduationCap, ShieldCheck } from 'lucide-react';
import { signup } from '../services/authService';

type Role = 'student' | 'admin';

const DEPARTMENTS = [
  'Computer Science',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering',
  'Electronics & Communication',
  'Information Technology',
  'Other',
];

interface FormState {
  student_id: string;
  full_name: string;
  department: string;
  year: string;         // kept as string in the form, converted to number on submit
  role: Role;
  password: string;
  confirm_password: string;
}

const BLANK: FormState = {
  student_id: '',
  full_name: '',
  department: '',
  year: '1',
  role: 'student',
  password: '',
  confirm_password: '',
};

export default function SignupPage() {
  const navigate = useNavigate();

  const [form,      setForm]      = useState<FormState>(BLANK);
  const [showPwd,   setShowPwd]   = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const [success,   setSuccess]   = useState(false);

  const isStudent = form.role === 'student';

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const setRole = (role: Role) => {
    setForm((prev) => ({ ...prev, role }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirm_password) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      await signup({
        student_id:  form.student_id.trim(),
        full_name:   form.full_name.trim(),
        department:  form.department,
        year:        isStudent ? parseInt(form.year, 10) : null,
        role:        form.role,
        password:    form.password,
      });
      setSuccess(true);
      // Redirect to login after a brief success message
      setTimeout(() => navigate('/login', { replace: true }), 1800);
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { detail?: string } } }).response?.data?.detail
          : undefined;
      setError(message ?? 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* ── Left brand panel ─────────────────────────────────────────────── */}
      <div className="flex-col justify-between hidden w-2/5 px-12 py-10 lg:flex bg-maroon-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-md h-9 w-9 bg-gold-400">
            <BookOpen className="w-5 h-5 text-maroon-900" />
          </div>
          <div>
            <p className="text-base font-bold leading-none text-white">College Portal</p>
            <p className="text-xs text-maroon-200 mt-0.5">Create your account</p>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold leading-tight text-white">
            Join your college
            <br />
            information hub.
          </h1>
          <p className="max-w-xs mt-4 text-sm leading-relaxed text-maroon-200">
            Register once and get a personalized feed of exams, events, and announcements — filtered for your department and year.
          </p>

          <div className="mt-10 space-y-3">
            {[
              'Personalized event feed by dept & year',
              'AI assistant with verified college data',
              'Real-time exam & workshop alerts',
            ].map((f) => (
              <div key={f} className="flex items-center gap-2.5 text-sm text-maroon-100">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-400 flex-shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-maroon-300">
          © {new Date().getFullYear()} College Portal. Internal system.
        </p>
      </div>

      {/* ── Right form panel ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-center flex-1 px-6 py-10 overflow-y-auto bg-white">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-maroon-800">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <p className="text-sm font-semibold text-gray-900">College Portal</p>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-0.5">Create account</h2>
          <p className="mb-5 text-sm text-gray-500">
            Already registered?{' '}
            <Link to="/login" className="font-medium text-maroon-800 hover:underline">
              Sign in
            </Link>
          </p>

          {/* Success state */}
          {success && (
            <div className="p-3 mb-4 text-sm text-green-700 border border-green-200 rounded-md bg-green-50 animate-fade-in">
              ✓ Account created successfully! Redirecting to login...
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="p-3 mb-4 text-sm text-red-700 border border-red-200 rounded-md bg-red-50 animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* ── Role toggle ──────────────────────────────────────────── */}
            <div>
              <p className="block text-xs font-medium text-gray-700 mb-1.5">
                I am registering as
              </p>
              <div className="flex overflow-hidden border border-gray-200 rounded-md">
                <button
                  type="button"
                  id="role-student"
                  onClick={() => setRole('student')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors
                    ${isStudent
                      ? 'bg-maroon-800 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  Student
                </button>
                <button
                  type="button"
                  id="role-admin"
                  onClick={() => setRole('admin')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors border-l border-gray-200
                    ${!isStudent
                      ? 'bg-maroon-800 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  Faculty / Admin
                </button>
              </div>
            </div>

            {/* ── ID ───────────────────────────────────────────────────── */}
            <div>
              <label htmlFor="signup-student-id" className="block mb-1 text-xs font-medium text-gray-700">
                {isStudent ? 'Student ID' : 'Employee / Staff ID'}
                <span className="text-red-500 ml-0.5">*</span>
              </label>
              <input
                id="signup-student-id"
                name="student_id"
                type="text"
                required
                autoComplete="username"
                value={form.student_id}
                onChange={handleChange}
                placeholder={isStudent ? 'e.g. CS2024001' : 'e.g. FAC2024001'}
                className="input-field"
              />
            </div>

            {/* ── Full Name ─────────────────────────────────────────────── */}
            <div>
              <label htmlFor="signup-full-name" className="block mb-1 text-xs font-medium text-gray-700">
                Full Name<span className="text-red-500 ml-0.5">*</span>
              </label>
              <input
                id="signup-full-name"
                name="full_name"
                type="text"
                required
                autoComplete="name"
                value={form.full_name}
                onChange={handleChange}
                placeholder="e.g. Arjun Mehta"
                className="input-field"
              />
            </div>

            {/* ── Department ────────────────────────────────────────────── */}
            <div>
              <label htmlFor="signup-department" className="block mb-1 text-xs font-medium text-gray-700">
                Department<span className="text-red-500 ml-0.5">*</span>
              </label>
              <select
                id="signup-department"
                name="department"
                required
                value={form.department}
                onChange={handleChange}
                className="input-field"
              >
                <option value="" disabled>Select your department</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* ── Year (students only) ──────────────────────────────────── */}
            {isStudent && (
              <div className="animate-fade-in">
                <label htmlFor="signup-year" className="block mb-1 text-xs font-medium text-gray-700">
                  Academic Year<span className="text-red-500 ml-0.5">*</span>
                </label>
                <select
                  id="signup-year"
                  name="year"
                  required
                  value={form.year}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="1">Year 1 (First Year)</option>
                  <option value="2">Year 2 (Second Year)</option>
                  <option value="3">Year 3 (Third Year)</option>
                  <option value="4">Year 4 (Final Year)</option>
                </select>
              </div>
            )}

            {/* ── Password ──────────────────────────────────────────────── */}
            <div>
              <label htmlFor="signup-password" className="block mb-1 text-xs font-medium text-gray-700">
                Password<span className="text-red-500 ml-0.5">*</span>
              </label>
              <div className="relative">
                <input
                  id="signup-password"
                  name="password"
                  type={showPwd ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
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

            {/* ── Confirm Password ──────────────────────────────────────── */}
            <div>
              <label htmlFor="signup-confirm-password" className="block mb-1 text-xs font-medium text-gray-700">
                Confirm Password<span className="text-red-500 ml-0.5">*</span>
              </label>
              <input
                id="signup-confirm-password"
                name="confirm_password"
                type={showPwd ? 'text' : 'password'}
                required
                autoComplete="new-password"
                value={form.confirm_password}
                onChange={handleChange}
                placeholder="Re-enter password"
                className="input-field"
              />
            </div>

            {/* ── Submit ────────────────────────────────────────────────── */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={isLoading || success}
                className="w-full btn-primary"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>
            </div>
          </form>

          <p className="mt-5 text-xs text-center text-gray-400">
            Your account will need admin approval before you can log in.
          </p>
        </div>
      </div>
    </div>
  );
}
