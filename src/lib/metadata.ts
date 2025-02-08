export const siteConfig = {
  name: 'App-Nest',
  title: 'App-Nest - Professional Software Development & AI Solutions | Web & Mobile Apps',
  description: 'App-Nest is your trusted partner for professional software development, specializing in AI-powered web and mobile applications. Experience innovative solutions with our expert team led by Rayan Khan.',
  url: 'https://app-nest.netlify.app',
  ogImage: 'https://app-nest.netlify.app/og-image.png',
  keywords: [
    'app nest',
    'app-nest',
    'software development company',
    'web development',
    'mobile app development',
    'AI solutions',
    'Next.js development',
    'React development',
    'custom software',
    'enterprise solutions',
    'digital transformation',
    'app development',
    'software agency',
    'tech solutions',
    'AI chat',
    'web applications',
    'software consulting',
    'professional software development',
    'artificial intelligence',
    'machine learning',
    'business automation',
    'cloud solutions',
    'digital solutions',
    'software engineering',
    'technology consulting'
  ],
  author: 'Rayan Khan',
  twitterHandle: '@appnest',
  locale: 'en_US',
  alternateLocales: ['en_GB', 'en_AU', 'en_CA'],
  organization: {
    name: 'App-Nest',
    foundingYear: 2024,
    founders: ['Rayan Khan'],
    location: 'India',
    socialMedia: {
      twitter: 'https://twitter.com/appnest',
      github: 'https://github.com/app-nest-x',
      linkedin: 'https://linkedin.com/company/app-nest'
    }
  }
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
    metadataBase: new URL(siteConfig.url),
    title: {
      default: title,
      template: `%s | ${siteConfig.name}`,
    },
    description,
    keywords: siteConfig.keywords.join(', '),
    authors: [{ name: siteConfig.author }],
    creator: siteConfig.author,
    publisher: siteConfig.organization.name,
    alternates: {
      canonical: url,
      languages: {
        'en-US': '/en-us',
        'en-GB': '/en-gb',
      },
    },
    openGraph: {
      type: 'website',
      locale: siteConfig.locale,
      alternateLocale: siteConfig.alternateLocales,
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
      site: siteConfig.twitterHandle,
    },
    robots: {
      index: true,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
      yahoo: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION,
    },
    category: 'technology',
  };
};
