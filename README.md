# 📺 YouTube to Blog Converter

> Transform any YouTube video into a well-structured, SEO-optimized blog post using AI

![Build](https://img.shields.io/github/actions/workflow/status/dlcsouza/youtube-to-blog/ci.yml?branch=main&style=flat-square&label=build)
![Tests](https://img.shields.io/badge/tests-playwright%20%2B%20jest-brightgreen?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)

> 📸 Screenshots coming soon — star the repo to be notified!

## ✨ Features

- **🎯 One-Click Conversion** - Paste a YouTube URL and get a blog post
- **🤖 Multiple AI Providers** - Choose between OpenAI GPT-4 or Anthropic Claude
- **📝 SEO Optimized** - Auto-generates titles, headers, and meta descriptions
- **👀 Live Preview** - See formatted article or raw Markdown
- **📋 Copy to Clipboard** - One-click copy for your blog platform
- **🎨 Modern UI** - Clean, responsive design with Tailwind CSS
- **⚡ Fast** - Built on Next.js 14 with App Router

## 💡 Why This Exists?

**The content creator problem:** video is how you build an audience — but blogs are how Google finds you.

Every YouTube video you publish contains hours of research, storytelling, and expertise. Yet most of that content is invisible to search engines. A well-optimized blog post for the same topic can drive organic traffic for years after the video is forgotten by the algorithm.

This tool fills that gap:

- **YouTubers** get blog posts without rewriting their scripts
- **Educators** turn lecture recordings into readable references  
- **Marketers** repurpose video content into SEO assets at scale
- **Developers** can integrate it into their own content pipelines via API

No copy-paste. No rehashing. Paste the URL, pick your AI, get publication-ready Markdown.

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

### 60-Second Demo

```bash
# Clone, install, run — that's it
git clone https://github.com/dlcsouza/youtube-to-blog.git && cd youtube-to-blog
cp .env.example .env.local && echo "OPENAI_API_KEY=sk-your-key" >> .env.local
npm install && npm run dev
# Open http://localhost:3000, paste any YouTube URL with captions, click Convert
```

Paste a URL like `https://www.youtube.com/watch?v=dQw4w9WgXcQ` and you'll have a formatted blog post in under 30 seconds.

## 🏗️ Architecture Overview

[View interactive diagram →](./youtube-to-blog-architecture.html)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         User (Browser)                                  │
│                    YouTube URL  →  Article                              │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │  HTTP
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      Next.js 14 App Router                              │
│                   TypeScript · SSR · API Routes                         │
└────────────────┬────────────────────────────────┬───────────────────────┘
                 │                                │
    ┌────────────▼───────────┐      ┌─────────────▼──────────────────────┐
    │    FRONTEND LAYER      │      │          SERVICE LAYER             │
    │  ──────────────────    │      │  ──────────────────────────────    │
    │  VideoForm             │      │  AI Orchestration  (lib/ai.ts)     │
    │  ResultDisplay         │◄────►│  YouTube Transcript (lib/youtube)  │
    │  PricingSection        │      │  Rate Limiter  (lib/rate-limit.ts) │
    │  CopyButton            │      │  API: /api/convert/route.ts        │
    │  UsageBanner           │      │                                    │
    └────────────────────────┘      └──────┬──────────────┬─────────────┘
                                           │              │
                  ┌────────────────────────▼──┐    ┌──────▼──────────────┐
                  │       AI PROVIDERS        │    │      PAYMENTS       │
                  │  ─────────────────────    │    │  ─────────────────  │
                  │  OpenAI GPT-4             │    │  Stripe             │
                  │    ↓ (fallback)           │    │  Free / Pro / Team  │
                  │  Anthropic Claude         │    │  Webhook handler    │
                  └───────────────────────────┘    └─────────────────────┘
```

### Tech Decisions

| Technology | Choice | Why |
|---|---|---|
| **Next.js 14** | App Router | SSR for fast initial load; clean API routes co-located with UI code; zero-config Vercel deploy |
| **Dual AI** | OpenAI + Anthropic | GPT-4 for snappy general content; Claude for long-form nuanced writing; user picks per conversion |
| **Stripe** | Payments | Built-in monetization with free/pro/team tiers; webhook-driven credit system; 5-minute integration |
| **youtube-transcript** | Transcript | No YouTube Data API key required; works on any captioned video; handles multiple caption tracks |
| **TypeScript** | Language | Catch API response shape errors at compile time; safe across the ai.ts ↔ route ↔ component boundary |
| **Tailwind CSS** | Styling | Rapid UI iteration; utility-first keeps component files self-contained; no CSS file sprawl |

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

Contributions are welcome! Here's how to get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines

- Keep PRs focused — one feature or fix per PR
- Add tests for new API-touching code (Jest for unit, Playwright for E2E flows)
- Follow the existing TypeScript patterns in `lib/` — no `any`, no untyped API responses
- Run `npm run lint` and `npm test` before opening a PR

### Roadmap Ideas

Looking for something to work on? These are good first contributions:

- [ ] **Multi-language support** — translate blog output to target language
- [ ] **Batch processing** — convert a whole YouTube playlist at once
- [ ] **Custom prompts** — let users define their own blog tone/style
- [ ] **CMS integrations** — publish directly to Ghost, WordPress, Hashnode
- [ ] **Podcast support** — extend transcript fetch to audio files
- [ ] **Image extraction** — pull thumbnails/frames as article hero images
- [ ] **Social snippets** — auto-generate tweet threads and LinkedIn posts from the blog

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
