import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import OpenAI from "openai";
import { connectDB } from './lib/db.js';
import { handleTelegramWebhook } from './lib/telegramHandler.js';
import { handleToggleStatus } from './lib/statusHandler.js';

const app = express();
const port = process.env.PORT || 5000; // Define PORT here

app.use(cors());
app.use(express.json());

// Initialize DB
await connectDB();

// Routes
app.post('/telegram-webhook', handleTelegramWebhook);
app.post('/toggle-status', handleToggleStatus);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      store: true,
      messages: [{ role: "user", content: message }],
    });
    // Extract only the plain text content from the response message object
    const replyMessage = completion.choices[0].message.content;
    res.json({ reply: replyMessage });
  } catch (error) {
    console.error("API call error:", error.response ? error.response.data : error);
    res.status(500).json({ error: "Error processing request" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); */

// Start server
app.listen(port, () => console.log(`Server running on port ${port}`));