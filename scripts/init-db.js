const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");
    const db = client.db("digilib");

    // Create Index
    await db.collection("books").createIndex({ title: 1 });
    console.log("Created index on books.title");

    // Add Mock Data
    const books = [
      {
        title: "Database System Concepts",
        author: "Abraham Silberschatz, Henry F. Korth",
        category: "Education",
        available: true,
        reviews: []
      },
      {
        title: "Introduction to Algorithms",
        author: "Thomas H. Cormen",
        category: "Education",
        available: true,
        reviews: []
      },
      {
        title: "The Clean Coder",
        author: "Robert C. Martin",
        category: "Technology",
        available: true,
        reviews: []
      },
      {
        title: "Artificial Intelligence: A Modern Approach",
        author: "Stuart Russell, Peter Norvig",
        category: "Education",
        available: true,
        reviews: []
      },
      {
        title: "Computer Networking: A Top-Down Approach",
        author: "James F. Kurose, Keith W. Ross",
        category: "Education",
        available: true,
        reviews: []
      },
      {
        title: "Design Patterns: Elements of Reusable Object-Oriented Software",
        author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
        category: "Technology",
        available: true,
        reviews: []
      }
    ];

    const result = await db.collection("books").insertMany(books);
    console.log(`${result.insertedCount} mock books inserted.`);

  } finally {
    await client.close();
  }
}

run().catch(console.dir);
