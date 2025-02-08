import { Inter } from 'next/font/google';
import { getMetadata } from '@/lib/metadata';
import { Header } from '@/components/Header';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = getMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0A0F1C" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'App-Nest',
              url: 'https://app-nest.netlify.app',
              logo: 'https://app-nest.netlify.app/logo.png',
              description: 'Leading software development company specializing in web and mobile applications.',
              founder: {
                '@type': 'Person',
                name: 'Rayan Khan',
              },
              sameAs: [
                'https://twitter.com/appnest',
                'https://github.com/app-nest-x',
                'https://linkedin.com/company/app-nest',
              ],
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <Header />
        {children}
      </body>
    </html>
  );
}
