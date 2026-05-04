const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function run() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('digilib');
    const collection = db.collection('books');

    // Reset all to in-stock
    await collection.updateMany({}, { 
      $set: { availableQuantity: 5, quantity: 5 } 
    });

    // Set first 2 to out-of-stock
    const booksToEmpty = await collection.find({}).limit(2).toArray();
    for (const book of booksToEmpty) {
      await collection.updateOne(
        { _id: book._id }, 
        { $set: { availableQuantity: 0 } }
      );
      console.log(`Setting "${book.title}" to Out of Stock`);
    }

    console.log('Successfully updated inventory.');
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();
