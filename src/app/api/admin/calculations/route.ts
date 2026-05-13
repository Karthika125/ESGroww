import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const hospitals = await prisma.hospital.findMany({
      include: {
        electricityData: true,
        waterData: true,
        wasteData: true,
        fuelData: true,
      },
    });

    // Generate calculations data
    const calculationsData = hospitals.map(hospital => {
      const categories = ['Electricity', 'Water', 'Waste', 'Fuel'];
      return {
        id: hospital.id,
        hospitalName: hospital.hospitalName,
        categories: categories.map(cat => {
          let months = 0;
          if (cat === 'Electricity') months = hospital.electricityData.length;
          if (cat === 'Water') months = hospital.waterData.length;
          if (cat === 'Waste') months = hospital.wasteData.length;
          if (cat === 'Fuel') months = hospital.fuelData.length;

          const completeness = Math.min((months / 12) * 100, 100);
          const confidence = months >= 9 ? 'High' : months >= 6 ? 'Medium' : months >= 3 ? 'Low' : 'Insufficient';
          const status =
            completeness === 100
              ? 'Complete'
              : completeness >= 50
              ? 'Partial'
              : completeness >= 25
              ? 'Low'
              : 'Insufficient';

          return {
            category: cat,
            months,
            completeness: Math.round(completeness),
            confidence,
            status,
          };
        }),
      };
    });

    return NextResponse.json(calculationsData.length > 0 ? calculationsData[0].categories : []);
  } catch (error) {
    console.error('Error fetching calculations:', error);
    return NextResponse.json({ error: 'Failed to fetch calculations' }, { status: 500 });
  }
}
