import { NextRequest, NextResponse } from 'next/server';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, orderBy, limit, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Invoice } from '@/types/Invoice';

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const q = query(collection(db, 'invoices'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const invoices = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Invoice));
    
    return NextResponse.json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { userId } = data;

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    // Get the last invoice number
    const invoicesRef = collection(db, 'invoices');
    const q = query(invoicesRef, where('userId', '==', userId), orderBy('invoiceNumber', 'desc'), limit(1));
    const querySnapshot = await getDocs(q);
    
    let nextInvoiceNumber = 1;
    if (!querySnapshot.empty) {
      const lastInvoice = querySnapshot.docs[0].data() as Invoice;
      nextInvoiceNumber = (lastInvoice.invoiceNumber || 0) + 1;
    }

    // Add the new invoice with the generated invoice number
    const newInvoiceData = {
      ...data,
      invoiceNumber: nextInvoiceNumber,
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(invoicesRef, newInvoiceData);
    
    // Update the document with its own ID
    await updateDoc(docRef, { id: docRef.id });

    const newInvoice = { id: docRef.id, ...newInvoiceData };

    return NextResponse.json(newInvoice);
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const invoice: Invoice = await request.json();
    const { id, ...updateData } = invoice;
    await updateDoc(doc(db, 'invoices', id), updateData);
    
    return NextResponse.json({ message: 'Invoice updated successfully' });
  } catch (error) {
    console.error('Error updating invoice:', error);
    return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const invoiceId = request.nextUrl.searchParams.get('id');
  console.log("invoiceId", invoiceId);
  try {
    await deleteDoc(doc(db, 'invoices'));
    return NextResponse.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return NextResponse.json({ error: 'Failed to delete invoice' }, { status: 500 });
  }
}