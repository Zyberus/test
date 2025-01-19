import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    try {
      // Generate response using Gemini
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent(message);
      const response = await result.response;
      const text = response.text();

      return NextResponse.json({ response: text });
    } catch (error) {
      console.error('Gemini API Error:', error);
      return NextResponse.json(
        { error: 'Failed to generate response from AI' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Request processing error:', error);
    return NextResponse.json(
      { error: 'Invalid request format' },
      { status: 400 }
    );
  }
}
