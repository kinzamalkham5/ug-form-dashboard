import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Upload, Check } from 'lucide-react';
import { Card } from '../../components/ui/Card.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { getCourses } from '../../services/course.service';
import { createSubmission } from '../../services/submission.service';

const STEPS = ['Semester', 'Courses', 'Voucher', 'Review & Submit'];
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024;

const StepIndicator = ({ step }) => (
  <div className="mb-6 flex items-center">
    {STEPS.map((label, i) => (
      <React.Fragment key={label}>
        <div className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
              i <= step ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-400'
            }`}
          >
            {i < step ? <Check size={16} /> : i + 1}
          </div>
          <span className={`hidden text-sm sm:inline ${i <= step ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
            {label}
          </span>
        </div>
        {i < STEPS.length - 1 && <div className="mx-2 h-px flex-1 bg-slate-200 sm:mx-3" />}
      </React.Fragment>
    ))}
  </div>
);

const UGForm = () => {
  const { user } = useAuth();
  const student = user?.student;
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [semester, setSemester] = useState(student?.semester || '');
  const [courses, setCourses] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [voucher, setVoucher] = useState(null);
  const [voucherPreview, setVoucherPreview] = useState(null);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!semester) return;
    setLoadingCourses(true);
    getCourses({ program: student?.program, semester })
      .then((res) => setCourses(res.courses))
      .finally(() => setLoadingCourses(false));
  }, [semester]);

  const selectedCourses = courses.filter((c) => selectedIds.includes(c._id));
  const totalCreditHours = selectedCourses.reduce((sum, c) => sum + c.creditHours, 0);

  const toggleCourse = (id) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

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
    <div className="max-w-3xl">
      <Card>
        <StepIndicator step={step} />

        {step === 0 && (
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-700">Select Semester</h3>
            <select
              className="w-full max-w-xs rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              value={semester}
              onChange={(e) => {
                setSemester(e.target.value);
                setSelectedIds([]);
              }}
            >
              <option value="" disabled>
                Choose semester
              </option>
              {Array.from({ length: 8 }, (_, i) => i + 1).map((s) => (
                <option key={s} value={s}>
                  Semester {s}
                </option>
              ))}
            </select>
          </div>
        )}

        {step === 1 && (
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-700">
              Select Courses — Semester {semester}
            </h3>
            {loadingCourses ? (
              <p className="text-sm text-slate-400">Loading courses...</p>
            ) : courses.length === 0 ? (
              <p className="text-sm text-slate-400">No courses found for this semester/program yet.</p>
            ) : (
              <div className="space-y-2">
                {courses.map((c) => (
                  <label
                    key={c._id}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-sm transition-colors ${
                      selectedIds.includes(c._id)
                        ? 'border-brand-400 bg-brand-50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(c._id)}
                        onChange={() => toggleCourse(c._id)}
                        className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                      />
                      <span>
                        <span className="font-semibold text-slate-700">{c.courseCode}</span>{' '}
                        <span className="text-slate-600">— {c.courseName}</span>
                      </span>
                    </div>
                    <span className="text-slate-400">{c.creditHours} CH</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-700">Upload Fee Voucher</h3>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-10 text-slate-400 hover:border-brand-400 hover:text-brand-500">
              <Upload size={26} />
              <span className="text-sm">Click to upload (JPG, PNG, WEBP — max 5MB)</span>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </label>
            {voucherPreview && (
              <div className="mt-4">
                <p className="mb-2 text-xs font-medium text-slate-500">Preview:</p>
                <img src={voucherPreview} alt="Voucher preview" className="max-h-64 rounded-lg border border-slate-200" />
                <button
                  type="button"
                  onClick={() => {
                    setVoucher(null);
                    setVoucherPreview(null);
                  }}
                  className="mt-2 text-xs font-medium text-rose-600 hover:underline"
                >
                  Remove and choose another
                </button>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-700">Review & Submit</h3>
            <div className="space-y-2 rounded-xl bg-slate-50 p-4 text-sm">
              <p><span className="text-slate-400">Student:</span> {student?.firstName} {student?.lastName}</p>
              <p><span className="text-slate-400">Student ID:</span> {student?.studentId}</p>
              <p><span className="text-slate-400">Semester:</span> {semester}</p>
              <p><span className="text-slate-400">Selected Courses:</span> {selectedIds.length}</p>
              <p><span className="text-slate-400">Total Credit Hours:</span> {totalCreditHours}</p>
              <p><span className="text-slate-400">Voucher:</span> {voucher?.name}</p>
            </div>
            <ul className="mt-3 space-y-1 text-sm text-slate-600">
              {selectedCourses.map((c) => (
                <li key={c._id}>
                  • {c.courseCode} — {c.courseName} ({c.creditHours} CH)
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 flex justify-between">
          <button
            type="button"
            disabled={step === 0}
            onClick={() => setStep((s) => s - 1)}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 disabled:opacity-40"
          >
            Back
          </button>
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              disabled={!canNext()}
              onClick={() => setStep((s) => s + 1)}
              className="rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-40"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
              className="rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {submitting ? 'Submitting...' : 'Confirm & Submit'}
            </button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default UGForm;
