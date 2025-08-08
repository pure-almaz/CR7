import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NowPaymentsApi from '@nowpaymentsio/nowpayments-api-js';
import {QRCodeSVG} from 'qrcode.react';
import './App.css';

const ticketLinks = [
  { label: 'GET TICKET WITH KLOOK', brand: 'Klook' },
  { label: 'GET TICKET WITH TRIP.COM', brand: 'Trip.com' },
  { label: 'GET TICKET WITH K11', brand: 'K11' },
];

const visitOptions = [
  { logo: '/images/museum-partners/Logo_Klook.png', btn: 'GET TICKET', brand: 'Klook' },
  { logo: '/images/museum-partners/Logo_Trip.png', btn: 'GET TICKET', brand: 'Trip.com' },
  { logo: '/images/museum-partners/Logo_K11.png', btn: 'GET TICKET', brand: 'K11' },
];

const ticketOptions = [
  {
    name: 'Standard',
    price: 24.45,
    description: 'General entry to the CR7 Museum with access to all permanent exhibits celebrating Cristiano Ronaldo’s career.'
  },
  {
    name: 'VIP',
    price: 270.38,
    description: 'Includes general entry plus a guided tour by a museum host, priority entry, and access to an exclusive photo area. Complimentary souvenir included.'
  },
  {
    name: 'Gold',
    price: 567.78,
    description: 'Enjoy all VIP benefits plus access to the private CR7 memorabilia collection, a personalized guided tour, and a signed replica photo.'
  },
  {
    name: 'Platinum',
    price: 999.57,
    description: 'Full CR7 experience: All Gold benefits plus a private lounge visit, premium gift pack, and a personalized video greeting from Cristiano Ronaldo (subject to availability).'
  },
  {
    name: 'Reserve',
    price: 2199.99,
    description: 'Reserved entry with flexible time slot on your chosen day, VIP seating for museum presentations, and complimentary refreshments.'
  }
];


const whatsInside = [
  {
    img: '/images/inside-museum/photo-trophies.jpg',
    title: 'TROPHIES',
    desc: 'See the highlighted trophies that I won by club and in individual.',
  },
  {
    img: '/images/inside-museum/photo-timeline.jpg',
    title: 'LIFE & CAREER TIMELINE',
    desc: 'Walk through my journey and discover more about my story and career.',
  },
  {
    img: '/images/inside-museum/photo-interactive-experience.jpg',
    title: 'INTERACTIVE EXPERIENCES',
    desc: 'You control the experience and the information.',
  },
  {
    img: '/images/inside-museum/photo-immersive-journey.jpg',
    title: 'IMMERSIVE JOURNEY',
    desc: 'Step into the places and the experiences that marked my career and life.',
  },
  {
    img: '/images/inside-museum/photo-youtube-studio.jpg',
    title: 'UR7 YOUTUBE STUDIO',
    desc: 'Take a photo at my UR7 youtube studio.',
  },
];

const partners = [
  { logo: '/images/museum-partners/Logo_Klook.png', label: 'klook' },
  { logo: '/images/museum-partners/Logo_Trip.png', label: 'Trip.com Group' },
  { logo: '/images/museum-partners/Logo_K11.png', label: 'K11' },
];

