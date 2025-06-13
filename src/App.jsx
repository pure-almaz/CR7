import React, { useState, useEffect, useRef } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LifeMuseumPage from './LifeMuseumPage'
import BrandsPage from './BrandsPage'

const sections = [
  { id: 'cr7', label: 'CR7' },
  { id: 'career', label: 'CAREER HIGHLIGHTS' },
  { id: 'brands', label: 'BRANDS' },
  { id: 'museum', label: 'LIFE MUSEUM' },
  { id: 'partners', label: 'PARTNERS' },
];

const heroCards = [
  {
    img: 'https://placehold.co/400x600?text=Highlight+1',
    title: 'ERAKULIS APP',
    subtitle: 'ERAKULIS',
    desc: 'ERAKULIS® is an all-in-one wellness experience for Fitness, Nutrition and Mental Balance, founded by Cristiano Ronaldo.',
    link: '#',
  },
  {
    img: 'https://placehold.co/400x600?text=Highlight+2',
    title: 'HYDRATION',
    subtitle: 'WATER',
    desc: 'Stay hydrated and energized for peak performance.',
    link: '#',
  },
  {
    img: 'https://placehold.co/400x600?text=Highlight+3',
    title: 'LEGACY',
    subtitle: 'CR7 FRAGRANCES',
    desc: 'Define your own legacy with Cristiano Ronaldo fragrances.',
    link: '#',
  },
  {
    img: 'https://placehold.co/400x600?text=Highlight+4',
    title: 'ATHLETICISM',
    subtitle: 'TRAINING',
    desc: 'Relentless drive and modern masculinity.',
    link: '#',
  },
  {
    img: 'https://placehold.co/400x600?text=Highlight+5',
    title: 'STYLE',
    subtitle: 'FASHION',
    desc: "Cristiano Ronaldo's unique style and confidence.",
    link: '#',
  },
];

const getHref = (sectionId) => {
  if (sectionId === "brands") return "brands";
  if (sectionId === "museum") return "life-museum-hk";
  return `#${sectionId}`;
};

