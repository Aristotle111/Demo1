"use client";

import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { GoArrowUpRight } from 'react-icons/go';
import Link from 'next/link';
import './CardNav.css';

const CardNav = ({
  logo,
  logoAlt = 'Logo',
  items,
  homeLabel = 'Home',
  className = '',
  ease = 'power3.out',
  baseColor = '#ffffff',
  menuColor,
  buttonBgColor,
  buttonTextColor,
  defaultOpen,
  onItemClick
}) => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(defaultOpen);
  const [isExpanded, setIsExpanded] = useState(defaultOpen);
  const navRef = useRef(null);
  const cardsRef = useRef([]);
  const tlRef = useRef(null);

  const isExpandedRef = useRef(isExpanded);
  useLayoutEffect(() => {
    isExpandedRef.current = isExpanded;
  }, [isExpanded]);

  const calculateHeight = () => {
    const navEl = navRef.current;
    if (!navEl) return 260;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
      const contentEl = navEl.querySelector('.card-nav-content');
      if (contentEl) {
        const wasVisible = contentEl.style.visibility;
        const wasPointerEvents = contentEl.style.pointerEvents;
        const wasPosition = contentEl.style.position;
        const wasHeight = contentEl.style.height;

        contentEl.style.visibility = 'visible';
        contentEl.style.pointerEvents = 'auto';
        contentEl.style.position = 'static';
        contentEl.style.height = 'auto';

        contentEl.offsetHeight;

        const topBar = 60;
        const padding = 16;
        const contentHeight = contentEl.scrollHeight;

        contentEl.style.visibility = wasVisible;
        contentEl.style.pointerEvents = wasPointerEvents;
        contentEl.style.position = wasPosition;
        contentEl.style.height = wasHeight;

        return topBar + contentHeight + padding;
      }
    }
    return 260;
  };

  const createTimeline = () => {
    const navEl = navRef.current;
    if (!navEl) return null;

    gsap.set(navEl, { height: 60, overflow: 'hidden' });
    gsap.set(cardsRef.current, { y: 50, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    tl.to(navEl, {
      height: calculateHeight,
      duration: 0.4,
      ease
    });

    tl.to(cardsRef.current, { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 }, '-=0.1');

    tl.eventCallback("onReverseComplete", () => {
      setIsExpanded(false);
    });

    return tl;
  };

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;

    if (defaultOpen && tl) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      tl.play();
    }

    return () => {
      tl?.kill();
      tlRef.current = null;
    };
  }, [ease, defaultOpen]);

  const lastWidthRef = useRef(typeof window !== 'undefined' ? window.innerWidth : 0);
  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return;
      
      const currentWidth = window.innerWidth;
      if (currentWidth === lastWidthRef.current) return;
      lastWidthRef.current = currentWidth;

      if (isExpandedRef.current) {
        const newHeight = calculateHeight();
        gsap.set(navRef.current, { height: newHeight });

        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          newTl.progress(1);
          tlRef.current = newTl;
        }
      } else {
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          tlRef.current = newTl;
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;

    if (!isExpandedRef.current) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      tl.timeScale(1.0);
      tl.play(); 
    } else {
      closeMenu();
    }
  };

  const closeMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;
    
    setIsHamburgerOpen(false);
    setIsExpanded(false);

    tl.timeScale(2.4); 
    tl.reverse();
  };

  const setCardRef = i => el => {
    if (el) cardsRef.current[i] = el;
  };

  return (
    <div className={`card-nav-container ${className}`}>
      <nav ref={navRef} className={`card-nav ${isHamburgerOpen ? 'open' : ''}`} style={{ backgroundColor: baseColor }}>
        <div className="card-nav-top">
          <div
            className={`hamburger-menu ${isHamburgerOpen ? 'open' : ''}`}
            onClick={toggleMenu}
            role="button"
            aria-label={isExpanded ? 'Close menu' : 'Open menu'}
            tabIndex={0}
            style={{ color: menuColor || '#000' }}
          >
            <div className="hamburger-line" />
            <div className="hamburger-line" />
          </div>

          <div className="logo-container">
            <span className="logo-text">{logoAlt}</span>
          </div>

          <Link
            href="/"
            className="card-nav-cta-button"
            style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
          >
            {homeLabel}
          </Link>
        </div>

        <div className="card-nav-content" aria-hidden={!isExpanded}>
          {(items || []).slice(0, 4).map((item, idx) => (
            <Link
              key={`${item.label}-${idx}`}
              href='#'
              className="nav-card clickable-card"
              ref={setCardRef(idx)}
              style={{ backgroundColor: item.bgColor, color: item.textColor }}
              onClick={(e) => {
                e.preventDefault(); 
                e.stopPropagation();
                
                if (typeof onItemClick === "function") {
                  onItemClick(idx);
                }
                
                closeMenu(); 
              }}
            >
              <div className="nav-card-header">
                <div className="nav-card-text-group">
                  <span className="nav-card-label">{item.label}</span>
                  {item.description && (
                    <p className="nav-card-description">{item.description}</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default CardNav;