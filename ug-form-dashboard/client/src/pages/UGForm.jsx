import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  LayoutDashboard,
  User,
  FileText,
  ListChecks,
  KeyRound,
  Check,
  UploadCloud,
  X,
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import { Card } from '../components/ui/Card.jsx';
import { Loader, EmptyState } from '../components/ui/Feedback.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getCourses } from '../services/course.service';
import { createSubmission } from '../services/submission.service';

const NAV_ITEMS = [
  { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/student/profile', label: 'My Profile', icon: User },
  { to: '/student/form', label: 'U/G Form', icon: FileText },
  { to: '/student/submissions', label: 'Submitted Forms', icon: ListChecks },
  { to: '/student/change-password', label: 'Change Password', icon: KeyRound },
];

const STEPS = ['Semester', 'Courses', 'Voucher', 'Review & Submit'];
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024;

const UGForm = () => {
  const { user } = useAuth();
  const student = user?.student;
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [semester, setSemester] = useState(student?.semester || 1);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [voucher, setVoucher] = useState(null);
  const [voucherPreview, setVoucherPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (step !== 1) return;
    setLoadingCourses(true);
    setSelectedIds([]);
    getCourses({ program: student?.program, semester })
      .then((data) => setCourses(data.courses))
      .catch(() => toast.error('Could not load courses.'))
      .finally(() => setLoadingCourses(false));
  }, [step, semester, student?.program]);

  const toggleCourse = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  };

  const selectedCourses = courses.filter((c) => selectedIds.includes(c._id));
  const totalCreditHours = selectedCourses.reduce((sum, c) => sum + c.creditHours, 0);

  const handleFile = (file) => {
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('Voucher image must be JPG, PNG, JPEG or WEBP.');
      return;
    }
    if (file.size > MAX_SIZE) {
      toast.error('File size must be less than 5MB.');
      return;
    }
    setVoucher(file);
    setVoucherPreview(URL.createObjectURL(file));
  };

  const canNext = () => {
    if (step === 0) return !!semester;
    if (step === 1) return selectedIds.length > 0;
    if (step === 2) return !!voucher;
    return true;
  };

  const goNext = () => {
    if (!canNext()) {
      if (step === 1) toast.error('Please select at least one course.');
      if (step === 2) toast.error('Please upload your voucher.');
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('semester', semester);
      formData.append('courseIds', JSON.stringify(selectedIds));
      formData.append('voucher', voucher);
      await createSubmission(formData);
      toast.success('Form submitted successfully.');
      navigate('/student/submissions');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout navItems={NAV_ITEMS} title="U/G Form">
      <div className="mx-auto max-w-3xl">
        {/* Progress indicator */}
        <div className="mb-6 flex items-center">
          {STEPS.map((label, i) => (
            <React.Fragment key={label}>
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                    i < step
                      ? 'bg-brand-600 text-white'
                      : i === step
                      ? 'border-2 border-brand-600 text-brand-600'
                      : 'border-2 border-slate-200 text-slate-400'
                  }`}
                >
                  {i < step ? <Check size={16} /> : i + 1}
                </div>
                <span
                  className={`text-xs font-medium ${i <= step ? 'text-brand-700' : 'text-slate-400'}`}
                >
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`mx-2 h-0.5 flex-1 ${i < step ? 'bg-brand-600' : 'bg-slate-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <Card>
          {step === 0 && (
            <div>
              <h3 className="mb-1 font-semibold text-slate-800">Select Semester</h3>
              <p className="mb-4 text-sm text-slate-500">
                Choose the semester you're submitting courses for.
              </p>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                {Array.from({ length: 8 }, (_, i) => i + 1).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSemester(s)}
                    className={`rounded-lg border py-3 text-sm font-semibold transition-colors ${
                      semester === s
                        ? 'border-brand-600 bg-brand-50 text-brand-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h3 className="mb-1 font-semibold text-slate-800">Select Courses — Semester {semester}</h3>
              <p className="mb-4 text-sm text-slate-500">{student?.program}</p>
              {loadingCourses ? (
                <Loader label="Loading courses..." />
              ) : courses.length === 0 ? (
                <EmptyState
                  title="No courses found"
                  subtitle="No courses have been added yet for this semester/program. Contact admin."
                />
              ) : (
                <div className="space-y-2">
                  {courses.map((c) => (
                    <label
                      key={c._id}
                      className={`flex cursor-pointer items-center justify-between rounded-lg border px-4 py-3 text-sm transition-colors ${
                        selectedIds.includes(c._id)
                          ? 'border-brand-500 bg-brand-50'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(c._id)}
                          onChange={() => toggleCourse(c._id)}
                          className="h-4 w-4 accent-brand-600"
                        />
                        <div>
                          <p className="font-medium text-slate-800">
                            {c.courseCode} — {c.courseName}
                          </p>
                        </div>
                      </div>
                      <span className="font-medium text-slate-500">{c.creditHours} CH</span>
                    </label>
                  ))}
                </div>
              )}
              {selectedIds.length > 0 && (
                <p className="mt-3 text-sm font-medium text-slate-600">
                  {selectedIds.length} course(s) selected &middot; {totalCreditHours} total credit hours
                </p>
              )}
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="mb-1 font-semibold text-slate-800">Upload Voucher</h3>
              <p className="mb-4 text-sm text-slate-500">
                Upload a clear picture of your fee voucher (JPG, PNG or WEBP, max 5MB).
              </p>

              {!voucherPreview ? (
                <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-12 text-center hover:border-brand-400">
                  <UploadCloud className="text-slate-400" size={32} />
                  <span className="text-sm font-medium text-slate-600">Click to upload voucher image</span>
                  <span className="text-xs text-slate-400">JPG, PNG, WEBP up to 5MB</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0])}
                  />
                </label>
              ) : (
                <div className="relative inline-block">
                  <img src={voucherPreview} alt="Voucher preview" className="max-h-80 rounded-xl border border-slate-200" />
                  <button
                    onClick={() => {
                      setVoucher(null);
                      setVoucherPreview(null);
                    }}
                    className="absolute -right-3 -top-3 rounded-full bg-white p-1.5 text-slate-500 shadow ring-1 ring-slate-200 hover:text-rose-600"
                  >
                    <X size={16} />
                  </button>
                  <label className="mt-3 block cursor-pointer text-center text-sm font-medium text-brand-600 hover:underline">
                    Replace image
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => handleFile(e.target.files?.[0])}
                    />
                  </label>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="mb-4 font-semibold text-slate-800">Review &amp; Submit</h3>
              <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-slate-400">Student</dt>
                  <dd className="font-medium text-slate-700">
                    {student?.firstName} {student?.lastName}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400">Student ID</dt>
                  <dd className="font-medium text-slate-700">{student?.studentId}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Semester</dt>
                  <dd className="font-medium text-slate-700">{semester}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Selected Courses</dt>
                  <dd className="font-medium text-slate-700">{selectedIds.length}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Total Credit Hours</dt>
                  <dd className="font-medium text-slate-700">{totalCreditHours}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Voucher</dt>
                  <dd className="font-medium text-slate-700">{voucher?.name}</dd>
                </div>
              </dl>

              <div className="mt-4">
                <p className="mb-2 text-sm font-medium text-slate-600">Courses</p>
                <ul className="space-y-1 text-sm text-slate-600">
                  {selectedCourses.map((c) => (
                    <li key={c._id}>
                      {c.courseCode} — {c.courseName} ({c.creditHours} CH)
                    </li>
                  ))}
                </ul>
              </div>

              {voucherPreview && (
                <img
                  src={voucherPreview}
                  alt="Voucher"
                  className="mt-4 max-h-56 rounded-xl border border-slate-200"
                />
              )}
            </div>
          )}

          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
            <button
              onClick={goBack}
              disabled={step === 0}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              Back
            </button>
            {step < STEPS.length - 1 ? (
              <button
                onClick={goNext}
                className="rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
              >
                {submitting ? 'Submitting...' : 'Confirm & Submit'}
              </button>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default UGForm;
