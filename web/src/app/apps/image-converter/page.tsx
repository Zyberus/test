import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Static page marker
export const dynamic = 'force-static';
export const revalidate = false;

// Dynamically import client components
const ClientPage = dynamic(() => import('./client-page'), {
  ssr: true
});

export default function ImageConverter() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientPage />
    </Suspense>
  );
}