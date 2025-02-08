# New Era Website

A modern website built with Next.js, featuring an admin panel with analytics and visitor tracking.

## Features

- Modern, responsive design with Tailwind CSS
- Secure admin panel with JWT authentication
- Visitor analytics and tracking
- Contact form functionality
- MongoDB integration for data storage
- Production-ready with security headers

## Prerequisites

- Node.js 18.x or later
- MongoDB database
- npm or yarn package manager

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your environment variables:
   ```bash
   cp .env.example .env
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
MONGODB_URI=your_mongodb_uri
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password
JWT_SECRET=your_jwt_secret
```

## Deployment

This project is configured for deployment on Netlify:

1. Push your code to GitHub
2. Connect your GitHub repository to Netlify
3. Configure environment variables in Netlify's dashboard
4. Deploy!

However, you can also deploy using the following alternative method:

# App-Nest Web

Modern web application built with Next.js, MongoDB, and Tailwind CSS.

## Features

- Modern UI with Tailwind CSS
- Contact form with MongoDB integration
- Server-side rendering with Next.js
- Dark mode support
- Responsive design

## Prerequisites

- Node.js 18.17.0 or later
- MongoDB Atlas account
- Netlify account (for deployment)

## Local Development

1. Clone the repository
```bash
git clone https://github.com/your-username/web.git
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

5. Run the development server
```bash
npm run dev
```

## Deployment to Netlify

1. Push your code to GitHub

2. Connect your repository to Netlify

3. Add the following environment variables in Netlify:
   - `MONGODB_URI`
   - `NEXT_PUBLIC_GEMINI_API_KEY`
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

## Built With

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [MongoDB](https://www.mongodb.com/) - Database
- [JWT](https://jwt.io/) - Authentication
- [Netlify](https://www.netlify.com/) - Hosting and deployment

## License

This project is licensed under the MIT License
