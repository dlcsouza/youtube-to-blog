export const mockYouTubeTranscript = {
  text: "Hello and welcome to this video. Today we will discuss important topics. First, let's talk about the basics. Then we'll dive deeper into advanced concepts. Thank you for watching!",
  segments: [
    { text: "Hello and welcome to this video.", start: 0, duration: 3 },
    { text: "Today we will discuss important topics.", start: 3, duration: 4 },
    { text: "First, let's talk about the basics.", start: 7, duration: 3 },
    { text: "Then we'll dive deeper into advanced concepts.", start: 10, duration: 4 },
    { text: "Thank you for watching!", start: 14, duration: 2 }
  ]
};

export const mockOpenAIResponse = {
  choices: [{
    message: {
      content: `# Video Summary

## Introduction
Hello and welcome to this video about important topics.

## Key Points
- Discussion of basics
- Advanced concepts exploration

## Conclusion
Thank you for watching this informative video.`
    }
  }]
};

export const mockVideoInfo = {
  videoId: 'dQw4w9WgXcQ',
  title: 'Test Video Title',
  description: 'A test video description',
  duration: '10:30'
};
