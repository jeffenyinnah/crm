import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where, updateDoc } from 'firebase/firestore';
import { Invoice, Company } from '@/types/Invoice';



export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const companiesRef = collection(db, 'companies');
    const q = query(companiesRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const companies = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Company));
    return NextResponse.json(companies);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
    const userId = req.nextUrl.searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
  try {
    const companyData = await req.json();
    
    const docRef = await addDoc(collection(db, 'companies'), { ...companyData, userId });
    await updateDoc(docRef, { id: docRef.id });
    return NextResponse.json({ id: docRef.id, ...companyData } as Company);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
  }
}
