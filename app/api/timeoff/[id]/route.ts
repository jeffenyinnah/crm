import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  try {
    const docRef = doc(db, "timeOffRequests", id as string);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return NextResponse.json({ id: docSnap.id, ...docSnap.data() }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Time off request not found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch time off request' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing ID parameter' }, { status: 400 });
  }
  
  try {
    const { status } = await req.json();
    const docRef = doc(db, "timeOffRequests", id as string);
    await updateDoc(docRef, { status });
    return NextResponse.json({ message: 'Time off request updated successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update time off request' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  try {
    await deleteDoc(doc(db, "timeOffRequests", id as string));
    return NextResponse.json({ message: 'Time off request deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete time off request' }, { status: 500 });
  }
}

export function OPTIONS(req: NextRequest) {
  return NextResponse.json({ allow: ['GET', 'PUT', 'DELETE'] }, { status: 405 });
}
