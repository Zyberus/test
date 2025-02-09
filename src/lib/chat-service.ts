import { GoogleGenerativeAI } from '@google/generative-ai';
import { getCustomInstructions } from './ai-instructions';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

// Chat history type
export type ChatMessage = {
  text: string;
  isUser: boolean;
  isError?: boolean;
};

export class ChatService {
  private model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  private chat = this.model.startChat({
    history: [
      {
        role: 'user',
        parts: 'Here are your instructions for how to behave and respond:' + getCustomInstructions(),
      },
      {
        role: 'model',
        parts: 'I understand and will follow these instructions. I am an AI assistant created by Rayan Khan, and I will maintain a professional yet friendly tone while being transparent about my capabilities and limitations.',
      },
    ],
    generationConfig: {
      maxOutputTokens: 1000,
      temperature: 0.7,
      topP: 0.8,
      topK: 40,
    },
  });

  async sendMessage(message: string): Promise<string> {
    try {
      const result = await this.chat.sendMessage(message);
      const response = await result.response;
      const text = response.text();
      return text;
    } catch (error) {
      console.error('Error in chat service:', error);
      throw new Error('Failed to get response from AI');
    }
  }

  // Reset chat with initial instructions
  async resetChat() {
    this.chat = this.model.startChat({
      history: [
        {
          role: 'user',
          parts: 'Here are your instructions for how to behave and respond:' + getCustomInstructions(),
        },
        {
          role: 'model',
          parts: 'I understand and will follow these instructions. I am an AI assistant created by Rayan Khan, and I will maintain a professional yet friendly tone while being transparent about my capabilities and limitations.',
        },
      ],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      },
    });
  }
}

// Singleton instance
export const chatService = new ChatService();
