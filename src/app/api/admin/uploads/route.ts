import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const uploads = await prisma.upload.findMany({
      include: {
        hospital: {
          select: { hospitalName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    // Transform data for frontend
    const uploadsData = uploads.map(u => ({
      id: u.id,
      fileName: u.fileUrl.split('/').pop() || 'File',
      category: u.category,
      month: u.month,
      year: u.year,
      uploadDate: u.createdAt,
      status: 'Uploaded',
      hospitalName: u.hospital.hospitalName,
    }));

    // Calculate category summary
    const categories = ['Electricity', 'Water', 'Waste', 'Fuel', 'Refrigerant', 'Transport'];
    const categorySummary = categories.map(cat => {
      const categoryFiles = uploadsData.filter(u => u.category === cat);
      const completeness = Math.min((categoryFiles.length / 12) * 100, 100);
      return {
        category: cat,
        totalFiles: categoryFiles.length,
        completeness: Math.round(completeness),
        status:
          completeness === 100
            ? 'Complete'
            : completeness >= 50
            ? 'Partial'
            : completeness >= 25
            ? 'Low Data'
            : 'Insufficient',
      };
    });

    return NextResponse.json({
      uploads: uploadsData,
      categories: categorySummary,
    });
  } catch (error) {
    console.error('Error fetching uploads:', error);
    return NextResponse.json({ error: 'Failed to fetch uploads' }, { status: 500 });
  }
}
