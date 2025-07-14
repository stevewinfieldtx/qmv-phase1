import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '');

export default function Landing() {
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const { id } = await res.json();
      const stripe = await stripePromise;
      await stripe?.redirectToCheckout({ sessionId: id });
    } catch (err) {
      console.error(err);
      alert('Something went wrong starting checkout.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">Create Your Custom Music Video</h1>
      <p className="max-w-xl text-center mb-8">
        Provide your song ideas and media, and we'll craft a unique AI-powered music video. Check out some examples below!
      </p>
      {/* TODO: Replace with real images & videos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 w-full max-w-4xl">
        <img src="https://placehold.co/300x200?text=Example+1" alt="Example video 1" />
        <img src="https://placehold.co/300x200?text=Example+2" alt="Example video 2" />
        <img src="https://placehold.co/300x200?text=Example+3" alt="Example video 3" />
      </div>
      <button
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-md disabled:opacity-50"
        onClick={handleStart}
        disabled={loading}
      >
        {loading ? 'Redirecting…' : 'Start for $10'}
      </button>
    </main>
  );
}