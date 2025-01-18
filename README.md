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

## Built With

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [MongoDB](https://www.mongodb.com/) - Database
- [JWT](https://jwt.io/) - Authentication
- [Netlify](https://www.netlify.com/) - Hosting and deployment

## License

This project is licensed under the MIT License
