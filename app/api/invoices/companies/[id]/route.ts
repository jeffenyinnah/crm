
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Company } from '@/types/Invoice';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 });
    }

    const companyRef = doc(db, 'companies', id);
    const companySnap = await getDoc(companyRef);

    if (!companySnap.exists()) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    const companyData = companySnap.data() as Company;
    return NextResponse.json({ companyData });
  } catch (error) {
    console.error('Error fetching company:', error);
    return NextResponse.json({ error: 'Failed to fetch company' }, { status: 500 });
  }
}