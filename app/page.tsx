import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-secondary flex flex-col items-center px-4 text-gray-800">
      {/* Hero Section */}
      <section className="w-full max-w-4xl text-center py-20">
        <div className="mb-8">
          <div className="inline-block">
            <Image
              src="https://photos.psychologytoday.com/7e041e14-ca9a-4770-aab8-830bc7753fc9/1/320x400.jpeg" 
              alt="Elora Silver, LCSW" 
              width={192}
              height={240}
              className="object-cover rounded-xl shadow-lg"
            />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Elora Silver, LCSW</h1>
        <h2 className="text-xl md:text-2xl text-brand-primary mb-6 font-medium">Licensed Clinical Social Worker</h2>
        <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
          Compassionate, client-centered therapy to help you navigate life&apos;s challenges and find your path to healing.
        </p>
        <a
          href="mailto:info@elorasilver.com"
          className="inline-flex items-center bg-brand-primary hover:opacity-90 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Schedule a Free Consultation
        </a>
      </section>

      {/* About Me Section */}
      <section className="w-full max-w-4xl py-16 text-left bg-white rounded-lg shadow-sm p-10">
        <h3 className="text-3xl font-bold text-gray-900 mb-6">About Me</h3>
        <p className="text-lg text-gray-700 mb-4">
          [Placeholder for Elora&apos;s bio. This is a great place to share her background, her passion for therapy, and what clients can expect when working with her. It should be warm, approachable, and build trust.]
        </p>
        <p className="text-lg text-gray-700">
          [For example: &quot;I am a Licensed Clinical Social Worker with over 10 years of experience helping individuals and families. My approach is rooted in empathy and collaboration...&quot;]
        </p>
      </section>

      {/* Services Section */}
      <section className="w-full max-w-4xl py-20 text-left">
        <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">My Approach & Services</h3>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h4 className="text-xl font-semibold text-brand-primary mb-2">Individual Therapy</h4>
            <p className="text-gray-700">
              [Placeholder for a description of individual therapy. E.g., &quot;One-on-one sessions focused on your unique needs and goals. We&apos;ll work together to explore challenges, develop coping strategies, and foster personal growth.&quot;]
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h4 className="text-xl font-semibold text-brand-primary mb-2">Couples Counseling</h4>
            <p className="text-gray-700">
              [Placeholder for couples counseling. E.g., &quot;A safe space for partners to improve communication, resolve conflicts, and strengthen their relationship.&quot;]
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 md:col-span-2">
            <h4 className="text-xl font-semibold text-brand-primary mb-2">Specialties</h4>
            <p className="text-gray-700">
              [Placeholder for specialties. E.g., &quot;I specialize in areas such as anxiety, depression, trauma, life transitions, and relationship issues. My practice is inclusive and affirming for all individuals.&quot;]
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="w-full max-w-4xl py-20 text-center">
        <h3 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h3>
        <p className="text-lg text-gray-700 mb-8">
          I am currently accepting new clients. Reach out to schedule a free 15-minute consultation.
        </p>
        <a
          href="mailto:info@elorasilver.com"
          className="inline-flex items-center bg-brand-primary hover:opacity-90 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Email Elora
        </a>
      </section>
      
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
