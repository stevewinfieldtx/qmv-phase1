import React, { useState } from 'react';

const PaymentForm = ({ jsonData, onComplete }) => {
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    billingAddress: '',
    city: '',
    zipCode: '',
    country: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  // Calculate pricing based on project complexity
  const calculatePrice = () => {
    let basePrice = 29.99; // Base price
    
    // Add pricing based on video length
    const videoLength = parseInt(jsonData?.customerInfo?.videoLength || 30);
    if (videoLength > 60) basePrice += 10;
    if (videoLength > 120) basePrice += 20;
    
    // Add pricing for advanced music options
    if (jsonData?.musicInfo?.mode === 'advanced') basePrice += 15;
    
    // Add pricing for AI-generated images
    if (jsonData?.videoInfo?.option === 'ai-generated') basePrice += 10;
    
    return basePrice.toFixed(2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!paymentData.cardNumber || paymentData.cardNumber.length < 16) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }
    
    if (!paymentData.expiryDate || !/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) {
      newErrors.expiryDate = 'Please enter expiry date (MM/YY)';
    }
    
    if (!paymentData.cvv || paymentData.cvv.length < 3) {
      newErrors.cvv = 'Please enter a valid CVV';
    }
    
    if (!paymentData.cardName.trim()) {
      newErrors.cardName = 'Please enter cardholder name';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // In a real app, this would:
      // 1. Process payment with payment gateway
      // 2. Store final JSON in Google Cloud Storage
      // 3. Trigger music video generation pipeline
      
      onComplete();
    } catch (error) {
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="form-section">
      <h2>Step 5: Payment</h2>
      
      <div className="payment-summary">
        <h3>Order Summary</h3>
        <div className="order-details">
          <div className="order-item">
            <span>Custom Music Video ({jsonData?.customerInfo?.videoLength}s)</span>
            <span>${calculatePrice()}</span>
          </div>
          <div className="order-total">
            <strong>
              <span>Total</span>
              <span>${calculatePrice()}</span>
            </strong>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="payment-form">
        <h3>Payment Information</h3>
        
        <div className="form-group">
          <label htmlFor="cardNumber">Card Number *</label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={paymentData.cardNumber}
            onChange={handleInputChange}
            placeholder="1234 5678 9012 3456"
            maxLength="19"
            className={errors.cardNumber ? 'error' : ''}
          />
          {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="expiryDate">Expiry Date *</label>
            <input
              type="text"
              id="expiryDate"
              name="expiryDate"
              value={paymentData.expiryDate}
              onChange={handleInputChange}
              placeholder="MM/YY"
              maxLength="5"
              className={errors.expiryDate ? 'error' : ''}
            />
            {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="cvv">CVV *</label>
            <input
              type="text"
              id="cvv"
              name="cvv"
              value={paymentData.cvv}
              onChange={handleInputChange}
              placeholder="123"
              maxLength="4"
              className={errors.cvv ? 'error' : ''}
            />
            {errors.cvv && <span className="error-message">{errors.cvv}</span>}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="cardName">Cardholder Name *</label>
          <input
            type="text"
            id="cardName"
            name="cardName"
            value={paymentData.cardName}
            onChange={handleInputChange}
            placeholder="John Doe"
            className={errors.cardName ? 'error' : ''}
          />
          {errors.cardName && <span className="error-message">{errors.cardName}</span>}
        </div>
        
        <h3>Billing Address</h3>
        
        <div className="form-group">
          <label htmlFor="billingAddress">Address</label>
          <input
            type="text"
            id="billingAddress"
            name="billingAddress"
            value={paymentData.billingAddress}
            onChange={handleInputChange}
            placeholder="123 Main Street"
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={paymentData.city}
              onChange={handleInputChange}
              placeholder="New York"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="zipCode">ZIP Code</label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={paymentData.zipCode}
              onChange={handleInputChange}
              placeholder="10001"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="country">Country</label>
          <select
            id="country"
            name="country"
            value={paymentData.country}
            onChange={handleInputChange}
          >
            <option value="">Select Country</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="UK">United Kingdom</option>
            <option value="AU">Australia</option>
            {/* Add more countries as needed */}
          </select>
        </div>
        
        <div className="payment-actions">
          <button 
            type="submit" 
            disabled={isProcessing}
            className="pay-button"
          >
            {isProcessing ? (
              <span>🔄 Processing Payment...</span>
            ) : (
              <span>💳 Pay ${calculatePrice()}</span>
            )}
          </button>
        </div>
        
        <div className="payment-security">
          <p>🔒 Your payment information is secure and encrypted</p>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;