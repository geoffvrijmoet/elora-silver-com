'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { STATUS_LABELS, STATUS_COLORS, type ChangeSession } from '@/lib/types';
import { formatDate, truncate } from '@/lib/utils';

export default function DashboardPage() {
  const [sessions, setSessions] = useState<ChangeSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchSessions = async () => {
    const res = await fetch('/api/sessions');
    const data = await res.json();
    setSessions(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSubmitting(true);
    const res = await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: message.trim() }),
    });

    if (res.ok) {
      setMessage('');
      setShowForm(false);
      fetchSessions();
    }
    setSubmitting(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Change Requests</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          {showForm ? 'Cancel' : 'New Request'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 bg-white rounded-xl border p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Describe the change you&apos;d like to make to your website
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            placeholder="e.g., Update the session price to $200, add a new testimonials section..."
          />
          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              disabled={submitting || !message.trim()}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No change requests yet. Click &quot;New Request&quot; to get started.
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <Link
              key={String(session._id)}
              href={`/dashboard/sessions/${session._id}`}
              className="block bg-white rounded-xl border p-4 hover:border-gray-400 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 font-medium">
                    {truncate(session.messages[0]?.content || 'No description', 120)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(session.createdAt)}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                    STATUS_COLORS[session.status] || 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {STATUS_LABELS[session.status] || session.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
