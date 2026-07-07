"use client";

import { useLayoutEffect, useRef, useState, ReactNode } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';
import useSound from 'use-sound';
import './CardNav.css';

interface CardNavProps {
  logo?: ReactNode;
  logoAlt?: string;
  items: Array<{
    label: string;
    description?: string;
    bgColor: string;
    textColor: string;
    path?: string;
  }>;
  homeLabel?: string;
  className?: string;
  ease?: string;
  baseColor?: string;
  menuColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  defaultOpen?: boolean;
  onItemClick?: (index: number) => void;
  isMobile: boolean;
  mobileActionComponent?: ReactNode; 
}

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
  defaultOpen = false,
  onItemClick,
  isMobile,
  mobileActionComponent = null
}: CardNavProps) => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(defaultOpen);
  const [isExpanded, setIsExpanded] = useState(defaultOpen);
  const navRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  
  const [playMenuOpen] = useSound('/sounds/menu_Open3.mp3', { volume: 0.45 });
  const [playHomeClick] = useSound('/sounds/home_Click.mp3', { volume: 0.25 });
  const [playMenuHover] = useSound('/sounds/menu_Hover2.mp3', { volume: 0.35 });
  const [playMenuClose] = useSound('/sounds/menu_Click2.mp3', { volume: 0.75 });

  const isExpandedRef = useRef(isExpanded);
  useLayoutEffect(() => {
    isExpandedRef.current = isExpanded;
  }, [isExpanded]);

  const calculateHeight = () => {
    const navEl = navRef.current;
    if (!navEl) return 260;
    if (isMobile) return window.innerHeight * 0.90;
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
      tl.progress(1);
      playMenuOpen();
    }

    return () => {
      tl?.kill();
      tlRef.current = null;
    };
  }, [defaultOpen, isMobile]); 

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
        if (newTl) tlRef.current = newTl;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;

    if (!isExpandedRef.current) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      tl.timeScale(1.0);
      tl.play(); 
      playMenuOpen();
    } else {
      playMenuClose();
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

  const setCardRef = (i: number) => (el: HTMLAnchorElement | null) => {
    if (el) cardsRef.current[i] = el;
  };

  return (
    <div className={`card-nav-container ${className} ${isMobile ? 'w-full' : ''}`}>
      <nav ref={navRef} className={`card-nav ${isHamburgerOpen ? 'open' : ''}`} style={{ backgroundColor: baseColor }}>
        
        <div className={`card-nav-top relative flex flex-row items-center justify-between ${isMobile ? 'w-full' : ''}`}>
          
          {/* Hamburger */}
          <div className="z-10 flex-shrink-0">
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
          </div>

          {/* Logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none whitespace-nowrap">
            <div className="logo-container text-center pointer-events-auto">
              <span className="logo-text">{logoAlt}</span>
            </div>
          </div>

          {/* Action Slot */}
          <div className="z-10 flex-shrink-0">
            {isMobile ? (
              <div className="mobile-action-container pr-2">
                {mobileActionComponent}
              </div>
            ) : (
              <Link
                href="/"
                className="card-nav-cta-button"
                style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
                onClick={() => playHomeClick()}
              >
                {homeLabel}
              </Link>
            )}
          </div>
          
        </div>

        <div className="card-nav-content" aria-hidden={!isExpanded}>
          {(items || []).slice(0, 4).map((item, idx) => (
            <Link
              key={`${item.label}-${idx}`}
              href='#'
              className="nav-card clickable-card"
              ref={setCardRef(idx)}
              onMouseEnter={() => playMenuHover()}
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