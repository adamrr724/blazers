import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { playerId, nickname } = await request.json();
    
    if (!playerId || !nickname) {
      return NextResponse.json({ error: 'Player ID and nickname are required' }, { status: 400 });
    }

    // Check if player exists
    const player = await db.player.findUnique({
      where: { id: playerId }
    });

    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    // Check if nickname already exists for this player
    const existingNickname = await db.nickname.findUnique({
      where: {
        nickname_playerId: {
          nickname: nickname.trim(),
          playerId
        }
      }
    });

    if (existingNickname) {
      return NextResponse.json({ error: 'This nickname already exists for this player' }, { status: 400 });
    }

    // Create new nickname suggestion
    const newNickname = await db.nickname.create({
      data: {
        nickname: nickname.trim(),
        playerId,
        suggestedBy: session.user.id,
        status: 'PENDING'
      }
    });

    return NextResponse.json({ success: true, nickname: newNickname });
  } catch (error) {
    console.error('Error creating nickname:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const nicknames = await db.nickname.findMany({
      include: {
        player: true,
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
    });

    return NextResponse.json(nicknames);
  } catch (error) {
    console.error('Error fetching nicknames:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
