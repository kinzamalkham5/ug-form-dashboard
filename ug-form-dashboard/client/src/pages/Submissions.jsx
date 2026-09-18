import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LayoutDashboard, User, FileText, ListChecks, KeyRound } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import { Card } from '../components/ui/Card.jsx';
import { Loader, EmptyState } from '../components/ui/Feedback.jsx';
import Badge from '../components/ui/Badge.jsx';
import { getMySubmissions } from '../services/submission.service';

const NAV_ITEMS = [
  { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/student/profile', label: 'My Profile', icon: User },
  { to: '/student/form', label: 'U/G Form', icon: FileText },
  { to: '/student/submissions', label: 'Submitted Forms', icon: ListChecks },
  { to: '/student/change-password', label: 'Change Password', icon: KeyRound },
];

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMySubmissions()
      .then((data) => setSubmissions(data.submissions))
      .catch(() => toast.error('Could not load submissions.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout navItems={NAV_ITEMS} title="Submitted Forms">
      {loading ? (
        <Loader label="Loading submissions..." />
      ) : submissions.length === 0 ? (
        <Card>
          <EmptyState title="No submissions yet" subtitle="Submit your first U/G form to see it here." />
          <div className="flex justify-center">
            <Link
              to="/student/form"
              className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Submit U/G Form
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {submissions.map((s) => (
            <Card key={s._id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-slate-800">Semester {s.semester}</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Submitted Date: {new Date(s.submittedAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-slate-500">
                    {s.courses.length} course(s) &middot; {s.totalCreditHours} credit hours
                  </p>
                </div>
                <Badge status={s.status} />
              </div>

              {s.status === 'Rejected' && s.rejectionReason && (
                <div className="mt-3 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  <span className="font-semibold">Reason: </span>
                  {s.rejectionReason}
                  {s.allowResubmission && (
                    <p className="mt-1 text-rose-600">
                      Admin has enabled resubmission for this semester —{' '}
                      <Link to="/student/form" className="font-semibold underline">
                        submit again
                      </Link>
                      .
                    </p>
                  )}
                </div>
              )}

              <details className="mt-3">
                <summary className="cursor-pointer text-sm font-medium text-brand-600 hover:underline">
                  View courses &amp; voucher
                </summary>
                <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <ul className="space-y-1 text-sm text-slate-600">
                    {s.courses.map((c) => (
                      <li key={c.course}>
                        {c.courseCode} — {c.courseName} ({c.creditHours} CH)
                      </li>
                    ))}
                  </ul>
                  <img
                    src={s.voucherImage}
                    alt="Voucher"
                    className="max-h-48 rounded-lg border border-slate-200 object-contain"
                  />
                </div>
              </details>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Submissions;
