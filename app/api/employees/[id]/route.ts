import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

// GET single employee
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const docRef = doc(db, 'employees', params.id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return NextResponse.json({ id: docSnap.id, ...docSnap.data() });
    } else {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching employee:', error);
    return NextResponse.json({ error: 'Error fetching employee' }, { status: 500 });
  }
}

// PUT update employee
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const docRef = doc(db, 'employees', params.id);
    await updateDoc(docRef, data);
    return NextResponse.json({ id: params.id, ...data });
  } catch (error) {
    console.error('Error updating employee:', error);
    return NextResponse.json({ error: 'Error updating employee' }, { status: 500 });
  }
}

// DELETE employee
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const docRef = doc(db, 'employees', params.id);
    await deleteDoc(docRef);
    return NextResponse.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    return NextResponse.json({ error: 'Error deleting employee' }, { status: 500 });
  }
}