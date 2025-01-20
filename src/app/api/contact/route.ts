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
    console.log('Received contact form submission');

    // Parse JSON body safely
    let body;
    try {
      body = await req.json();
      console.log('Parsed request body:', body);
    } catch (e) {
      console.error('JSON parsing error:', e);
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400, headers }
      );
    }

    const { name, email, message } = body;

    // Validate inputs
    if (!name || !email || !message) {
      console.error('Missing required fields:', { name, email, message });
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400, headers }
      );
    }

    // Connect to database
    try {
      console.log('Connecting to database...');
      await connectDB();
      console.log('Database connected successfully');
    } catch (e) {
      console.error('Database connection error:', e);
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500, headers }
      );
    }

    // Create new contact submission
    try {
      console.log('Creating contact document...');
      const contactData = {
        name,
        email,
        message,
        createdAt: new Date(),
      };
      console.log('Contact data:', contactData);

      const contact = await Contact.create(contactData);
      console.log('Contact created successfully:', contact);

      return NextResponse.json(
        { 
          message: 'Message sent successfully', 
          contact: contact.toObject() 
        },
        { status: 201, headers }
      );
    } catch (e) {
      console.error('Contact creation error:', e);
      if (e instanceof Error) {
        console.error('Error details:', e.message);
        if ('errors' in (e as any)) {
          console.error('Validation errors:', (e as any).errors);
        }
      }
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
