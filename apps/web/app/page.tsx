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

            {/* Group 1: Pinnate fern frond, far left */}
            {/* Rachis */}
            <path d="M 57 180 C 56 156 54 130 52 104 C 51 84 50 64 49 44" strokeWidth="1.4"/>
            {/* Right pinnae - oval leaflets curving off rachis */}
            <path d="M 53 155 C 63 148 76 140 82 129 C 87 119 83 111 74 115 C 64 119 53 137 53 155" strokeWidth="1.1"/>
            <path d="M 52 126 C 63 117 77 107 83 94 C 88 82 83 74 74 78 C 64 83 52 106 52 126" strokeWidth="1.1"/>
            <path d="M 51 97 C 61 87 73 75 78 62 C 82 50 77 43 68 47 C 58 52 50 75 51 97" strokeWidth="1.1"/>
            {/* Left pinnae - alternating offset */}
            <path d="M 53 142 C 43 133 31 123 25 110 C 19 98 23 90 32 95 C 41 100 52 121 53 142" strokeWidth="1.1"/>
            <path d="M 52 113 C 41 102 28 91 22 78 C 16 65 20 58 29 63 C 39 68 52 93 52 113" strokeWidth="1.1"/>
            <path d="M 50 83 C 39 72 28 59 23 47 C 19 36 23 30 32 35 C 41 40 50 64 50 83" strokeWidth="1.1"/>

            {/* Group 2: Monstera deliciosa leaf, center-left */}
            {/* Petiole */}
            <path d="M 252 180 C 251 166 249 150 248 136" strokeWidth="1.4"/>
            {/* Leaf outline with characteristic deep lobes */}
            <path d="M 248 136 C 262 132 274 122 280 110 C 284 100 281 91 274 92 C 267 93 262 103 262 112 C 261 100 260 86 258 78 C 264 67 268 54 268 45 C 268 37 263 32 256 36 C 250 40 249 52 250 62 C 251 52 252 40 251 32 C 250 25 247 22 244 26 C 242 30 241 42 242 52 C 243 60 246 67 249 72 C 242 81 234 92 231 102 C 229 113 234 121 241 118 C 248 115 251 104 251 94 C 250 106 246 118 240 126 C 234 134 236 142 245 141 C 248 140 248 136 248 136 Z" strokeWidth="1.2"/>
            {/* Midrib */}
            <path d="M 248 136 C 251 108 254 80 256 52 C 258 38 257 28 251 24" strokeWidth="1.0"/>
            {/* Fenestrations (characteristic oval holes near midrib) */}
            <ellipse cx="254" cy="66" rx="4" ry="6" transform="rotate(-20 254 66)" strokeWidth="0.9"/>
            <ellipse cx="253" cy="92" rx="4" ry="5" transform="rotate(-15 253 92)" strokeWidth="0.9"/>
            {/* Lateral veins */}
            <path d="M 252 116 C 260 108 268 101 274 93" strokeWidth="0.7"/>
            <path d="M 252 98 C 258 90 264 82 266 74" strokeWidth="0.7"/>
            <path d="M 252 116 C 244 107 238 100 234 92" strokeWidth="0.7"/>
            <path d="M 252 98 C 244 89 240 81 238 73" strokeWidth="0.7"/>

            {/* Group 3: Tall pinnate fern frond, center-left */}
            {/* Rachis */}
            <path d="M 430 180 C 429 153 426 124 422 94 C 418 70 414 48 410 27" strokeWidth="1.4"/>
            {/* Right pinnae */}
            <path d="M 426 156 C 437 148 452 138 459 126 C 465 115 460 106 451 110 C 441 115 426 136 426 156" strokeWidth="1.1"/>
            <path d="M 424 127 C 436 117 451 106 458 92 C 464 79 459 70 449 74 C 439 79 423 103 424 127" strokeWidth="1.1"/>
            <path d="M 421 98 C 432 87 445 74 450 60 C 454 47 449 39 440 43 C 430 48 420 74 421 98" strokeWidth="1.1"/>
            <path d="M 418 69 C 426 57 435 46 437 33 C 439 22 434 17 427 21 C 419 26 417 51 418 69" strokeWidth="1.1"/>
            {/* Left pinnae - alternating offset */}
            <path d="M 426 143 C 414 133 399 122 392 109 C 385 96 389 87 399 92 C 409 97 425 121 426 143" strokeWidth="1.1"/>
            <path d="M 423 114 C 410 102 394 89 386 75 C 379 62 383 53 394 58 C 405 64 423 92 423 114" strokeWidth="1.1"/>
            <path d="M 420 84 C 408 71 394 57 387 43 C 381 31 386 24 396 29 C 407 35 420 64 420 84" strokeWidth="1.1"/>
            <path d="M 416 54 C 405 42 395 30 392 18 C 389 8 393 3 402 8 C 410 14 416 40 416 54" strokeWidth="1.0"/>

            {/* Group 4: Tall grass blades with seed heads, center */}
            <path d="M 578 180 C 577 154 575 126 572 96 C 570 74 567 56 565 38" strokeWidth="1.1"/>
            <path d="M 591 180 C 590 154 589 126 590 96 C 591 74 593 54 594 34" strokeWidth="1.1"/>
            <path d="M 604 180 C 604 154 606 126 610 98 C 614 76 619 58 622 40" strokeWidth="1.1"/>
            <path d="M 617 180 C 619 156 623 130 629 104 C 635 80 641 62 645 46" strokeWidth="1.1"/>
            {/* Seed heads */}
            <path d="M 565 38 C 563 28 560 17 557 8" strokeWidth="0.9"/>
            <path d="M 557 8 C 552 4 548 2 546 4" strokeWidth="0.7"/>
            <path d="M 557 8 C 562 4 566 2 568 4" strokeWidth="0.7"/>
            <path d="M 594 34 C 592 24 592 14 594 4" strokeWidth="0.9"/>
            <path d="M 594 4 C 590 0 587 0 586 2" strokeWidth="0.7"/>
            <path d="M 594 4 C 598 0 601 0 602 2" strokeWidth="0.7"/>

            {/* Group 5: Heart-leaf philodendron, center-right */}
            {/* Petiole */}
            <path d="M 804 180 C 803 162 801 142 800 122" strokeWidth="1.5"/>
            {/* Leaf outline - broad heart-shaped with pointed tip */}
            <path d="M 800 122 C 813 118 828 108 838 94 C 846 80 844 64 834 52 C 824 42 812 38 810 36 C 812 28 812 20 810 14 C 808 20 808 28 806 36 C 798 36 786 40 778 50 C 768 62 766 78 774 92 C 782 108 796 118 800 122 Z" strokeWidth="1.3"/>
            {/* Midrib */}
            <path d="M 800 122 C 804 96 807 68 810 40 C 811 28 810 18 810 14" strokeWidth="1.0"/>
            {/* Lateral veins - right */}
            <path d="M 803 104 C 813 98 822 90 830 80" strokeWidth="0.7"/>
            <path d="M 805 88 C 815 82 822 72 826 62" strokeWidth="0.7"/>
            <path d="M 807 72 C 815 66 820 56 822 48" strokeWidth="0.7"/>
            {/* Lateral veins - left */}
            <path d="M 803 104 C 794 98 786 90 778 80" strokeWidth="0.7"/>
            <path d="M 805 88 C 797 82 790 72 786 62" strokeWidth="0.7"/>
            <path d="M 807 72 C 800 66 795 56 793 48" strokeWidth="0.7"/>

            {/* Group 6: Eucalyptus branch with oval leaves, right */}
            <path d="M 1052 180 C 1050 156 1046 130 1040 104" strokeWidth="1.4"/>
            {/* Right-side stems and oval leaves */}
            <path d="M 1044 150 C 1053 142 1064 135 1072 124" strokeWidth="1.1"/>
            <ellipse cx="1078" cy="118" rx="13" ry="8" transform="rotate(-30 1078 118)" strokeWidth="1.1"/>
            <path d="M 1043 128 C 1052 118 1064 110 1072 98" strokeWidth="1.1"/>
            <ellipse cx="1078" cy="92" rx="12" ry="8" transform="rotate(-25 1078 92)" strokeWidth="1.1"/>
            <path d="M 1041 108 C 1050 96 1060 86 1066 74" strokeWidth="1.1"/>
            <ellipse cx="1072" cy="68" rx="12" ry="7" transform="rotate(-20 1072 68)" strokeWidth="1.1"/>
            {/* Left-side stems and oval leaves */}
            <path d="M 1042 138 C 1031 128 1020 120 1013 108" strokeWidth="1.1"/>
            <ellipse cx="1007" cy="102" rx="13" ry="8" transform="rotate(20 1007 102)" strokeWidth="1.1"/>
            <path d="M 1040 116 C 1030 104 1020 92 1015 78" strokeWidth="1.1"/>
            <ellipse cx="1011" cy="72" rx="12" ry="7" transform="rotate(15 1011 72)" strokeWidth="1.1"/>
            <path d="M 1038 94 C 1030 80 1024 66 1022 52" strokeWidth="1.1"/>
            <ellipse cx="1018" cy="46" rx="11" ry="7" transform="rotate(-5 1018 46)" strokeWidth="1.1"/>

            {/* Group 7: Monstera deliciosa leaf, far right (mirrored) */}
            {/* Petiole */}
            <path d="M 1315 180 C 1314 166 1312 150 1311 136" strokeWidth="1.4"/>
            {/* Leaf outline - mirrored lobes */}
            <path d="M 1311 136 C 1296 132 1284 122 1278 110 C 1274 100 1277 91 1284 92 C 1291 93 1296 103 1296 112 C 1297 100 1298 86 1300 78 C 1294 67 1290 54 1290 45 C 1290 37 1295 32 1302 36 C 1308 40 1309 52 1308 62 C 1307 52 1306 40 1307 32 C 1308 25 1311 22 1314 26 C 1316 30 1317 42 1316 52 C 1315 60 1312 67 1309 72 C 1316 81 1324 92 1327 102 C 1329 113 1324 121 1317 118 C 1310 115 1307 104 1307 94 C 1308 106 1312 118 1318 126 C 1324 134 1322 142 1313 141 C 1310 140 1311 136 1311 136 Z" strokeWidth="1.2"/>
            {/* Midrib */}
            <path d="M 1311 136 C 1308 108 1304 80 1302 52 C 1300 38 1301 28 1307 24" strokeWidth="1.0"/>
            {/* Fenestrations */}
            <ellipse cx="1305" cy="66" rx="4" ry="6" transform="rotate(20 1305 66)" strokeWidth="0.9"/>
            <ellipse cx="1306" cy="92" rx="4" ry="5" transform="rotate(15 1306 92)" strokeWidth="0.9"/>
            {/* Lateral veins */}
            <path d="M 1308 116 C 1300 108 1293 101 1288 93" strokeWidth="0.7"/>
            <path d="M 1308 98 C 1302 90 1296 82 1294 74" strokeWidth="0.7"/>
            <path d="M 1308 116 C 1316 107 1320 100 1322 92" strokeWidth="0.7"/>
            <path d="M 1308 98 C 1314 89 1318 81 1320 73" strokeWidth="0.7"/>

            {/* Accent: Small fern frond, far right edge */}
            <path d="M 1426 180 C 1425 164 1423 146 1421 126" strokeWidth="1.3"/>
            <path d="M 1421 155 C 1430 148 1439 140 1440 130 C 1440 120 1435 113 1427 117 C 1421 121 1421 138 1421 155" strokeWidth="1.1"/>
            <path d="M 1420 130 C 1429 121 1438 112 1439 100 C 1440 89 1434 82 1427 86 C 1421 90 1420 110 1420 130" strokeWidth="1.1"/>
            <path d="M 1421 155 C 1413 147 1405 138 1405 128 C 1405 119 1411 114 1418 118" strokeWidth="1.1"/>
            <path d="M 1420 130 C 1411 120 1403 111 1402 99 C 1401 88 1407 82 1415 86" strokeWidth="1.1"/>

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