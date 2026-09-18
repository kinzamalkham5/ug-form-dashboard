import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Card } from '../../components/ui/Card.jsx';
import FormField, { inputClass } from '../../components/ui/FormField.jsx';
import { changePasswordSchema } from '../../utils/validators';
import { changePassword } from '../../services/auth.service';

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
      toast.success('Password updated.');
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update password.');
    }
  };

  return (
    <div className="max-w-md">
      <Card>
        <h2 className="mb-4 text-base font-semibold text-slate-800">Change Password</h2>
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
            className="mt-2 w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {isSubmitting ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </Card>
    </div>
  );
};

export default ChangePassword;
