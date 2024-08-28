import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

// PUT update node
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const docRef = doc(db, 'organizationChart', params.id);
    await updateDoc(docRef, data);
    return NextResponse.json({ id: params.id, ...data });
  } catch (error) {
    console.error('Error updating node:', error);
    return NextResponse.json({ error: 'Error updating node' }, { status: 500 });
  }
}

// DELETE node
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const docRef = doc(db, 'organizationChart', params.id);
    await deleteDoc(docRef);
    return NextResponse.json({ message: 'Node deleted successfully' });
  } catch (error) {
    console.error('Error deleting node:', error);
    return NextResponse.json({ error: 'Error deleting node' }, { status: 500 });
  }
}