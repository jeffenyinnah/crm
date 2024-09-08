import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where, updateDoc } from 'firebase/firestore';

// GET all nodes
export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {

    const chartCollection = collection(db, 'organizationChart');  
    const q = query(chartCollection, where('userId', '==', userId));
    const chartSnapshot = await getDocs(q);
    const chartData = chartSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return NextResponse.json(chartData);
  } catch (error) {
    console.error('Error fetching organization chart:', error);
    return NextResponse.json({ error: 'Error fetching organization chart' }, { status: 500 });
  }
}

// POST new node
export async function POST(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }
  try {
    const data = await request.json();
    data.userId = userId;
    const docRef = await addDoc(collection(db, 'organizationChart'), data);
    // Update the document with its own ID
    await updateDoc(docRef, { id: docRef.id });
    const newNode = { id: docRef.id, ...data };
    return NextResponse.json(newNode, { status: 201 });
  } catch (error) {
    console.error('Error adding node:', error);
    return NextResponse.json({ error: 'Error adding node' }, { status: 500 });
  }
}