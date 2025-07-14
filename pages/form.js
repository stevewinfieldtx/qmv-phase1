import { useState } from 'react';
import { useRouter } from 'next/router';

export default function FormPage() {
  const router = useRouter();
  const { session_id } = router.query;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [songInfo, setSongInfo] = useState({
    artistReference: '',
    overallTone: 'happy',
    speed: 'medium',
    additionalNotes: '',
  });

  const [mediaInfo, setMediaInfo] = useState({
    uploadType: 'images',
    imageDuration: 4,
    numImages: 8,
    keywords: '',
  });

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleSongChange = (e) => {
    const { name, value } = e.target;
    setSongInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleMediaChange = (e) => {
    const { name, value } = e.target;
    setMediaInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await fetch('/api/save-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id, songInfo, mediaInfo }),
      });
      router.push('/thank-you');
    } catch (err) {
      console.error(err);
      alert('Failed to submit form.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center p-8">
      <h1 className="text-3xl font-semibold mb-4">Music Video Details</h1>
      {step === 1 && (
        <section className="w-full max-w-xl space-y-4">
          <h2 className="text-xl font-medium">1. Song Information</h2>
          <label className="block">
            <span>Artist / Song reference (optional)</span>
            <input
              type="text"
              name="artistReference"
              value={songInfo.artistReference}
              onChange={handleSongChange}
              className="w-full border px-2 py-1"
            />
          </label>
          <label className="block">
            <span>Overall tone</span>
            <select name="overallTone" value={songInfo.overallTone} onChange={handleSongChange} className="w-full border px-2 py-1">
              {['happy', 'sad', 'excited', 'moody', 'calm'].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span>Speed</span>
            <select name="speed" value={songInfo.speed} onChange={handleSongChange} className="w-full border px-2 py-1">
              {['very slow', 'slow', 'medium', 'fast', 'very fast'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span>Additional notes</span>
            <textarea
              name="additionalNotes"
              value={songInfo.additionalNotes}
              onChange={handleSongChange}
              className="w-full border px-2 py-1"
              rows={3}
            />
          </label>
          <div className="flex justify-end mt-4">
            <button className="bg-indigo-600 text-white px-6 py-2 rounded" onClick={nextStep}>
              Next
            </button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="w-full max-w-xl space-y-4">
          <h2 className="text-xl font-medium">2. Media / Image Details</h2>
          <label className="block">
            <span>Image upload type</span>
            <select name="uploadType" value={mediaInfo.uploadType} onChange={handleMediaChange} className="w-full border px-2 py-1">
              <option value="images">I will upload images</option>
              <option value="ai">Generate AI images</option>
              <option value="random">Random goofy combo</option>
            </select>
          </label>
          {mediaInfo.uploadType === 'images' && (
            <>
              <label className="block">
                <span>Number of images</span>
                <select name="numImages" value={mediaInfo.numImages} onChange={handleMediaChange} className="w-full border px-2 py-1">
                  <option value={30}>30 images (1 sec each)</option>
                  <option value={16}>16 images (~2 sec each)</option>
                  <option value={8}>8 images (~4 sec each)</option>
                </select>
              </label>
              <label className="block">
                <span>Duration per image (seconds)</span>
                <input
                  type="number"
                  name="imageDuration"
                  min="1"
                  max="10"
                  value={mediaInfo.imageDuration}
                  onChange={handleMediaChange}
                  className="w-full border px-2 py-1"
                />
              </label>
              {/* In a real app, you'd offer an upload component here */}
              <p className="text-sm text-gray-600">You will receive an upload link after submitting this form.</p>
            </>
          )}
          {mediaInfo.uploadType !== 'images' && (
            <label className="block">
              <span>Keywords / description for AI</span>
              <textarea
                name="keywords"
                value={mediaInfo.keywords}
                onChange={handleMediaChange}
                className="w-full border px-2 py-1"
                rows={3}
              />
            </label>
          )}
          <div className="flex justify-between mt-4">
            <button className="border px-6 py-2 rounded" onClick={prevStep}>
              Back
            </button>
            <button
              className="bg-indigo-600 text-white px-6 py-2 rounded"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Submitting…' : 'Submit'}
            </button>
          </div>
        </section>
      )}
    </main>
  );
}