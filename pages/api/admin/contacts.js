import { adminAuth } from '../../../middleware/adminAuth';
import dbConnect from '../../../lib/mongodb';
import Contact from '../../../models/Contact';

async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const contacts = await Contact.find({}).sort({ createdAt: -1 });
      res.status(200).json(contacts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch contacts' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export default adminAuth(handler);
