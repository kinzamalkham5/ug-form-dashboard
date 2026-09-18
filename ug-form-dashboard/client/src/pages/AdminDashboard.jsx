import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardCheck,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import { StatCard } from '../components/ui/Card.jsx';
import { Loader } from '../components/ui/Feedback.jsx';
import { getAdminDashboardStats } from '../services/admin.service';

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/students', label: 'Students', icon: Users },
  { to: '/admin/courses', label: 'Courses', icon: BookOpen },
  { to: '/admin/submissions', label: 'U/G Forms', icon: ClipboardCheck },
];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDashboardStats()
      .then((data) => setStats(data.stats))
      .catch(() => toast.error('Could not load dashboard stats.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout navItems={NAV_ITEMS} title="Admin Dashboard">
      {loading ? (
        <Loader label="Loading stats..." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard label="Total Students" value={stats?.totalStudents ?? 0} icon={Users} tone="brand" />
          <StatCard label="Total Submissions" value={stats?.totalSubmissions ?? 0} icon={ClipboardCheck} tone="brand" />
          <StatCard label="Pending" value={stats?.pending ?? 0} icon={Clock} tone="amber" />
          <StatCard label="Approved" value={stats?.approved ?? 0} icon={CheckCircle2} tone="green" />
          <StatCard label="Rejected" value={stats?.rejected ?? 0} icon={XCircle} tone="red" />
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
