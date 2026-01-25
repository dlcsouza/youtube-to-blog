# 📺 YouTube to Blog Converter

> Transform any YouTube video into a well-structured, SEO-optimized blog post using AI

![Demo](./demo.gif)
*Demo GIF placeholder - record your own!*

## ✨ Features

- **🎯 One-Click Conversion** - Paste a YouTube URL and get a blog post
- **🤖 Multiple AI Providers** - Choose between OpenAI GPT-4 or Anthropic Claude
- **📝 SEO Optimized** - Auto-generates titles, headers, and meta descriptions
- **👀 Live Preview** - See formatted article or raw Markdown
- **📋 Copy to Clipboard** - One-click copy for your blog platform
- **🎨 Modern UI** - Clean, responsive design with Tailwind CSS
- **⚡ Fast** - Built on Next.js 14 with App Router

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- OpenAI API key and/or Anthropic API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/dlcsouza/youtube-to-blog.git
   cd youtube-to-blog
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your API keys:
   ```env
   OPENAI_API_KEY=sk-your-openai-key
   ANTHROPIC_API_KEY=sk-ant-your-anthropic-key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | For OpenAI | Your OpenAI API key from [platform.openai.com](https://platform.openai.com/api-keys) |
| `ANTHROPIC_API_KEY` | For Claude | Your Anthropic API key from [console.anthropic.com](https://console.anthropic.com/) |

*Note: You only need the API key for the provider you want to use.*

## 🌐 Deploy to Vercel

The easiest way to deploy is using [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fdlcsouza%2Fyoutube-to-blog&env=OPENAI_API_KEY,ANTHROPIC_API_KEY&envDescription=API%20keys%20for%20AI%20providers&project-name=youtube-to-blog&repository-name=youtube-to-blog)

1. Click the button above
2. Connect your GitHub account
3. Add your API keys in the environment variables
4. Deploy!

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## 📁 Project Structure

```
youtube-to-blog/
├── app/
│   ├── api/
│   │   └── convert/route.ts    # API endpoint for conversion
│   ├── globals.css             # Global styles + Tailwind
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Main page
├── components/
│   ├── VideoForm.tsx           # URL input + provider selector
│   ├── ResultDisplay.tsx       # Article preview/markdown view
│   └── CopyButton.tsx          # Copy to clipboard button
├── lib/
│   ├── youtube.ts              # YouTube transcript extraction
│   └── ai.ts                   # AI generation (OpenAI/Anthropic)
├── .env.example
├── package.json
├── tailwind.config.ts
└── README.md
```

## 🎯 How It Works

1. **URL Parsing** - Extracts video ID from various YouTube URL formats
2. **Transcript Fetch** - Uses `youtube-transcript` to get video captions
3. **AI Processing** - Sends transcript to OpenAI/Claude with SEO prompts
4. **Output** - Returns formatted Markdown with title, sections, and meta description

## 💡 Use Cases

- **Content Repurposing** - Turn your YouTube content into blog posts
- **Research Notes** - Convert educational videos into readable summaries
- **SEO Content** - Generate SEO-optimized articles from video content
- **Accessibility** - Create text versions of video content

## 💰 Pricing Ideas (If You Want to Monetize)

| Tier | Price | Features |
|------|-------|----------|
| Free | $0 | 3 conversions/day, watermark |
| Pro | $9/mo | Unlimited, no watermark, priority |
| Team | $29/mo | Everything + API access, multiple users |

*Cost estimation: ~$0.05-0.15 per conversion with GPT-4*

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **AI**: [OpenAI](https://openai.com/) / [Anthropic](https://anthropic.com/)
- **Transcript**: [youtube-transcript](https://www.npmjs.com/package/youtube-transcript)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📝 License

MIT License - feel free to use this for personal or commercial projects!

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Known Limitations

- Videos must have captions/subtitles enabled
- Very long videos may be truncated (15k character limit)
- Auto-generated captions may have errors

## 📧 Support

If you have questions or need help:
- Open an [issue](https://github.com/dlcsouza/youtube-to-blog/issues)
- Star ⭐ the repo if you find it useful!

---

Made with ❤️ and AI magic ✨
