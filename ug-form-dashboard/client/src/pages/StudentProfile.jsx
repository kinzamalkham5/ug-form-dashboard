import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { LayoutDashboard, User, FileText, ListChecks, KeyRound, Lock } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import { Card } from '../components/ui/Card.jsx';
import { Loader } from '../components/ui/Feedback.jsx';
import FormField, { inputClass } from '../components/ui/FormField.jsx';
import { getProfile, updateProfile } from '../services/student.service';
import { useAuth } from '../context/AuthContext.jsx';

const NAV_ITEMS = [
  { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/student/profile', label: 'My Profile', icon: User },
  { to: '/student/form', label: 'U/G Form', icon: FileText },
  { to: '/student/submissions', label: 'Submitted Forms', icon: ListChecks },
  { to: '/student/change-password', label: 'Change Password', icon: KeyRound },
];

const StudentProfile = () => {
  const { refresh } = useAuth();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    getProfile()
      .then((data) => {
        setStudent(data.student);
        reset(data.student);
      })
      .catch(() => toast.error('Could not load profile.'))
      .finally(() => setLoading(false));
  }, [reset]);

  const onSubmit = async (data) => {
    try {
      const res = await updateProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      });
      setStudent(res.student);
      await refresh();
      toast.success('Profile updated.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed.');
    }
  };

  return (
    <DashboardLayout navItems={NAV_ITEMS} title="My Profile">
      {loading ? (
        <Loader label="Loading profile..." />
      ) : (
        <div className="mx-auto max-w-2xl">
          <Card>
            <h3 className="mb-1 font-semibold text-slate-800">Editable Information</h3>
            <p className="mb-4 text-sm text-slate-500">
              You can update your name and phone number. CNIC and Student ID are locked for
              security.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
              <FormField label="First Name">
                <input className={inputClass} {...register('firstName')} />
              </FormField>
              <FormField label="Last Name">
                <input className={inputClass} {...register('lastName')} />
              </FormField>
              <FormField label="Phone">
                <input className={inputClass} {...register('phone')} />
              </FormField>
              <FormField label="Email">
                <input className={`${inputClass} bg-slate-50 text-slate-400`} value={student?.email || ''} disabled />
              </FormField>

              <div className="col-span-full mt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </Card>

          <Card className="mt-4">
            <div className="mb-3 flex items-center gap-2 text-slate-500">
              <Lock size={16} />
              <h3 className="font-semibold text-slate-700">Locked Information</h3>
            </div>
            <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-slate-400">CNIC</dt>
                <dd className="font-medium text-slate-700">{student?.cnic}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Student ID</dt>
                <dd className="font-medium text-slate-700">{student?.studentId}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Program</dt>
                <dd className="font-medium text-slate-700">{student?.program}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Current Semester</dt>
                <dd className="font-medium text-slate-700">Semester {student?.semester}</dd>
              </div>
            </dl>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
};

export default StudentProfile;
