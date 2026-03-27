'use client';

import { useEffect, useState, useRef } from 'react';
import { STATUS_LABELS, STATUS_COLORS, type ChatState } from '@/lib/types';
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

export default function DashboardPage() {
  const [chat, setChat] = useState<ChatState | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  };

  const fetchChat = async () => {
    const res = await fetch('/api/chat');
    if (res.ok) {
      const data = await res.json();
      setChat(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchChat();
  }, []);

  useEffect(() => {
    if (!chat) return;
    const pollingStatuses = ['pending', 'processing', 'approved', 'deploying'];
    if (!pollingStatuses.includes(chat.status)) return;

    const interval = setInterval(fetchChat, 10000);
    return () => clearInterval(interval);
  }, [chat?.status]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat?.messages?.length]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSubmitting(true);
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: message.trim() }),
    });
    if (res.ok) {
      setMessage('');
      fetchChat();
    }
    setSubmitting(false);
  };

  const handleApprove = async () => {
    setSubmitting(true);
    const res = await fetch('/api/chat/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'approve' }),
    });
    if (res.ok) fetchChat();
    setSubmitting(false);
  };

  const handleFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setSubmitting(true);
    const res = await fetch('/api/chat/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'feedback', message: feedback.trim() }),
    });
    if (res.ok) {
      setFeedback('');
      fetchChat();
    }
    setSubmitting(false);
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading...</div>;
  }

  const status = chat?.status || 'idle';
  const messages = chat?.messages || [];
  const canSendMessage = status === 'idle' || status === 'failed' || status === 'pending';

  return (
    <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 80px)' }}>
      <div className="flex items-center gap-2 mb-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            STATUS_COLORS[status] || 'bg-gray-100 text-gray-800'
          }`}
        >
          {STATUS_LABELS[status] || status}
        </span>
        {(status === 'processing' || status === 'deploying') && (
          <span className="text-xs text-gray-500 animate-pulse">
            {status === 'processing' ? 'Working on your changes...' : 'Deploying to production...'}
          </span>
        )}
        {status === 'pending' && (
          <span className="text-xs text-gray-500">Waiting to be picked up...</span>
        )}
      </div>

      <div className="flex-1 space-y-3 mb-6">
        {messages.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Send a message to request a change to your website.
          </div>
        )}
        {messages.map((msg, i) => (
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
        <div ref={messagesEndRef} />
      </div>

      <div className="sticky bottom-0 bg-gray-50 pt-4 pb-2">
        {canSendMessage && (
          <form onSubmit={handleSendMessage}>
            {status === 'pending' && (
              <p className="text-xs text-blue-600 mb-2">
                Queued — will be picked up shortly. You can keep adding more details.
              </p>
            )}
            {status === 'failed' && (
              <p className="text-xs text-red-600 mb-2">
                Something went wrong. You can try again or send a different request.
              </p>
            )}
            <div className="flex gap-2">
              <textarea
                value={message}
                onChange={(e) => { setMessage(e.target.value); autoResize(e.target); }}
                rows={2}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none overflow-hidden"
                placeholder="Describe a change you'd like to make..."
              />
              <button
                type="submit"
                disabled={submitting || !message.trim()}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors self-end"
              >
                Send
              </button>
            </div>
          </form>
        )}

        {status === 'preview_ready' && (
          <div className="space-y-3">
            <div className="flex gap-3">
              <button
                onClick={handleApprove}
                disabled={submitting}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                Approve &amp; Deploy
              </button>
            </div>
            <form onSubmit={handleFeedback}>
              <div className="flex gap-2">
                <textarea
                  value={feedback}
                  onChange={(e) => { setFeedback(e.target.value); autoResize(e.target); }}
                  rows={2}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none overflow-hidden"
                  placeholder="Or describe what you'd like changed..."
                />
                <button
                  type="submit"
                  disabled={submitting || !feedback.trim()}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors self-end"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        )}

        {(status === 'processing' || status === 'approved' || status === 'deploying') && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
            <p className="text-sm text-blue-800">
              {status === 'processing' && 'Working on your changes... This usually takes 10-20 minutes.'}
              {status === 'approved' && 'Deployment approved. Merging to production...'}
              {status === 'deploying' && 'Deploying to production...'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
