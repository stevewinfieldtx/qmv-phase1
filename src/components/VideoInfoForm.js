import React, { useState } from 'react';
import ImageUpload from './ImageUpload';
import AIService from '../services/AIService';

const VideoInfoForm = ({ data, customerInfo, musicInfo, onUpdate, onNext, onPrev }) => {
  const [formData, setFormData] = useState({
    option: data.option || '', // 'own-images', 'ai-generated', 'random'
    // Own images
    uploadedImages: data.uploadedImages || [],
    imageDuration: data.imageDuration || '2',
    // AI generated
    aiPrompt: data.aiPrompt || '',
    aiKeywords: data.aiKeywords || '',
    selectedSuggestion: data.selectedSuggestion || '',
    // Random
    randomStyle: data.randomStyle || ''
  });

  const [suggestions, setSuggestions] = useState([]);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);

  const durationOptions = [
    { value: '1', label: '1 second', images: 30 },
    { value: '2', label: '2 seconds', images: 15 },
    { value: '4', label: '4 seconds', images: 8 },
    { value: '6', label: '6 seconds', images: 5 },
    { value: '8', label: '8 seconds', images: 4 }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (images) => {
    setFormData(prev => ({ ...prev, uploadedImages: images }));
  };

  const generateSuggestions = async () => {
    setIsGeneratingSuggestions(true);
    try {
      const allData = {
        customerInfo,
        musicInfo,
        videoInfo: formData
      };
      
      const aiSuggestions = await AIService.generateImageSuggestions(allData);
      setSuggestions(aiSuggestions);
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  const selectSuggestion = (suggestion) => {
    setFormData(prev => ({ ...prev, selectedSuggestion: suggestion }));
  };

  const calculateVideoLength = () => {
    if (formData.option === 'own-images' && formData.uploadedImages.length > 0) {
      return formData.uploadedImages.length * parseInt(formData.imageDuration);
    }
    return parseInt(customerInfo.videoLength || 30);
  };

  const getRequiredImages = () => {
    const duration = parseInt(formData.imageDuration);
    const videoLength = parseInt(customerInfo.videoLength || 30);
    return Math.ceil(videoLength / duration);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Add calculated values
    const finalData = {
      ...formData,
      calculatedVideoLength: calculateVideoLength(),
      requiredImages: getRequiredImages()
    };
    
    onUpdate(finalData);
    onNext();
  };

  return (
    <div className="form-section">
      <h2>Step 3: Video Information</h2>
      
      <div className="video-info-summary">
        <p><strong>Video Length:</strong> {customerInfo.videoLength} seconds</p>
        <p><strong>Target Audience:</strong> {customerInfo.targetAudience}</p>
        <p><strong>Music Tone:</strong> {musicInfo.tone || 'Not specified'}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="video-options">
          <h3>Choose your video option:</h3>
          
          <div className="option-card">
            <label>
              <input
                type="radio"
                name="option"
                value="own-images"
                checked={formData.option === 'own-images'}
                onChange={handleInputChange}
              />
              <strong>Option A: Use Your Own Images</strong>
            </label>
            
            {formData.option === 'own-images' && (
              <div className="option-content">
                <div className="form-group">
                  <label htmlFor="imageDuration">Duration per image:</label>
                  <select
                    id="imageDuration"
                    name="imageDuration"
                    value={formData.imageDuration}
                    onChange={handleInputChange}
                  >
                    {durationOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label} (need {Math.ceil(parseInt(customerInfo.videoLength || 30) / parseInt(option.value))} images)
                      </option>
                    ))}
                  </select>
                </div>
                
                <ImageUpload
                  images={formData.uploadedImages}
                  onImagesChange={handleImageUpload}
                  maxImages={getRequiredImages()}
                />
                
                <p className="image-count">
                  Uploaded: {formData.uploadedImages.length} / {getRequiredImages()} images
                  {formData.uploadedImages.length > 0 && (
                    <span> (Video length: {calculateVideoLength()} seconds)</span>
                  )}
                </p>
              </div>
            )}
          </div>

          <div className="option-card">
            <label>
              <input
                type="radio"
                name="option"
                value="ai-generated"
                checked={formData.option === 'ai-generated'}
                onChange={handleInputChange}
              />
              <strong>Option B: AI-Generated Images</strong>
            </label>
            
            {formData.option === 'ai-generated' && (
              <div className="option-content">
                <div className="form-group">
                  <label htmlFor="aiKeywords">Keywords or Description:</label>
                  <input
                    type="text"
                    id="aiKeywords"
                    name="aiKeywords"
                    value={formData.aiKeywords}
                    onChange={handleInputChange}
                    placeholder="e.g., sunset, mountains, peaceful, nature"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="aiPrompt">Detailed Prompt (Optional):</label>
                  <textarea
                    id="aiPrompt"
                    name="aiPrompt"
                    value={formData.aiPrompt}
                    onChange={handleInputChange}
                    placeholder="Describe the visual style and content you want..."
                  />
                </div>
                
                <button
                  type="button"
                  onClick={generateSuggestions}
                  disabled={isGeneratingSuggestions}
                  className="suggestion-button"
                >
                  {isGeneratingSuggestions ? 'Generating...' : '💡 Get AI Suggestions'}
                </button>
                
                {suggestions.length > 0 && (
                  <div className="suggestions">
                    <h4>AI Suggestions:</h4>
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className={`suggestion-item ${formData.selectedSuggestion === suggestion ? 'selected' : ''}`}
                        onClick={() => selectSuggestion(suggestion)}
                      >
                        <p>{suggestion}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="option-card">
            <label>
              <input
                type="radio"
                name="option"
                value="random"
                checked={formData.option === 'random'}
                onChange={handleInputChange}
              />
              <strong>Option C: Random & Fun</strong>
            </label>
            
            {formData.option === 'random' && (
              <div className="option-content">
                <p>Let AI create truly random, goofy, and silly combinations!</p>
                <div className="form-group">
                  <label htmlFor="randomStyle">Preferred style (Optional):</label>
                  <select
                    id="randomStyle"
                    name="randomStyle"
                    value={formData.randomStyle}
                    onChange={handleInputChange}
                  >
                    <option value="">Completely Random</option>
                    <option value="cartoon">Cartoon Style</option>
                    <option value="abstract">Abstract Art</option>
                    <option value="surreal">Surreal & Weird</option>
                    <option value="retro">Retro & Vintage</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onPrev}>Previous</button>
          <button 
            type="submit" 
            disabled={
              !formData.option || 
              (formData.option === 'own-images' && formData.uploadedImages.length === 0)
            }
          >
            Generate JSON
          </button>
        </div>
      </form>
    </div>
  );
};

export default VideoInfoForm;