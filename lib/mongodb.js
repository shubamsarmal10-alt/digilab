import { MongoClient } from "mongodb";
import { MongoMemoryServer } from 'mongodb-memory-server';

let client;
let clientPromise;

async function setupMongoDB() {
  if (process.env.NODE_ENV === "development") {
    let globalWithMongo = global;
    
    if (!globalWithMongo._mongoClientPromise) {
      // First, try connecting to MONGODB_URI from env or local mongodb
      const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
      try {
        console.log(`Attempting to connect to ${process.env.MONGODB_URI ? 'MONGODB_URI' : 'local MongoDB'}...`);
        client = new MongoClient(uri, { serverSelectionTimeoutMS: 2000 });
        await client.connect();
        // Test connection
        await client.db("admin").command({ ping: 1 });
        console.log("✅ Connected to local MongoDB");
        
        // Ensure indexes exist on local MongoDB too
        const db = client.db("digilib");
        await db.collection("books").createIndex({ title: "text", author: "text" });
        await db.collection("users").createIndex({ email: 1 }, { unique: true });
        await db.collection("transactions").createIndex({ userId: 1, status: 1 });
        
        // Seed admin user if not exists
        await seedData(db);
        
        globalWithMongo._mongoClientPromise = Promise.resolve(client);
      } catch (e) {
        console.log("⚠️ Local MongoDB not found. Starting in-memory MongoDB for testing...");
        // Fallback to memory server
        if (!globalWithMongo._mongoServer) {
          globalWithMongo._mongoServer = await MongoMemoryServer.create();
        }
        const uri = globalWithMongo._mongoServer.getUri();
        client = new MongoClient(uri);
        globalWithMongo._mongoClientPromise = client.connect().then(async (c) => {
          const db = c.db("digilib");
          
          // Create Indexes
          await db.collection("books").createIndex({ title: "text", author: "text" });
          await db.collection("users").createIndex({ email: 1 }, { unique: true });
          await db.collection("transactions").createIndex({ userId: 1, status: 1 });

          // Seed data
          await seedData(db);

          return c;
        });
      }
    }
    return globalWithMongo._mongoClientPromise;
  } else {
    // production code
    client = new MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017");
    const c = await client.connect();
    const db = c.db("digilib");
    await db.collection("books").createIndex({ title: "text", author: "text" });
    await seedData(db);
    return c;
  }
}

