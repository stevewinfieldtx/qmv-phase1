import React, { useState } from 'react';
import AIService from '../services/AIService';

const MusicInfoForm = ({ data, customerInfo, onUpdate, onNext, onPrev }) => {
  const [formData, setFormData] = useState({
    mode: data.mode || 'limited', // 'limited' or 'advanced'
    // Limited options
    referenceSong: data.referenceSong || '',
    referenceArtist: data.referenceArtist || '',
    tone: data.tone || '',
    speed: data.speed || '',
    additionalNotes: data.additionalNotes || '',
    // Advanced options
    genre: data.genre || [],
    vocalStyle: data.vocalStyle || [],
    moodEnergy: data.moodEnergy || [],
    instruments: data.instruments || [],
    toneCharacteristics: data.toneCharacteristics || [],
    productionEffects: data.productionEffects || [],
    advancedNotes: data.advancedNotes || ''
  });

  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const musicOptions = {
    genre: ['Pop', 'Rock', 'Hip-Hop', 'Electronic', 'Jazz', 'Classical', 'R&B', 'Country', 'Reggae', 'Blues', 'Metal', 'Folk', 'Disco', 'Funk', 'Soul', 'Punk', 'Ambient', 'World', 'Latin', 'EDM'],
    vocalStyle: ['Belting', 'Falsetto', 'Whispered', 'Spoken-Word', 'Rap', 'Harmonized (stacked vocals)', 'Melismatic (ornamented runs)', 'Staccato', 'Legato', 'Gritty'],
    moodEnergy: ['Uplifting', 'Melancholic', 'Energetic', 'Chill', 'Dark', 'Bright', 'Tense', 'Relaxed', 'Euphoric', 'Introspective'],
    instruments: ['Electric Guitar', 'Acoustic Guitar', 'Bass Guitar', 'Piano', 'Synthesizer', 'Drums', 'Percussion', 'Violin', 'Cello', 'Cow Bell', 'Double Bass', 'Saxophone', 'Trumpet', 'Trombone', 'Ukulele', 'Bagpipes', 'Steel Drums', 'Harp', 'Banjo', 'Theremin'],
    toneCharacteristics: ['Warm', 'Bright', 'Dark', 'Airy', 'Gritty', 'Raw', 'Polished', 'Ethereal', 'Vintage', 'Modern', 'Minimalistic', 'Cinematic', 'Organic', 'Synthetic', 'Dreamy'],
    productionEffects: ['Reverb', 'Echo', 'Delay', 'Chorus', 'Distortion', 'Overdrive', 'EQ (Equalization)', 'Compression', 'Auto-Tune', 'Wah-Wah', 'Tremolo', 'Pitch Shift', 'Vocoder', 'Sidechain', 'Filter Sweep', 'Fade In', 'Fade Out', 'Reverse', 'Build-Up', 'Drop'],
    tones: ['Happy', 'Sad', 'Excited', 'Morose', 'Energetic', 'Calm', 'Mysterious', 'Romantic', 'Aggressive', 'Peaceful'],
    speeds: ['Very Slow', 'Slow', 'Medium', 'Fast', 'Very Fast']
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (category, value) => {
    setFormData(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const handleAIEnhancement = async () => {
    setIsGeneratingAI(true);
    try {
      let aiEnhancements = {};
      
      if (formData.referenceArtist) {
        aiEnhancements.artistTags = await AIService.generateArtistTags(formData.referenceArtist);
      }
      
      if (formData.referenceSong) {
        aiEnhancements.songTags = await AIService.generateSongTags(formData.referenceSong);
      }
      
      if (formData.additionalNotes || formData.advancedNotes) {
        aiEnhancements.textAnalysis = await AIService.analyzeText(
          formData.additionalNotes || formData.advancedNotes
        );
      }
      
      setFormData(prev => ({ ...prev, aiEnhancements }));
    } catch (error) {
      console.error('AI enhancement failed:', error);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
    onNext();
  };

  const renderCheckboxGroup = (category, options, title) => (
    <div className="form-group">
      <label>{title}</label>
      <div className="checkbox-group">
        {options.map(option => (
          <div key={option} className="checkbox-item">
            <input
              type="checkbox"
              id={`${category}-${option}`}
              checked={formData[category].includes(option)}
              onChange={() => handleCheckboxChange(category, option)}
            />
            <label htmlFor={`${category}-${option}`}>{option}</label>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="form-section">
      <h2>Step 2: Music Information</h2>
      
      <div className="mode-selector">
        <label>
          <input
            type="radio"
            name="mode"
            value="limited"
            checked={formData.mode === 'limited'}
            onChange={handleInputChange}
          />
          Limited Options (Recommended)
        </label>
        <label>
          <input
            type="radio"
            name="mode"
            value="advanced"
            checked={formData.mode === 'advanced'}
            onChange={handleInputChange}
          />
          Advanced Options
        </label>
      </div>

      <form onSubmit={handleSubmit}>
        {formData.mode === 'limited' ? (
          <div className="limited-options">
            <div className="form-group">
              <label htmlFor="referenceSong">Reference Song (Optional)</label>
              <input
                type="text"
                id="referenceSong"
                name="referenceSong"
                value={formData.referenceSong}
                onChange={handleInputChange}
                placeholder="e.g., 'Bohemian Rhapsody' by Queen"
              />
            </div>

            <div className="form-group">
              <label htmlFor="referenceArtist">Reference Artist/Group (Optional)</label>
              <input
                type="text"
                id="referenceArtist"
                name="referenceArtist"
                value={formData.referenceArtist}
                onChange={handleInputChange}
                placeholder="e.g., The Beatles, Taylor Swift"
              />
            </div>

            <div className="form-group">
              <label htmlFor="tone">Overall Tone</label>
              <select
                id="tone"
                name="tone"
                value={formData.tone}
                onChange={handleInputChange}
              >
                <option value="">Select tone</option>
                {musicOptions.tones.map(tone => (
                  <option key={tone} value={tone}>{tone}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="speed">Speed</label>
              <select
                id="speed"
                name="speed"
                value={formData.speed}
                onChange={handleInputChange}
              >
                <option value="">Select speed</option>
                {musicOptions.speeds.map(speed => (
                  <option key={speed} value={speed}>{speed}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="additionalNotes">Additional Notes</label>
              <textarea
                id="additionalNotes"
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleInputChange}
                placeholder="Describe any specific musical elements you want..."
              />
            </div>
          </div>
        ) : (
          <div className="advanced-options">
            {renderCheckboxGroup('genre', musicOptions.genre, 'Genre')}
            {renderCheckboxGroup('vocalStyle', musicOptions.vocalStyle, 'Vocal Style')}
            {renderCheckboxGroup('moodEnergy', musicOptions.moodEnergy, 'Mood & Energy')}
            {renderCheckboxGroup('instruments', musicOptions.instruments, 'Highlighted Instruments')}
            {renderCheckboxGroup('toneCharacteristics', musicOptions.toneCharacteristics, 'Tone Characteristics')}
            {renderCheckboxGroup('productionEffects', musicOptions.productionEffects, 'Production & Effects')}

            <div className="form-group">
              <label htmlFor="advancedNotes">Additional Notes</label>
              <textarea
                id="advancedNotes"
                name="advancedNotes"
                value={formData.advancedNotes}
                onChange={handleInputChange}
                placeholder="Describe any specific musical elements you want..."
              />
            </div>
          </div>
        )}

        <div className="ai-enhancement">
          <button
            type="button"
            onClick={handleAIEnhancement}
            disabled={isGeneratingAI}
            className="ai-button"
          >
            {isGeneratingAI ? 'Enhancing with AI...' : '🤖 Enhance with AI'}
          </button>
        </div>

        {formData.aiEnhancements && (
          <div className="ai-results">
            <h4>AI Enhancements:</h4>
            <pre>{JSON.stringify(formData.aiEnhancements, null, 2)}</pre>
          </div>
        )}

        <div className="form-actions">
          <button type="button" onClick={onPrev}>Previous</button>
          <button type="submit">Next: Video Information</button>
        </div>
      </form>
    </div>
  );
};

export default MusicInfoForm;