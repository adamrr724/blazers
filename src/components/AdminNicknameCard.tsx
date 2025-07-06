'use client';

import { useState } from 'react';

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
}

interface AdminNicknameCardProps {
  nickname: Nickname;
}

export default function AdminNicknameCard({ nickname }: AdminNicknameCardProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleModerate = async (action: 'approve' | 'reject') => {
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/admin/nicknames', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nicknameId: nickname.id,
          action,
        }),
      });

      if (response.ok) {
        window.location.reload();
      } else {
        alert('Error processing request');
      }
    } catch (error) {
      console.error('Error moderating nickname:', error);
      alert('Error processing request');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-bold text-black mb-2">&quot;{nickname.nickname}&quot;</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p><span className="font-semibold">Player:</span> {nickname.player.name} (#{nickname.player.jerseyNumber})</p>
            <p><span className="font-semibold">Position:</span> {nickname.player.position}</p>
            <p><span className="font-semibold">Suggested by:</span> {nickname.user.name || nickname.user.email}</p>
          </div>
        </div>

        <div className="flex space-x-3 pt-3">
          <button
            onClick={() => handleModerate('approve')}
            disabled={isProcessing}
            className="flex-1 bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isProcessing ? 'Processing...' : 'Approve'}
          </button>
          <button
            onClick={() => handleModerate('reject')}
            disabled={isProcessing}
            className="flex-1 bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isProcessing ? 'Processing...' : 'Reject'}
          </button>
        </div>
      </div>
    </div>
  );
}
