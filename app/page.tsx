'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ContactModal } from '@/components/contact-modal';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <main className="h-screen flex flex-col bg-muted-green-light text-dark-green-text">
        <div className="w-full max-w-7xl mx-auto p-4 flex flex-col flex-grow">
          {/* Header Section */}
          <header className="text-center p-4 rounded-lg shadow-bottom mb-4">
            <h1 className="text-3xl font-bold">Elora Silver, LCSW</h1>
            <p className="font-medium opacity-80">Licensed Clinical Social Worker</p>
          </header>

          {/* Main Content Grid Container */}
          <div className="flex-grow grid md:grid-cols-3 md:grid-rows-2 gap-4">
            {/* Left Column: Image + Intro */}
            <div className="md:row-span-2 p-6 rounded-lg flex flex-col">
              <div className="flex-shrink-0 mx-auto">
                <Image
                  src="https://photos.psychologytoday.com/7e041e14-ca9a-4770-aab8-830bc7753fc9/1/320x400.jpeg"
                  alt="Elora Silver, LCSW"
                  width={384}
                  height={480}
                  className="object-cover rounded-lg"
                />
              </div>
              <p className="text-sm mt-4 opacity-90">
                A compassionate, client-centered therapist dedicated to helping you navigate life&apos;s challenges.
              </p>
            </div>

            {/* My Approach Section (Top Right) */}
            <div className="md:col-span-2 p-6 rounded-lg shadow-md">
              <h3 className="font-bold text-lg mb-2">My Approach</h3>
              <p className="text-sm opacity-80">
                I use a collaborative, strengths-based approach, integrating modalities like CBT and mindfulness to meet your unique needs. My goal is to create a safe, non-judgmental space where we can work together towards your healing and growth. I believe in fostering a therapeutic relationship built on trust, empathy, and respect.
              </p>
            </div>

            {/* Services Section (Bottom Middle) */}
            <div className="p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Services</h3>
              <ul className="list-disc list-inside text-sm opacity-80">
                <li>Individual Therapy</li>
                <li>Anxiety & Depression</li>
                <li>Life Transitions & Stress Management</li>
                <li>Trauma-Informed Care</li>
              </ul>
            </div>

            {/* Get in Touch Section (Bottom Right) */}
            <div className="relative p-6 rounded-lg flex flex-col justify-center items-center text-center">
              <h3 className="font-bold text-lg mb-3">Get in Touch</h3>
              <p className="text-sm mb-4 opacity-80">
                I am currently accepting new clients. Reach out to schedule a free 15-minute consultation.
              </p>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="w-auto bg-muted-green-dark text-dark-green-text border border-dark-green-text/50 px-6 py-2 transition-all duration-300 hover:shadow-glow"
              >
                Contact Me
              </Button>
              <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            </div>
          </div>
        </div>


        {/* Secret Game Button */}
        <div className="fixed bottom-4 right-4">
          <Link
            href="/game"
            className="inline-flex items-center justify-center w-12 h-12 bg-transparent hover:bg-gray-200 text-transparent hover:text-gray-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 opacity-0 hover:opacity-100"
            title="Secret Game"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </Link>
        </div>
      </main>
    </>
  );
}