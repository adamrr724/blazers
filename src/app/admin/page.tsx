import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import AdminNicknameCard from '@/components/AdminNicknameCard';
import AdminNicknameManager from '@/components/AdminNicknameManager';

export default async function AdminPage() {
  const session = await auth();

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/api/auth/signin');
  }

  const pendingNicknames = await db.nickname.findMany({
    where: { status: 'PENDING' },
    include: {
      player: true,
      user: true
    },
    orderBy: { createdAt: 'desc' }
  });

  // Get players with their nicknames organized
  const playersWithNicknames = await db.player.findMany({
    include: {
      nicknames: {
        include: {
          user: true,
          _count: {
            select: { votes: true }
          }
        },
        orderBy: {
          votes: {
            _count: 'desc'
          }
        }
      }
    },
    orderBy: { name: 'asc' }
  });

  const allNicknames = await db.nickname.findMany({
    include: {
      player: true,
      user: true,
      _count: {
        select: { votes: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between bg-gradient-to-r from-black to-red-600 text-white p-6 rounded-lg">
        <div>
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-red-200 mt-1">Fan-created nickname voting management</p>
        </div>
        <div className="text-sm text-red-100">
          Welcome, {session.user.name || session.user.email}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg border">
          <h3 className="text-lg font-bold text-gray-900">Pending Approval</h3>
          <p className="text-4xl font-bold text-orange-600 mt-2">{pendingNicknames.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg border">
          <h3 className="text-lg font-bold text-gray-900">Total Nicknames</h3>
          <p className="text-4xl font-bold text-blue-600 mt-2">{allNicknames.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg border">
          <h3 className="text-lg font-bold text-gray-900">Approved</h3>
          <p className="text-4xl font-bold text-green-600 mt-2">
            {allNicknames.filter(n => n.status === 'APPROVED').length}
          </p>
        </div>
      </div>

      {pendingNicknames.length > 0 ? (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Pending Nicknames</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingNicknames.map((nickname) => (
              <AdminNicknameCard
                key={nickname.id}
                nickname={{
                  ...nickname,
                  player: {
                    ...nickname.player,
                    jerseyNumber: String(nickname.player.jerseyNumber),
                  },
                }}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-gray-600">No pending nicknames</h2>
          <p className="text-gray-500">All nickname suggestions have been reviewed.</p>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Nicknames by Player</h2>
        <div className="space-y-6">
          {playersWithNicknames.map((player) => (
            <div key={player.id} className="bg-white shadow-lg rounded-lg p-6 border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-600">#{player.jerseyNumber}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{player.name}</h3>
                    <p className="text-sm text-gray-600">{player.position}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {player.nicknames.length} nickname{player.nicknames.length !== 1 ? 's' : ''}
                </div>
              </div>

              {player.nicknames.length === 0 ? (
                <p className="text-gray-500 italic">No nicknames yet</p>
              ) : (
                <div className="space-y-3">
                  {player.nicknames.map((nickname) => (
                    <AdminNicknameManager
                      key={nickname.id}
                      nickname={nickname}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
