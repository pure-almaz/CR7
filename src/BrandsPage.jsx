import React, { useState, useRef, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const brandsData = [
  {
    name: 'URSUS',
    slides: [
      {
        img: 'https://placehold.co/1200x700?text=URSUS+1',
        title: 'WATER',
        subtitle: 'URSUS',
        desc: 'URSUS is much more than water... It is an inspiration to drink health and a lifestyle.',
        cta: 'SHOP NOW',
      },
      {
        img: 'https://placehold.co/1200x700?text=URSUS+2',
        title: 'HYDRATION',
        subtitle: 'STAY FRESH',
        desc: 'Stay hydrated and energized for peak performance.',
        cta: 'LEARN MORE',
      },
    ],
  },
  {
    name: 'ERAKULIS',
    slides: [
      {
        img: 'https://placehold.co/1200x700?text=ERAKULIS+1',
        title: 'APP',
        subtitle: 'ERAKULIS',
        desc: 'ERAKULIS is an all-in-one wellness experience for Fitness, Nutrition and Mental Balance, founded by Cristiano Ronaldo.',
        cta: 'VIEW MORE',
      },
      {
        img: 'https://placehold.co/1200x700?text=ERAKULIS+2',
        title: 'FITNESS',
        subtitle: 'ERAKULIS APP',
        desc: 'Behind your customized plan, we have a team of certified experts who will take the time to listen to your story, understand your aspirations, and craft a tailored wellness experience plan that aligns with your goals and lifestyle.',
        cta: 'VIEW MORE',
      },
      {
        img: 'https://placehold.co/1200x700?text=ERAKULIS+3',
        title: 'NUTRITION',
        subtitle: 'ERAKULIS APP',
        desc: 'Discover a world of balanced, delicious, and healthful eating.',
        cta: 'VIEW MORE',
      },
    ],
  },
  {
    name: 'AVACR7',
    slides: [
      {
        img: 'https://placehold.co/1200x700?text=AVACR7+1',
        title: 'AVACR7',
        subtitle: '',
        desc: 'AVACR7 is a premium brand for activewear and accessories.',
        cta: 'SHOP NOW',
      },
    ],
  },
  {
    name: 'FRAGRANCES',
    slides: [
      {
        img: 'https://placehold.co/1200x700?text=FRAGRANCES+1',
        title: 'FRAGRANCES',
        subtitle: '',
        desc: 'Define your own legacy with Cristiano Ronaldo fragrances.',
        cta: 'SHOP NOW',
      },
      {
        img: 'https://placehold.co/1200x700?text=FRAGRANCES+2',
        title: 'LEGACY',
        subtitle: '',
        desc: 'A long-lasting woody aromatic amber scent.',
        cta: 'DISCOVER',
      },
    ],
  },
  {
    name: 'UNDERWEAR',
    slides: [
      {
        img: 'https://placehold.co/1200x700?text=UNDERWEAR+1',
        title: 'UNDERWEAR',
        subtitle: '',
        desc: 'Comfort and style for every day.',
        cta: 'SHOP NOW',
      },
    ],
  },
  {
    name: 'FOOTWEAR',
    slides: [
      {
        img: 'https://placehold.co/1200x700?text=FOOTWEAR+1',
        title: 'FOOTWEAR',
        subtitle: '',
        desc: 'Step up your game with CR7 footwear.',
        cta: 'SHOP NOW',
      },
    ],
  },
];

export default function BrandsPage() {
  const navigate = useNavigate();
  const [brandIdx, setBrandIdx] = useState(0);
  const [slideIdx, setSlideIdx] = useState(0);
  const [animating, setAnimating] = useState(false);
  const mainRef = useRef(null);
  const brandRefs = useRef([]);
  const [highlightPos, setHighlightPos] = useState({ top: 0, height: 0 });
  const currentBrand = brandsData[brandIdx];
  const currentSlide = currentBrand.slides[slideIdx];

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        if (brandIdx < brandsData.length - 1) {
          setAnimating(true);
          setTimeout(() => {
            setBrandIdx((idx) => Math.min(idx + 1, brandsData.length - 1));
            setSlideIdx(0);
            setAnimating(false);
          }, 200);
        }
      } else if (e.key === 'ArrowUp') {
        if (brandIdx > 0) {
          setAnimating(true);
          setTimeout(() => {
            setBrandIdx((idx) => Math.max(idx - 1, 0));
            setSlideIdx(0);
            setAnimating(false);
          }, 200);
        }
      } else if (e.key === 'ArrowRight') {
        if (slideIdx < currentBrand.slides.length - 1) {
          setAnimating(true);
          setTimeout(() => {
            setSlideIdx((idx) => Math.min(idx + 1, currentBrand.slides.length - 1));
            setAnimating(false);
          }, 200);
        }
      } else if (e.key === 'ArrowLeft') {
        if (slideIdx > 0) {
          setAnimating(true);
          setTimeout(() => {
            setSlideIdx((idx) => Math.max(idx - 1, 0));
            setAnimating(false);
          }, 200);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [brandIdx, currentBrand.slides.length, slideIdx]);

  // Touch navigation (swipe)
  // ... (implement as needed)

  // When brand changes, reset slide
  React.useEffect(() => {
    setSlideIdx(0);
  }, [brandIdx]);

  // Calculate highlight position
  useLayoutEffect(() => {
    if (brandRefs.current[brandIdx]) {
      const el = brandRefs.current[brandIdx];
      setHighlightPos({
        top: el.offsetTop - 4, // small extension above
        height: el.offsetHeight + 8, // small extension below
      });
    }
  }, [brandIdx]);

  // Slide indicator width logic
  const slideCount = currentBrand.slides.length;
  const showIndicators = slideCount > 1;
  const indicatorWidth = showIndicators ? '70vw' : 0;
  const indicatorLineWidth = showIndicators ? `calc((100% - ${(slideCount - 1) * 16}px) / ${slideCount})` : 0;

  return (
    <div className="brands-root">
      {/* Header */}
      <nav className="lm-navbar">
        <div className="cr7-logo">CRISTIANO RONALDO</div>
        <button className="lm-close-btn" aria-label="Close" onClick={() => navigate('/')}>×</button>
      </nav>
      {/* Sidebar with vertical line and highlight to the left of text */}
      <aside className="brands-sidebar-abs">
        <div className="brands-vert-line" />
        <div
          className="brands-vert-highlight"
          style={{ top: highlightPos.top, height: highlightPos.height }}
        />
        <div className="brands-list-center-group">
          {brandsData.map((brand, idx) => (
            <div
              className={`brands-list-item${idx === brandIdx ? ' active' : ''}`}
              key={brand.name}
              ref={el => (brandRefs.current[idx] = el)}
              onClick={() => { setBrandIdx(idx); setSlideIdx(0); }}
            >
              <span>{brand.name}</span>
            </div>
          ))}
        </div>
      </aside>
      {/* Main Slide Area */}
      <main className="brands-main-full" ref={mainRef}>
        <div className={`brands-slide-full${animating ? ' animating' : ''}`} style={{ backgroundImage: `url(${currentSlide.img})` }}>
          <div className="brands-slide-content-center">
            <div className={`brands-slide-content${slideIdx === 0 ? ' first' : ''}`}>
              {currentSlide.subtitle && <div className="brands-slide-subtitle">{currentSlide.subtitle}</div>}
              <div className="brands-slide-title">{currentSlide.title}</div>
              <div className="brands-slide-desc">{currentSlide.desc}</div>
              {currentSlide.cta && <a className="brands-slide-cta" href="#">{currentSlide.cta} <span>&rarr;</span></a>}
            </div>
          </div>
          {/* Slide indicators */}
          {showIndicators && (
            <div className="brands-slide-indicators-center-true">
              {currentBrand.slides.map((_, i) => (
                <div
                  key={i}
                  className={`brands-slide-indicator-center${i === slideIdx ? ' active' : ''}`}
                  style={{ width: indicatorLineWidth }}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 