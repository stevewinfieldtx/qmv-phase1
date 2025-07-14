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
    videoLength: 30, // seconds default
    ageAudience: 'all',
    additionalNotes: '',
  });

  const advancedDefaults = {
    genres: [],
    vocalStyles: [],
    moods: [],
    instruments: [],
    effects: [],
  };

  const [advanced, setAdvanced] = useState(advancedDefaults);

  const [mediaInfo, setMediaInfo] = useState({
    uploadType: 'images',
    imageDuration: 4,
    numImages: 8,
    keywords: '',
    uploadedUrls: [],
  });

  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

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

  const toggleAdvancedValue = (category, value) => {
    setAdvanced((prev) => {
      const set = new Set(prev[category]);
      if (set.has(value)) set.delete(value);
      else set.add(value);
      return { ...prev, [category]: Array.from(set) };
    });
  };

  // Option lists
  const GENRES = ['Pop', 'Rock', 'Hip-Hop', 'Electronic', 'Jazz', 'Classical', 'R&B', 'Country', 'Reggae', 'Blues', 'Metal', 'Folk', 'Disco', 'Funk', 'Soul', 'Punk', 'Ambient', 'World', 'Latin', 'EDM'];
  const VOCAL_STYLES = ['Belting', 'Falsetto', 'Whispered', 'Spoken-Word', 'Rap', 'Harmonized', 'Melismatic', 'Staccato', 'Legato', 'Gritty'];
  const MOODS = ['Uplifting', 'Melancholic', 'Energetic', 'Chill', 'Dark', 'Bright', 'Tense', 'Relaxed', 'Euphoric', 'Introspective'];
  const INSTRUMENTS = ['Electric Guitar', 'Acoustic Guitar', 'Bass Guitar', 'Piano', 'Synthesizer', 'Drums', 'Percussion', 'Violin', 'Cello', 'Saxophone', 'Trumpet', 'Trombone'];
  const EFFECTS = ['Reverb', 'Echo', 'Delay', 'Chorus', 'Distortion', 'Overdrive', 'EQ', 'Compression', 'Auto-Tune', 'Tremolo'];

  const validateStep1 = () => {
    const errs = {};
    if (!songInfo.overallTone) errs.overallTone = 'Tone is required';
    if (!songInfo.speed) errs.speed = 'Speed required';
    if (!songInfo.videoLength || songInfo.videoLength < 10) errs.videoLength = 'Video length must be >=10s';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    nextStep();
  };

  const handleGenerateAI = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai-suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promptContext: {
            songInfo,
            advanced,
            mediaInfo,
          },
        }),
      });
      const data = await res.json();
      setAiSuggestions(data.suggestions || []);
    } catch (err) {
      console.error(err);
      alert('Failed to get suggestions');
    }
    setAiLoading(false);
  };

  const handleUploadFiles = async (files) => {
    setUploading(true);
    const uploaded = [];
    for (const file of files) {
      try {
        const res = await fetch('/api/get-upload-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, contentType: file.type }),
        });
        const { url, publicUrl } = await res.json();
        await fetch(url, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file,
        });
        uploaded.push(publicUrl);
      } catch (err) {
        console.error('upload error', err);
        alert(`Failed to upload ${file.name}`);
      }
    }
    setMediaInfo((prev) => ({ ...prev, uploadedUrls: [...prev.uploadedUrls, ...uploaded] }));
    setUploading(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await fetch('/api/save-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id, songInfo, advanced, mediaInfo, aiSuggestions }),
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
          <h2 className="text-xl font-medium">1. Basic Song Information</h2>
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
            <span>Desired video length (seconds)</span>
            <input
              type="number"
              name="videoLength"
              min="10"
              max="300"
              value={songInfo.videoLength}
              onChange={handleSongChange}
              className="w-full border px-2 py-1"
            />
            {errors.videoLength && <span className="text-red-600 text-sm">{errors.videoLength}</span>}
          </label>
          <label className="block">
            <span>Age of audience</span>
            <select name="ageAudience" value={songInfo.ageAudience} onChange={handleSongChange} className="w-full border px-2 py-1">
              <option value="under6">Under 6</option>
              <option value="6-12">6 – 12</option>
              <option value="13-18">13 – 18</option>
              <option value="18+">18+</option>
              <option value="all">All Ages</option>
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
          {Object.values(errors).length > 0 && (
            <p className="text-red-600 text-sm">Please fix the errors above before continuing.</p>
          )}
          <div className="flex justify-end mt-4">
            <button className="bg-indigo-600 text-white px-6 py-2 rounded" onClick={handleNext}>
              Next
            </button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="w-full max-w-xl space-y-4">
          <h2 className="text-xl font-medium">2. Advanced Music Options</h2>

          {/* Genres */}
          <div>
            <h3 className="font-semibold mb-1">Genres</h3>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border p-2">
              {GENRES.map((g) => (
                <label key={g} className="text-sm flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={advanced.genres.includes(g)}
                    onChange={() => toggleAdvancedValue('genres', g)}
                  />
                  <span>{g}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Vocal Styles */}
          <div>
            <h3 className="font-semibold mb-1">Vocal Styles</h3>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border p-2">
              {VOCAL_STYLES.map((v) => (
                <label key={v} className="text-sm flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={advanced.vocalStyles.includes(v)}
                    onChange={() => toggleAdvancedValue('vocalStyles', v)}
                  />
                  <span>{v}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Moods */}
          <div>
            <h3 className="font-semibold mb-1">Moods/Energy</h3>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border p-2">
              {MOODS.map((m) => (
                <label key={m} className="text-sm flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={advanced.moods.includes(m)}
                    onChange={() => toggleAdvancedValue('moods', m)}
                  />
                  <span>{m}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Instruments */}
          <div>
            <h3 className="font-semibold mb-1">Highlighted Instruments</h3>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border p-2">
              {INSTRUMENTS.map((i) => (
                <label key={i} className="text-sm flex items-center space-x-2">
                  <input type="checkbox" checked={advanced.instruments.includes(i)} onChange={() => toggleAdvancedValue('instruments', i)} />
                  <span>{i}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Effects */}
          <div>
            <h3 className="font-semibold mb-1">Production & Effects</h3>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border p-2">
              {EFFECTS.map((e) => (
                <label key={e} className="text-sm flex items-center space-x-2">
                  <input type="checkbox" checked={advanced.effects.includes(e)} onChange={() => toggleAdvancedValue('effects', e)} />
                  <span>{e}</span>
                </label>
              ))}
            </div>
          </div>

          {/* AI Suggestion */}
          <div className="border-t pt-4">
            <button
              type="button"
              className="bg-gray-800 text-white px-4 py-2 rounded"
              onClick={handleGenerateAI}
              disabled={aiLoading}
            >
              {aiLoading ? 'Generating…' : 'Generate Prompt Suggestions'}
            </button>
            {aiSuggestions.length > 0 && (
              <ul className="list-disc mt-2 pl-6 space-y-1 text-sm">
                {aiSuggestions.map((s, idx) => (
                  <li key={idx} className="cursor-pointer hover:text-indigo-600" onClick={() => setMediaInfo((p) => ({ ...p, keywords: (p.keywords ? p.keywords + ' ' : '') + s }))}>{s}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex justify-between mt-4">
            <button className="border px-6 py-2 rounded" onClick={prevStep}>Back</button>
            <button className="bg-indigo-600 text-white px-6 py-2 rounded" onClick={nextStep}>Next</button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="w-full max-w-xl space-y-4">
          <h2 className="text-xl font-medium">3. Media / Image Details</h2>
          <label className="block">
            <span>Image source</span>
            <select name="uploadType" value={mediaInfo.uploadType} onChange={handleMediaChange} className="w-full border px-2 py-1">
              <option value="images">I will upload images</option>
              <option value="ai">Generate AI images</option>
              <option value="random">Random goofy combo</option>
            </select>
          </label>

          {mediaInfo.uploadType === 'images' && (
            <>
              <label className="block">
                <span>Select images</span>
                <input type="file" accept="image/*" multiple onChange={(e) => handleUploadFiles(e.target.files)} />
              </label>
              {mediaInfo.uploadedUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {mediaInfo.uploadedUrls.map((url) => (
                    <img key={url} src={url} alt="uploaded" className="w-full h-24 object-cover rounded" />
                  ))}
                </div>
              )}
            </>
          )}

          {mediaInfo.uploadType === 'images' && (
            <>
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

          {mediaInfo.uploadType === 'images' && uploading && (
            <p className="text-sm text-gray-600">Uploading images…</p>
          )}

          <div className="flex justify-between mt-4">
            <button className="border px-6 py-2 rounded" onClick={prevStep}>Back</button>
            <button className="bg-indigo-600 text-white px-6 py-2 rounded" onClick={handleSubmit} disabled={loading || uploading}>
              {loading ? 'Submitting…' : uploading ? 'Uploading…' : 'Submit'}
            </button>
          </div>
        </section>
      )}
    </main>
  );
}