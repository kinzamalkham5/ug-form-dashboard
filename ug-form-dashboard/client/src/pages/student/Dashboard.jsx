import React, { useEffect, useState } from 'react';
import { FileText, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Card, StatCard } from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import { Loader, EmptyState } from '../../components/ui/Feedback.jsx';
import { getDashboardStats } from '../../services/student.service';
import { useAuth } from '../../context/AuthContext.jsx';

const StudentDashboard = () => {
  const { user } = useAuth();
  const student = user?.student;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading your dashboard..." />;

  const { stats, recent } = data || { stats: {}, recent: [] };

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-bold text-slate-800">
          Welcome, {student?.firstName} {student?.lastName}
        </h2>
        <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-4">
          <p><span className="text-slate-400">Student ID:</span> {student?.studentId}</p>
          <p><span className="text-slate-400">Program:</span> {student?.program}</p>
          <p><span className="text-slate-400">Semester:</span> {student?.semester}</p>
          <p><span className="text-slate-400">Email:</span> {student?.email}</p>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Forms" value={stats.total ?? 0} icon={FileText} tone="brand" />
        <StatCard label="Pending Forms" value={stats.pending ?? 0} icon={Clock} tone="amber" />
        <StatCard label="Approved Forms" value={stats.approved ?? 0} icon={CheckCircle2} tone="green" />
        <StatCard label="Rejected Forms" value={stats.rejected ?? 0} icon={XCircle} tone="red" />
      </div>

      <Card>
        <h3 className="mb-3 text-base font-semibold text-slate-800">Recent Submissions</h3>
        {recent?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400">
                  <th className="py-2 pr-4">Semester</th>
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Credit Hours</th>
                  <th className="py-2 pr-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((r) => (
                  <tr key={r._id} className="border-b border-slate-50">
                    <td className="py-2.5 pr-4">Semester {r.semester}</td>
                    <td className="py-2.5 pr-4">{new Date(r.submittedAt).toLocaleDateString()}</td>
                    <td className="py-2.5 pr-4">{r.totalCreditHours}</td>
                    <td className="py-2.5 pr-4">
                      <Badge status={r.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="No submissions yet" subtitle="Submit your first U/G form to get started." />
        )}
      </Card>
    </div>
  );
};

export default StudentDashboard;
