import dbConnect from '../../../lib/mongodb';
import getVisitorModel from '../../../models/Visitor';
import { adminAuth } from '../../../middleware/adminAuth';

export default adminAuth(async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();
    const Visitor = await getVisitorModel();

    // Get total visitors
    const totalVisitors = await Visitor.countDocuments();

    // Get visitors by country
    const visitorsByCountry = await Visitor.aggregate([
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Get visitors by browser
    const visitorsByBrowser = await Visitor.aggregate([
      { $group: { _id: '$browser', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Get visitors by device
    const visitorsByDevice = await Visitor.aggregate([
      { $group: { _id: '$device', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get visitors over time (last 7 days)
    const visitorsOverTime = await Visitor.aggregate([
      {
        $match: {
          timestamp: { 
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) 
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Get most visited pages
    const popularPages = await Visitor.aggregate([
      { $group: { _id: '$path', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Get recent visitors
    const recentVisitors = await Visitor.find()
      .sort({ timestamp: -1 })
      .limit(20)
      .select('-_id ip country city browser device path timestamp');

    res.status(200).json({
      totalVisitors,
      visitorsByCountry,
      visitorsByBrowser,
      visitorsByDevice,
      visitorsOverTime,
      popularPages,
      recentVisitors
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
