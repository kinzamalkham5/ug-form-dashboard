import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { GraduationCap } from 'lucide-react';
import { loginSchema } from '../utils/validators';
import { loginStudent } from '../services/auth.service';
import { useAuth } from '../context/AuthContext.jsx';
import FormField, { inputClass } from '../components/ui/FormField.jsx';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    try {
      const res = await loginStudent(data);
      login(res.token, 'student', res.student);
      toast.success(`Welcome back, ${res.student.firstName}!`);
      navigate('/student/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <div className="rounded-xl bg-brand-600 p-2.5 text-white">
            <GraduationCap size={24} />
          </div>
          <h1 className="text-lg font-bold text-slate-800">Student Login</h1>
          <p className="text-sm text-slate-500">University of Faisalabad U/G Form Dashboard</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormField label="Email" error={errors.email?.message}>
            <input className={inputClass} type="email" {...register('email')} placeholder="you@example.com" />
          </FormField>
          <FormField label="Password" error={errors.password?.message}>
            <input className={inputClass} type="password" {...register('password')} placeholder="••••••••" />
          </FormField>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
          >
            {isSubmitting ? 'Signing in...' : 'Log In'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-brand-600 hover:underline">
            Register
          </Link>
        </p>
        <p className="mt-2 text-center text-xs text-slate-400">
          Administrator?{' '}
          <Link to="/admin/login" className="text-slate-500 hover:underline">
            Admin login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
