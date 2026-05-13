import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const hospitals = await prisma.hospital.findMany({
      include: {
        esgScores: {
          select: { overallScore: true },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        uploads: {
          select: { id: true },
        },
        _count: {
          select: { uploads: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(hospitals);
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    return NextResponse.json({ error: 'Failed to fetch hospitals' }, { status: 500 });
  }
}
