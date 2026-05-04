import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db("digilib");
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const type = url.searchParams.get('type');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'userId required' }, { status: 400 });
    }

    // Active loans
    const currentlyBorrowed = await db.collection("transactions")
      .find({ userId, status: "issued" })
      .sort({ issueDate: -1 })
      .toArray();

    if (type === 'borrowed') {
      return NextResponse.json({ success: true, currentlyBorrowed });
    }

    // Stats
    const totalBorrowed = await db.collection("transactions").countDocuments({ userId });
    const totalReturned = await db.collection("transactions").countDocuments({ userId, status: "returned" });
    const activeLoans = currentlyBorrowed.length;

    // Count reviews given by this user across all books
    const booksWithUserReviews = await db.collection("books").find({
      "reviews.userId": userId
    }).toArray();
    let reviewsGiven = 0;
    booksWithUserReviews.forEach(book => {
      reviewsGiven += book.reviews.filter(r => r.userId === userId).length;
    });

    // Recommended books (random selection of 4)
    const recommended = await db.collection("books")
      .find({ isDeleted: { $ne: true } })
      .limit(4)
      .toArray();

    return NextResponse.json({
      success: true,
      totalBorrowed,
      totalReturned,
      activeLoans,
      reviewsGiven,
      currentlyBorrowed,
      recommended,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
