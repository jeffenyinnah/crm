import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, getDocs, Timestamp, where } from 'firebase/firestore';

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const invoicesRef = collection(db, 'invoices');
    const q = query(invoicesRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    const monthlyTotals: { [key: string]: number } = {};


    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const date = data.invoice_date.toDate();
      const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      
      if (!monthlyTotals[month]) {
        monthlyTotals[month] = 0;
      }
      monthlyTotals[month] += data.total_amount;
    });

    const formattedData = Object.entries(monthlyTotals).map(([month, total]) => ({
      month,
      total
    }));

    formattedData.sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Firestore Error:', error);
    return NextResponse.json({ error: 'Failed to fetch monthly invoice totals' }, { status: 500 });
  }
}
