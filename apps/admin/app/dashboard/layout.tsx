'use client';

import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/dashboard', label: 'Chat', match: (p: string) => p === '/dashboard' },
  { href: '/dashboard/analytics', label: 'Analytics', match: (p: string) => p.startsWith('/dashboard/analytics') },
  { href: '/dashboard/qr', label: 'QR Codes', match: (p: string) => p.startsWith('/dashboard/qr') },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

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
            {tabs.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className={`py-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                  tab.match(pathname)
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
