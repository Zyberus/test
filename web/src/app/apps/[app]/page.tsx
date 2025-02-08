'use client';

import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return [
    { app: 'chat' },
    { app: 'image-converter' }
  ];
}

export default function AppPage({ params }: { params: { app: string } }) {
  const validApps = ['chat', 'image-converter'];
  
  if (!validApps.includes(params.app)) {
    notFound();
  }

  return null;
}
