import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, getDocs, query, where, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }
  try {
    const querySnapshot = await getDocs(collection(db, "timeOffRequests"));
    const q = query(collection(db, "timeOffRequests"), where("userId", "==", userId));
    const requests = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    return NextResponse.json(requests, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch time off requests' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }
  try {
    const { employeeId, leaveType, leaveFrom, leaveTo, days, userId } = await req.json();
    
    // Fetch employee using document ID
    const employeeDoc = await getDoc(doc(db, "employees", employeeId));
    
    if (!employeeDoc.exists()) {
      console.error(`No employee found with id: ${employeeId}`);
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    const employeeData = employeeDoc.data();
    const employeeName = employeeData.name;

    const docRef = await addDoc(collection(db, "timeOffRequests"), {
      employeeId,
      employeeName,
      leaveType,
      leaveFrom,
      leaveTo,
      days,
      status: "Pending",
      userId: userId
    });
    await updateDoc(docRef, { id: docRef.id });
    return NextResponse.json({ id: docRef.id, message: 'Time off request created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating time off request:', error);
    return NextResponse.json({ error: 'Failed to create time off request' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing ID parameter' }, { status: 400 });
  }

  try {
    const { status } = await req.json();
    const docRef = doc(db, "timeOffRequests", id);
    await updateDoc(docRef, { status });
    return NextResponse.json({ message: 'Time off request updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating time off request:', error);
    return NextResponse.json({ 
      error: 'Failed to update time off request', 
      details: (error as Error).message 
    }, { status: 500 });
  }
}

export function OPTIONS(req: NextRequest) {
  return NextResponse.json({ allow: ['GET', 'POST'] }, { status: 405 });
}
