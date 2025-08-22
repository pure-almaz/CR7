import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import FomoPopup from './FomoPopup';
import { useNavigate } from 'react-router-dom';
import NowPaymentsApi from '@nowpaymentsio/nowpayments-api-js';
import {QRCodeSVG} from 'qrcode.react';
import './App.css';

// Google Analytics helper function for delayed navigation
function gtagSendEvent(url) {
  var callback = function () {
    if (typeof url === 'string') {
      window.location = url;
    }
  };
  if (typeof gtag !== 'undefined') {
    gtag('event', 'ads_conversion_Purchase_1', {
      'event_callback': callback,
      'event_timeout': 2000,
    });
  } else {
    // Fallback if gtag is not available
    callback();
  }
  return false;
}

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
  { name: 'Standard', price: 24.45, description: 'General entry to the CR7 Museum with access to all permanent exhibits celebrating Cristiano Ronaldo’s career.' },
  { name: 'VIP', price: 270.38, description: 'Includes general entry plus a guided tour by a museum host, priority entry, and access to an exclusive photo area. Complimentary souvenir included.' },
  { name: 'Gold', price: 567.78, description: 'Enjoy all VIP benefits plus access to the private CR7 memorabilia collection, a personalized guided tour, and a signed replica photo.' },
  { name: 'Platinum', price: 999.57, description: 'Full CR7 experience: All Gold benefits plus a private lounge visit, premium gift pack, and a personalized video greeting from Cristiano Ronaldo (subject to availability).' },
  { name: 'Reserve', price: 2199.99, description: 'Reserved entry with flexible time slot on your chosen day, VIP seating for museum presentations, and complimentary refreshments.' },
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

