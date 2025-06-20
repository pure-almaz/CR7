import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const ticketLinks = [
  { label: 'GET TICKET WITH KLOOK', href: '#' },
  { label: 'GET TICKET WITH TRIP.COM', href: '#' },
  { label: 'GET TICKET WITH K11', href: '#' },
];

const visitOptions = [
  { logo: '/images/museum-partners/Logo_Klook.png', btn: 'GET TICKET' },
  { logo: '/images/museum-partners/Logo_Trip.png', btn: 'GET TICKET' },
  { logo: '/images/museum-partners/Logo_K11.png', btn: 'GET TICKET' },
];

const whatsInside = [
  {
    img: 'https://placehold.co/260x320?text=Trophies',
    title: 'TROPHIES',
    desc: 'See the highlighted trophies that I won by club and in individual.',
  },
  {
    img: 'https://placehold.co/260x320?text=Timeline',
    title: 'LIFE & CAREER TIMELINE',
    desc: 'Walk through my journey and discover more about my story and career.',
  },
  {
    img: 'https://placehold.co/260x320?text=Interactive',
    title: 'INTERACTIVE EXPERIENCES',
    desc: 'You control the experience and the information.',
  },
  {
    img: 'https://placehold.co/260x320?text=Immersive',
    title: 'IMMERSIVE JOURNEY',
    desc: 'Step into the places and the experiences that marked my career and life.',
  },
  {
    img: 'https://placehold.co/260x320?text=UR7+Studio',
    title: 'UR7 YOUTUBE STUDIO',
    desc: 'Take a photo at my UR7 youtube studio.',
  },
];

const partners = [
  { logo: 'https://placehold.co/80x40?text=Klook', label: 'klook' },
  { logo: 'https://placehold.co/120x40?text=Trip.com', label: 'Trip.com Group' },
  { logo: 'https://placehold.co/60x40?text=K11', label: 'K11' },
];

export default function LifeMuseumPage() {
  const navigate = useNavigate();
  const insideCardsRef = useRef(null);
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
            src="https://www.w3schools.com/html/mov_bbb.mp4"
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
                <a className="lm-hero-btn" href={btn.href} key={i}>{btn.label}</a>
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
                <a className="lm-book-btn" href="#">{opt.btn}</a>
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
    </div>
  );
} 