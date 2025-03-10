import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config(); // Load environment variables

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // Increase the server selection timeout (default is 30000 ms)
  serverSelectionTimeoutMS: 5000, // try 5000 ms or adjust as needed
})
.then(() => console.log("MongoDB connected!"))
.catch((error) => console.error("MongoDB connection error:", error));


if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in .env!");
}

const client = new MongoClient(MONGODB_URI);
let db;

export async function connectDB() {
  if (!db) {
    try {
      await client.connect();
      db = client.db('chatbot');
      console.log("Connected to MongoDB!");
      
      // Initialize default status
      const statusCollection = db.collection('status');
      const existingStatus = await statusCollection.findOne({ _id: 'config' });
      if (!existingStatus) {
        await statusCollection.insertOne({
          _id: 'config',
          isOnline: true,
          autoReply: 'Hi, I’m offline. I’ll be back soon!',
        });
      }
    } catch (error) {
      console.error("MongoDB connection error:", error);
      process.exit(1); // Exit if DB connection fails
    }
  }
  return db;
}