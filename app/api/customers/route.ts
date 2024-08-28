import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { MongoError } from 'mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("crm");
    const customers = await db.collection("customers").find({}).toArray();
    return NextResponse.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ error: 'Error fetching customers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("crm");
    const { name, email, phone } = await request.json();
    const result = await db.collection("customers").insertOne({ name, email, phone });
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating customer:', error);
    if (error instanceof MongoError && error.code === 11000) {
      return NextResponse.json({ error: 'Duplicate email address' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error creating customer' }, { status: 500 });
  }
}