import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Contact from '@/models/Contact';

export async function POST(req: Request) {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { headers });
  }

  try {
    // Parse JSON body safely
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400, headers }
      );
    }

    const { name, email, message } = body;

    // Validate inputs
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400, headers }
      );
    }

    // Connect to database
    try {
      await connectDB();
    } catch (e) {
      console.error('Database connection error:', e);
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500, headers }
      );
    }

    // Create new contact submission
    try {
      const contact = await Contact.create({
        name,
        email,
        message,
      });

      return NextResponse.json(
        { message: 'Message sent successfully', contact },
        { status: 201, headers }
      );
    } catch (e) {
      console.error('Contact creation error:', e);
      return NextResponse.json(
        { error: 'Failed to save message' },
        { status: 500, headers }
      );
    }
  } catch (error) {
    console.error('Contact submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers }
    );
  }
}
