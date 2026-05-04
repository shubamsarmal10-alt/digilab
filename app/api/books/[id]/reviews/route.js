import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db("digilib");
    const book = await db.collection("books").findOne({ _id: new ObjectId(id) });
    
    if (!book) return NextResponse.json({ success: false, error: "Book not found" }, { status: 404 });
    
    return NextResponse.json({ success: true, reviews: book.reviews || [] });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db("digilib");
    const data = await request.json();
    
    const review = {
      user: data.user,
      userId: data.userId,
      rating: Number(data.rating),
      comment: data.comment,
      date: new Date()
    };
    
    // Push review
    await db.collection("books").updateOne(
      { _id: new ObjectId(id) },
      { $push: { reviews: review } }
    );

    // Recalculate average rating
    const book = await db.collection("books").findOne({ _id: new ObjectId(id) });
    if (book?.reviews?.length > 0) {
      const avg = book.reviews.reduce((sum, r) => sum + r.rating, 0) / book.reviews.length;
      await db.collection("books").updateOne(
        { _id: new ObjectId(id) },
        { $set: { averageRating: Math.round(avg * 10) / 10 } }
      );
    }
    
    return NextResponse.json({ success: true, message: "Review added successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
