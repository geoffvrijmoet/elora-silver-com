'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type Tab = 'approach' | 'services' | 'contact' | 'fees';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('approach');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [sessionPrice, setSessionPrice] = useState<number | null>(null);
  const [priceLoading, setPriceLoading] = useState(false);

  // Fetch price from Psychology Today on page load
  useEffect(() => {
    if (sessionPrice === null && !priceLoading) {
      setPriceLoading(true);
      fetch('/api/psychology-today-price')
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          if (data.price !== null && data.price !== undefined) {
            setSessionPrice(data.price);
          }
          // If price is null, fallback to $150 will be used in the display
          setPriceLoading(false);
        })
        .catch((error) => {
          console.error('Failed to fetch price:', error);
          // On error, sessionPrice stays null, so fallback to $150 will be used
          setPriceLoading(false);
        });
    }
  }, [sessionPrice, priceLoading]);

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
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Failed to send email:', error);
      setStatus('error');
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-muted-green-light text-dark-green-text overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto p-4 flex flex-col flex-grow overflow-x-hidden">
        {/* Header Section */}
        <header className="text-center p-4 rounded-lg shadow-bottom mb-4">
          <h1 className="text-3xl font-bold">Elora Silver, LCSW</h1>
          <p className="font-medium opacity-80">Licensed Clinical Social Worker</p>
        </header>

        {/* Main Content Flex Container */}
        <div className="flex-grow flex md:flex-row flex-col gap-4">
          {/* Left Column: Image + Intro */}
          <div className="md:w-1/3 p-6 rounded-lg flex flex-col">
            <div className="flex-shrink-0 mx-auto w-full max-w-sm">
              <div className="relative w-full aspect-[3/4] overflow-hidden rounded-lg">
                <Image
                  src="/images/FI5A7311.webp"
                  alt="Elora Silver, LCSW"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Right Column: Tabbed Content */}
          <div className="md:w-2/3 flex flex-col">
            {/* Tab Navigation */}
            <div className="flex flex-wrap overflow-x-hidden border-b border-dark-green-text/20 mb-4">
              <button onClick={() => setActiveTab('approach')} className={`px-3 py-2 text-sm md:px-4 md:text-base transition-colors duration-200 whitespace-nowrap ${activeTab === 'approach' ? 'border-b-2 border-dark-green-text' : 'opacity-70'}`}>My Approach</button>
              <button onClick={() => setActiveTab('services')} className={`px-3 py-2 text-sm md:px-4 md:text-base transition-colors duration-200 whitespace-nowrap ${activeTab === 'services' ? 'border-b-2 border-dark-green-text' : 'opacity-70'}`}>Services</button>
              <button onClick={() => setActiveTab('fees')} className={`px-3 py-2 text-sm md:px-4 md:text-base transition-colors duration-200 whitespace-nowrap ${activeTab === 'fees' ? 'border-b-2 border-dark-green-text' : 'opacity-70'}`}>Fees & Insurance</button>
              <button onClick={() => setActiveTab('contact')} className={`px-3 py-2 text-sm md:px-4 md:text-base transition-colors duration-200 whitespace-nowrap ${activeTab === 'contact' ? 'border-b-2 border-dark-green-text' : 'opacity-70'}`}>Get in Touch</button>
            </div>

            {/* Tab Content Area */}
            <div className="flex-grow p-6 rounded-lg">
              {activeTab === 'approach' && (
                <div>
                  <div className="text-base opacity-80 space-y-4">
                    <p>
                      I am a psychotherapist with eight years of experience supporting survivors of trauma. Using an authentic and relational approach, I create a space that is supportive and welcoming while making room for the complexity that comes with existing in an overwhelming world. I work with individuals who are seeking to build healthy relationships, manage anxiety and emotional dysregulation, improve self-esteem, and manage conflict. My therapeutic approach is supportive, caring, and sex-positive, with an awareness that therapy cannot be separated from larger social, political, and environmental contexts.
                    </p>
                    <p>
                      I use a psychodynamic approach, working collaboratively to make a treatment plan that is best for you. With a training background in DBT, Internal Family Systems, ACT, Trauma-Focused CBT, and years of experience working with survivors of diverse backgrounds and experiences, I am well equipped to meet you wherever you are in your journey.
                    </p>
                    <p>
                      Starting therapy can be an incredibly vulnerable experience, but it is that vulnerability and messiness that allows us to live full and meaningful lives. I am here to foster a grounding and safe space that makes room for this vulnerability while helping you to move towards your goals. Book now to get started.
                    </p>
                  </div>
                </div>
              )}
              {activeTab === 'services' && (
                <div className="text-base opacity-80">
                  <p className="mb-4">I provide individual therapy for adults, specializing in:</p>
                  <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                    {/* Left Column */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">Specialized Support</h3>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>Domestic Abuse & Domestic Violence</li>
                          <li>Disabilities, Chronic Illness & Chronic Pain</li>
                          <li>Healthy Relationships</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Relationships & Identity</h3>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>Relationship Issues</li>
                          <li>Open Relationships & Non-Monogamy</li>
                          <li>Sex-Positive, Kink Allied</li>
                          <li>Codependency</li>
                          <li>Women&apos;s Issues</li>
                        </ul>
                      </div>
                    </div>
                    {/* Right Column */}
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">Mental Health & Emotional Wellbeing</h3>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Anxiety</li>
                        <li>Depression</li>
                        <li>Trauma and PTSD</li>
                        <li>Stress Management</li>
                        <li>Grief</li>
                        <li>Self-Esteem</li>
                        <li>Coping Skills</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'fees' && (
                <div className="text-base opacity-80 space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Session Fees</h3>
                    <p>
                      Individual sessions:{' '}
                      {priceLoading ? (
                        <span className="opacity-60">Loading...</span>
                      ) : sessionPrice !== null ? (
                        `$${sessionPrice} per session`
                      ) : (
                        '$150 per session'
                      )}
                    </p>
                    <p className="mt-2">Sliding scale available based on income. Please reach out to discuss options.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Accepted Insurance</h3>
                    <p className="mb-2">Insurance is verified through Headway or Sondermind platforms. Accepted plans include:</p>
                    <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                      <ul className="list-disc list-inside space-y-1 ml-2 flex-1">
                        <li>Aetna</li>
                        <li>Alliance Coal Health Plan</li>
                        <li>Anthem Blue Cross Blue Shield</li>
                        <li>Anthem EAP</li>
                        <li>Carelon Behavioral Health</li>
                        <li>Cigna and Evernorth</li>
                        <li>ClaimDoc</li>
                        <li>Empire Blue Cross Blue Shield</li>
                      </ul>
                      <ul className="list-disc list-inside space-y-1 ml-2 flex-1">
                        <li>FAIROS/OccuNet</li>
                        <li>Horizon Blue Cross and Blue Shield</li>
                        <li>Partners Direct</li>
                        <li>Prime Health</li>
                        <li>Quest Behavioral Health</li>
                        <li>Unity</li>
                        <li>Velocity</li>
                      </ul>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Availability</h3>
                    <p>I am available for video sessions on weekday evenings.</p>
                    <p className="mt-2">I see insured clients through Headway or Sondermind and self-pay via Doxy!</p>
                  </div>
                </div>
              )}
              {activeTab === 'contact' && (
                <div className="relative flex flex-col items-start">
                  <p className="text-base mb-6 opacity-80">
                    I am currently accepting new clients. Reach out to schedule a free 15-minute consultation.
                  </p>
                  <div className="w-full space-y-6">
                    <div>
                      <h3 className="font-semibold mb-3">Contact Me</h3>
                      {status === 'success' ? (
                        <div className="text-base opacity-80 space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="rounded-full bg-green-100 p-2 flex-shrink-0">
                              <svg
                                className="h-6 w-6 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-dark-green-text font-semibold">Message Sent Successfully!</p>
                              <p className="text-dark-green-text text-sm mt-1">
                                Thank you for reaching out. I&apos;ve received your message and will get back to you as soon as possible.
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div>
                            <label htmlFor="name" className="sr-only">Name</label>
                            <Input
                              id="name"
                              placeholder="Your Name"
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              required
                              disabled={status === 'loading'}
                              className="border-dark-green-text/30 text-dark-green-text placeholder:text-dark-green-text/50"
                            />
                          </div>
                          <div>
                            <label htmlFor="email" className="sr-only">Email</label>
                            <Input
                              id="email"
                              placeholder="Your Email"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                              disabled={status === 'loading'}
                              className="border-dark-green-text/30 text-dark-green-text placeholder:text-dark-green-text/50"
                            />
                          </div>
                          <div>
                            <label htmlFor="message" className="sr-only">Message</label>
                            <Textarea
                              id="message"
                              placeholder="Your Message"
                              rows={4}
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              required
                              disabled={status === 'loading'}
                              className="border-dark-green-text/30 text-dark-green-text placeholder:text-dark-green-text/50"
                            />
                          </div>
                          <Button
                            type="submit"
                            variant="outline"
                            className="w-auto bg-transparent border-dark-green-text/50 text-dark-green-text px-6 py-2 transition-colors duration-300 hover:bg-white/20"
                            disabled={status === 'loading'}
                          >
                            {status === 'loading' ? 'Sending...' : 'Send Message'}
                          </Button>
                          {status === 'error' && (
                            <p className="text-sm text-red-600 opacity-80">Something went wrong. Please try again later.</p>
                          )}
                        </form>
                      )}
                    </div>
                    <div>
                      <div className="space-y-3">
                        <a
                          href="https://www.psychologytoday.com/us/therapists/elora-silver-brooklyn-ny/1577352"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-base text-dark-green-text opacity-90 hover:opacity-100 transition-all duration-200 hover:translate-x-1"
                        >
                          <span className="font-medium">Psychology Today Profile</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                        <a
                          href="https://care.headway.co/providers/elora-silver"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-base text-dark-green-text opacity-90 hover:opacity-100 transition-all duration-200 hover:translate-x-1"
                        >
                          <span className="font-medium">Headway Profile</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                        <a
                          href="https://www.sondermind.com/providers/ivjf6zga/elora-silver"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-base text-dark-green-text opacity-90 hover:opacity-100 transition-all duration-200 hover:translate-x-1"
                        >
                          <span className="font-medium">Sondermind Profile</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Secret Smiley Button */}
      <div className="fixed bottom-4 right-4">
        <Link
          href="/secret"
          className="inline-flex items-center justify-center w-12 h-12 bg-transparent hover:bg-gray-200/20 text-transparent hover:text-gray-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 opacity-0 hover:opacity-60"
          title="Secret Page"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2c.83 0 1.5-.67 1.5-1.5S7.33 15 6.5 15 5 15.67 5 16.5s.67 1.5 1.5 1.5zm11 0c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zM9 11c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1zm6 0c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z"/>
          </svg>
        </Link>
      </div>
    </main>
  );
}