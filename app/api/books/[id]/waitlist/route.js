import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const client = await clientPromise;
    const db = client.db("digilib");
    const data = await request.json();
    
    const result = await db.collection("books").updateOne(
      { _id: new ObjectId(id) },
      { $addToSet: { waitlist: data.user_name } }
    );
    
    // Log activity
    await db.collection("users").updateOne(
      { name: data.user_name },
      { $push: { activityLog: { action: `Joined waitlist for book ID: ${id}`, timestamp: new Date() } } }
    );
    
    return NextResponse.json({ success: true, message: "Added to waitlist." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
