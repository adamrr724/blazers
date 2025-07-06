import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const nickname = await db.nickname.findUnique({
      where: { id },
      include: {
        player: true,
        user: true,
        _count: {
          select: { votes: true }
        }
      }
    });

    if (!nickname) {
      return NextResponse.json({ error: 'Nickname not found' }, { status: 404 });
    }

    return NextResponse.json({ nickname });
  } catch (error) {
    console.error('Error fetching nickname:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
