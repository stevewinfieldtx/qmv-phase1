import React, { useState } from 'react';

const CustomerInfoForm = ({ data, onUpdate, onNext }) => {
  const [formData, setFormData] = useState({
    name: data.name || '',
    age: data.age || '',
    email: data.email || '',
    videoLength: data.videoLength || '30',
    targetAudience: data.targetAudience || ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.age || formData.age < 1 || formData.age > 120) {
      newErrors.age = 'Please enter a valid age';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.targetAudience) {
      newErrors.targetAudience = 'Please select target audience';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onUpdate(formData);
      onNext();
    }
  };

  return (
    <div className="form-section">
      <h2>Step 1: Customer Information</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="age">Age *</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            min="1"
            max="120"
            className={errors.age ? 'error' : ''}
          />
          {errors.age && <span className="error-message">{errors.age}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="videoLength">Video Length (seconds)</label>
          <select
            id="videoLength"
            name="videoLength"
            value={formData.videoLength}
            onChange={handleChange}
          >
            <option value="15">15 seconds</option>
            <option value="30">30 seconds</option>
            <option value="60">60 seconds</option>
            <option value="90">90 seconds</option>
            <option value="120">2 minutes</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="targetAudience">Target Audience *</label>
          <select
            id="targetAudience"
            name="targetAudience"
            value={formData.targetAudience}
            onChange={handleChange}
            className={errors.targetAudience ? 'error' : ''}
          >
            <option value="">Select target audience</option>
            <option value="under-6">Under 6</option>
            <option value="6-12">6-12 years</option>
            <option value="13-18">13-18 years</option>
            <option value="18+">18+ years</option>
            <option value="all-ages">All Ages</option>
          </select>
          {errors.targetAudience && <span className="error-message">{errors.targetAudience}</span>}
        </div>

        <div className="form-actions">
          <button type="submit">Next: Music Information</button>
        </div>
      </form>
    </div>
  );
};

export default CustomerInfoForm;