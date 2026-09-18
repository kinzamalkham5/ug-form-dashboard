import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, FileCheck2, ShieldCheck, ArrowRight } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-brand-600 p-2 text-white">
            <GraduationCap size={22} />
          </div>
          <span className="font-bold text-slate-800">UOF U/G Form Dashboard</span>
        </div>
        <div className="flex items-center gap-3 text-sm font-medium">
          <Link to="/login" className="text-slate-600 hover:text-brand-700">
            Student Login
          </Link>
          <Link
            to="/register"
            className="rounded-lg bg-brand-600 px-4 py-2 text-white hover:bg-brand-700"
          >
            Register
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-16 text-center">
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
          University of Faisalabad
          <br />
          U/G Course &amp; Fee Voucher Submission
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-500">
          Register, pick your semester's courses, upload your fee voucher, and track your
          submission status — all in one place.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/register"
            className="flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Get Started <ArrowRight size={16} />
          </Link>
          <Link
            to="/login"
            className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            I already have an account
          </Link>
        </div>

        <div className="mx-auto mt-16 grid max-w-3xl gap-4 text-left sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <FileCheck2 className="text-brand-600" size={24} />
            <h3 className="mt-3 font-semibold text-slate-800">Semester-wise Submission</h3>
            <p className="mt-1 text-sm text-slate-500">
              Select your semester's courses and upload your voucher in a simple guided flow.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <ShieldCheck className="text-brand-600" size={24} />
            <h3 className="mt-3 font-semibold text-slate-800">Transparent Status</h3>
            <p className="mt-1 text-sm text-slate-500">
              Track Pending, Approved, or Rejected status with a clear reason if revisions are
              needed.
            </p>
          </div>
        </div>

        <p className="mt-10 text-xs text-slate-400">
          Administrator?{' '}
          <Link to="/admin/login" className="text-slate-500 hover:underline">
            Admin login
          </Link>
        </p>
      </main>
    </div>
  );
};

export default Landing;
