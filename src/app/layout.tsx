import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navigation from "@/components/Navigation";
import Image from "next/image";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blazers Nicknames",
  description: "Unofficial fan voting app for Portland Trail Blazers player nicknames - not affiliated with the team",
  icons: {
    icon: "/images/blazers-logo.png",
    shortcut: "/images/blazers-logo.png",
    apple: "/images/blazers-logo.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        <Providers>
          <header className="bg-black text-white shadow-lg">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-4 hover:opacity-80 transition-opacity cursor-pointer">
                  <Image 
                    src="/images/blazers-logo.png" 
                    alt="Portland Trail Blazers" 
                    width={48}
                    height={48}
                  />
                  <div>
                    <h1 className="text-xl font-bold">Trail Blazers</h1>
                    <p className="text-sm text-gray-300">Fan Nickname Voting</p>
                  </div>
                </Link>
                <Navigation />
              </div>
            </div>
          </header>
          <main className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-8">
              {children}
            </div>
          </main>
          <footer className="bg-gray-900 text-white py-8 mt-12">
            <div className="container mx-auto px-4 text-center">
              <p className="text-sm text-gray-400 mb-2">
                <strong>Disclaimer:</strong> This is an unofficial fan-created application and is not affiliated with, endorsed by, or connected to the Portland Trail Blazers, the NBA, or any official team entities.
              </p>
              <p className="text-xs text-gray-500">
                All team logos, player images, and trademarks are property of their respective owners. This site is for entertainment purposes only.
              </p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
