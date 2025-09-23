import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="h-screen flex flex-col bg-gray-100 text-gray-800">
      <div className="w-full max-w-7xl mx-auto p-4 flex flex-col flex-grow">
        {/* Header Section */}
        <header className="text-center p-4 bg-white rounded-lg shadow-md mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Elora Silver, LCSW</h1>
          <p className="text-brand-primary font-medium">Licensed Clinical Social Worker</p>
        </header>

        {/* Main Content Flex Container */}
        <div className="flex-grow md:flex md:gap-4">
          {/* Left Column: Image + Intro */}
          <div className="flex-1 bg-brand-secondary p-6 rounded-lg shadow-sm flex flex-col mb-4 md:mb-0">
            <div className="flex-shrink-0 mx-auto">
              <Image
                src="https://photos.psychologytoday.com/7e041e14-ca9a-4770-aab8-830bc7753fc9/1/320x400.jpeg"
                alt="Elora Silver, LCSW"
                width={192}
                height={240}
                className="object-cover rounded-lg shadow-lg"
              />
            </div>
            <p className="text-sm text-gray-700 mt-4">
              A compassionate, client-centered therapist dedicated to helping you navigate life&apos;s challenges.
            </p>
          </div>

          {/* Middle Column: About + Services */}
          <div className="flex-1 flex flex-col gap-4 mb-4 md:mb-0">
            <div className="flex-grow bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg text-brand-primary mb-2">My Approach</h3>
              <p className="text-sm text-gray-600">
                I use a collaborative, strengths-based approach, integrating modalities like CBT and mindfulness to meet your unique needs. My goal is to create a safe, non-judgmental space where we can work together towards your healing and growth.
              </p>
            </div>
            <div className="flex-grow bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg text-brand-primary mb-2">Services</h3>
              <ul className="list-disc list-inside text-sm text-gray-600">
                <li>Individual Therapy</li>
                <li>Couples Counseling</li>
                <li>Anxiety & Depression</li>
                <li>Life Transitions & Stress Management</li>
                <li>Trauma-Informed Care</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Contact */}
          <div className="flex-1 bg-blue-50 p-6 rounded-lg shadow-sm flex flex-col justify-center items-center text-center">
            <h3 className="font-bold text-lg text-brand-primary mb-3">Get in Touch</h3>
            <p className="text-sm text-gray-600 mb-4">
              I am currently accepting new clients. Reach out to schedule a free 15-minute consultation to see if we are a good fit.
            </p>
            <a
              href="mailto:info@elorasilver.com"
              className="w-full text-center bg-brand-primary hover:opacity-90 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Email Elora
            </a>
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
  );
}
