import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db("digilib");
    const url = new URL(request.url);
    
    // Build search query based on params
    let query = { isDeleted: { $ne: true } };
    const category = url.searchParams.get("category");
    const q = url.searchParams.get("q");
    const title = url.searchParams.get("title");
    
    if (q) {
      query.$text = { $search: q };
    } else {
      if (category && category !== 'All') query.category = new RegExp(category, 'i');
      if (title) query.title = new RegExp(title, 'i');
    }
    
    // Support sorting
    let sort = { title: 1 };
    const sortBy = url.searchParams.get("sort");
    if (sortBy === "rating") sort = { averageRating: -1 };
    else if (sortBy === "newest") sort = { _id: -1 };
    else if (sortBy === "available") sort = { availableQuantity: -1 };
    
    const books = await db.collection("books")
      .find(query)
      .sort(sort)
      .toArray();
      
    return NextResponse.json({ success: true, books });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db("digilib");
    const data = await request.json();
    
    const newBook = {
      title: data.title,
      author: data.author,
      category: data.category || "General",
      description: data.description || "",
      isbn: data.isbn || "",
      quantity: parseInt(data.quantity) || 1,
      availableQuantity: parseInt(data.quantity) || 1,
      reviews: [],
      averageRating: 0,
      chapters: data.chapters || [],
      isDeleted: false,
      createdAt: new Date(),
    };
    
    const result = await db.collection("books").insertOne(newBook);
    return NextResponse.json({ success: true, insertedId: result.insertedId, message: "Book added successfully." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const client = await clientPromise;
    const db = client.db("digilib");
    const data = await request.json();
    const { _id, ...updateData } = data;
    
    const result = await db.collection("books").updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    );
    
    return NextResponse.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const client = await clientPromise;
    const db = client.db("digilib");
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    
    if (id) {
      // Soft delete
      const result = await db.collection("books").updateOne(
        { _id: new ObjectId(id) },
        { $set: { isDeleted: true } }
      );
      return NextResponse.json({ success: true, deletedCount: result.modifiedCount });
    }
    
    return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
