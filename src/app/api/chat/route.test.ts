import { POST } from './route';

// Mock Response and Request
class MockResponse {
  private body: string;
  private options: any;

  constructor(body: string | object, options = {}) {
    this.body = typeof body === 'string' ? body : JSON.stringify(body);
    this.options = options;
  }

  get status() {
    return this.options.status || 200;
  }

  async json() {
    return JSON.parse(this.body);
  }
}

class MockRequest {
  private url: string;
  private init?: RequestInit;

  constructor(url: string, init?: RequestInit) {
    this.url = url;
    this.init = init;
  }

  async json() {
    if (typeof this.init?.body !== 'string') {
      throw new Error('Invalid body');
    }
    return JSON.parse(this.init.body);
  }
}

// Mock globals
global.Request = MockRequest as any;
global.Response = MockResponse as any;
global.fetch = jest.fn(() => 
  Promise.resolve(new MockResponse({ response: { text: () => 'AI response' } }))
);

// Mock Gemini API
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockImplementation(() => ({
      generateContent: jest.fn().mockImplementation(() => ({
        response: {
          text: () => 'AI response'
        }
      }))
    }))
  }))
}));

describe('Chat API', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('should return 400 if message is missing', async () => {
    process.env.NEXT_PUBLIC_GEMINI_API_KEY = 'test-api-key';
    const req = new Request('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Message is required');
  });

  it('should return 500 if API key is not configured', async () => {
    // Force reload the module to get fresh environment
    jest.isolateModules(async () => {
      process.env.NEXT_PUBLIC_GEMINI_API_KEY = '';
      
      const req = new Request('http://localhost/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'test' }),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('API key not configured');
    });
  });

  it('should handle invalid JSON request', async () => {
    process.env.NEXT_PUBLIC_GEMINI_API_KEY = 'test-api-key';
    const req = new Request('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'invalid json',
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBeDefined();
  });

  it('should handle successful request', async () => {
    process.env.NEXT_PUBLIC_GEMINI_API_KEY = 'test-api-key';
    const req = new Request('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Hello' }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.response).toBe('AI response');
  });
});
