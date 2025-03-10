import express from 'express';
import axios from 'axios';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();
const app = express();
app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize MongoDB (replace with your URI)
const client = new MongoClient(process.env.MONGODB_URI);
let db;
let statusCollection;

async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db('chatbot');
    statusCollection = db.collection('status');
    // Initialize default status if missing
    const existingStatus = await statusCollection.findOne({ _id: 'config' });
    if (!existingStatus) {
      await statusCollection.insertOne({
        _id: 'config',
        isOnline: true,
        autoReply: 'Hi, I’m offline. I’ll be back soon!',
      });
    }
  }
  return { db, statusCollection };
}

// Telegram webhook handler
app.post('/', async (req, res) => {
  try {
    await connectDB();
    const { message } = req.body;
    if (!message) return res.sendStatus(200);

    const chatId = message.chat.id;
    const userMessage = message.text;

    // Check if bot is online
    const config = await statusCollection.findOne({ _id: 'config' });

    // If offline, send auto-reply
    if (!config.isOnline) {
      await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`, {
        chat_id: chatId,
        text: config.autoReply,
      });
      return res.sendStatus(200);
    }

    // Generate AI response
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }],
    });
    const gptResponse = completion.choices[0].message.content;

    // Send response to Telegram
    await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`, {
      chat_id: chatId,
      text: gptResponse,
    });

    res.sendStatus(200);
  } catch (error) {
    console.error("Error:", error);
    res.sendStatus(500);
  }
});

export default app;