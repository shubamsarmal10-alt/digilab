import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db("digilib");
    const data = await request.json();

    const bookId = new ObjectId(data.bookId);
    const userId = data.userId;

    // Check book availability
    const book = await db.collection("books").findOne({ _id: bookId });
    if (!book) return NextResponse.json({ success: false, error: "Book not found" }, { status: 404 });
    if (book.availableQuantity <= 0) return NextResponse.json({ success: false, error: "No copies available" }, { status: 400 });

    // Check if already borrowed by this user
    const existing = await db.collection("transactions").findOne({
      bookId, userId, status: "issued"
    });
    if (existing) return NextResponse.json({ success: false, error: "You already have this book borrowed" }, { status: 400 });

    // Create transaction
    const transaction = {
      userId,
      bookId,
      bookTitle: book.title,
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      status: "issued",
    };
    await db.collection("transactions").insertOne(transaction);

    // Decrement available
    await db.collection("books").updateOne(
      { _id: bookId, availableQuantity: { $gt: 0 } },
      { $inc: { availableQuantity: -1 } }
    );

    return NextResponse.json({ success: true, message: "Book issued successfully" });
  } catch (error) {
    console.error("Issue error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
