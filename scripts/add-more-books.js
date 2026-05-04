const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db("digilib");

    const newBooks = [
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

    const result = await db.collection("books").insertMany(newBooks);
    console.log(`${result.insertedCount} new books inserted.`);

  } finally {
    await client.close();
  }
}

run().catch(console.dir);
