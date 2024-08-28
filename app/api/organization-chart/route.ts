import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

// GET all nodes
export async function GET() {
  try {
    const chartCollection = collection(db, 'organizationChart');
    const chartSnapshot = await getDocs(chartCollection);
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
  try {
    const data = await request.json();
    const docRef = await addDoc(collection(db, 'organizationChart'), data);
    return NextResponse.json({ id: docRef.id, ...data }, { status: 201 });
  } catch (error) {
    console.error('Error adding node:', error);
    return NextResponse.json({ error: 'Error adding node' }, { status: 500 });
  }
}