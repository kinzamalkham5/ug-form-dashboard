import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardCheck,
  Plus,
  Pencil,
  Trash2,
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import { Card } from '../components/ui/Card.jsx';
import { Loader, EmptyState, Modal } from '../components/ui/Feedback.jsx';
import FormField, { inputClass } from '../components/ui/FormField.jsx';
import { getCourses, createCourse, updateCourse, deleteCourse } from '../services/course.service';

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/students', label: 'Students', icon: Users },
  { to: '/admin/courses', label: 'Courses', icon: BookOpen },
  { to: '/admin/submissions', label: 'U/G Forms', icon: ClipboardCheck },
];

const EMPTY_FORM = { courseCode: '', courseName: '', creditHours: 3, semester: 1, program: '' };

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [semesterFilter, setSemesterFilter] = useState('');
  const [programFilter, setProgramFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = () => {
    setLoading(true);
    getCourses({ program: programFilter || undefined, semester: semesterFilter || undefined })
      .then((data) => setCourses(data.courses))
      .catch(() => toast.error('Could not load courses.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [semesterFilter, programFilter]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (course) => {
    setEditingId(course._id);
    setForm({
      courseCode: course.courseCode,
      courseName: course.courseName,
      creditHours: course.creditHours,
      semester: course.semester,
      program: course.program,
    });
    setModalOpen(true);
  };

  const save = async () => {
    try {
      if (editingId) {
        await updateCourse(editingId, form);
        toast.success('Course updated.');
      } else {
        await createCourse(form);
        toast.success('Course created.');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed.');
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteCourse(deleteTarget._id);
      toast.success('Course deleted.');
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed.');
    }
  };

  return (
    <DashboardLayout navItems={NAV_ITEMS} title="Courses">
      <Card className="mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <input
            className={`${inputClass} max-w-[220px]`}
            placeholder="Filter by program"
            value={programFilter}
            onChange={(e) => setProgramFilter(e.target.value)}
          />
          <select
            className={`${inputClass} max-w-[160px]`}
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
          >
            <option value="">All semesters</option>
            {Array.from({ length: 8 }, (_, i) => i + 1).map((s) => (
              <option key={s} value={s}>
                Semester {s}
              </option>
            ))}
          </select>
          <button
            onClick={openCreate}
            className="ml-auto flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
          >
            <Plus size={16} /> Add Course
          </button>
        </div>
      </Card>

      <Card>
        {loading ? (
          <Loader label="Loading courses..." />
        ) : courses.length === 0 ? (
          <EmptyState title="No courses found" subtitle="Add a course to get started." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase text-slate-400">
                  <th className="py-2 pr-3">Code</th>
                  <th className="py-2 pr-3">Name</th>
                  <th className="py-2 pr-3">Credit Hours</th>
                  <th className="py-2 pr-3">Semester</th>
                  <th className="py-2 pr-3">Program</th>
                  <th className="py-2 pr-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c._id} className="border-b border-slate-50">
                    <td className="py-2.5 pr-3 font-medium text-slate-700">{c.courseCode}</td>
                    <td className="py-2.5 pr-3 text-slate-600">
                      {c.courseName} {c.isDemoData && <span className="text-xs text-slate-400">(demo)</span>}
                    </td>
                    <td className="py-2.5 pr-3 text-slate-500">{c.creditHours}</td>
                    <td className="py-2.5 pr-3 text-slate-500">{c.semester}</td>
                    <td className="py-2.5 pr-3 text-slate-500">{c.program}</td>
                    <td className="py-2.5 pr-3">
                      <div className="flex items-center gap-3">
                        <button onClick={() => openEdit(c)} className="flex items-center gap-1 text-brand-600 hover:underline">
                          <Pencil size={14} /> Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(c)}
                          className="flex items-center gap-1 text-rose-600 hover:underline"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Course' : 'Add Course'}>
        <FormField label="Course Code">
          <input className={inputClass} value={form.courseCode} onChange={(e) => setForm({ ...form, courseCode: e.target.value })} placeholder="CS-101" />
        </FormField>
        <FormField label="Course Name">
          <input className={inputClass} value={form.courseName} onChange={(e) => setForm({ ...form, courseName: e.target.value })} placeholder="Programming Fundamentals" />
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Credit Hours">
            <input
              type="number"
              min={1}
              max={6}
              className={inputClass}
              value={form.creditHours}
              onChange={(e) => setForm({ ...form, creditHours: Number(e.target.value) })}
            />
          </FormField>
          <FormField label="Semester">
            <select className={inputClass} value={form.semester} onChange={(e) => setForm({ ...form, semester: Number(e.target.value) })}>
              {Array.from({ length: 8 }, (_, i) => i + 1).map((s) => (
                <option key={s} value={s}>
                  Semester {s}
                </option>
              ))}
            </select>
          </FormField>
        </div>
        <FormField label="Program">
          <input className={inputClass} value={form.program} onChange={(e) => setForm({ ...form, program: e.target.value })} placeholder="BS Computer Science" />
        </FormField>
        <button onClick={save} className="mt-2 w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
          {editingId ? 'Save Changes' : 'Create Course'}
        </button>
      </Modal>

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Course"
        footer={
          <>
            <button onClick={() => setDeleteTarget(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
              Cancel
            </button>
            <button onClick={confirmDelete} className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700">
              Delete
            </button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          Are you sure you want to delete <span className="font-semibold">{deleteTarget?.courseCode}</span>? This
          cannot be undone.
        </p>
      </Modal>
    </DashboardLayout>
  );
};

export default AdminCourses;
