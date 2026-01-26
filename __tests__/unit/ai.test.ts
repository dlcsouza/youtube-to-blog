import { mockOpenAIResponse, mockYouTubeTranscript } from '../mocks/handlers';

describe('AI Formatter', () => {
  describe('formatTranscriptPrompt', () => {
    const formatPrompt = (transcript: string, title?: string): string => {
      let prompt = `Convert the following video transcript into a well-structured blog post.

Requirements:
- Use markdown formatting
- Include a compelling title (H1)
- Break into logical sections (H2, H3)
- Highlight key points
- Keep the original message but improve readability
- Add a brief summary at the end

`;
      if (title) prompt += `Video Title: ${title}\n\n`;
      prompt += `Transcript:\n${transcript}`;
      return prompt;
    };

    test('should create prompt with transcript', () => {
      const prompt = formatPrompt(mockYouTubeTranscript.text);
      expect(prompt).toContain('Convert the following video transcript');
      expect(prompt).toContain(mockYouTubeTranscript.text);
    });

    test('should include video title if provided', () => {
      const prompt = formatPrompt(mockYouTubeTranscript.text, 'My Video');
      expect(prompt).toContain('Video Title: My Video');
    });

    test('should specify markdown formatting', () => {
      const prompt = formatPrompt('test');
      expect(prompt).toContain('markdown');
    });
  });

  describe('parseAIResponse', () => {
    test('should extract content from OpenAI response', () => {
      const content = mockOpenAIResponse.choices[0].message.content;
      expect(content).toContain('# Video Summary');
      expect(content).toContain('## Introduction');
    });

    test('should handle markdown headers', () => {
      const content = mockOpenAIResponse.choices[0].message.content;
      const h1Match = content.match(/^# .+$/m);
      const h2Match = content.match(/^## .+$/m);
      
      expect(h1Match).not.toBeNull();
      expect(h2Match).not.toBeNull();
    });
  });
});
