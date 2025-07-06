'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface Nickname {
  id: string;
  nickname: string;
  status: string;
  player: {
    id: string;
    name: string;
    position: string;
    jerseyNumber: string;
  };
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  _count: {
    votes: number;
  };
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditNickname({ params }: PageProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [nickname, setNickname] = useState<Nickname | null>(null);
  const [newNickname, setNewNickname] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [nicknameId, setNicknameId] = useState<string>('');

  const fetchNickname = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/nicknames/${nicknameId}`);
      if (response.ok) {
        const data = await response.json();
        setNickname(data.nickname);
        setNewNickname(data.nickname.nickname);
        setStatus(data.nickname.status);
      } else {
        alert('Nickname not found');
        router.push('/admin');
      }
    } catch (error) {
      console.error('Error fetching nickname:', error);
      alert('Error loading nickname');
      router.push('/admin');
    } finally {
      setIsLoading(false);
    }
  }, [nicknameId, router]);

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setNicknameId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!session || session.user.role !== 'ADMIN') {
      router.push('/api/auth/signin');
      return;
    }

    if (nicknameId) {
      fetchNickname();
    }
  }, [session, nicknameId, router, fetchNickname]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNickname.trim()) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/nicknames', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nicknameId,
          nickname: newNickname.trim(),
          status,
        }),
      });

      if (response.ok) {
        alert('Nickname updated successfully!');
        router.push('/admin');
      } else {
        alert('Error updating nickname');
      }
    } catch (error) {
      console.error('Error updating nickname:', error);
      alert('Error updating nickname');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!nickname) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">Nickname not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-gradient-to-r from-black to-red-600 text-white p-6 rounded-lg">
        <h1 className="text-3xl font-bold">Edit Nickname</h1>
        <p className="text-red-100 mt-2">Modify nickname details and status</p>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 border">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Nickname Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-semibold">Player:</span> {nickname.player.name} (#{nickname.player.jerseyNumber})
            </div>
            <div>
              <span className="font-semibold">Position:</span> {nickname.player.position}
            </div>
            <div>
              <span className="font-semibold">Suggested by:</span> {nickname.user.name || nickname.user.email}
            </div>
            <div>
              <span className="font-semibold">Current votes:</span> {nickname._count.votes}
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
              Nickname
            </label>
            <input
              type="text"
              id="nickname"
              value={newNickname}
              onChange={(e) => setNewNickname(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
              placeholder="Enter nickname"
              required
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
            >
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin')}
              className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-400 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
