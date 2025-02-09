# App-Nest Web

Modern web application built with Next.js, MongoDB, and Tailwind CSS.

## Features

- Modern, responsive design with Tailwind CSS
- Secure admin panel with JWT authentication
- Visitor analytics and tracking
- Contact form with MongoDB integration
- Server-side rendering with Next.js
- Dark mode support

## Prerequisites

- Node.js 18.17.0 or later
- MongoDB Atlas account
- Netlify account (for deployment)

## Local Development

1. Clone the repository
```bash
git clone https://bitbucket.org/zyberus/app-nest.git
cd web
```

2. Install dependencies
```bash
npm install
```

3. Copy the example environment file
```bash
cp .env.example .env.local
```

4. Update the environment variables in `.env.local`:
- `MONGODB_URI`: Your MongoDB connection string with database name
- `NEXT_PUBLIC_GEMINI_API_KEY`: Your Gemini API key
- `ADMIN_USERNAME`: Your admin username
- `ADMIN_PASSWORD`: Your admin password
- `JWT_SECRET`: Your JWT secret key

5. Run the development server
```bash
npm run dev
```

## Deployment to Netlify

1. Push your code to Bitbucket

2. Connect your repository to Netlify

3. Add the following environment variables in Netlify:
   - `MONGODB_URI`
   - `NEXT_PUBLIC_GEMINI_API_KEY`
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
   - `JWT_SECRET`
   - `NODE_ENV=production`

4. Deploy settings:
   - Build command: `npm install --production=false && npm run build`
   - Publish directory: `.next`
   - Node version: 18.17.0

## Important Notes

- The MongoDB URI should include the database name: `mongodb+srv://...@cluster.../contact?...`
- Ensure all required environment variables are set in Netlify
- The site uses server-side rendering, so the Netlify Edge Functions are required
- CORS is configured to allow all origins for the API routes
- The contact form submissions are stored in the 'contact' collection
- Admin panel is secured with JWT authentication

## Built With

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [MongoDB](https://www.mongodb.com/) - Database
- [JWT](https://jwt.io/) - Authentication
- [Netlify](https://www.netlify.com/) - Hosting and deployment

## License

This project is licensed under the MIT License
