import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db("digilib");
    
    // Most popular books (top 10)
    const popularBooks = await db.collection("transactions").aggregate([
      { $group: { _id: "$bookId", totalIssued: { $sum: 1 }, title: { $first: "$bookTitle" } } },
      { $sort: { totalIssued: -1 } },
      { $limit: 10 }
    ]).toArray();

    // Total Counts
    const totalBooks = await db.collection("books").countDocuments({ isDeleted: { $ne: true } });
    const totalUsers = await db.collection("users").countDocuments();
    const activeIssues = await db.collection("transactions").countDocuments({ status: "issued" });

    // Total reviews across all books
    const booksWithReviews = await db.collection("books").aggregate([
      { $project: { reviewCount: { $size: { $ifNull: ["$reviews", []] } } } },
      { $group: { _id: null, total: { $sum: "$reviewCount" } } }
    ]).toArray();
    const totalReviews = booksWithReviews.length > 0 ? booksWithReviews[0].total : 0;

    // Category Distribution
    const categoryStats = await db.collection("books").aggregate([
      { $match: { isDeleted: { $ne: true } } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).toArray();

    // Recent Activity (last 10 transactions)
    const recentActivity = await db.collection("transactions")
      .find()
      .sort({ _id: -1 })
      .limit(10)
      .toArray();
    
    return NextResponse.json({ 
      success: true, 
      stats: {
        totalBooks,
        totalUsers,
        activeIssues,
        totalReviews,
        popularBooks,
        categoryStats,
        recentActivity
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
