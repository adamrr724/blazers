import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import PlayerCard from "@/components/PlayerCard";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  const players = await db.player.findMany({
    include: {
      nicknames: {
        where: { status: "APPROVED" },
        include: {
          _count: {
            select: { votes: true }
          }
        }
      }
    }
  });

  return (
    <div className="space-y-8">
      <div className="text-center bg-gradient-to-r from-red-600 to-black text-white py-12 px-4 rounded-lg">
        <h1 className="text-5xl font-bold mb-4">
          Vote for Your Favorite Player Nicknames
        </h1>
        <p className="text-xl text-red-100 max-w-3xl mx-auto mb-4">
          Welcome to the Trail Blazers fan nickname voting platform! Cast your votes for the best 
          fan-suggested nicknames for your favorite players. You can vote for one nickname per player.
        </p>
        <p className="text-sm text-red-200 max-w-2xl mx-auto">
          <em>Note: This is an unofficial fan-created app and is not affiliated with the Portland Trail Blazers or NBA.</em>
        </p>
        {!session && (
          <div className="mt-6">
            <Link 
              href="/auth/signin"
              className="inline-block bg-white text-red-600 px-6 py-3 rounded-lg font-bold hover:bg-red-50 transition-colors"
            >
              Sign In to Vote & Suggest
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {players.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600 text-lg">No players found. Please check the database.</p>
          </div>
        ) : (
          players.map((player) => (
            <PlayerCard key={player.id} player={player} session={session} />
          ))
        )}
      </div>
    </div>
  );
}

