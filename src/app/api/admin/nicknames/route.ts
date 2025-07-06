import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { nicknameId, action } = await request.json();
    
    if (!nicknameId || !action) {
      return NextResponse.json({ error: 'Nickname ID and action are required' }, { status: 400 });
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const nickname = await db.nickname.findUnique({
      where: { id: nicknameId }
    });

    if (!nickname) {
      return NextResponse.json({ error: 'Nickname not found' }, { status: 404 });
    }

    const newStatus = action === 'approve' ? 'APPROVED' : 'REJECTED';
    
    const updatedNickname = await db.nickname.update({
      where: { id: nicknameId },
      data: { status: newStatus }
    });

    return NextResponse.json({ success: true, nickname: updatedNickname });
  } catch (error) {
    console.error('Error moderating nickname:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { nicknameId } = await request.json();
    
    if (!nicknameId) {
      return NextResponse.json({ error: 'Nickname ID is required' }, { status: 400 });
    }

    const nickname = await db.nickname.findUnique({
      where: { id: nicknameId }
    });

    if (!nickname) {
      return NextResponse.json({ error: 'Nickname not found' }, { status: 404 });
    }

    // Delete all votes for this nickname first
    await db.vote.deleteMany({
      where: { nicknameId }
    });

    // Delete the nickname
    await db.nickname.delete({
      where: { id: nicknameId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting nickname:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { nicknameId, nickname: newNickname, status } = await request.json();
    
    if (!nicknameId || !newNickname) {
      return NextResponse.json({ error: 'Nickname ID and new nickname are required' }, { status: 400 });
    }

    const nickname = await db.nickname.findUnique({
      where: { id: nicknameId }
    });

    if (!nickname) {
      return NextResponse.json({ error: 'Nickname not found' }, { status: 404 });
    }

    const updatedNickname = await db.nickname.update({
      where: { id: nicknameId },
      data: { 
        nickname: newNickname,
        ...(status && { status })
      }
    });

    return NextResponse.json({ success: true, nickname: updatedNickname });
  } catch (error) {
    console.error('Error updating nickname:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
