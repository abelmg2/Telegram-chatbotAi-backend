import { connectDB } from './db.js';

export async function handleToggleStatus(req, res) {
  try {
    const db = await connectDB();
    const statusCollection = db.collection('status');
    
    const config = await statusCollection.findOne({ _id: 'config' });
    const newStatus = !config.isOnline;

    await statusCollection.updateOne(
      { _id: 'config' },
      { $set: { isOnline: newStatus } }
    );

    res.json({ status: newStatus ? 'Online' : 'Offline' });
  } catch (error) {
    console.error("Error toggling status:", error);
    res.status(500).send("Internal Server Error");
  }
}