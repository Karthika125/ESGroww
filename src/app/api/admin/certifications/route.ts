import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const hospitals = await prisma.hospital.findMany({
      select: {
        id: true,
        hospitalName: true,
      },
      take: 20,
    });

    const data = hospitals.map(h => ({
      id: h.id,
      name: h.hospitalName,
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching certifications:', error);
    return NextResponse.json({ error: 'Failed to fetch certifications' }, { status: 500 });
  }
}
