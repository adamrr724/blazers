import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { nicknameId } = await request.json();
    
    if (!nicknameId) {
      return NextResponse.json({ error: 'Nickname ID is required' }, { status: 400 });
    }

    // Check if nickname exists and is approved
    const nickname = await db.nickname.findUnique({
      where: { id: nicknameId },
      include: { player: true }
    });

    if (!nickname) {
      return NextResponse.json({ error: 'Nickname not found' }, { status: 404 });
    }

    if (nickname.status !== 'APPROVED') {
      return NextResponse.json({ error: 'Nickname not approved' }, { status: 400 });
    }

    // Check if user has already voted for this player
    const existingVote = await db.vote.findFirst({
      where: {
        userId: session.user.id,
        nickname: {
          playerId: nickname.playerId
        }
      }
    });

    if (existingVote) {
      // Update existing vote
      await db.vote.update({
        where: { id: existingVote.id },
        data: { nicknameId }
      });
    } else {
      // Create new vote
      await db.vote.create({
        data: {
          userId: session.user.id,
          nicknameId
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error voting:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
