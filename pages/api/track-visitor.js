import dbConnect from '../../lib/mongodb';
import Visitor from '../../models/Visitor';
import UAParser from 'ua-parser-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const userAgent = req.headers['user-agent'] || '';
    const parser = new UAParser(userAgent);
    const browser = parser.getBrowser();
    const os = parser.getOS();
    const device = parser.getDevice();

    // Get IP address
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || 
               req.socket.remoteAddress ||
               '127.0.0.1';

    // Create visitor record
    const visitor = new Visitor({
      ip: ip,
      userAgent: userAgent,
      browser: `${browser.name || ''} ${browser.version || ''}`.trim(),
      os: `${os.name || ''} ${os.version || ''}`.trim(),
      device: device.type || 'desktop',
      path: req.body.path,
      referrer: req.headers.referer || '',
      language: req.headers['accept-language'] || '',
      country: '',
      city: '',
      region: '',
    });

    // Fetch location data from IP
    try {
      const geoRes = await fetch(`http://ip-api.com/json/${ip}`);
      const geoData = await geoRes.json();
      
      if (geoData.status === 'success') {
        visitor.country = geoData.country;
        visitor.city = geoData.city;
        visitor.region = geoData.regionName;
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
    }

    await visitor.save();
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error tracking visitor:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
