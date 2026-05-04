import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

import { ObjectId } from 'mongodb';

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db("digilib");
    const data = await request.json();
    
    const newUser = {
      name: data.name,
      email: data.email,
      role: data.role || "member",
      isBlocked: false,
      joinedAt: new Date(),
      activityLog: [{ action: "Account Created", timestamp: new Date() }]
    };
    
    const result = await db.collection("users").insertOne(newUser);
    return NextResponse.json({ success: true, insertedId: result.insertedId, message: "User registered successfully." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const client = await clientPromise;
    const db = client.db("digilib");
    const data = await request.json();
    const { id, ...updateData } = data;
    
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    return NextResponse.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db("digilib");
    const users = await db.collection("users").find({}).sort({ joinedAt: -1 }).toArray();
    return NextResponse.json({ success: true, users });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
