import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Card } from '../../components/ui/Card.jsx';
import FormField, { inputClass } from '../../components/ui/FormField.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { updateProfile } from '../../services/student.service';

const Profile = () => {
  const { user, refresh } = useAuth();
  const student = user?.student;
  const [form, setForm] = useState({
    firstName: student?.firstName || '',
    lastName: student?.lastName || '',
    phone: student?.phone || '',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(form);
      toast.success('Profile updated.');
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <Card>
        <h2 className="mb-4 text-base font-semibold text-slate-800">My Profile</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
          <FormField label="First Name">
            <input className={inputClass} name="firstName" value={form.firstName} onChange={handleChange} />
          </FormField>
          <FormField label="Last Name">
            <input className={inputClass} name="lastName" value={form.lastName} onChange={handleChange} />
          </FormField>
          <FormField label="Phone">
            <input className={inputClass} name="phone" value={form.phone} onChange={handleChange} />
          </FormField>
          <FormField label="Email (locked)">
            <input className={`${inputClass} bg-slate-50 text-slate-400`} value={student?.email} disabled />
          </FormField>
          <FormField label="CNIC (locked)">
            <input className={`${inputClass} bg-slate-50 text-slate-400`} value={student?.cnic} disabled />
          </FormField>
          <FormField label="Student ID (locked)">
            <input className={`${inputClass} bg-slate-50 text-slate-400`} value={student?.studentId} disabled />
          </FormField>
          <FormField label="Program">
            <input className={`${inputClass} bg-slate-50 text-slate-400`} value={student?.program} disabled />
          </FormField>
          <FormField label="Current Semester">
            <input className={`${inputClass} bg-slate-50 text-slate-400`} value={student?.semester} disabled />
          </FormField>

          <div className="col-span-full mt-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <p className="mt-3 text-xs text-slate-400">
              CNIC and Student ID cannot be changed here. Contact admin if these need correction.
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Profile;
