import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import { Loader, EmptyState } from '../../components/ui/Feedback.jsx';
import { getMySubmissions } from '../../services/submission.service';

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMySubmissions()
      .then((res) => setSubmissions(res.submissions))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading your submissions..." />;

  return (
    <Card>
      <h2 className="mb-4 text-base font-semibold text-slate-800">Submitted Forms</h2>
      {submissions.length === 0 ? (
        <EmptyState title="No submissions yet" subtitle="Head to U/G Form to submit your first semester." />
      ) : (
        <div className="space-y-3">
          {submissions.map((s) => (
            <div key={s._id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-700">Semester {s.semester}</p>
                  <p className="text-xs text-slate-400">
                    Submitted {new Date(s.submittedAt).toLocaleDateString()} • {s.totalCreditHours} credit hours
                  </p>
                </div>
                <Badge status={s.status} />
              </div>
              {s.status === 'Rejected' && s.rejectionReason && (
                <p className="mt-2 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700">
                  Reason: {s.rejectionReason}
                  {s.allowResubmission && (
                    <span className="ml-1 font-medium text-rose-800">— you may resubmit for this semester.</span>
                  )}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default Submissions;
