# Anonymous Messaging App

A production-ready anonymous messaging website built with React, Vite, Tailwind CSS, and Vercel Serverless Functions.

## Features
- **Anonymous Messaging**: Users can send messages without creating an account.
- **Beautiful UI**: Modern, glassmorphism design with Framer Motion animations.
- **Vercel Serverless Functions**: Uses `/api` endpoint to handle the backend processing securely.
- **Email Delivery**: Uses `nodemailer` to deliver beautifully formatted HTML emails.
- **Responsive**: Mobile-first design.

## Tech Stack
- Frontend: React (Vite), Tailwind CSS, Framer Motion
- Backend: Vercel Serverless Functions (Node.js)
- Email: Nodemailer

## Local Development Setup

1. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Configure Environment Variables**
   Create a \`.env\` file in the root of your project by copying \`.env.example\`:
   \`\`\`bash
   cp .env.example .env
   \`\`\`
   Fill in your SMTP server credentials and the admin email addresses.
   \`\`\`env
   SMTP_HOST=smtp.example.com
   SMTP_PORT=465
   SMTP_USER=your_smtp_username
   SMTP_PASS=your_smtp_password
   ADMIN_EMAILS=owner1@example.com,owner2@example.com
   \`\`\`

3. **Run the local development server**
   \`\`\`bash
   npm run dev
   \`\`\`
   *Note: Serverless functions inside the \`/api\` folder might require Vercel CLI (\`vercel dev\`) to run properly locally alongside your Vite app, depending on your setup.*

## Deployment to Vercel

This app is designed to be deployed directly to Vercel as a single project. No separate backend is required.

1. Create an account on [Vercel](https://vercel.com).
2. Connect your GitHub repository.
3. Import the project.
4. **Important:** Add the required Environment Variables in the Vercel dashboard under Settings > Environment Variables:
   - \`SMTP_HOST\`
   - \`SMTP_PORT\`
   - \`SMTP_USER\`
   - \`SMTP_PASS\`
   - \`ADMIN_EMAILS\` (Comma-separated list of emails)
5. Click **Deploy**. Vercel will automatically build the React app and deploy the \`/api\` folder as Serverless Functions.

## Security Features
- **Client and Server-side Validation**: Strict length checks and required fields.
- **XSS Prevention**: HTML entities are escaped before inserting user inputs into the email template.
- **No Exposed Secrets**: All sensitive logic happens in the Vercel Serverless Function. Admin emails and SMTP credentials are fully hidden from the frontend.
