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
          // If price is null, fallback to $185 will be used in the display
          setPriceLoading(false);
        })
        .catch((error) => {
          console.error('Failed to fetch price:', error);
          // On error, sessionPrice stays null, so fallback to $185 will be used
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
                          <li>Trauma and PTSD</li>
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
                      Individual sessions: $185 per session
                    </p>
                    <p className="mt-2">Sliding scale available based on income. Please reach out to discuss options.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Accepted Insurance</h3>
                    <p className="mb-2 italic" style={{ fontSize: '15px' }}>Please note that I am unable to bill through insurance for clients based in Vermont.</p>
                    <p className="mb-2">Insurance is verified through Headway. Accepted plans include:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Aetna</li>
                      <li>Blue Cross Blue Shield of Massachusetts</li>
                      <li>Oscar</li>
                      <li>Oxford</li>
                      <li>Quest Behavioral Health</li>
                      <li>United Healthcare</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Availability</h3>
                    <p>I am available for video sessions.</p>
                    <p className="mt-2">I see insured clients through Headway!</p>
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
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Botanical Leaf Decoration */}
      <div className="fixed bottom-0 left-0 w-full pointer-events-none" aria-hidden="true">
        <svg
          viewBox="0 0 1440 180"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="auto"
          preserveAspectRatio="xMidYMax meet"
          role="presentation"
        >
          <g stroke="#2A4B2A" fill="none" strokeLinecap="round" strokeLinejoin="round">

            {/* Group 1: Small cluster, far left */}
            <path d="M 55 180 C 57 158 55 135 52 108" strokeWidth="1.4"/>
            <path d="M 53 148 C 68 138 88 132 96 118 C 104 104 96 93 83 98 C 68 104 52 126 53 148" strokeWidth="1.2"/>
            <path d="M 53 148 C 72 128 84 112 96 118" strokeWidth="0.8"/>
            <path d="M 51 122 C 36 110 18 102 13 86 C 8 70 19 60 32 68 C 46 77 51 103 51 122" strokeWidth="1.2"/>
            <path d="M 51 122 C 32 100 22 78 32 68" strokeWidth="0.8"/>
            <path d="M 52 108 C 58 90 64 72 58 56 C 53 42 42 40 37 51 C 32 64 40 88 52 108" strokeWidth="1.2"/>
            <path d="M 52 108 C 54 86 50 64 58 56" strokeWidth="0.8"/>

            {/* Group 2: Large broad leaf with veins, center-left */}
            <path d="M 248 180 C 246 160 242 140 236 118" strokeWidth="1.5"/>
            <path d="M 236 118 C 248 94 278 78 304 88 C 330 98 330 126 308 138 C 284 152 248 148 236 118" strokeWidth="1.3"/>
            <path d="M 236 118 C 264 114 294 118 304 88" strokeWidth="1.0"/>
            <path d="M 248 108 C 266 100 286 96 300 92" strokeWidth="0.7"/>
            <path d="M 252 120 C 270 114 288 110 302 106" strokeWidth="0.7"/>
            <path d="M 248 132 C 266 128 282 124 296 120" strokeWidth="0.7"/>

            {/* Group 3: Tall stem with alternating leaves */}
            <path d="M 428 180 C 430 152 432 120 430 88 C 428 64 424 44 420 28" strokeWidth="1.4"/>
            <path d="M 429 145 C 444 134 464 128 470 114 C 476 100 468 89 455 94 C 440 100 428 124 429 145" strokeWidth="1.2"/>
            <path d="M 429 145 C 448 124 460 106 470 114" strokeWidth="0.8"/>
            <path d="M 429 112 C 412 100 392 92 386 76 C 380 60 392 50 406 58 C 420 66 430 92 429 112" strokeWidth="1.2"/>
            <path d="M 429 112 C 408 92 394 70 406 58" strokeWidth="0.8"/>
            <path d="M 428 78 C 442 64 460 54 464 38 C 468 24 458 16 447 24 C 434 34 426 58 428 78" strokeWidth="1.2"/>
            <path d="M 428 78 C 446 60 454 38 464 38" strokeWidth="0.8"/>

            {/* Group 4: Tall grass blades with seed head, center */}
            <path d="M 580 180 C 578 154 574 126 570 96 C 567 74 562 56 560 38" strokeWidth="1.1"/>
            <path d="M 594 180 C 592 154 590 124 590 94 C 590 72 592 52 592 32" strokeWidth="1.1"/>
            <path d="M 608 180 C 608 154 610 126 614 98 C 618 76 624 58 626 40" strokeWidth="1.1"/>
            <path d="M 622 180 C 624 156 628 130 634 104 C 640 80 646 62 650 46" strokeWidth="1.1"/>
            <path d="M 560 38 C 558 26 554 16 550 8" strokeWidth="0.9"/>
            <path d="M 554 24 C 546 18 542 10 540 4" strokeWidth="0.7"/>
            <path d="M 554 24 C 562 18 566 10 564 4" strokeWidth="0.7"/>

            {/* Group 5: Two overlapping leaves, center-right */}
            <path d="M 800 180 C 798 158 796 134 794 108" strokeWidth="1.5"/>
            <path d="M 794 108 C 778 86 760 70 762 50 C 764 30 784 26 796 44 C 808 62 804 90 794 108" strokeWidth="1.3"/>
            <path d="M 794 108 C 792 82 794 58 796 44" strokeWidth="0.9"/>
            <path d="M 786 96 C 778 78 774 62 772 48" strokeWidth="0.7"/>
            <path d="M 796 106 C 814 84 836 70 844 50 C 852 32 844 20 830 28 C 814 38 796 74 796 106" strokeWidth="1.3"/>
            <path d="M 796 106 C 820 80 832 54 844 50" strokeWidth="0.9"/>
            <path d="M 808 92 C 820 74 830 58 838 46" strokeWidth="0.7"/>
            <path d="M 798 150 C 814 140 832 136 838 122 C 844 108 834 98 820 104 C 804 112 796 134 798 150" strokeWidth="1.1"/>
            <path d="M 798 150 C 818 130 830 114 838 122" strokeWidth="0.7"/>

            {/* Group 6: Round-leafed sprig (eucalyptus style), right */}
            <path d="M 1050 180 C 1048 158 1044 134 1038 108" strokeWidth="1.4"/>
            <path d="M 1042 148 C 1056 138 1070 130 1076 118" strokeWidth="1.1"/>
            <ellipse cx="1082" cy="112" rx="14" ry="9" transform="rotate(-25 1082 112)" strokeWidth="1.1"/>
            <path d="M 1040 124 C 1054 112 1068 106 1074 92" strokeWidth="1.1"/>
            <ellipse cx="1080" cy="86" rx="13" ry="8" transform="rotate(-30 1080 86)" strokeWidth="1.1"/>
            <path d="M 1041 136 C 1026 126 1016 118 1010 106" strokeWidth="1.1"/>
            <ellipse cx="1004" cy="100" rx="14" ry="9" transform="rotate(20 1004 100)" strokeWidth="1.1"/>
            <path d="M 1038 108 C 1032 94 1024 80 1020 66" strokeWidth="1.1"/>
            <ellipse cx="1016" cy="60" rx="12" ry="8" transform="rotate(-5 1016 60)" strokeWidth="1.1"/>

            {/* Group 7: Large leaf cluster, far right */}
            <path d="M 1318 180 C 1316 158 1312 134 1306 108" strokeWidth="1.5"/>
            <path d="M 1306 108 C 1322 84 1350 70 1372 82 C 1394 94 1392 120 1370 132 C 1344 146 1308 142 1306 108" strokeWidth="1.3"/>
            <path d="M 1306 108 C 1336 104 1364 108 1372 82" strokeWidth="1.0"/>
            <path d="M 1318 98 C 1338 90 1356 86 1368 84" strokeWidth="0.7"/>
            <path d="M 1322 110 C 1340 104 1358 100 1370 96" strokeWidth="0.7"/>
            <path d="M 1318 122 C 1336 118 1352 114 1364 110" strokeWidth="0.7"/>
            <path d="M 1303 116 C 1286 94 1264 78 1260 58 C 1256 40 1268 32 1280 42 C 1292 52 1302 84 1303 116" strokeWidth="1.3"/>
            <path d="M 1303 116 C 1286 88 1274 58 1280 42" strokeWidth="0.9"/>
            <path d="M 1292 106 C 1282 84 1274 62 1272 48" strokeWidth="0.7"/>

            {/* Accent leaf, far right edge */}
            <path d="M 1426 180 C 1424 158 1420 132 1414 106" strokeWidth="1.3"/>
            <path d="M 1414 106 C 1422 88 1432 74 1436 56 C 1440 40 1432 30 1422 38 C 1410 48 1408 78 1414 106" strokeWidth="1.2"/>
            <path d="M 1414 106 C 1428 84 1434 60 1436 56" strokeWidth="0.8"/>

          </g>
        </svg>
      </div>

      {/* Secret Smiley Button */}
      <div className="fixed bottom-4 right-4">
        <Link
          href="/secret"
          className="inline-flex items-center justify-center w-12 h-12 bg-transparent hover:bg-gray-200/20 text-transparent hover:text-gray-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 opacity-0 hover:opacity-60"
          title="Secret Page"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            {/* Face outline */}
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            {/* Eyes */}
            <circle cx="9" cy="10" r="1"/>
            <circle cx="15" cy="10" r="1"/>
            {/* Smile */}
            <path d="M7.5 14c.83 1.5 2.5 2.5 4.5 2.5s3.67-1 4.5-2.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </Link>
      </div>

      {/* Hidden Admin Button */}
      <div className="fixed bottom-4 left-4">
        <a
          href="https://admin.elorasilver.com"
          className="inline-flex items-center justify-center w-8 h-8 bg-transparent text-transparent hover:text-gray-400 rounded-full transition-all duration-200 opacity-0 hover:opacity-50"
          title=""
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </a>
      </div>
    </main>
  );
}