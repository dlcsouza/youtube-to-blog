import '@testing-library/jest-dom';

// Mock fetch globally
global.fetch = jest.fn();

// Mock environment variables
process.env.OPENAI_API_KEY = 'test-key';
process.env.ANTHROPIC_API_KEY = 'test-key';
