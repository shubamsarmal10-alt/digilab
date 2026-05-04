import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db("digilib");
    const data = await request.json();

    const { bookId, userId, userName, rating, comment } = data;

    if (!bookId || !rating || !comment) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const newReview = {
      userId,
      userName,
      rating: parseInt(rating),
      comment,
      createdAt: new Date(),
    };

    // Add review to book and update average rating
    const book = await db.collection("books").findOne({ _id: new ObjectId(bookId) });
    if (!book) {
      return NextResponse.json({ success: false, error: "Book not found" }, { status: 404 });
    }

    const reviews = book.reviews || [];
    reviews.push(newReview);

    const totalRating = reviews.reduce((acc, rev) => acc + rev.rating, 0);
    const averageRating = totalRating / reviews.length;

    await db.collection("books").updateOne(
      { _id: new ObjectId(bookId) },
      { 
        $set: { 
          reviews: reviews,
          averageRating: averageRating
        } 
      }
    );

    return NextResponse.json({ success: true, message: "Review added successfully" });
  } catch (error) {
    console.error("Review error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
