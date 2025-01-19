import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    // Get API key from environment
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    // Validate API key first
    if (!apiKey || apiKey.trim() === '') {
      return new Response(
        JSON.stringify({ error: 'API key not configured' }), 
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Initialize the Gemini API client
    const genAI = new GoogleGenerativeAI(apiKey);

    // Parse request body
    const body = await req.json();
    const { message } = body;

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    try {
      // Generate response using Gemini
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent(message);
      const response = await result.response;
      const text = response.text();

      if (!text) {
        return new Response(
          JSON.stringify({ error: 'Empty response from AI' }), 
          { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      // Return successful response
      return new Response(
        JSON.stringify({ response: text }), 
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );

    } catch (error) {
      console.error('Gemini API Error:', error);
      return new Response(
        JSON.stringify({ 
          error: error instanceof Error ? error.message : 'Failed to process request'
        }), 
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (error) {
    console.error('Request processing error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to process request'
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
