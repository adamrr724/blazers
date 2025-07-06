'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Navigation() {
  const { data: session } = useSession();

  return (
    <nav className="flex items-center space-x-6">
      {session?.user?.role === 'ADMIN' && (
        <Link href="/admin" className="hover:text-red-500 transition-colors font-medium">
          Admin
        </Link>
      )}
      {session ? (
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-300">Welcome, {session.user?.name || session.user?.email}</span>
          <button 
            onClick={() => signOut()}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors font-medium"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div className="flex items-center space-x-3">
          <Link href="/auth/signin" className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors font-medium">
            Sign In
          </Link>
          <Link href="/auth/signup" className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors font-medium">
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
}
