import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db("digilib");
    const data = await request.json();

    const { transactionId, bookId, userId } = data;

    if (!transactionId || !bookId) {
      return NextResponse.json({ success: false, error: "Transaction and Book ID required" }, { status: 400 });
    }

    // Find the existing transaction to check due date
    const loan = await db.collection("transactions").findOne({ 
      _id: new ObjectId(transactionId), 
      userId: userId, 
      status: "issued" 
    });

    if (!loan) {
      return NextResponse.json({ success: false, error: "Active transaction not found" }, { status: 404 });
    }

    // Calculate Fine
    const now = new Date();
    const dueDate = new Date(loan.dueDate);
    let fineAmount = 0;
    
    if (now > dueDate) {
      const diffTime = Math.abs(now - dueDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      fineAmount = diffDays * 3; // 3 Rs per day
    }

    // Update transaction status
    const result = await db.collection("transactions").updateOne(
      { _id: new ObjectId(transactionId) },
      { $set: { status: "returned", returnDate: now, fineAmount: fineAmount } }
    );

    // Increment available quantity in books
    await db.collection("books").updateOne(
      { _id: new ObjectId(bookId) },
      { $inc: { availableQuantity: 1 } }
    );

    // Update user activity log (optional but good for ADBMS)
    await db.collection("users").updateOne(
      { email: userId }, // In my seed script, userId was email or id. Let's be careful.
      { $push: { activityLog: { action: "Returned Book", bookId, timestamp: new Date() } } }
    );

    return NextResponse.json({ success: true, message: "Book returned successfully" });
  } catch (error) {
    console.error("Return error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
