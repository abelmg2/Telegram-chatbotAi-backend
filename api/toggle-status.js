import express from 'express';
import { handleToggleStatus } from '../lib/statusHandler.js'; // Your existing logic
import { connectDB } from '../lib/db.js';

const app = express();
app.use(express.json());

// Initialize DB
await connectDB();

// Toggle status route
app.post('/', handleToggleStatus);

export default app;