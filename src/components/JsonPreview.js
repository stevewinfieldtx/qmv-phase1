import React, { useState } from 'react';

const JsonPreview = ({ jsonData, onApprove, onEdit }) => {
  const [feedback, setFeedback] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleFeedbackSubmit = () => {
    if (feedback.trim()) {
      // In a real app, this would send feedback to AI for improvements
      alert('Feedback submitted! The JSON will be updated based on your suggestions.');
      setFeedback('');
    }
  };

  const downloadJson = () => {
    const dataStr = JSON.stringify(jsonData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `qmv-project-${Date.now()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="form-section">
      <h2>Step 4: Review Your Project</h2>
      
      <div className="json-summary">
        <h3>Project Summary</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <strong>Customer:</strong> {jsonData?.customerInfo?.name}
          </div>
          <div className="summary-item">
            <strong>Video Length:</strong> {jsonData?.customerInfo?.videoLength} seconds
          </div>
          <div className="summary-item">
            <strong>Target Audience:</strong> {jsonData?.customerInfo?.targetAudience}
          </div>
          <div className="summary-item">
            <strong>Music Style:</strong> {jsonData?.musicInfo?.tone || 'Custom'}
          </div>
          <div className="summary-item">
            <strong>Video Option:</strong> {jsonData?.videoInfo?.option}
          </div>
        </div>
      </div>
      
      <div className="json-preview-container">
        <div className="json-header">
          <h3>Complete Project JSON</h3>
          <button onClick={downloadJson} className="download-btn">
            📥 Download JSON
          </button>
        </div>
        
        <div className="json-preview">
          {JSON.stringify(jsonData, null, 2)}
        </div>
      </div>
      
      <div className="feedback-section">
        <h3>Request Changes</h3>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Describe any changes you'd like to make to your project..."
          rows={4}
        />
        <button 
          onClick={handleFeedbackSubmit}
          disabled={!feedback.trim()}
          className="feedback-btn"
        >
          🤖 Request AI Improvements
        </button>
      </div>
      
      <div className="approval-section">
        <h3>Ready to proceed?</h3>
        <p>Review your project details above. Once approved, you'll proceed to payment.</p>
        
        <div className="form-actions">
          <button onClick={onEdit} className="edit-btn">
            ← Edit Project
          </button>
          <button onClick={onApprove} className="approve-btn">
            ✓ Approve & Continue to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default JsonPreview;