function SuccessPopup({ isOpen, onClose, brand, email }) {
  if (!isOpen) return null;

  return (
    <div className="ticket-popup-overlay" onClick={onClose}>
      <div className="ticket-popup" onClick={(e) => e.stopPropagation()}>
        <button className="ticket-popup-close" onClick={onClose}>×</button>
        <div className="ticket-popup-header">
          <img 
            src={`/images/museum-partners/Logo_${brand === 'Trip.com' ? 'Trip' : brand}.png`} 
            alt={`${brand} Logo`} 
            className="ticket-popup-logo"
          />
          <h2>Payment Successful!</h2>
        </div>
        <div className="success-popup-content">
          <h3>Thank You for your purchase!</h3>
          <p>Your payment has been confirmed.</p>
          <p>Your ticket will be sent to your recorded email <strong>{email}</strong> from <strong>{brand}</strong> within 24 hours.</p>
          <p>Please check your spam folder if you do not see it in your inbox.</p>
          <button className="lm-hero-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

function TicketPopup({ isOpen, onClose, brand }) {
  const [selectedTicket, setSelectedTicket] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('crypto');
  const [npApi, setNpApi] = useState(null);
  const [availableCurrencies, setAvailableCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('usdttrc20');
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const api = new NowPaymentsApi({ apiKey: import.meta.env.VITE_NOWPAYMENTS_API_KEY });
      setNpApi(api);
      
      const fetchCurrencies = async () => {
        try {
          const { currencies } = await api.getCurrencies();
          setAvailableCurrencies(currencies);
        } catch (e) {
          setError('Could not fetch currencies.');
          console.error(e);
        }
      };
      fetchCurrencies();
    }
  }, [isOpen]);

  useEffect(() => {
    if (paymentInfo && paymentInfo.payment_id) {
      const interval = setInterval(async () => {
        try {
          const status = await npApi.getPaymentStatus({ payment_id: paymentInfo.payment_id });
          setPaymentStatus(status.payment_status);
          if (['finished', 'confirmed', 'sending'].includes(status.payment_status)) {
            clearInterval(interval);
            // Navigate to /success with details
            navigate('/success', { state: { email, brand } });
          }
        } catch (e) {
          console.error("Error checking payment status:", e);
        }
      }, 5000); // Check every 5 seconds

      return () => clearInterval(interval);
    }
  }, [paymentInfo, npApi, email, brand, navigate]);


  if (!isOpen) return null;

  const totalPrice = ticketOptions[selectedTicket].price * quantity;
  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (paymentMethod === 'crypto' && npApi) {
        setIsLoading(true);
        setError(null);
        setPaymentInfo(null);
        try {
            const payment = await npApi.createPayment({
                price_amount: totalPrice,
                price_currency: 'usd',
                pay_currency: selectedCurrency,
                order_id: `CR7MUSEUM-${Date.now()}`,
                order_description: `${ticketOptions[selectedTicket].name} x${quantity}`,
                payer_email: email,
            });
            setPaymentInfo(payment);
        } catch (e) {
            setError('Payment creation failed. Please try again.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }
  };

  if (paymentInfo) {
    const handleCopy = () => {
      if (paymentInfo.pay_address) {
        navigator.clipboard.writeText(paymentInfo.pay_address);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }
    };
    return (
      <div className="ticket-popup-overlay" onClick={onClose}>
        <div className="ticket-popup" onClick={(e) => e.stopPropagation()}>
          <button className="ticket-popup-close" onClick={onClose}>×</button>
          <div className="ticket-popup-header">
            <h2>Complete Your Payment</h2>
          </div>
          <div className="payment-info-content">
            <p>Please send exactly</p>
            <h3>{paymentInfo.pay_amount} {paymentInfo?.pay_currency?.toUpperCase()}</h3>
            <p>to the address below:</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <strong className="payment-address">{paymentInfo.pay_address}</strong>
              <button
                type="button"
                onClick={handleCopy}
                style={{
                  background: '#d6ff1c',
                  color: '#000',
                  border: 'none',
                  borderRadius: 4,
                  padding: '4px 10px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                }}
                aria-label="Copy address to clipboard"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="qr-code-container">
              <QRCodeSVG value={paymentInfo.pay_address} size={180} />
            </div>
            <p>Status: <span className={`payment-status status-${paymentStatus}`}>{paymentStatus || 'waiting'}</span></p>
            <p className="payment-note">Do not close this window until the payment is confirmed.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ticket-popup-overlay" onClick={onClose}>
      <div className="ticket-popup" onClick={(e) => e.stopPropagation()}>
        <button className="ticket-popup-close" onClick={onClose}>×</button>
        
        <div className="ticket-popup-header">
          <img 
            src={`/images/museum-partners/Logo_${brand === 'Trip.com' ? 'Trip' : brand}.png`} 
            alt={`${brand} Logo`} 
            className="ticket-popup-logo"
          />
          <h2>Get Your Ticket with {brand}</h2>
        </div>

        <form onSubmit={handleSubmit} className="ticket-popup-form">
          {/* Ticket Type Selection */}
          <div className="ticket-popup-section">
            <h3>Select Ticket Type</h3>
            <div className="ticket-options">
              {ticketOptions.map((ticket, index) => (
                <div 
                  key={index}
                  className={`ticket-option ${selectedTicket === index ? 'selected' : ''}`}
                  onClick={() => setSelectedTicket(index)}
                >
                  <div className="ticket-option-header">
                    <input
                      type="radio"
                      name="ticketType"
                      checked={selectedTicket === index}
                      onChange={() => setSelectedTicket(index)}
                    />
                    <span className="ticket-name">{ticket.name}</span>
                    <span className="ticket-price">${ticket.price.toLocaleString()}</span>
                  </div>
                  <p className="ticket-description">{ticket.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Date Selection */}
          <div className="ticket-popup-section">
            <h3>Select Date</h3>
            <div className="date-input-container">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={today}
                max={maxDate}
                required
                className="date-input"
                placeholder="Select visit date"
              />
              <svg 
                className="date-input-icon" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" 
                  fill="currentColor"
                />
              </svg>
            </div>
            <p className="date-note">Select your preferred visit date</p>
          </div>

          {/* Quantity */}
          <div className="ticket-popup-section">
            <h3>Quantity</h3>
            <div className="quantity-selector">
              <button 
                type="button" 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="quantity-btn"
              >
                -
              </button>
              <span className="quantity-display">{quantity}</span>
              <button 
                type="button" 
                onClick={() => setQuantity(quantity + 1)}
                className="quantity-btn"
              >
                +
              </button>
            </div>
          </div>

          {/* Email */}
          <div className="ticket-popup-section">
            <h3>Email Address</h3>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                className="email-input"
            />
            <p className="email-note">Your e-ticket will be sent to this address.</p>
          </div>

          {/* Payment Method */}
          <div className="ticket-popup-section">
            <h3>Payment Method</h3>
            <div className="payment-methods">
              <div className="payment-method">
                <input
                  type="radio"
                  id="crypto-payment"
                  name="paymentMethod"
                  value="crypto"
                  checked={paymentMethod === 'crypto'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label htmlFor="crypto-payment">Pay With Crypto</label>
                {paymentMethod === 'crypto' && (
                  <select 
                    className="currency-selector" 
                    value={selectedCurrency} 
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                  >
                    {availableCurrencies.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                  </select>
                )}
              </div>
              <div className="payment-method disabled">
                <input
                  type="radio"
                  id="card-payment"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  disabled
                />
                <label htmlFor="card-payment">Pay With Card</label>
                <p className="maintenance-notice">Card payment is currently undergoing maintenance. Only crypto payment is currently supported.</p>
              </div>
            </div>
          </div>

          <div className="ticket-popup-total">
            <h3>Total: ${totalPrice.toFixed(2)} USD</h3>
          </div>

          {/* WhatsApp Help Section */}
          <div className="whatsapp-help-section">
            <div className="whatsapp-help-content">
              <div className="whatsapp-help-text">
                <p>Do you need help completing your purchase?</p>
                <p><strong>Chat with us on WhatsApp</strong></p>
              </div>
              <a 
                href="https://wa.me/15632011430" 
                target="_blank" 
                rel="noopener noreferrer"
                className="whatsapp-help-button"
              >
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="whatsapp-icon"
                >
                  <path 
                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" 
                    fill="currentColor"
                  />
                </svg>
                Chat Now
              </a>
            </div>
          </div>
          
          {error && <p className="error-message">{error}</p>}

          <button 
            type="submit" 
            className="ticket-popup-submit"
            disabled={!selectedDate || !email || paymentMethod === 'card' || isLoading}
          >
            {isLoading ? 'Processing...' : 'Proceed to Payment'}
          </button>
        </form>

        <div className="ticket-popup-info">
          <h4>About this package</h4>
          <p>Upon Museum admission, you are required to present this ticket (E-tickets by mobile devices or an A4-sized printout). If needed, you are also required to present the identity document of the ticket holder before entering the museum.</p>
          
          <h4>Additional information</h4>
          <ul>
            <li>This is an admission ticket to CR7® LIFE Museum Hong Kong.</li>
            <li>This ticket is valid for one-time admission on the date specified.</li>
            <li>This ticket is non-refundable, non-exchangeable and can be used once only.</li>
            <li>This ticket must be used by the same person during its period of validity.</li>
            <li>Child ticket is for children aged 3-11. Children aged 0-11 must be accompanied by a person aged 18+.</li>
            <li>Senior ticket is for elderly aged 65 or above.</li>
            <li>No cancellations, refunds, or changes can be made.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function LifeMuseumPage() {
  const navigate = useNavigate();
  const insideCardsRef = useRef(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('');

  const handleTicketClick = (brand) => {
    setSelectedBrand(brand);
    setPopupOpen(true);
  };

  return (
    <div className="lm-root">
      {/* ... nav and hero ... */}
      <nav className="lm-navbar">
        <div className="cr7-logo">CRISTIANO RONALDO</div>
        <button className="lm-close-btn" aria-label="Close" onClick={() => navigate('/')}>×</button>
      </nav>
      <main>
        <section className="lm-hero">
          <video
            className="lm-hero-video"
            src="/videos/CR7SignatureMuseum_header.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="lm-hero-overlay">
            <span className="lm-highlight">CR7 LIFE MUSEUM</span>
            <h1>HONG KONG</h1>
            <p className="lm-hero-desc">This is my journey, my career, my life.<br />An exclusive view, stories never told before. An unique experience.</p>
            <div className="lm-hero-btns-row">
              {ticketLinks.map((btn, i) => (
                <button 
                  className="lm-hero-btn" 
                  onClick={() => handleTicketClick(btn.brand)} 
                  key={i}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ... rest of the page ... */}
        <div className="lm-banner-container">
          <img
            src="/images/banner-logo.png"
            alt="CR7 Life Museum Logo"
            className="lm-banner-logo-img"
          />
          <img
            src="/images/banner-background.jpg"
            alt="CR7 Life Museum Banner"
            className="lm-banner-img"
          />
          <div className="lm-banner-bottom-overlay">
            <span className="lm-banner-bottom-text">"WITHOUT FOOTBALL,<br />MY LIFE IS WORTH NOTHING."</span>
          </div>
        </div>

        <section className="lm-book-visit">
          <h2 className="lm-book-title">BOOK YOUR VISIT</h2>
          <p className="lm-book-desc">Visit my exclusive <b>CR7 Life Museum at K11, Hong Kong</b></p>
          <div className="lm-book-options">
            {visitOptions.map((opt, i) => (
              <div className="lm-book-card" key={i}>
                <img src={opt.logo} alt="Museum Partner Logo" className="lm-book-logo" />
                <button 
                  className="lm-book-btn" 
                  onClick={() => handleTicketClick(opt.brand)}
                >
                  {opt.btn}
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="lm-inside">
          <h2 className="lm-inside-title">WHAT'S INSIDE?</h2>
          <p className="lm-inside-desc">
            Capture my passion for football, experience the journey through my career: the places, the people, the trophies, the memories. This is my life, inside and outside the field, and can only be seen at the Life Museum in Hong Kong.
          </p>
          <div className="lm-inside-cards" ref={insideCardsRef}>
            {whatsInside.map((item, i) => (
              <div className="lm-inside-card" key={i}>
                <div className="lm-inside-img-container">
                  <img src={item.img} alt={item.title} className="lm-inside-img" />
                  <div className="lm-inside-card-overlay">
                    <div className="lm-inside-card-title">{item.title}</div>
                    <div className="lm-inside-card-desc">{item.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="lm-banner1-container">
          <img
            src="/images/banner-1.jpg"
            alt="Banner 1"
            className="lm-banner1-img"
          />
          <img
            src="/images/banner-2.png"
            alt="Banner 2 Overlay"
            className="lm-banner2-overlay-img"
          />
        </div>

        <section className="lm-partners">
          <h2 className="lm-partners-title">PARTNERS</h2>
          <div className="lm-partners-logos">
            {partners.map((p, i) => (
              <img src={p.logo} alt={p.label} className="lm-partner-logo" key={i} />
            ))}
          </div>
        </section>
      </main>

      {/* Ticket Popup */}
      <TicketPopup 
        isOpen={popupOpen} 
        onClose={() => setPopupOpen(false)} 
        brand={selectedBrand}
      />
    </div>
  );
}
