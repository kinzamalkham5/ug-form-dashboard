import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardCheck,
  Search,
  Eye,
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import { Card } from '../components/ui/Card.jsx';
import { Loader, EmptyState, Modal } from '../components/ui/Feedback.jsx';
import Badge from '../components/ui/Badge.jsx';
import { inputClass } from '../components/ui/FormField.jsx';
import { getStudents, getStudentById } from '../services/admin.service';

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/students', label: 'Students', icon: Users },
  { to: '/admin/courses', label: 'Courses', icon: BookOpen },
  { to: '/admin/submissions', label: 'U/G Forms', icon: ClipboardCheck },
];

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [program, setProgram] = useState('');
  const [semester, setSemester] = useState('');
  const [viewing, setViewing] = useState(null);
  const [viewingSubs, setViewingSubs] = useState([]);

  const load = () => {
    setLoading(true);
    getStudents({ search, program, semester })
      .then((data) => setStudents(data.students))
      .catch(() => toast.error('Could not load students.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, program, semester]);

  const openStudent = async (id) => {
    try {
      const data = await getStudentById(id);
      setViewing(data.student);
      setViewingSubs(data.submissions);
    } catch {
      toast.error('Could not load student.');
    }
  };

  return (
    <DashboardLayout navItems={NAV_ITEMS} title="Students">
      <Card className="mb-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input
              className={`${inputClass} pl-9`}
              placeholder="Search name, ID, email, CNIC..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <input
            className={`${inputClass} max-w-[200px]`}
            placeholder="Filter by program"
            value={program}
            onChange={(e) => setProgram(e.target.value)}
          />
          <select className={`${inputClass} max-w-[160px]`} value={semester} onChange={(e) => setSemester(e.target.value)}>
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
          <Loader label="Loading students..." />
        ) : students.length === 0 ? (
          <EmptyState title="No students found" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase text-slate-400">
                  <th className="py-2 pr-3">Student ID</th>
                  <th className="py-2 pr-3">Name</th>
                  <th className="py-2 pr-3">CNIC</th>
                  <th className="py-2 pr-3">Phone</th>
                  <th className="py-2 pr-3">Email</th>
                  <th className="py-2 pr-3">Program</th>
                  <th className="py-2 pr-3">Semester</th>
                  <th className="py-2 pr-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s._id} className="border-b border-slate-50">
                    <td className="py-2.5 pr-3 font-medium text-slate-700">{s.studentId}</td>
                    <td className="py-2.5 pr-3 text-slate-600">
                      {s.firstName} {s.lastName}
                    </td>
                    <td className="py-2.5 pr-3 text-slate-500">{s.cnic}</td>
                    <td className="py-2.5 pr-3 text-slate-500">{s.phone}</td>
                    <td className="py-2.5 pr-3 text-slate-500">{s.email}</td>
                    <td className="py-2.5 pr-3 text-slate-500">{s.program}</td>
                    <td className="py-2.5 pr-3 text-slate-500">{s.semester}</td>
                    <td className="py-2.5 pr-3">
                      <button
                        onClick={() => openStudent(s._id)}
                        className="flex items-center gap-1 text-brand-600 hover:underline"
                      >
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

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Student Profile">
        {viewing && (
          <div>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-slate-400">Name</dt>
                <dd className="font-medium text-slate-700">
                  {viewing.firstName} {viewing.lastName}
                </dd>
              </div>
              <div>
                <dt className="text-slate-400">Student ID</dt>
                <dd className="font-medium text-slate-700">{viewing.studentId}</dd>
              </div>
              <div>
                <dt className="text-slate-400">CNIC</dt>
                <dd className="font-medium text-slate-700">{viewing.cnic}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Phone</dt>
                <dd className="font-medium text-slate-700">{viewing.phone}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Email</dt>
                <dd className="font-medium text-slate-700">{viewing.email}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Program / Semester</dt>
                <dd className="font-medium text-slate-700">
                  {viewing.program} — Sem {viewing.semester}
                </dd>
              </div>
            </dl>

            <h4 className="mb-2 mt-5 text-sm font-semibold text-slate-700">Submitted Forms</h4>
            {viewingSubs.length === 0 ? (
              <p className="text-sm text-slate-400">No submissions yet.</p>
            ) : (
              <ul className="space-y-2">
                {viewingSubs.map((s) => (
                  <li key={s._id} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-sm">
                    <span>
                      Semester {s.semester} — {new Date(s.submittedAt).toLocaleDateString()}
                    </span>
                    <Badge status={s.status} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default AdminStudents;
