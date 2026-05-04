import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

export async function PUT(request) {
  try {
    const client = await clientPromise;
    const db = client.db("digilib");
    const data = await request.json();

    if (!data.userId) {
      return NextResponse.json({ success: false, error: 'userId required' }, { status: 400 });
    }

    const updateData = {};

    // Profile update
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;

    // Password change
    if (data.newPassword) {
      if (data.currentPassword) {
        const user = await db.collection("users").findOne({ _id: new ObjectId(data.userId) });
        if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        
        const isValid = await bcrypt.compare(data.currentPassword, user.password);
        if (!isValid) return NextResponse.json({ success: false, error: 'Current password is incorrect' }, { status: 400 });
      }
      updateData.password = await bcrypt.hash(data.newPassword, 12);
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ success: false, error: 'No data to update' }, { status: 400 });
    }

    await db.collection("users").updateOne(
      { _id: new ObjectId(data.userId) },
      { $set: updateData }
    );

    return NextResponse.json({ success: true, message: 'Profile updated' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
