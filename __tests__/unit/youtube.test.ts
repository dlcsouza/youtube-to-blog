describe('YouTube Utils', () => {
  describe('extractVideoId', () => {
    const extractVideoId = (url: string): string | null => {
      const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /^([a-zA-Z0-9_-]{11})$/
      ];
      
      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
      }
      return null;
    };

    test('should extract ID from standard URL', () => {
      expect(extractVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    });

    test('should extract ID from short URL', () => {
      expect(extractVideoId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    });

    test('should extract ID from embed URL', () => {
      expect(extractVideoId('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    });

    test('should handle URL with extra parameters', () => {
      expect(extractVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=120')).toBe('dQw4w9WgXcQ');
    });

    test('should accept raw video ID', () => {
      expect(extractVideoId('dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    });

    test('should return null for invalid URL', () => {
      expect(extractVideoId('https://example.com')).toBeNull();
    });
  });

  describe('formatDuration', () => {
    const formatDuration = (seconds: number): string => {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = seconds % 60;
      
      if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
      return `${m}:${s.toString().padStart(2, '0')}`;
    };

    test('should format seconds only', () => {
      expect(formatDuration(45)).toBe('0:45');
    });

    test('should format minutes and seconds', () => {
      expect(formatDuration(125)).toBe('2:05');
    });

    test('should format hours', () => {
      expect(formatDuration(3665)).toBe('1:01:05');
    });
  });
});
