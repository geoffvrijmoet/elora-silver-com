import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 text-gray-800">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header Section */}
        <header className="text-center p-6 bg-white rounded-lg shadow-md mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Elora Silver, LCSW</h1>
          <p className="text-brand-primary font-medium">Licensed Clinical Social Worker</p>
        </header>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* Left Column: Image + Intro */}
          <div className="md:col-span-1 bg-brand-secondary p-6 rounded-lg shadow-sm">
            <Image
              src="https://photos.psychologytoday.com/7e041e14-ca9a-4770-aab8-830bc7753fc9/1/320x400.jpeg" 
              alt="Elora Silver, LCSW" 
              width={192}
              height={240}
              className="object-cover rounded-lg shadow-lg mx-auto mb-4"
            />
            <p className="text-sm text-gray-700">
              A compassionate, client-centered therapist dedicated to helping you navigate life&apos;s challenges.
            </p>
          </div>

          {/* Middle Column: About + Services */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg text-brand-primary mb-2">My Approach</h3>
              <p className="text-sm text-gray-600">
                I use a collaborative, strengths-based approach, integrating modalities like CBT and mindfulness to meet your unique needs.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg text-brand-primary mb-2">Services</h3>
              <ul className="list-disc list-inside text-sm text-gray-600">
                <li>Individual Therapy</li>
                <li>Couples Counseling</li>
                <li>Anxiety & Depression</li>
                <li>Life Transitions</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Contact */}
          <div className="md:col-span-1 bg-blue-50 p-6 rounded-lg shadow-sm flex flex-col justify-center items-center text-center">
            <h3 className="font-bold text-lg text-brand-primary mb-3">Get in Touch</h3>
            <p className="text-sm text-gray-600 mb-4">
              Accepting new clients. Schedule a free 15-minute consultation today.
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
