'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Nickname {
  id: string;
  nickname: string;
  status: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  _count: {
    votes: number;
  };
}

interface AdminNicknameManagerProps {
  nickname: Nickname;
}

export default function AdminNicknameManager({ nickname }: AdminNicknameManagerProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    router.push(`/admin/nickname/${nickname.id}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete the nickname "${nickname.nickname}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch('/api/admin/nicknames', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nicknameId: nickname.id })
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert('Error deleting nickname');
      }
    } catch (error) {
      console.error('Error deleting nickname:', error);
      alert('Error deleting nickname');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 border">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <span className="text-lg font-semibold text-gray-900">&quot;{nickname.nickname}&quot;</span>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
              nickname.status === 'APPROVED' 
                ? 'bg-green-100 text-green-800'
                : nickname.status === 'REJECTED'
                ? 'bg-red-100 text-red-800'
                : 'bg-orange-100 text-orange-800'
            }`}>
              {nickname.status}
            </span>
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Suggested by {nickname.user.name || nickname.user.email} • {nickname._count.votes} votes
          </div>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={handleEdit}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
