'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { STATUS_LABELS, STATUS_COLORS, type ChangeSession } from '@/lib/types';
import { formatDate } from '@/lib/utils';

function linkify(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, i) =>
    urlRegex.test(part) ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="underline break-all"
      >
        {part}
      </a>
    ) : (
      part
    )
  );
}

export default function SessionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [session, setSession] = useState<ChangeSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchSession = async () => {
    const res = await fetch(`/api/sessions/${params.id}`);
    if (res.ok) {
      const data = await res.json();
      setSession(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSession();
  }, [params.id]);

  const handleApprove = async () => {
    setSubmitting(true);
    const res = await fetch(`/api/sessions/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'approve' }),
    });
    if (res.ok) fetchSession();
    setSubmitting(false);
  };

  const handleFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setSubmitting(true);
    const res = await fetch(`/api/sessions/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'feedback', message: feedback.trim() }),
    });
    if (res.ok) {
      setFeedback('');
      fetchSession();
    }
    setSubmitting(false);
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading...</div>;
  }

  if (!session) {
    return <div className="text-center py-12 text-gray-500">Session not found.</div>;
  }

  return (
    <div>
      <button
        onClick={() => router.push('/dashboard')}
        className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-flex items-center gap-1"
      >
        &larr; Back to dashboard
      </button>

      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold">Change Request</h2>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            STATUS_COLORS[session.status] || 'bg-gray-100 text-gray-800'
          }`}
        >
          {STATUS_LABELS[session.status] || session.status}
        </span>
      </div>

      {/* Deployed confirmation */}
      {session.status === 'deployed' && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-slate-700 font-medium">
            These changes are now live at{' '}
            <a
              href="https://elorasilver.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              elorasilver.com
            </a>
          </p>
        </div>
      )}

      {/* Message thread */}
      <div className="space-y-3 mb-8">
        {session.messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'elora' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-xl px-4 py-3 ${
                msg.role === 'elora'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white border text-gray-900'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{linkify(msg.content)}</p>
              <p
                className={`text-xs mt-1 ${
                  msg.role === 'elora' ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                {formatDate(msg.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Processing state */}
      {session.status === 'processing' && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
          <p className="text-sm text-blue-800 font-medium">
            Processing your request... This usually takes 10-20 minutes.
          </p>
        </div>
      )}

      {/* Actions for preview_ready */}
      {session.status === 'preview_ready' && (
        <div className="bg-white border rounded-xl p-6 space-y-4">
          <div className="flex gap-3">
            <button
              onClick={handleApprove}
              disabled={submitting}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              Approve &amp; Deploy
            </button>
          </div>

          <div className="border-t pt-4">
            <form onSubmit={handleFeedback}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Or request changes
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="Describe what you'd like changed..."
              />
              <div className="mt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting || !feedback.trim()}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Send Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feedback pending state */}
      {session.status === 'feedback_pending' && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
          <p className="text-sm text-orange-800 font-medium">
            Your feedback has been received. Working on revisions...
          </p>
        </div>
      )}
    </div>
  );
}
