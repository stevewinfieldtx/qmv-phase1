import React, { useState } from 'react';
import CustomerInfoForm from './components/CustomerInfoForm';
import MusicInfoForm from './components/MusicInfoForm';
import VideoInfoForm from './components/VideoInfoForm';
import JsonPreview from './components/JsonPreview';
import PaymentForm from './components/PaymentForm';
import './App.css';
import './components/components.css';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    customerInfo: {},
    musicInfo: {},
    videoInfo: {},
    finalJson: null
  });

  const updateFormData = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 5));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const generateFinalJson = () => {
    const finalJson = {
      timestamp: new Date().toISOString(),
      projectId: `qmv-${Date.now()}`,
      customerInfo: formData.customerInfo,
      musicInfo: formData.musicInfo,
      videoInfo: formData.videoInfo,
      status: 'pending_approval',
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
    };
    
    setFormData(prev => ({ ...prev, finalJson }));
    setCurrentStep(4);
  };

  const renderProgressBar = () => {
    const progress = (currentStep / 5) * 100;
    return (
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <CustomerInfoForm
            data={formData.customerInfo}
            onUpdate={(data) => updateFormData('customerInfo', data)}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <MusicInfoForm
            data={formData.musicInfo}
            customerInfo={formData.customerInfo}
            onUpdate={(data) => updateFormData('musicInfo', data)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 3:
        return (
          <VideoInfoForm
            data={formData.videoInfo}
            customerInfo={formData.customerInfo}
            musicInfo={formData.musicInfo}
            onUpdate={(data) => updateFormData('videoInfo', data)}
            onNext={generateFinalJson}
            onPrev={prevStep}
          />
        );
      case 4:
        return (
          <JsonPreview
            jsonData={formData.finalJson}
            onApprove={() => setCurrentStep(5)}
            onEdit={() => setCurrentStep(1)}
          />
        );
      case 5:
        return (
          <PaymentForm
            jsonData={formData.finalJson}
            onComplete={() => {
              alert('🎉 Payment completed! Your music video will be created and delivered within 7 days. Check your email for updates.');
              // In a real app, this would redirect to a success page
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <div className="container">
        <header className="app-header">
          <h1>🎵 QMV - Music Video Creator</h1>
          <p>Create your custom music video in 5 easy steps</p>
          {renderProgressBar()}
          <div className="step-info">
            Step {currentStep} of 5
          </div>
        </header>
        
        <main>
          {renderCurrentStep()}
        </main>
        
        <footer className="app-footer">
          <p>© 2024 QMV Music Video Creator. Powered by AI.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;