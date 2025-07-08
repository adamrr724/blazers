'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Session } from 'next-auth';

interface Player {
  id: string;
  name: string;
  position: string;
  jerseyNumber: string;
  imageUrl: string | null;
  officialNickname: string | null;
  nicknames: Array<{
    id: string;
    nickname: string;
    _count: {
      votes: number;
    };
  }>;
}

interface PlayerCardProps {
  player: Player;
  session: Session | null;
}

export default function PlayerCard({ player, session }: PlayerCardProps) {
  const [isVoting, setIsVoting] = useState(false);
  const [showSuggestForm, setShowSuggestForm] = useState(false);
  const [suggestion, setSuggestion] = useState('');

  const handleVote = async (nicknameId: string) => {
    if (!session) {
      alert('Please sign in to vote!');
      return;
    }
    
    setIsVoting(true);
    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nicknameId }),
      });

      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const handleSuggestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !suggestion.trim()) {
      if (!session) {
        alert('Please sign in to suggest nicknames!');
        return;
      }
      return;
    }

    try {
      const response = await fetch('/api/nicknames', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerId: player.id,
          nickname: suggestion.trim(),
        }),
      });

      if (response.ok) {
        setSuggestion('');
        setShowSuggestForm(false);
        alert('Nickname suggestion submitted for review!');
      }
    } catch (error) {
      console.error('Error submitting suggestion:', error);
    }
  };

  // Function to get local image path based on player name
  const getLocalImagePath = (playerName: string) => {
    const nameMap: { [key: string]: string } = {
      'Deni Avdija': '/images/players/avdija.png',
      'Sterling Henderson': '/images/players/henderson.png',
      'Shaedon Sharpe': '/images/players/sharpe.png',
      'Toumani Camara': '/images/players/camara.png',
      'Jerami Grant': '/images/players/grant.png',
      'Donovan Clingan': '/images/players/clingan.png',
      'Jrue Holiday': '/images/players/holiday.png',
      'Matisse Thybulle': '/images/players/thybulle.png',
      'Robert Williams III': '/images/players/williams.png',
      'Hansen Yang': '/images/players/yang.png',
      'Duop Reath': '/images/players/reath.png',
      'Kris Murray': '/images/players/murray.png',
      'Rayan Rupert': '/images/players/rupert.png',
      'Caleb Love': '/images/players/love.png',
      'Sidy Cissoko': '/images/players/cissoko.png'
    };
    return nameMap[playerName] || '/images/players/fallback.png';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
      <div className="aspect-w-3 aspect-h-4">
        <Image
          src={getLocalImagePath(player.name)}
          alt={`${player.name} headshot`}
          width={300}
          height={400}
          className={`w-full h-64 bg-gray-100 ${
            player.name === 'Hansen Yang' 
              ? 'object-contain object-center' 
              : 'object-cover object-top'
          }`}
          priority={false}
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2Y5ZmFmYiIvPgo8L3N2Zz4="
          onError={(e) => {
            // Fallback to local fallback image if player image fails to load
            const target = e.target as HTMLImageElement;
            target.src = '/images/players/fallback.png';
          }}
        />
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-black">#{player.jerseyNumber}</h3>
          <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">{player.position}</span>
        </div>
        
        <h2 className="text-2xl font-bold text-black mb-3">{player.name}</h2>
        
        <div className="space-y-3">
          <h4 className="font-bold text-gray-900 text-lg">Fan Nicknames:</h4>
          
          {player.nicknames.length === 0 ? (
            <p className="text-sm text-gray-600 italic">No approved nicknames yet</p>
          ) : (
            <div className="space-y-2">
              {player.nicknames.map((nickname) => (
                <div key={nickname.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                  <span className="font-semibold text-gray-900">{nickname.nickname}</span>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-700">{nickname._count.votes} votes</span>
                    {session ? (
                      <button
                        onClick={() => handleVote(nickname.id)}
                        disabled={isVoting}
                        className="bg-red-600 text-white px-4 py-2 text-sm font-medium rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isVoting ? 'Voting...' : 'Vote'}
                      </button>
                    ) : (
                      <button
                        onClick={() => alert('Please sign in to vote!')}
                        className="bg-gray-400 text-white px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-500 transition-colors"
                      >
                        Sign in to Vote
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-5 pt-4 border-t border-gray-200">
            {session && (
              !showSuggestForm ? (
                <button
                  onClick={() => setShowSuggestForm(true)}
                  className="w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-colors font-medium"
                >
                  Suggest New Nickname
                </button>
              ) : (
              <form onSubmit={handleSuggestion} className="space-y-3">
                <input
                  type="text"
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  placeholder="Enter nickname suggestion"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-500"
                />
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="flex-1 bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 font-medium transition-colors"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowSuggestForm(false);
                      setSuggestion('');
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-400 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
