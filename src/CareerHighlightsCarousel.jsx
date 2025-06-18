import React, { useEffect, useRef, useState } from 'react';
import './App.css';

const highlights = [
  {
    club: 'SPORTING CP',
    desktop: 'videos/highlights/CR7_WebsiteHighlights-Sporting_desktop.mp4',
    mobile: 'videos/highlights/CR7_WebsiteHighlights-Sporting_mobile.mp4',
  },
  {
    club: 'MANCHESTER UNITED FC',
    desktop: 'videos/highlights/CR7_WebsiteHighlights-ManUtd_desktop.mp4',
    mobile: 'videos/highlights/CR7_WebsiteHighlights-ManUtd_mobile.mp4',
  },
  {
    club: 'REAL MADRID CF',
    desktop: 'videos/highlights/CR7_WebsiteHighlights-RealMadrid_desktop.mp4',
    mobile: 'videos/highlights/CR7_WebsiteHighlights-RealMadrid_mobile.mp4',
  },
  {
    club: 'JUVENTUS FC',
    desktop: 'videos/highlights/CR7_WebsiteHighlights-Juventus_desktop.mp4',
    mobile: null, // No mobile version provided
  },
  {
    club: 'AL-NASSR FC',
    desktop: 'videos/highlights/CR7_WebsiteHighlights-AlNassr_desktop.mp4',
    mobile: 'videos/highlights/CR7_WebsiteHighlights-AlNassr_mobile.mp4',
  },
];

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return isMobile;
}

export default function CareerHighlightsCarousel() {
  const [current, setCurrent] = useState(0);
  const videoRef = useRef(null);
  const isMobile = useIsMobile();

  // Auto-advance to next video when current ends
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleEnded = () => {
      setCurrent((prev) => (prev + 1) % highlights.length);
    };
    video.addEventListener('ended', handleEnded);
    return () => video.removeEventListener('ended', handleEnded);
  }, [current]);

  // Auto-advance after 8 seconds if video fails to fire 'ended' (e.g. short/looping video)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % highlights.length);
    }, 8000);
    return () => clearTimeout(timeout);
  }, [current]);

  // When switching, restart video
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      video.play();
    }
  }, [current, isMobile]);

  const { club, desktop, mobile } = highlights[current];
  const videoSrc = isMobile && mobile ? mobile : desktop;

  return (
    <div className="cr7-highlights-carousel">
      <div className="cr7-highlights-video-wrapper">
        <div className="cr7-highlights-header cr7-highlights-header-overlay">CAREER HIGHLIGHTS</div>
        <video
          key={videoSrc}
          ref={videoRef}
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          className="cr7-highlights-video"
        />
        <div className="cr7-highlights-club-label">{club}</div>
        <div className="cr7-highlights-indicators">
          {highlights.map((_, idx) => (
            <div
              key={idx}
              className={`cr7-highlights-indicator${idx === current ? ' active' : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 