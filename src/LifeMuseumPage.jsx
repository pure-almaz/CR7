import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    description: 'No cancellation, Valid on the selected date, Instant confirmation'
  },
  {
    name: 'Duo Ticket (2 Adults)',
    price: 27.38,
    description: 'No cancellation, Valid on the selected date, Instant confirmation'
  },
  {
    name: 'Duo Concession Ticket (2 Child/ Senior)',
    price: 39.78,
    description: 'No cancellation, Valid on the selected date, Instant confirmation'
  },
  {
    name: 'Duo Ticket and Concession Ticket (2 Adults + 1 Child/ Senior)',
    price: 66.57,
    description: 'No cancellation, Valid on the selected date, Instant confirmation'
  },
  {
    name: '1 Adult & 1 Concession (Child/Senior)',
    price: 43.59,
    description: 'No cancellation, Valid on the selected date, Instant confirmation'
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

function TicketPopup({ isOpen, onClose, brand }) {
  const [selectedTicket, setSelectedTicket] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('crypto');

  if (!isOpen) return null;

  const totalPrice = ticketOptions[selectedTicket].price * quantity;
  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (paymentMethod === 'crypto') {
      // Handle crypto payment
      alert('Redirecting to crypto payment...');
    }
  };

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
                    <span className="ticket-price">${ticket.price}</span>
                  </div>
                  <p className="ticket-description">{ticket.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="ticket-popup-section">
            <h3>Select Date</h3>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={today}
              max={maxDate}
              required
              className="date-input"
            />
          </div>

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

          <div className="ticket-popup-section">
            <h3>Payment Method</h3>
            <div className="payment-methods">
              <div className="payment-method">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="crypto"
                  checked={paymentMethod === 'crypto'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label>Pay With Crypto</label>
              </div>
              <div className="payment-method disabled">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  disabled
                />
                <label>Pay With Card</label>
                <p className="maintenance-notice">Card payment is currently undergoing maintenance. Only crypto payment is currently supported.</p>
              </div>
            </div>
          </div>

          <div className="ticket-popup-total">
            <h3>Total: ${totalPrice.toFixed(2)} USD</h3>
          </div>

          <button 
            type="submit" 
            className="ticket-popup-submit"
            disabled={!selectedDate || paymentMethod === 'card'}
          >
            {paymentMethod === 'crypto' ? 'Pay with Crypto' : 'Pay with Card (Disabled)'}
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
      {/* Transparent Nav Bar */}
      <nav className="lm-navbar">
        <div className="cr7-logo">CRISTIANO RONALDO</div>
        <button className="lm-close-btn" aria-label="Close" onClick={() => navigate('/')}>×</button>
      </nav>
      <main>
        {/* Hero Section */}
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

        {/* Banner Image with Overlays */}
        <div className="lm-banner-container">
          {/* Top Overlay as Image */}
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
          {/* Bottom Overlay */}
          <div className="lm-banner-bottom-overlay">
            <span className="lm-banner-bottom-text">"WITHOUT FOOTBALL,<br />MY LIFE IS WORTH NOTHING."</span>
          </div>
        </div>

        {/* Book Your Visit Section */}
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

        {/* What's Inside Section */}
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

        {/* Banner 1 with Banner 2 Overlay */}
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

        {/* Partners Section */}
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