export function generateStaticParams() {
  return [
    { slug: ['chat'] },
    { slug: ['image-converter'] }
  ]
}

export default function AppPage({ params }: { params: { slug: string[] } }) {
  return null;
}
