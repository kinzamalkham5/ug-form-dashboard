import React, { useEffect, useState } from 'react';
import { Users, FileText, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Card, StatCard } from '../../components/ui/Card.jsx';
import { Loader } from '../../components/ui/Feedback.jsx';
import { getAdminDashboardStats } from '../../services/admin.service';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDashboardStats()
      .then((res) => setStats(res.stats))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading dashboard..." />;

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-bold text-slate-800">Admin Overview</h2>
        <p className="text-sm text-slate-500">University of Faisalabad — U/G Form Submission Dashboard</p>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total Students" value={stats.totalStudents} icon={Users} tone="brand" />
        <StatCard label="Total Submissions" value={stats.totalSubmissions} icon={FileText} tone="brand" />
        <StatCard label="Pending" value={stats.pending} icon={Clock} tone="amber" />
        <StatCard label="Approved" value={stats.approved} icon={CheckCircle2} tone="green" />
        <StatCard label="Rejected" value={stats.rejected} icon={XCircle} tone="red" />
      </div>
    </div>
  );
};

export default AdminDashboard;
