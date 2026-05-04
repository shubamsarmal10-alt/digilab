import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db("digilib");
    const book = await db.collection("books").findOne({ _id: new ObjectId(id) });
    
    if (!book) {
      return NextResponse.json({ success: false, error: "Book not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, book });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db("digilib");
    const data = await request.json();
    
    const result = await db.collection("books").updateOne(
      { _id: new ObjectId(id) },
      { $set: data }
    );
    
    return NextResponse.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db("digilib");
    
    // Soft delete
    const result = await db.collection("books").updateOne(
      { _id: new ObjectId(id) },
      { $set: { isDeleted: true } }
    );
    
    return NextResponse.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
