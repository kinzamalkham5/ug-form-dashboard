import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { LayoutDashboard, User, FileText, ListChecks, KeyRound } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import { Card } from '../components/ui/Card.jsx';
import FormField, { inputClass } from '../components/ui/FormField.jsx';
import { changePasswordSchema } from '../utils/validators';
import { changePassword } from '../services/auth.service';

const NAV_ITEMS = [
  { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/student/profile', label: 'My Profile', icon: User },
  { to: '/student/form', label: 'U/G Form', icon: FileText },
  { to: '/student/submissions', label: 'Submitted Forms', icon: ListChecks },
  { to: '/student/change-password', label: 'Change Password', icon: KeyRound },
];

const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(changePasswordSchema) });

  const onSubmit = async (data) => {
    try {
      await changePassword(data);
      toast.success('Password updated successfully.');
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update password.');
    }
  };

  return (
    <DashboardLayout navItems={NAV_ITEMS} title="Change Password">
      <div className="mx-auto max-w-md">
        <Card>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormField label="Current Password" error={errors.currentPassword?.message}>
              <input className={inputClass} type="password" {...register('currentPassword')} />
            </FormField>
            <FormField label="New Password" error={errors.newPassword?.message}>
              <input className={inputClass} type="password" {...register('newPassword')} />
            </FormField>
            <FormField label="Confirm New Password" error={errors.confirmNewPassword?.message}>
              <input className={inputClass} type="password" {...register('confirmNewPassword')} />
            </FormField>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
            >
              {isSubmitting ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ChangePassword;
