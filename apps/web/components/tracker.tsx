'use client';

import { useEffect } from 'react';

function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let id = sessionStorage.getItem('_sid');
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem('_sid', id);
  }
  return id;
}

export default function Tracker() {
  useEffect(() => {
    const sessionId = getSessionId();
    if (!sessionId) return;

    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: window.location.pathname,
        referrer: document.referrer,
        sessionId,
        screenWidth: window.innerWidth,
      }),
    }).catch(() => {});
  }, []);

  return null;
}
