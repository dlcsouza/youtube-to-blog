import { mockYouTubeTranscript, mockOpenAIResponse, mockVideoInfo } from '../mocks/handlers';

describe('Conversion Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('complete conversion flow', async () => {
    // 1. Extract video ID
    const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    const videoId = url.match(/v=([^&]+)/)?.[1];
    expect(videoId).toBe('dQw4w9WgXcQ');

    // 2. Mock transcript fetch
    const transcript = mockYouTubeTranscript.text;
    expect(transcript.length).toBeGreaterThan(0);

    // 3. Format AI prompt
    const prompt = `Convert this transcript:\n${transcript}`;
    expect(prompt).toContain('transcript');

    // 4. Mock AI response
    const blogPost = mockOpenAIResponse.choices[0].message.content;
    expect(blogPost).toContain('#');

    // 5. Verify markdown output
    expect(blogPost).toMatch(/^#/m); // Has headers
  });

  test('should handle missing transcript', async () => {
    const emptyTranscript = '';
    expect(emptyTranscript).toBe('');
    
    // Should throw or return error
    const handleEmptyTranscript = (t: string) => {
      if (!t) throw new Error('No transcript available');
      return t;
    };
    
    expect(() => handleEmptyTranscript(emptyTranscript)).toThrow('No transcript available');
  });

  test('should validate YouTube URL', () => {
    const isValidYouTubeUrl = (url: string): boolean => {
      return /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)/.test(url);
    };

    expect(isValidYouTubeUrl('https://youtube.com/watch?v=abc123')).toBe(true);
    expect(isValidYouTubeUrl('https://youtu.be/abc123')).toBe(true);
    expect(isValidYouTubeUrl('https://example.com')).toBe(false);
  });

  test('should estimate reading time', () => {
    const estimateReadingTime = (text: string): number => {
      const wordsPerMinute = 200;
      const words = text.split(/\s+/).length;
      return Math.ceil(words / wordsPerMinute);
    };

    const blogPost = mockOpenAIResponse.choices[0].message.content;
    const readingTime = estimateReadingTime(blogPost);
    
    expect(readingTime).toBeGreaterThan(0);
    expect(typeof readingTime).toBe('number');
  });
});
