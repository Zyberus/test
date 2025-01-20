import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  console.log('Chat API route hit');
  try {
    console.log('API Key:', process.env.NEXT_PUBLIC_GEMINI_API_KEY ? 'Present' : 'Missing');
    
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      console.log('API key missing error');
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const body = await req.json();
    console.log('Request body:', body);
    const { message } = body;

    if (!message) {
      console.log('Message missing error');
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    try {
      console.log('Calling Gemini API with message:', message);
      const result = await model.generateContent(message);
      const response = await result.response;
      const text = response.text();
      console.log('Gemini API response:', text);

      if (!text) {
        console.log('Empty response error');
        return NextResponse.json(
          { error: 'Empty response from AI' },
          { status: 500 }
        );
      }

      return NextResponse.json({ response: text });
    } catch (error) {
      console.error('Gemini API Error:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to generate AI response' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Request processing error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process request' },
      { status: 500 }
    );
  }
}
