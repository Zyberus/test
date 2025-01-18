import dbConnect from '../lib/mongodb';
import getVisitorModel from '../models/Visitor';
import UAParser from 'ua-parser-js';

export async function trackVisitor(req) {
  // Skip tracking for admin routes
  if (req.nextUrl.pathname.startsWith('/admin-login')) {
    return null;
  }

  try {
    await dbConnect();
    const Visitor = await getVisitorModel();

    const userAgent = req.headers.get('user-agent') || '';
    const parser = new UAParser(userAgent);
    const browser = parser.getBrowser();
    const os = parser.getOS();
    const device = parser.getDevice();

    // Get IP address
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 
               req.headers.get('x-real-ip') ||
               '127.0.0.1';

    // Create visitor record
    const visitor = new Visitor({
      ip: ip,
      userAgent: userAgent,
      browser: `${browser.name || ''} ${browser.version || ''}`.trim(),
      os: `${os.name || ''} ${os.version || ''}`.trim(),
      device: device.type || 'desktop',
      path: req.nextUrl.pathname,
      referrer: req.headers.get('referer') || '',
      language: req.headers.get('accept-language') || '',
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
    return visitor;
  } catch (error) {
    console.error('Error tracking visitor:', error);
    return null;
  }
}
