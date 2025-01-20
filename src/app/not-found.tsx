import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--primary)] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[var(--text-primary)]">404</h1>
        <h2 className="text-2xl mt-4 text-[var(--text-primary)]">Page Not Found</h2>
        <p className="mt-4 text-[var(--text-secondary)]">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link 
          href="/"
          className="mt-8 inline-block px-6 py-3 rounded-lg bg-[var(--accent)] text-white hover:bg-opacity-90 transition-all"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
