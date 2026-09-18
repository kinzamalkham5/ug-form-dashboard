import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// role: 'student' | 'admin'. Denies access (does not just redirect) when the
// authenticated user's role doesn't match — role is never trusted from the client,
// only from what the backend returned for the verified token.
const ProtectedRoute = ({ role, children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-500">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to={role === 'admin' ? '/admin/login' : '/login'} replace />;
  }

  if (user.role !== role) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-2 text-slate-600">
        <p className="text-lg font-semibold">Access denied</p>
        <p className="text-sm">You are not authorized to view this page.</p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
