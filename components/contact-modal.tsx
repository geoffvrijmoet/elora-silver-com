'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShow(true), 10);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      onClose();
      setStatus('idle');
      setName('');
      setEmail('');
      setMessage('');
    }, 300);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Failed to send email:', error);
      setStatus('error');
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ease-in-out ${
          show ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Modal Content - The "Tray" */}
      <div
        className={`absolute bottom-full mb-2 z-50 w-full max-w-sm rounded-lg bg-white p-6 shadow-xl transition-all duration-300 ease-in-out origin-bottom ${
          show ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {status === 'success' ? (
          <div className="text-center">
            <h2 className="mb-2 text-xl font-bold text-gray-900">Thank You!</h2>
            <p className="mb-4 text-sm text-gray-600">Your message has been sent successfully. I will get back to you shortly.</p>
            <Button onClick={handleClose} className="w-full bg-dark-green-text hover:opacity-90">
              Close
            </Button>
          </div>
        ) : (
          <>
            <h2 className="mb-2 text-xl font-bold text-gray-900">Contact Me</h2>
            <p className="mb-4 text-sm text-gray-600">
              I&apos;m currently accepting new clients.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="sr-only">Name</label>
                <Input id="name" placeholder="Your Name" type="text" value={name} onChange={(e) => setName(e.target.value)} required disabled={status === 'loading'} />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <Input id="email" placeholder="Your Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={status === 'loading'} />
              </div>
              <div>
                <label htmlFor="message" className="sr-only">Message</label>
                <Textarea id="message" placeholder="Your Message" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} required disabled={status === 'loading'} />
              </div>
              <Button type="submit" className="w-full bg-dark-green-text hover:opacity-90" disabled={status === 'loading'}>
                {status === 'loading' ? 'Sending...' : 'Send Message'}
              </Button>
              {status === 'error' && (
                <p className="text-sm text-red-600">Something went wrong. Please try again later.</p>
              )}
            </form>
          </>
        )}
      </div>
    </>
  );
}