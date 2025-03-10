import axios from 'axios';
import OpenAI from 'openai';
import { connectDB } from './db.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function handleTelegramWebhook(req, res) {
  const { message } = req.body;
  if (!message) return res.sendStatus(200);

  const chatId = message.chat.id;
  const userMessage = message.text;

  try {
    const db = await connectDB();
    const statusCollection = db.collection('status');
    const config = await statusCollection.findOne({ _id: 'config' });

    // Your existing logic here...
    // (e.g., send auto-reply if offline, call GPT-3.5-turbo, etc.)

    res.sendStatus(200);
  } catch (error) {
    console.error("Error:", error);
    res.sendStatus(500);
  }
}