// Flutterwave card payment function
function makePayment({ amount, email, brand }) {
  const tx_ref = `CR7MUSEUM-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  window.FlutterwaveCheckout({
    public_key: 'FLWPUBK-9f81191e76c5478fdfe1dedaf8646e32-X',
    tx_ref,
    amount,
    currency: 'USD',
    redirect_url: `${window.location.origin}/success?email=${encodeURIComponent(email)}&brand=${encodeURIComponent(brand)}`,
    customer: {
      email: email,
    },
    customizations: {
      title: 'CR7 Museum HK',
      description: 'Ticket Booking Payment',
      logo: 'https://i.ibb.co/B5CMy6Nh/CR7-Logo.jpg',
    },
  });
}

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
  const { t, i18n } = useTranslation();
  const [selectedTicket, setSelectedTicket] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [email, setEmail] = useState('');
  // Validation error state for live feedback
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (!selectedDate) {
      setValidationError(t('ticket.error.date'));
    } else if (!email) {
      setValidationError(t('ticket.error.email'));
    } else {
      setValidationError("");
    }
  }, [selectedDate, email, t]);
  const [paymentMethod, setPaymentMethod] = useState('card'); // Default to card
  const [cardDisabled, setCardDisabled] = useState(false);
  const [cardDisableMsg, setCardDisableMsg] = useState('');
  const [npApi, setNpApi] = useState(null);
  const [availableCurrencies, setAvailableCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('usdttrc20');
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const emailRef = useRef();
  const dateRef = useRef();
  // Accept fomoDiscount prop
  const fomoDiscount = arguments[0]?.fomoDiscount;

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
          if (["finished", "confirmed", "sending"].includes(status.payment_status)) {
            clearInterval(interval);
            gtagSendEvent('/success');
            setTimeout(() => {
              navigate('/success', { state: { email, brand } });
            }, 100);
          }
        } catch (e) {}
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [paymentInfo, npApi, email, brand, navigate]);

  const basePrice = ticketOptions[selectedTicket].price * quantity;
  const discount = fomoDiscount ? 0.1 : 0;
  const totalPrice = basePrice * (1 - discount);

  useEffect(() => {
    // Only check for totalPrice > 1000
    if (totalPrice > 1000) {
      setCardDisabled(true);
      setPaymentMethod('crypto');
      setCardDisableMsg('Amount exceeding 1000 USD can only be paid via crypto. Please contact us using the WhatsApp button below if you don\'t know how to pay with crypto.');
    } else {
      setCardDisabled(false);
      setCardDisableMsg('');
    }
  }, [totalPrice]);

  if (!isOpen) return null;

  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setPaymentInfo(null);

    // Error handling for missing fields
    if (!selectedDate) {
      setError('Please select a date.');
      dateRef.current?.focus();
      return;
    }
    if (!email) {
      setError('Please enter your email address.');
      emailRef.current?.focus();
      return;
    }

    if (paymentMethod === 'card') {
      makePayment({ amount: totalPrice, email, brand });
      return;
    }

    if (paymentMethod === 'crypto' && npApi) {
      setIsLoading(true);
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
              <button type="button" onClick={handleCopy} style={{ background: '#d6ff1c', color: '#000', border: 'none', borderRadius: 4, padding: '4px 10px', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem' }} aria-label="Copy address to clipboard">{copied ? 'Copied!' : 'Copy'}</button>
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
          <img src={`/images/museum-partners/Logo_${brand === 'Trip.com' ? 'Trip' : brand}.png`} alt={`${brand} Logo`} className="ticket-popup-logo" />
          <h2>{t('ticket.title', { brand })}</h2>
        </div>
        <form onSubmit={handleSubmit} className="ticket-popup-form">
          {/* Ticket Type Selection */}
          <div className="ticket-popup-section">
            <h3>{t('ticket.selectType')}</h3>
            <div className="ticket-options">
              {ticketOptions.map((ticket, index) => (
                <div key={index} className={`ticket-option ${selectedTicket === index ? 'selected' : ''}`} onClick={() => setSelectedTicket(index)}>
                  <div className="ticket-option-header">
                    <input type="radio" name="ticketType" checked={selectedTicket === index} onChange={() => setSelectedTicket(index)} />
                    <span className="ticket-name">{ticket.name}</span>
                    <span className="ticket-price">${ticket.price.toLocaleString()}</span>
                  </div>
                  <p className="ticket-description">{t(`ticket.desc`, { defaultValue: ticket.description })}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Date Selection */}
          <div className="ticket-popup-section">
            <h3>{t('ticket.selectDate')}</h3>
            <div className="date-input-container">
              <input ref={dateRef} type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} min={today} max={maxDate} required className="date-input" placeholder="Select visit date" />
            </div>
            <p className="date-note">{t('ticket.dateNote', { defaultValue: 'Select your preferred visit date' })}</p>
          </div>
          {/* Quantity */}
          <div className="ticket-popup-section">
            <h3>{t('ticket.quantity')}</h3>
            <div className="quantity-selector">
              <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="quantity-btn">-</button>
              <span className="quantity-display">{quantity}</span>
              <button type="button" onClick={() => setQuantity(quantity + 1)} className="quantity-btn">+</button>
            </div>
          </div>
          {/* Email */}
          <div className="ticket-popup-section">
            <h3>{t('ticket.email')}</h3>
            <input ref={emailRef} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your.email@example.com" required className="email-input" />
            <p className="email-note">{t('ticket.emailNote', { defaultValue: 'Your e-ticket will be sent to this address.' })}</p>
          </div>
          {/* Payment Method */}
          <div className="ticket-popup-section">
            <h3>{t('ticket.paymentMethod')}</h3>
            <div className="payment-methods">
              <div className={`payment-method${cardDisabled ? ' disabled' : ''}`}> 
                <input 
                  type="radio" 
                  id="card-payment" 
                  name="paymentMethod" 
                  value="card" 
                  checked={paymentMethod === 'card'} 
                  onChange={(e) => setPaymentMethod(e.target.value)} 
                  disabled={cardDisabled}
                />
                <label htmlFor="card-payment">{t('ticket.payWithCard')}</label>
                {cardDisabled && (
                  <p className="card-disable-msg" style={{color: 'red', fontWeight: 500}}>{cardDisableMsg}</p>
                )}
              </div>
              <div className="payment-method">
                <input 
                  type="radio" 
                  id="crypto-payment" 
                  name="paymentMethod" 
                  value="crypto" 
                  checked={paymentMethod === 'crypto'} 
                  onChange={(e) => setPaymentMethod(e.target.value)} 
                />
                <label htmlFor="crypto-payment">{t('ticket.payWithCrypto')}</label>
                {paymentMethod === 'crypto' && (
                  <select className="currency-selector" value={selectedCurrency} onChange={(e) => setSelectedCurrency(e.target.value)}>
                    {availableCurrencies.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                  </select>
                )}
              </div>
            </div>
          </div>
          <div className="ticket-popup-total">
            {fomoDiscount ? (
              <>
                <h3>{t('ticket.total', { price: basePrice.toFixed(2) })} <span style={{textDecoration:'line-through', color:'#888'}}>${basePrice.toFixed(2)}</span> <span style={{color:'#d6ff1c', fontWeight:700}}>${totalPrice.toFixed(2)}</span> USD</h3>
                <p style={{color:'#d6ff1c', fontWeight:600}}>{t('ticket.discount')}</p>
              </>
            ) : (
              <h3>{t('ticket.total', { price: totalPrice.toFixed(2) })}</h3>
            )}
          </div>
          {validationError && (
            <p className="error-message" style={{color:'red',marginBottom:'10px'}}>{validationError}</p>
          )}
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="ticket-popup-submit" disabled={isLoading}>
            {isLoading ? 'Processing...' : t('ticket.button')}
          </button>
          {/* Language Switcher */}
          <div style={{marginTop:16}}>
            <select value={i18n.language} onChange={e => i18n.changeLanguage(e.target.value)}>
              <option value="en">English</option>
              <option value="zh-CN">简体中文</option>
              <option value="zh-TW">繁體中文</option>
              <option value="ja">日本語</option>
              <option value="ko">한국어</option>
            </select>
          </div>
                    {/* WhatsApp Help Section */}
          <div className="whatsapp-help-section">
            <div className="whatsapp-help-content">
              <div className="whatsapp-help-text">
                <p>{t('ticket.help', { defaultValue: 'Do you need help completing your purchase?' })}</p>
                <p><strong>{t('ticket.whatsapp', { defaultValue: 'Chat with us on WhatsApp' })}</strong></p>
              </div>
              <a href="https://wa.me/15632011430" target="_blank" rel="noopener noreferrer" className="whatsapp-help-button">
                {/* ...SVG... */}
                {t('ticket.chatNow', { defaultValue: 'Chat Now' })}
              </a>
            </div>
          </div>
        </form>
        <div className="ticket-popup-info">
          {/* ...existing info... */}
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
  const [fomoOpen, setFomoOpen] = useState(false);
  const [fomoDiscountActive, setFomoDiscountActive] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFomoOpen(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleTicketClick = (brand) => {
    setSelectedBrand(brand);
    setPopupOpen(true);
    setFomoDiscountActive(false);
  };

  const handleFomoGetTicket = (brand) => {
    setFomoOpen(false);
    setSelectedBrand(brand);
    setPopupOpen(true);
    setFomoDiscountActive(true);
  };

  return (
    <div className="lm-root">
      {/* FOMO Popup */}
      <FomoPopup open={fomoOpen} onClose={() => setFomoOpen(false)} onGetTicket={handleFomoGetTicket} />
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
        onClose={() => { setPopupOpen(false); setFomoDiscountActive(false); }} 
        brand={selectedBrand}
        fomoDiscount={fomoDiscountActive}
      />
    </div>
  );
}
