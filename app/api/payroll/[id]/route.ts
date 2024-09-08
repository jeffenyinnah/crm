import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { PayrollRecord, ApiResponse } from '@/types/payroll';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse<PayrollRecord>>> {
  try {
    const payrollDoc = await getDoc(doc(db, 'payroll', params.id));
    if (!payrollDoc.exists()) {
      return NextResponse.json({ error: 'Payroll record not found' }, { status: 404 });
    }
    return NextResponse.json({ data: { id: payrollDoc.id, ...payrollDoc.data() } as PayrollRecord });
  } catch (error) {
    console.error('Error fetching payroll record:', error);
    return NextResponse.json({ error: 'Failed to fetch payroll record' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse<string>>> {
  try {
    const data: Partial<PayrollRecord> = await request.json();
    await updateDoc(doc(db, 'payroll', params.id), data);
    return NextResponse.json({ data: 'Payroll record updated successfully' });
  } catch (error) {
    console.error('Error updating payroll record:', error);
    return NextResponse.json({ error: 'Failed to update payroll record' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse<string>>> {
  try {
    await deleteDoc(doc(db, 'payroll', params.id));
    return NextResponse.json({ data: 'Payroll record deleted successfully' });
  } catch (error) {
    console.error('Error deleting payroll record:', error);
    return NextResponse.json({ error: 'Failed to delete payroll record' }, { status: 500 });
  }
}