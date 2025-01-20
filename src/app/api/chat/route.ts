import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Ensure response is JSON
const jsonResponse = (data: any, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export async function POST(req: Request) {
  console.log('Chat API route hit');
  
  // Validate request method
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  try {
    // Check API key
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    console.log('API Key status:', apiKey ? 'Present' : 'Missing');

    if (!apiKey) {
      return jsonResponse({ error: 'API key not configured' }, 500);
    }

    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return jsonResponse({ error: 'Invalid request body' }, 400);
    }

    const { message } = body;
    console.log('Received message:', message);

    if (!message) {
      return jsonResponse({ error: 'Message is required' }, 400);
    }

    // Initialize Gemini
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      console.log('Calling Gemini API...');
      const result = await model.generateContent(message);
      const response = await result.response;
      const text = response.text();
      console.log('Gemini response:', text);

      if (!text) {
        return jsonResponse({ error: 'Empty response from AI' }, 500);
      }

      return jsonResponse({ response: text });
    } catch (error) {
      console.error('Gemini API Error:', error);
      return jsonResponse({ 
        error: error instanceof Error ? error.message : 'Failed to generate AI response'
      }, 500);
    }
  } catch (error) {
    console.error('Request processing error:', error);
    return jsonResponse({ 
      error: error instanceof Error ? error.message : 'Failed to process request'
    }, 500);
  }
}
