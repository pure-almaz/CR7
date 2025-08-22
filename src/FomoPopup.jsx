
import React, { useEffect, useState, useRef } from 'react';
import './FomoPopup.css';

const packages = ['Standard', 'VIP', 'Gold', 'Platinum', 'Reserve'];
const emails = ["lily...@outlook.com","logan...@gmail.com","matthe...@hotmail.com","stella...@hotmail.com","audrey...@hotmail.com","sarah...@yahoo.com","victor...@hotmail.com","liam...@gmail.com","hannah...@gmail.com","oliver...@hotmail.com","zoe...@gmail.com","willia...@gmail.com","owen...@yahoo.com","isaac...@gmail.com","aria...@gmail.com","christ...@yahoo.com","justin...@gmail.com","aiden...@outlook.com","edward...@gmail.com","robert...@yahoo.com","juliet...@outlook.com","george...@hotmail.com","elijah...@yahoo.com","peter...@gmail.com","ava...@yahoo.com","ryan...@gmail.com","anna...@gmail.com","skylar...@gmail.com","michae...@gmail.com","amelia...@yahoo.com","rachel...@hotmail.com","felix...@hotmail.com","anthon...@outlook.com","jackso...@hotmail.com","caleb...@hotmail.com","mason...@yahoo.com","ruth...@yahoo.com","charle...@yahoo.com","savann...@hotmail.com","benjam...@yahoo.com","james...@yahoo.com","alice...@outlook.com","victor...@yahoo.com","daniel...@yahoo.com","abigai...@outlook.com","olivia...@gmail.com","emma...@gmail.com","penelo...@hotmail.com","nora...@gmail.com","maryan...@yahoo.com","johnso...@yahoo.com","philip...@outlook.com","sophia...@yahoo.com","kather...@gmail.com","david...@yahoo.com","ella...@outlook.com","samuel...@outlook.com","jayden...@hotmail.com","harry...@hotmail.com","nathan...@outlook.com","stephe...@yahoo.com","susan...@yahoo.com","helen...@yahoo.com","patric...@yahoo.com","alexan...@yahoo.com","luna...@gmail.com","grace...@outlook.com","sebast...@hotmail.com","martin...@hotmail.com","tutpeg...@gmail.com","natali...@gmail.com","henry...@gmail.com","ellie...@yahoo.com","elena...@hotmail.com","maya...@yahoo.com","noah...@yahoo.com","beatri...@yahoo.com","jacob...@hotmail.com","scarle...@outlook.com","lawren...@yahoo.com","ethan...@gmail.com","carter...@hotmail.com","lucas...@yahoo.com","isabel...@outlook.com","chloe...@outlook.com","gabrie...@yahoo.com","hazel...@outlook.com","ibrahi...@yahoo.com","layla...@gmail.com","joseph...@yahoo.com","levi...@outlook.com","charlo...@yahoo.com","mia...@yahoo.com","emmanu...@outlook.com","franci...@yahoo.com","paul...@hotmail.com","elizab...@hotmail.com","madiso...@hotmail.com","chloe4...@gmail.com","grace1...@yahoo.com"]


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


export default function FomoPopup({ open, onClose, onGetTicket }) {
  // Single digit between 7 and 15, then multiply by 10 for 70-150
  const [tickets, setTickets] = useState(() => getRandomInt(7, 15) * 10);
  const [fomoMsg, setFomoMsg] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const intervalRef = useRef();

  useEffect(() => {
    if (!open) return;
    let running = true;
    function iterateFomo() {
      if (!running || tickets <= 0) return;
      const email = emails[getRandomInt(0, emails.length - 1)];
      const pkg = packages[getRandomInt(0, packages.length - 1)];
      setFomoMsg(`${email} just bought a ${pkg} ticket`);
      setTickets(t => (t > 0 ? t - 1 : 0));
      const nextDelay = getRandomInt(2000, 3000); // 2-3 seconds
      intervalRef.current = setTimeout(iterateFomo, nextDelay);
    }
    iterateFomo();
    return () => {
      running = false;
      clearTimeout(intervalRef.current);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fomo-popup-overlay">
      <div className="fomo-popup-bg" style={{backgroundImage: 'url(/images/cr7-exclusive.webp)'}}>
        <div className="fomo-popup-overlay-dark" />
        <div className="fomo-popup-content">
          {/* X button at top right */}
          <button className="fomo-x-btn" onClick={() => setShowWarning(true)} aria-label="Close popup">×</button>
          {/* Large GET 10% OFF button */}
          <button className="fomo-get-discount-btn">GET 10% OFF MY HK MUSEUM TICKET</button>
          <div className="fomo-popup-header">
            <span className="fomo-exclusive">Exclusive</span>
            <span className="fomo-title">Ticket sales for Cristiano Ronaldo’s Hong Kong</span>
          </div>
          <div className="fomo-popup-sub">
            <span className="fomo-discount">Get <span className="fomo-discount-highlight">10% Off Now!</span></span>
            <span className="fomo-limited">Ticket selling Out Fast! <span className="fomo-limited-highlight">Limited Edition!</span></span>
          </div>
          <div className="fomo-tickets-row">
            <span className="fomo-tickets-label">Available Tickets:</span>
            <span className="fomo-tickets-count">{tickets}</span>
          </div>
          <div className="fomo-message">
            {fomoMsg}
          </div>
          {/* GET TICKET NOW button */}
          <button className="fomo-get-ticket-btn" onClick={() => onGetTicket && onGetTicket('Klook')}>
            GET TICKET NOW!
          </button>
          {showWarning && (
            <div className="fomo-warning">
              <span>You will lose your 10% discount if you close now!</span>
              <button className="fomo-warning-close" onClick={onClose}>Close Anyway</button>
              <button className="fomo-warning-back" onClick={() => setShowWarning(false)}>Go Back</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
