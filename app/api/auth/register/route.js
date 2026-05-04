import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db("digilib");
    const data = await request.json();

    // Validation
    if (!data.name || !data.email || !data.password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (data.password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check for existing user
    const existingUser = await db.collection("users").findOne({ email: data.email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    const newUser = {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: 'user',
      isBlocked: false,
      joinedAt: new Date(),
      activityLog: [{ action: 'Account Created', timestamp: new Date() }]
    };

    const result = await db.collection("users").insertOne(newUser);

    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      userId: result.insertedId
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
