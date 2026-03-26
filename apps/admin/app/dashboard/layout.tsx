'use client';

import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAnalytics = pathname.startsWith('/dashboard/analytics');

  return (
    <div className="min-h-screen">
      <header className="border-b bg-white">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">
            Elora Silver Admin
          </h1>
          <UserButton />
        </div>
        <div className="max-w-4xl mx-auto px-4">
          <nav className="flex gap-4 -mb-px">
            <Link
              href="/dashboard"
              className={`py-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                !isAnalytics
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Chat
            </Link>
            <Link
              href="/dashboard/analytics"
              className={`py-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                isAnalytics
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Analytics
            </Link>
          </nav>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
