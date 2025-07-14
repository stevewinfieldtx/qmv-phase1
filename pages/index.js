import { loadStripe } from '@stripe/stripe-js';
import { useState, useEffect } from 'react';
import Head from 'next/head';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '');

export default function Landing() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('canceled')) {
      setError('Payment canceled. You can try again when ready.');
    }
  }, []);

  const handleStart = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to create session');
      const { id } = await res.json();
      const stripe = await stripePromise;
      await stripe?.redirectToCheckout({ sessionId: id });
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong starting checkout.');
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Create Your Custom Music Video</title>
        <meta name="description" content="Generate a unique AI-powered music video tailored to your song and images." />
        <meta property="og:title" content="Custom AI Music Video" />
        <meta property="og:description" content="Provide your song details and we’ll craft a bespoke music video." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop" />
      </Head>
      <main className="min-h-screen flex flex-col items-center justify-center p-8" role="main">
      <h1 className="text-4xl font-bold mb-4">Create Your Custom Music Video</h1>
      <p className="max-w-xl text-center mb-8">
        Provide your song ideas and media, and we'll craft a unique AI-powered music video. Check out some examples below!
      </p>
      {/* TODO: Replace with real images & videos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 w-full max-w-4xl">
        {/* Example embedded YouTube video */}
        <div className="aspect-video">
          <iframe
            className="w-full h-full rounded"
            src="https://www.youtube.com/embed/2vjPBrBU-TM"
            title="Example Music Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        {/* Example high-quality images */}
        <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop" alt="Concert lights" className="rounded" />
        <img src="https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=600&auto=format&fit=crop" alt="DJ mixing" className="rounded" />
      </div>
      {error && <p className="text-red-600 mb-4" role="alert">{error}</p>}
      <button
        aria-label="Start checkout for custom music video"
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-md disabled:opacity-50"
        onClick={handleStart}
        disabled={loading}
      >
        {loading ? 'Redirecting…' : 'Start for $10'}
      </button>
    </main>
    </>
  );
}