function AppContent() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('cr7');
  const [expanded, setExpanded] = useState(0); // index of expanded hero card
  const sectionRefs = useRef({});

  // Scroll spy: update hash and active nav as you scroll
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || 'cr7';
      setActiveSection(hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      (entries) => {
        const visibleSections = entries.filter(e => e.isIntersecting && e.intersectionRatio > 0.5);
        if (visibleSections.length > 0) {
          // Pick the first most visible section
          const topSection = visibleSections.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          const id = topSection.target.id;
          setActiveSection(id);
          if (window.location.hash.replace('#', '') !== id) {
            window.history.replaceState(null, '', `#${id}`);
          }
        }
      },
      {
        threshold: [0.5],
      }
    );
    sections.forEach(({ id }) => {
      if (sectionRefs.current[id]) {
        observer.observe(sectionRefs.current[id]);
      }
    });
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (id) => {
    window.location.hash = id;
    setMenuOpen(false);
  };

  return (
    <div className="cr7-root">
      {/* Header & Navigation */}
      <header className="cr7-header">
        <div className="cr7-logo">CRISTIANO RONALDO</div>
        <nav className={`cr7-nav${menuOpen ? ' open' : ''}`}>
          <ul>
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={getHref(section.id)}
                  className={
                    activeSection === section.id ? 'active-strike' : ''
                  }
                  onClick={() => handleNavClick(section.id)}
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <button
          className="cr7-menu-btn"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Open menu"
        >
          <span className="cr7-menu-icon" />
        </button>
      </header>

      {/* Mobile Overlay Menu */}
      {menuOpen && (
        <div className="cr7-mobile-menu">
          <button
            className="cr7-close-btn"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            ×
          </button>
          <ul>
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className={
                    activeSection === section.id ? 'active-strike' : ''
                  }
                  onClick={() => handleNavClick(section.id)}
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="cr7-mobile-social">
            <a href="#" aria-label="Instagram">&#xf16d;</a>
            <a href="#" aria-label="Facebook">&#xf09a;</a>
            <a href="#" aria-label="Twitter">&#xf099;</a>
          </div>
          <a href="#" className="cr7-privacy-link">PRIVACY POLICY</a>
        </div>
      )}

      {/* Main Sections */}
      <main>
        {/* Hero/Highlights Section */}
        <section
          id="cr7"
          className="cr7-section cr7-hero-row"
          ref={el => (sectionRefs.current['cr7'] = el)}
        >
          <div className="cr7-hero-cards">
            {heroCards.map((card, idx) => (
              <div
                key={idx}
                className={`cr7-hero-card${expanded === idx ? ' expanded' : ''}`}
                onMouseEnter={() => setExpanded(idx)}
                onFocus={() => setExpanded(idx)}
                tabIndex={0}
                onMouseLeave={() => setExpanded(0)}
              >
                <img src={card.img} alt={card.title} />
                {expanded === idx && (
                  <div className="cr7-hero-overlay">
                    <div className="cr7-hero-overlay-inner">
                      <div className="cr7-hero-overlay-title">
                        <span className="cr7-bold">{card.title.split(' ')[0]}</span>{' '}{card.title.split(' ').slice(1).join(' ')}
                        <span className="cr7-hero-overlay-app"> {card.subtitle ? <span className="cr7-hero-overlay-app">{card.subtitle}</span> : null}</span>
                      </div>
                      <div className="cr7-hero-overlay-desc">{card.desc}</div>
                      <a href={card.link} className="cr7-hero-overlay-link">VIEW MORE <span>&rarr;</span></a>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <button className="cr7-hero-scroll-indicator" aria-label="Scroll for more cards">
              &#8594;
            </button>
          </div>
        </section>

        {/* Career Highlights Section */}
        <section
          id="career"
          className="cr7-section cr7-career"
          ref={el => (sectionRefs.current['career'] = el)}
        >
          <div className="cr7-career-img">
            <img src="https://placehold.co/400x400?text=Career+Highlight" alt="Career" />
          </div>
          <div className="cr7-career-content">
            <h2>
              <span className="cr7-bold">CAREER</span> HIGHLIGHTS
            </h2>
            <p>Cristiano Ronaldo's highlights and achievements.</p>
            <a href="#" className="cr7-view-link">VIEW HIGHLIGHTS →</a>
          </div>
        </section>

        {/* Brands Section */}
        <section
          id="brands"
          className="cr7-section cr7-brands"
          ref={el => (sectionRefs.current['brands'] = el)}
        >
          <h2>
            I WORK WITH BRANDS I <span className="cr7-bold">BELIEVE IN</span>
          </h2>
          <div className="cr7-brands-grid">
            {Array.from({ length: 15 }).map((_, i) => (
              <div className="cr7-brand-logo" key={i}>
                <img src={`https://placehold.co/180x80?text=Brand+${i + 1}`} alt={`Brand ${i + 1}`} />
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter Section */}
        <section
          id="museum"
          className="cr7-section cr7-newsletter"
          ref={el => (sectionRefs.current['museum'] = el)}
        >
          <h2>STAY TUNED</h2>
          <p>
            Subscribe my newsletter and don't miss any update on new products, promotions or even career events.
          </p>
          <form className="cr7-newsletter-form" onSubmit={e => e.preventDefault()}>
            <label className="cr7-checkbox">
              <input type="checkbox" required /> I read and accept the <a href="#">privacy policy</a>.
            </label>
            <input type="email" placeholder="yourname@email.com" required />
            <button type="submit">SUBSCRIBE TO NEWSLETTER</button>
          </form>
        </section>

        {/* Partners Section (footer area) */}
        <section
          id="partners"
          className="cr7-section cr7-partners"
          ref={el => (sectionRefs.current['partners'] = el)}
        >
          <div className="cr7-partners-grid">
            {Array.from({ length: 10 }).map((_, i) => (
              <div className="cr7-partner-logo" key={i}>
                <img src={`https://placehold.co/160x60?text=Partner+${i + 1}`} alt={`Partner ${i + 1}`} />
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="cr7-footer">
        <a href="#" className="cr7-privacy-link">Privacy Policy</a>
        <span>© Cristiano Ronaldo, All Rights Reserved</span>
        <span className="cr7-powered">POWERED BY 7EGEND</span>
        <div className="cr7-footer-social">
          <a href="#" aria-label="Instagram">&#xf16d;</a>
          <a href="#" aria-label="Facebook">&#xf09a;</a>
          <a href="#" aria-label="Twitter">&#xf099;</a>
        </div>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path="/life-museum-hk" element={<LifeMuseumPage />} />
        <Route path="/brands" element={<BrandsPage />} />
      </Routes>
    </Router>
  );
}
