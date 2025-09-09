import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-2xl text-center">
        {/* Hero Image */}
        <div className="mb-8">
          <div className="inline-block">
            <img 
              src="https://photos.psychologytoday.com/7e041e14-ca9a-4770-aab8-830bc7753fc9/1/320x400.jpeg" 
              alt="Elora Silver, LCSW" 
              className="w-48 h-60 object-cover rounded-xl shadow-lg"
            />
          </div>
        </div>

        {/* Main Content */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Elora Silver, LCSW</h1>
        <h2 className="text-xl md:text-2xl text-blue-700 mb-6 font-medium">Licensed Clinical Social Worker</h2>
        
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Website Under Construction</h3>
          <p className="text-lg text-gray-700 mb-6">
            My website is currently under construction. Please check back soon!
          </p>
          <a 
            href="mailto:info@elorasilver.com" 
            className="inline-flex items-center bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email me
          </a>
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
