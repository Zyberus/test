export const siteConfig = {
  name: 'App-Nest',
  title: 'App-Nest - Leading Software Development Company | Web & Mobile Apps',
  description: 'App-Nest is a premier software development company specializing in cutting-edge web and mobile applications. We deliver innovative solutions using Next.js, React, and AI technologies.',
  url: 'https://app-nest.com',
  ogImage: 'https://app-nest.netlify.app/og-image.png',
  keywords: [
    'software development',
    'web development',
    'mobile apps',
    'AI solutions',
    'Next.js development',
    'React development',
    'custom software',
    'enterprise solutions',
    'digital transformation',
    'app development company',
    'software agency',
    'tech solutions',
    'AI chat',
    'web applications',
    'software consulting',
    'App Nest',
    'App-Nest',
    'app nest',
    'app-nest'

  ],
  author: 'Rayan Khan',
  twitterHandle: '@appnest',
  locale: 'en_US',
};

export const getMetadata = (options?: {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
}) => {
  const title = options?.title 
    ? `${options.title} | ${siteConfig.name}`
    : siteConfig.title;
  
  const description = options?.description || siteConfig.description;
  const url = options?.path ? `${siteConfig.url}${options.path}` : siteConfig.url;
  const ogImage = options?.ogImage || siteConfig.ogImage;

  return {
    title,
    description,
    keywords: siteConfig.keywords.join(', '),
    authors: [{ name: siteConfig.author }],
    creator: siteConfig.author,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'website',
      locale: siteConfig.locale,
      url,
      title,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      creator: siteConfig.twitterHandle,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'your-google-verification-code',
    },
  };
};
