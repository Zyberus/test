export async function trackPageView() {
  // Skip tracking for admin pages
  if (window.location.pathname.startsWith('/admin-login')) {
    return;
  }

  try {
    await fetch('/api/track-visitor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path: window.location.pathname,
      }),
    });
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
}
