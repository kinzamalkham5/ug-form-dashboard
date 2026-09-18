import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardCheck,
  Eye,
  Check,
  X,
  RotateCcw,
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import { Card } from '../components/ui/Card.jsx';
import { Loader, EmptyState, Modal } from '../components/ui/Feedback.jsx';
import Badge from '../components/ui/Badge.jsx';
import { inputClass } from '../components/ui/FormField.jsx';
import {
  getAdminSubmissions,
  approveSubmission,
  rejectSubmission,
  allowResubmission,
} from '../services/admin.service';

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/students', label: 'Students', icon: Users },
  { to: '/admin/courses', label: 'Courses', icon: BookOpen },
  { to: '/admin/submissions', label: 'U/G Forms', icon: ClipboardCheck },
];

const AdminSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');
  const [viewing, setViewing] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    setLoading(true);
    getAdminSubmissions({ status: statusFilter || undefined, semester: semesterFilter || undefined })
      .then((data) => setSubmissions(data.submissions))
      .catch(() => toast.error('Could not load submissions.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [statusFilter, semesterFilter]);

  const handleApprove = async (id) => {
    setBusyId(id);
    try {
      await approveSubmission(id);
      toast.success('Submission approved.');
      setViewing(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Approve failed.');
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a rejection reason.');
      return;
    }
    setBusyId(rejectTarget._id);
    try {
      await rejectSubmission(rejectTarget._id, rejectReason.trim());
      toast.success('Submission rejected.');
      setRejectTarget(null);
      setRejectReason('');
      setViewing(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reject failed.');
    } finally {
      setBusyId(null);
    }
  };

  const handleAllowResubmission = async (id) => {
    setBusyId(id);
    try {
      await allowResubmission(id);
      toast.success('Resubmission enabled for this student.');
      load();
      if (viewing?._id === id) setViewing(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <DashboardLayout navItems={NAV_ITEMS} title="U/G Forms">
      <Card className="mb-4">
        <div className="flex flex-wrap gap-3">
          <select className={`${inputClass} max-w-[180px]`} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <select className={`${inputClass} max-w-[160px]`} value={semesterFilter} onChange={(e) => setSemesterFilter(e.target.value)}>
            <option value="">All semesters</option>
            {Array.from({ length: 8 }, (_, i) => i + 1).map((s) => (
              <option key={s} value={s}>
                Semester {s}
              </option>
            ))}
          </select>
        </div>
      </Card>

      <Card>
        {loading ? (
          <Loader label="Loading submissions..." />
        ) : submissions.length === 0 ? (
          <EmptyState title="No submissions found" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase text-slate-400">
                  <th className="py-2 pr-3">Student ID</th>
                  <th className="py-2 pr-3">Name</th>
                  <th className="py-2 pr-3">Program</th>
                  <th className="py-2 pr-3">Semester</th>
                  <th className="py-2 pr-3">Courses</th>
                  <th className="py-2 pr-3">Date</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 pr-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((s) => (
                  <tr key={s._id} className="border-b border-slate-50">
                    <td className="py-2.5 pr-3 font-medium text-slate-700">{s.student?.studentId}</td>
                    <td className="py-2.5 pr-3 text-slate-600">
                      {s.student?.firstName} {s.student?.lastName}
                    </td>
                    <td className="py-2.5 pr-3 text-slate-500">{s.program}</td>
                    <td className="py-2.5 pr-3 text-slate-500">{s.semester}</td>
                    <td className="py-2.5 pr-3 text-slate-500">{s.courses.length}</td>
                    <td className="py-2.5 pr-3 text-slate-500">{new Date(s.submittedAt).toLocaleDateString()}</td>
                    <td className="py-2.5 pr-3">
                      <Badge status={s.status} />
                    </td>
                    <td className="py-2.5 pr-3">
                      <button onClick={() => setViewing(s)} className="flex items-center gap-1 text-brand-600 hover:underline">
                        <Eye size={14} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* View / Approve / Reject modal */}
      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Submission Review">
        {viewing && (
          <div>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-slate-400">Student</dt>
                <dd className="font-medium text-slate-700">
                  {viewing.student?.firstName} {viewing.student?.lastName} ({viewing.student?.studentId})
                </dd>
              </div>
              <div>
                <dt className="text-slate-400">Program / Semester</dt>
                <dd className="font-medium text-slate-700">
                  {viewing.program} — Sem {viewing.semester}
                </dd>
              </div>
              <div>
                <dt className="text-slate-400">Total Credit Hours</dt>
                <dd className="font-medium text-slate-700">{viewing.totalCreditHours}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Status</dt>
                <dd>
                  <Badge status={viewing.status} />
                </dd>
              </div>
            </dl>

            <h4 className="mb-2 mt-4 text-sm font-semibold text-slate-700">Selected Courses</h4>
            <ul className="space-y-1 text-sm text-slate-600">
              {viewing.courses.map((c) => (
                <li key={c.course}>
                  {c.courseCode} — {c.courseName} ({c.creditHours} CH)
                </li>
              ))}
            </ul>

            <h4 className="mb-2 mt-4 text-sm font-semibold text-slate-700">Voucher</h4>
            <a href={viewing.voucherImage} target="_blank" rel="noreferrer">
              <img
                src={viewing.voucherImage}
                alt="Voucher"
                className="max-h-72 cursor-zoom-in rounded-lg border border-slate-200 object-contain"
              />
            </a>

            {viewing.status === 'Rejected' && viewing.rejectionReason && (
              <div className="mt-4 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">
                <span className="font-semibold">Rejection reason: </span>
                {viewing.rejectionReason}
              </div>
            )}

            {viewing.status === 'Pending' && (
              <div className="mt-5 flex justify-end gap-2">
                <button
                  onClick={() => setRejectTarget(viewing)}
                  disabled={busyId === viewing._id}
                  className="flex items-center gap-1.5 rounded-lg border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-60"
                >
                  <X size={16} /> Reject
                </button>
                <button
                  onClick={() => handleApprove(viewing._id)}
                  disabled={busyId === viewing._id}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                >
                  <Check size={16} /> Approve
                </button>
              </div>
            )}

            {viewing.status === 'Rejected' && !viewing.allowResubmission && (
              <div className="mt-5 flex justify-end">
                <button
                  onClick={() => handleAllowResubmission(viewing._id)}
                  disabled={busyId === viewing._id}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60"
                >
                  <RotateCcw size={16} /> Allow Resubmission
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Reject reason modal */}
      <Modal
        open={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        title="Reject Submission"
        footer={
          <>
            <button
              onClick={() => setRejectTarget(null)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleReject}
              disabled={busyId === rejectTarget?._id}
              className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
            >
              Reject Submission
            </button>
          </>
        }
      >
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Rejection Reason</label>
        <textarea
          className={`${inputClass} min-h-[100px]`}
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="e.g. Voucher image is unclear."
        />
      </Modal>
    </DashboardLayout>
  );
};

export default AdminSubmissions;
