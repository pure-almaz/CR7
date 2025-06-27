import React, { useState, useEffect, useRef } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LifeMuseumPage from './LifeMuseumPage'
import BrandsPage from './BrandsPage'
import CareerHighlightsCarousel from './CareerHighlightsCarousel'

const sections = [
  { id: 'cr7', label: 'CR7' },
  { id: 'career-highlights', label: 'CAREER HIGHLIGHTS' },
  // { id: 'brands', label: 'BRANDS' },
  { id: 'museum', label: 'LIFE MUSEUM' },
  { id: 'partners', label: 'PARTNERS' },
];

const heroCards = [
  {
    video: 'videos/highlights/CR7_WebsiteHighlights-Carrousel-2023-Vertical.mp4',
    title: 'CAREER',
    subtitle: 'HIGHLIGHTS',
    desc: "Cristiano Ronaldo's highlights and achievements.",
    action: "VIEW HIGHLIGHTS",
    link: '#career-highlights',
  },
  {
    img: 'images/highlights/brand_ursu.jpg',
    title: 'URSU',
    subtitle: 'WATER',
    desc: 'URSU is much more than water... It is an inspiration to drink health and a lifestyle.',
    action: "VIEW MORE",
    link: 'https://ursu9.es/#origin',
  },
  {
    img: 'images/highlights/brand_erakulis.jpg',
    title: 'ERAKULIS',
    subtitle: 'APP',
    desc: 'ERAKULIS® is an all-in-one wellness experience for Fitness, Nutrition and Mental Balance, founded by Cristiano Ronaldo.',
    action: "VIEW MORE",
    link: 'https://erakulis.com',
  },
  {
    img: 'images/highlights/brand_fragrances.jpg',
    title: 'CR7',
    subtitle: 'FRAGRANCES',
    desc: "Define your own legacy with the NEW fragrances, Cristiano Ronaldo Legacy. A long-lasting woody aromatic amber scent, inspired by Ronaldo's relentless drive and modern masculinity, this fragrance is a testament to greatness.",
    action: "SHOP NOW",
    link: 'https://cr7fragrances.store/',
  },
  {
    img: 'images/highlights/brand_underwear.jpg',
    title: 'CR7',
    subtitle: 'UNDERWEAR',
    desc: 'Working with quality materials and many years of experience producing underwear, the CR7 collection delivers a perfect unique fit.'
  },
  {
    img: 'images/highlights/brand_footwear.jpg',
    title: 'CR7',
    subtitle: 'FOOTWEAR',
    desc: "A new footwear line that further enriches the whole collection and interprets the style of the most demanding and eccentric man.",
  },
];

const getHref = (sectionId) => {
  if (sectionId === "brands") return "brands";
  if (sectionId === "museum") return "life-museum-hk";
  return `#${sectionId}`;
};

function ErakulisFullScreenVideo() {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef(null);

  const handlePlay = () => {
    setPlaying(true);
    videoRef.current?.play();
  };

  const handlePause = () => {
    setPlaying(false);
    videoRef.current?.pause();
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onPause = () => setPlaying(false);
    const onPlay = () => setPlaying(true);
    video.addEventListener('pause', onPause);
    video.addEventListener('play', onPlay);
    return () => {
      video.removeEventListener('pause', onPause);
      video.removeEventListener('play', onPlay);
    };
  }, []);

  return (
    <section className="erakulis-fullscreen-video-section">
      <video
        ref={videoRef}
        className="erakulis-fullscreen-video"
        src="/videos/highlights/Erakulis_video_5Bitrate.mp4"
        poster="/images/highlights/Erakulis_thumbnail.png"
        playsInline
        controls={false}
        muted
        tabIndex={-1}
        style={{ pointerEvents: playing ? 'auto' : 'none' }}
        onClick={handlePause}
      />
      {!playing && (
        <button className="erakulis-play-btn" onClick={handlePlay} aria-label="Play video">
          <span className="erakulis-pulse-circle" />
          <span className="erakulis-play-icon">▶</span>
        </button>
      )}
    </section>
  );
}

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

  //The landing page code

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
                onMouseEnter={() => expanded !== idx && setExpanded(idx)}
                onFocus={() => setExpanded(idx)}
                tabIndex={0}
                onMouseLeave={() => expanded === idx && setExpanded(0)}
              >
                {card.img ? <img src={card.img} alt={card.title} /> :
                <video
                  src={card.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                />
                }
                {expanded === idx && (
                  <div className="cr7-hero-overlay" style={{ pointerEvents: expanded === idx ? 'auto' : 'none' }}>
                    <div className="cr7-hero-overlay-inner">
                      <div className="cr7-hero-overlay-title">
                        <span className="cr7-bold">{card.title.split(' ')[0]}</span>{' '}{card.title.split(' ').slice(1).join(' ')}
                        <span className="cr7-hero-overlay-app"> {card.subtitle ? <span className="cr7-hero-overlay-app">{card.subtitle}</span> : null}</span>
                      </div>
                      <div className="cr7-hero-overlay-desc">{card.desc}</div>
                      {card.action && <a href={card.link} className="cr7-hero-overlay-link">{card.action}<span>&rarr;</span></a>}
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
          id="career-highlights"
          className="cr7-section cr7-career-highlights-carousel"
          ref={el => (sectionRefs.current['career-highlights'] = el)}
        >
          <CareerHighlightsCarousel />
        </section>

        {/* Erakulis Fullscreen Video Section */}
        <ErakulisFullScreenVideo />

        {/* Newsletter Section */}
        <section
          className="cr7-section cr7-newsletter"
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
          <div className="cr7-partners-header">
            I WORK WITH BRANDS I <span className="cr7-partners-header-highlight">BELIEVE</span> IN
          </div>
          <div className="cr7-partners-container">
            <div className="cr7-partners-grid">
              {[
                'Logo_PestanaCR7.svg',
                'Logo_7egend.svg',
                'Logo_Insparya.png',
                'Logo_Nike.svg',
                'Logo_Zujugp.svg',
                'Logo_Herbalife.svg',
                'Logo_Clear.svg',
                'Logo_Binance.svg',
                'Logo_CR7CrunchFitness.svg',
                'Logo_UFL.svg',
                'Logo_DomumSeptem.svg',
                'Logo_JacobCo.svg',
                'Logo_Ursu.svg',
                'Logo_Erakulis.svg',
                'Logo_Whoop.svg',
                'Logo_AVA.svg',
                'Logo_SNK.svg',
              ].map((filename) => (
                <div className="cr7-partner-logo" key={filename}>
                  <div className="cr7-partner-logo-overlay" />
                  <img src={`/images/partners/${filename}`} alt={filename.replace(/Logo_|\.(svg|png)$/gi, '').replace(/([A-Z])/g, ' $1').trim()} />
                </div>
              ))}
            </div>
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
        
      </Routes>
    </Router>
  );
}

//<Route path="/brands" element={<BrandsPage />} />