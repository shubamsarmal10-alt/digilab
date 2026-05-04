const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function seedAdmin() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB...");
    const db = client.db("digilib");

    const adminEmail = "admin@digilib.com";
    const existingAdmin = await db.collection("users").findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("Admin user already exists.");
    } else {
      const hashedPassword = await bcrypt.hash("admin123", 12);
      const adminUser = {
        name: "Admin User",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        isBlocked: false,
        joinedAt: new Date(),
        activityLog: [{ action: "Account Created", timestamp: new Date() }]
      };

      await db.collection("users").insertOne(adminUser);
      console.log("✅ Admin user seeded successfully!");
      console.log("Email: admin@digilib.com");
      console.log("Password: admin123");
    }

    // Also seed a test user while we're at it
    const userEmail = "user@digilib.com";
    const existingUser = await db.collection("users").findOne({ email: userEmail });
    if (!existingUser) {
      const hashedUserPassword = await bcrypt.hash("user123", 12);
      await db.collection("users").insertOne({
        name: "John Reader",
        email: userEmail,
        password: hashedUserPassword,
        role: "user",
        isBlocked: false,
        joinedAt: new Date(),
        activityLog: [{ action: "Account Created", timestamp: new Date() }]
      });
      console.log("✅ Test user seeded successfully!");
    }

  } catch (error) {
    console.error("Error seeding admin:", error);
  } finally {
    await client.close();
  }
}

seedAdmin();
