import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  LayoutDashboard,
  User,
  FileText,
  ListChecks,
  KeyRound,
  ClipboardList,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import { StatCard, Card } from '../components/ui/Card.jsx';
import { Loader, EmptyState } from '../components/ui/Feedback.jsx';
import Badge from '../components/ui/Badge.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getDashboardStats } from '../services/student.service';

const NAV_ITEMS = [
  { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/student/profile', label: 'My Profile', icon: User },
  { to: '/student/form', label: 'U/G Form', icon: FileText },
  { to: '/student/submissions', label: 'Submitted Forms', icon: ListChecks },
  { to: '/student/change-password', label: 'Change Password', icon: KeyRound },
];

const StudentDashboard = () => {
  const { user } = useAuth();
  const student = user?.student;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(setData)
      .catch(() => toast.error('Could not load dashboard stats.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout navItems={NAV_ITEMS} title="Dashboard">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">
          Welcome, {student?.firstName} {student?.lastName}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {student?.studentId} &middot; {student?.program} &middot; Semester {student?.semester}
        </p>
      </div>

      {loading ? (
        <Loader label="Loading your dashboard..." />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Forms" value={data?.stats?.total ?? 0} icon={ClipboardList} tone="brand" />
            <StatCard label="Pending" value={data?.stats?.pending ?? 0} icon={Clock} tone="amber" />
            <StatCard label="Approved" value={data?.stats?.approved ?? 0} icon={CheckCircle2} tone="green" />
            <StatCard label="Rejected" value={data?.stats?.rejected ?? 0} icon={XCircle} tone="red" />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold text-slate-800">Recent Submissions</h3>
                <Link to="/student/submissions" className="text-sm font-medium text-brand-600 hover:underline">
                  View all
                </Link>
              </div>
              {data?.recent?.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-xs uppercase text-slate-400">
                        <th className="py-2">Semester</th>
                        <th className="py-2">Date</th>
                        <th className="py-2">Credit Hours</th>
                        <th className="py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recent.map((s) => (
                        <tr key={s._id} className="border-b border-slate-50">
                          <td className="py-2.5 font-medium text-slate-700">Semester {s.semester}</td>
                          <td className="py-2.5 text-slate-500">
                            {new Date(s.submittedAt).toLocaleDateString()}
                          </td>
                          <td className="py-2.5 text-slate-500">{s.totalCreditHours} CH</td>
                          <td className="py-2.5">
                            <Badge status={s.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState
                  title="No submissions yet"
                  subtitle="Submit your first U/G form to see it here."
                />
              )}
            </Card>

            <Card>
              <h3 className="mb-3 font-semibold text-slate-800">Quick Actions</h3>
              <div className="flex flex-col gap-2">
                <Link
                  to="/student/form"
                  className="rounded-lg bg-brand-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-brand-700"
                >
                  Submit U/G Form
                </Link>
                <Link
                  to="/student/profile"
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-center text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  View My Profile
                </Link>
              </div>
            </Card>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default StudentDashboard;
