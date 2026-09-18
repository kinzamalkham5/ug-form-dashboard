import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ShieldCheck } from 'lucide-react';
import { loginSchema } from '../utils/validators';
import { loginAdmin } from '../services/auth.service';
import { useAuth } from '../context/AuthContext.jsx';
import FormField, { inputClass } from '../components/ui/FormField.jsx';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    try {
      const res = await loginAdmin(data);
      login(res.token, 'admin', res.admin);
      toast.success(`Welcome back, ${res.admin.name}!`);
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-800 p-8 shadow-xl">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <div className="rounded-xl bg-brand-600 p-2.5 text-white">
            <ShieldCheck size={24} />
          </div>
          <h1 className="text-lg font-bold text-white">Admin Login</h1>
          <p className="text-sm text-slate-400">U/G Form Dashboard — Administration</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormField label={<span className="text-slate-200">Email</span>} error={errors.email?.message}>
            <input
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-900"
              type="email"
              {...register('email')}
              placeholder="admin@university.edu"
            />
          </FormField>
          <FormField label={<span className="text-slate-200">Password</span>} error={errors.password?.message}>
            <input
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-900"
              type="password"
              {...register('password')}
              placeholder="••••••••"
            />
          </FormField>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
          >
            {isSubmitting ? 'Signing in...' : 'Log In'}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-slate-500">
          <Link to="/login" className="hover:underline">
            Back to student login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
