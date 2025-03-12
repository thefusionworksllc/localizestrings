This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Project Requirements

## Overview
This project is a Next.js application designed for translating XLIFF files using Google Translate API and Supabase for backend services.

## Prerequisites
- Node.js (version 14.x or later)
- npm (Node Package Manager) or Yarn

## Dependencies
The following dependencies are required for this project:

### Core Dependencies
- **Next.js**: Framework for server-rendered React applications.
- **React**: JavaScript library for building user interfaces.
- **React DOM**: Provides DOM-specific methods for React.
- **Supabase**: Backend as a service for authentication and database management.
- **Material-UI**: React components for faster and easier web development.

### Development Dependencies
- **@supabase/ssr**: Supabase client for server-side rendering.
- **react-syntax-highlighter**: Syntax highlighting for code snippets.
- **file-saver**: Library for saving files on the client-side.

### Example `package.json` Dependencies
```json
{
  "dependencies": {
    "next": "^12.0.0",
    "react": "^17.0.0",
    "react-dom": "^17.0.0",
    "@supabase/supabase-js": "^1.0.0",
    "@mui/material": "^5.0.0",
    "@mui/icons-material": "^5.0.0",
    "react-syntax-highlighter": "^15.0.0",
    "file-saver": "^2.0.0"
  },
  "devDependencies": {
    "@supabase/ssr": "^0.1.0"
  }
}
```

## Environment Variables
The following environment variables are required for the application to function correctly:

- `NEXT_PUBLIC_SUPABASE_URL`: The URL of your Supabase project.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: The anonymous key for your Supabase project.
- `SUPABASE_SERVICE_KEY`: The service role key for your Supabase project.
- `GOOGLE_TRANSLATE_API_KEY`: The API key for Google Translate.

### Example `.env.local` File
```plaintext
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
GOOGLE_TRANSLATE_API_KEY=your-google-translate-api-key
```

## Running the Project
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo.git
   cd your-repo
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:3000`.

## Deployment
For deployment, you can use platforms like Vercel or Netlify. Ensure that you set the environment variables in the deployment platform's settings.

## Additional Notes
- Ensure that you have the necessary permissions and billing set up for Google Cloud services if using the Google Translate API.
- Review the Supabase documentation for setting up authentication and database schemas.
