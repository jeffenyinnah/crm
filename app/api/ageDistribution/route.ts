import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, getDocs, where } from 'firebase/firestore';

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const employeesRef = collection(db, 'employees');
    const q = query(employeesRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    const ageDistribution: { [key: string]: number } = {};

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const age = data.age;
      const ageRange = `${Math.floor(age / 10) * 10}-${Math.floor(age / 10) * 10 + 9}`;
      
      if (!ageDistribution[ageRange]) {
        ageDistribution[ageRange] = 0;
      }
      ageDistribution[ageRange]++;
    });

    const formattedData = Object.entries(ageDistribution).map(([ageRange, count]) => ({
      ageRange,
      count
    }));

    formattedData.sort((a, b) => parseInt(a.ageRange) - parseInt(b.ageRange));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Firestore Error:', error);
    return NextResponse.json({ error: 'Failed to fetch age distribution' }, { status: 500 });
  }
}