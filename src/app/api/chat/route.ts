import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Access the API key from environment variables
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(apiKey || '');

export async function POST(req: Request) {
  try {
    // Validate API key
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    try {
      // Generate response using Gemini
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent(message);
      const response = await result.response;
      const text = response.text();

      // Ensure we have a valid response
      if (!text) {
        throw new Error('Empty response from AI');
      }

      // Return formatted JSON response
      return new NextResponse(
        JSON.stringify({ response: text }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
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