async function seedData(db) {
  // Seed admin user
  const userCount = await db.collection("users").countDocuments();
  if (userCount === 0) {
    // Use bcryptjs to hash passwords — dynamic import since this is a module
    const bcrypt = await import('bcryptjs');
    const adminPassword = await bcrypt.hash('admin123', 12);
    const userPassword = await bcrypt.hash('user123', 12);
    
    await db.collection("users").insertMany([
      {
        name: "Admin User",
        email: "admin@digilib.com",
        password: adminPassword,
        role: "admin",
        isBlocked: false,
        joinedAt: new Date(),
        activityLog: [{ action: "Account Created", timestamp: new Date() }]
      },
      {
        name: "John Reader",
        email: "user@digilib.com",
        password: userPassword,
        role: "user",
        isBlocked: false,
        joinedAt: new Date(),
        activityLog: [{ action: "Account Created", timestamp: new Date() }]
      }
    ]);
    console.log("✅ Default users created (admin@digilib.com / admin123, user@digilib.com / user123)");
  }

  // Seed books
  const bookCount = await db.collection("books").countDocuments();
  if (bookCount === 0) {
    await db.collection("books").insertMany([
      { 
        title: "Database System Concepts", 
        author: "Abraham Silberschatz, Henry F. Korth", 
        category: "Education", 
        description: "Comprehensive introduction to the foundations of database systems, covering data models, database languages, database design, and more.",
        quantity: 5,
        availableQuantity: 5,
        isbn: "978-0073523323",
        averageRating: 0,
        reviews: [],
        chapters: [
          { title: "Introduction to Databases", pageNumber: 1 },
          { title: "Entity-Relationship Model", pageNumber: 45 },
          { title: "Relational Model", pageNumber: 89 },
          { title: "SQL Fundamentals", pageNumber: 133 },
          { title: "Advanced SQL", pageNumber: 189 }
        ],
        isDeleted: false,
        createdAt: new Date()
      },
      { 
        title: "Introduction to Algorithms", 
        author: "Thomas H. Cormen", 
        category: "Education", 
        description: "A comprehensive textbook covering a broad range of algorithms in depth, yet makes their design and analysis accessible to all levels.",
        quantity: 3,
        availableQuantity: 3,
        isbn: "978-0262033848",
        averageRating: 0,
        reviews: [],
        chapters: [
          { title: "Foundations", pageNumber: 1 },
          { title: "Sorting and Order Statistics", pageNumber: 60 },
          { title: "Data Structures", pageNumber: 120 },
          { title: "Graph Algorithms", pageNumber: 220 }
        ],
        isDeleted: false,
        createdAt: new Date()
      },
      { 
        title: "The Clean Coder", 
        author: "Robert C. Martin", 
        category: "Technology", 
        description: "A guide to professional conduct in software engineering. Learn what it means to behave as a true software craftsman.",
        quantity: 10,
        availableQuantity: 10,
        isbn: "978-0137081073",
        averageRating: 0,
        reviews: [],
        chapters: [
          { title: "Professionalism", pageNumber: 1 },
          { title: "Saying No", pageNumber: 25 },
          { title: "Saying Yes", pageNumber: 49 },
          { title: "Coding", pageNumber: 73 }
        ],
        isDeleted: false,
        createdAt: new Date()
      },
      {
        title: "Artificial Intelligence: A Modern Approach",
        author: "Stuart Russell, Peter Norvig",
        category: "Science",
        description: "The leading textbook in Artificial Intelligence, used in over 1500 universities worldwide. Comprehensive, up-to-date introduction to AI.",
        quantity: 4,
        availableQuantity: 4,
        isbn: "978-0136042594",
        averageRating: 0,
        reviews: [],
        chapters: [
          { title: "Introduction", pageNumber: 1 },
          { title: "Intelligent Agents", pageNumber: 34 },
          { title: "Search Algorithms", pageNumber: 64 },
          { title: "Machine Learning", pageNumber: 200 }
        ],
        isDeleted: false,
        createdAt: new Date()
      },
      {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        category: "Fiction",
        description: "A story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan, of lavish parties on Long Island.",
        quantity: 8,
        availableQuantity: 8,
        isbn: "978-0743273565",
        averageRating: 0,
        reviews: [],
        chapters: [
          { title: "Chapter 1 - Nick Arrives", pageNumber: 1 },
          { title: "Chapter 2 - Valley of Ashes", pageNumber: 23 },
          { title: "Chapter 3 - Gatsby's Party", pageNumber: 39 },
          { title: "Chapter 4 - Gatsby's Past", pageNumber: 61 }
        ],
        isDeleted: false,
        createdAt: new Date()
      },
      {
        title: "Computer Networking: A Top-Down Approach",
        author: "James F. Kurose, Keith W. Ross",
        category: "Education",
        description: "An innovative early-motivation, top-down approach to teaching computer networking with practical examples.",
        quantity: 6,
        availableQuantity: 6,
        isbn: "978-0133594140",
        averageRating: 0,
        reviews: [],
        chapters: [
          { title: "Computer Networks and the Internet", pageNumber: 1 },
          { title: "Application Layer", pageNumber: 63 },
          { title: "Transport Layer", pageNumber: 130 },
          { title: "Network Layer", pageNumber: 220 }
        ],
        isDeleted: false,
        createdAt: new Date()
      },
      {
        title: "Design Patterns",
        author: "Erich Gamma, Richard Helm, Ralph Johnson",
        category: "Technology",
        description: "Elements of Reusable Object-Oriented Software. The classic guide to design patterns in software engineering.",
        quantity: 4,
        availableQuantity: 4,
        isbn: "978-0201633610",
        averageRating: 0,
        reviews: [],
        chapters: [
          { title: "Introduction", pageNumber: 1 },
          { title: "Creational Patterns", pageNumber: 81 },
          { title: "Structural Patterns", pageNumber: 137 },
          { title: "Behavioral Patterns", pageNumber: 221 }
        ],
        isDeleted: false,
        createdAt: new Date()
      },
      {
        title: "A Brief History of Time",
        author: "Stephen Hawking",
        category: "Science",
        description: "A landmark volume in science writing exploring the outer limits of our knowledge of astrophysics and the nature of time.",
        quantity: 7,
        availableQuantity: 7,
        isbn: "978-0553380163",
        averageRating: 0,
        reviews: [],
        chapters: [
          { title: "Our Picture of the Universe", pageNumber: 1 },
          { title: "Space and Time", pageNumber: 15 },
          { title: "The Expanding Universe", pageNumber: 35 },
          { title: "Black Holes", pageNumber: 81 }
        ],
        isDeleted: false,
        createdAt: new Date()
      }
    ]);
    console.log("✅ Rich mock book data inserted (8 books).");
  }
}

export default setupMongoDB();
