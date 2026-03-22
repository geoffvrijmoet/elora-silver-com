import type { Metadata } from "next";
import { Rethink_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

const rethinkSans = Rethink_Sans({ 
  subsets: ["latin"],
  variable: "--font-rethink-sans"
});

export const metadata: Metadata = {
  title: "Elora Silver - Social Worker & Therapist",
  description: "Professional therapy and social work services by Elora Silver",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={rethinkSans.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
