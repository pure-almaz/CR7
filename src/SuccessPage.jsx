import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function SuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  // Details may be passed via location.state
  const details = location.state || { email: 'test@example.com', brand: 'Klook' };

  // Fire Google Analytics conversion event when page loads
  useEffect(() => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'ads_conversion_Purchase_1', {
        // Add any additional event parameters here if needed
      });
    }
  }, []);

  return (
    <div className="ticket-popup-overlay" style={{ minHeight: '100vh' }}>
      <div className="ticket-popup" style={{ margin: '40px auto', maxWidth: 500 }}>
        <div className="ticket-popup-header">
          <img 
            src={`/images/museum-partners/Logo_${details.brand === 'Trip.com' ? 'Trip' : details.brand}.png`} 
            alt={`${details.brand} Logo`} 
            className="ticket-popup-logo"
          />
          <h2>Payment Successful!</h2>
        </div>
        <div className="success-popup-content">
          <h3>Thank You for your purchase!</h3>
          <p>Your payment has been confirmed.</p>
          <p>Your ticket will be sent to your recorded email <strong>{details.email}</strong> from <strong>{details.brand}</strong> within 24 hours.</p>
          <p>Please check your spam folder if you do not see it in your inbox.</p>
          <button className="lm-hero-btn" onClick={() => navigate('/')}>Back to Home</button>
        </div>
      </div>
    </div>
  );
}