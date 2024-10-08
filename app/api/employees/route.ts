import { NextRequest, NextResponse } from 'next/server';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// GET all employees
export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const employeesCollection = collection(db, 'employees');
    const q = query(employeesCollection, where('userId', '==', userId));
    const employeesSnapshot = await getDocs(q);
    const employees = employeesSnapshot.docs.map(doc => ({
      id: doc.id,  // Include the document ID
      ...doc.data()
    }));
    return NextResponse.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json({ error: 'Error fetching employees' }, { status: 500 });
  }
}

// POST new employee
export async function POST(request: NextRequest) {
  const data = await request.json();
  const { userId } = data;

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {    
    // First, add the document to get an auto-generated ID
    const docRef = await addDoc(collection(db, 'employees'), data);
    
    // Then, update the document to include its ID as a field
    const updatedData = { ...data, id: docRef.id };
    await setDoc(doc(db, 'employees', docRef.id), updatedData);

    return NextResponse.json(updatedData, { status: 201 });
  } catch (error) {
    console.error('Error adding employee:', error);
    return NextResponse.json({ error: 'Error adding employee' }, { status: 500 });
  }
}