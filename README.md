# Error 404 - Minecraft Mapmaking Team Website

A modern, interactive website for the Error 404 Minecraft mapmaking team built with React, TypeScript, and Supabase.

## Features

- **Interactive Design**: Modern UI with hover effects, animations, and Easter eggs
- **Contact System**: Functional contact form with database storage
- **Team Showcase**: Display team members and their roles
- **Realms Gallery**: Showcase Minecraft Java Edition maps
- **Responsive Design**: Works perfectly on all devices
- **Easter Eggs**: Hidden features activated by keyboard shortcuts

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (Database + Edge Functions)
- **Deployment**: Netlify
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Fill in your Supabase credentials.

4. Start the development server:
   ```bash
   npm run dev
   ```

## Contact Form Setup

The contact form stores submissions in Supabase and can send notifications via:

### Discord Webhook (Recommended)
1. Create a Discord webhook in your server
2. Add the webhook URL to your Supabase edge function environment variables:
   ```
   DISCORD_WEBHOOK_URL=your_discord_webhook_url
   ```

### Email Notifications (Optional)
To receive email notifications, you can integrate with services like:
- **Resend** (recommended)
- SendGrid
- Mailgun
- AWS SES

#### Setting up Resend:
1. Sign up at [resend.com](https://resend.com)
2. Get your API key
3. Add environment variables to your Supabase edge function:
   ```
   RESEND_API_KEY=your_resend_api_key
   NOTIFICATION_EMAIL=your_email@example.com
   ```
4. Uncomment the email notification code in `supabase/functions/notify-contact-submission/index.ts`

## Database Setup

The project uses Supabase with the following table:

### contact_submissions
- `id` (uuid, primary key)
- `name` (text, required)
- `email` (text, required) 
- `subject` (text, required)
- `message` (text, required)
- `submitted_at` (timestamptz, required)
- `created_at` (timestamptz, default: now())

Row Level Security (RLS) is enabled with policies for:
- Anonymous users can insert (contact form)
- Service role can read all (admin access)
- Authenticated users can read their own submissions

## Easter Eggs

The website includes several hidden features:

- **Konami Code**: ↑↑↓↓←→←→BA - Flips the page
- **Secret Word**: Type "minecraft" to activate pixel trail
- **Logo Clicks**: Click the logo 10 times for a surprise
- **Keyboard Shortcuts**:
  - Press 'M' three times quickly: Matrix mode
  - Press 'R' three times quickly: Rainbow mode  
  - Press 'G' three times quickly: Gravity flip

## Deployment

The site is automatically deployed to Netlify. Any pushes to the main branch will trigger a new deployment.

### Manual Deployment

```bash
npm run build
```

Then upload the `dist` folder to your hosting provider.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is private and belongs to the Error 404 team.

## Support

For technical issues or questions about the website, contact the development team through the contact form or Discord.