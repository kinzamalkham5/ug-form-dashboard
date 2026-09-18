import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { GraduationCap } from 'lucide-react';
import { registerSchema } from '../utils/validators';
import { registerStudent } from '../services/auth.service';
import FormField, { inputClass } from '../components/ui/FormField.jsx';

const PROGRAMS = ['BS Computer Science', 'BS Software Engineering', 'BS Information Technology'];

const Register = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data) => {
    try {
      const { confirmPassword, ...payload } = data;
      await registerStudent(payload);
      toast.success('Registration successful. Please log in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-2">
          <div className="rounded-xl bg-brand-600 p-2 text-white">
            <GraduationCap size={22} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">Student Registration</h1>
            <p className="text-sm text-slate-500">University of Faisalabad U/G Form Dashboard</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
          <FormField label="First Name" error={errors.firstName?.message}>
            <input className={inputClass} {...register('firstName')} placeholder="John" />
          </FormField>
          <FormField label="Last Name" error={errors.lastName?.message}>
            <input className={inputClass} {...register('lastName')} placeholder="Doe" />
          </FormField>

          <FormField label="CNIC" error={errors.cnic?.message}>
            <input className={inputClass} {...register('cnic')} placeholder="12345-1234567-1" />
          </FormField>
          <FormField label="Phone Number" error={errors.phone?.message}>
            <input className={inputClass} {...register('phone')} placeholder="03001234567" />
          </FormField>

          <FormField label="Email" error={errors.email?.message}>
            <input className={inputClass} type="email" {...register('email')} placeholder="john@example.com" />
          </FormField>
          <FormField label="Student ID / Registration Number" error={errors.studentId?.message}>
            <input className={inputClass} {...register('studentId')} placeholder="UAF-12345" />
          </FormField>

          <FormField label="Program" error={errors.program?.message}>
            <select className={inputClass} {...register('program')} defaultValue="">
              <option value="" disabled>
                Select program
              </option>
              {PROGRAMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Current Semester" error={errors.semester?.message}>
            <select className={inputClass} {...register('semester')} defaultValue="">
              <option value="" disabled>
                Select semester
              </option>
              {Array.from({ length: 8 }, (_, i) => i + 1).map((s) => (
                <option key={s} value={s}>
                  Semester {s}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Password" error={errors.password?.message}>
            <input className={inputClass} type="password" {...register('password')} placeholder="••••••••" />
          </FormField>
          <FormField label="Confirm Password" error={errors.confirmPassword?.message}>
            <input
              className={inputClass}
              type="password"
              {...register('confirmPassword')}
              placeholder="••••••••"
            />
          </FormField>

          <div className="col-span-full mt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
            >
              {isSubmitting ? 'Creating account...' : 'Register'}
            </button>
            <p className="mt-4 text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-brand-600 hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
