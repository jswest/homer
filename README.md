# HOMER

_It's web-based performance art masquerading as a social media network._

A social media experiment featuring AI-powered post summarization. Every hour, user posts are automatically summarized using GPT-5 nano, progressively condensing content over 6 iterations.

## Features

### 🔐 Authentication
- **Supabase Auth** - Secure email/password authentication
- **Protected Routes** - All routes except home require authentication
- **User Profiles** - Custom handles and biographies (max 20 char handles, 500 char bios)

### 📝 Posts
- **Create Posts** - Up to 500 characters per post
- **Rate Limiting** - 12 posts per day per user
- **Real-time Feed** - View all user posts chronologically
- **AI Summarization** - Posts automatically shrink over time

### 🤖 AI Summarization
- **Automated** - Runs every hour via Vercel Cron
- **Progressive** - Posts summarized up to 6 times
- **GPT-5 Nano** - Uses OpenAI's latest efficient model
- **Verification** - Ensures summaries are shorter than originals

## Tech Stack

- **Framework**: SvelteKit 2.0 (Svelte 5 runes)
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Auth**: Supabase Auth
- **AI**: OpenAI GPT-5 nano
- **Deployment**: Vercel (with Cron Jobs)
- **Styling**: Custom CSS with design tokens

## Design System

### Colors
- **Pink**: `rgb(235, 153, 153)` - Cards, highlights, badges
- **White**: Primary card backgrounds
- **Black**: Text, borders, page background

### Typography
- **Doto**: Display font for headers and handles (900 weight)
- **Roboto Condensed**: Body text and UI elements

### Layout
- **Card-based**: Everything is a bordered card component
- **3px borders**: Bold black borders everywhere
- **Unit system**: All spacing based on 20px unit
- **Max-width**: 600px centered container
- **Responsive**: Mobile-friendly with flex-wrap navigation

## Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database (Supabase)
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd homer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create `.env` file:
   ```env
   DATABASE_URL=postgresql://...
   PUBLIC_SUPABASE_URL=https://...
   PUBLIC_SUPABASE_ANON_KEY=...
   OPENAI_API_KEY=sk-proj-...
   CRON_SECRET=your-secret-token
   ```

4. **Run Prisma migrations**
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## Deployment (Vercel)

1. **Push to GitHub**

2. **Import to Vercel**
   - Connect your repository
   - Framework preset: SvelteKit

3. **Add Environment Variables**
   - `DATABASE_URL`
   - `PUBLIC_SUPABASE_URL`
   - `PUBLIC_SUPABASE_ANON_KEY`
   - `OPENAI_API_KEY`
   - `CRON_SECRET` (generate secure random token)

4. **Deploy**
   - Vercel automatically detects `vercel.json`
   - Cron job runs hourly in production

## Key Features

### Rate Limiting
Posts are limited to 12 per user per day (resets at midnight UTC). Enforced server-side in `src/routes/posts/create/+page.server.js:54-71`.

### Handle Validation
- Real-time availability check with 500ms debounce
- Client-side: `src/lib/components/AuthForm.svelte:22-46`
- Server-side: `src/routes/api/check-handle/+server.js`
- Format: letters, numbers, underscores only (max 20 chars)

### Route Protection
Middleware in `src/hooks.server.js:68-76`:
- Unauthenticated users redirected to home page
- Authenticated users redirected from home to feed

### Cron Job
Hourly summarization at `src/routes/api/cron/summarize-posts/+server.js`:
- Processes 20 posts per run
- Verifies summaries are shorter
- Tracks iteration count (max 6)

**Manual trigger**:
```bash
curl -X GET https://your-app.vercel.app/api/cron/summarize-posts \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## Components

### Base Components (DRY)
- **Button** (`src/lib/components/Button.svelte`) - Primary/secondary variants
- **Card** (`src/lib/components/Card.svelte`) - White/pink variants with 3px borders
- **Message** (`src/lib/components/Message.svelte`) - Success/error/info alerts

### Feature Components
- **PostCard** - Post display with timestamp, handle, summarization badge
- **UserCard** - User profile (handle + bio) in pink card
- **AuthForm** - Sign in/up with toggle and handle availability check

## Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Prisma Studio (database GUI)
npx prisma studio

# Check database
npx prisma db pull
```

## License

MIT