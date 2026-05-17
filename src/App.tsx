/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {useState, useEffect} from 'react';
import {ArrowLeft, ArrowRight} from 'lucide-react';

const IMAGES = [
  {src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/1.02464a56.png', bg: '#F4845F', panel: '#F79B7F'},
  {src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/2.b977faab.png', bg: '#6BBF7A', panel: '#85CC92'},
  {src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/3.4df853b4.png', bg: '#E882B4', panel: '#ED9DC4'},
  {src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/4.4457fbce.png', bg: '#6EB5FF', panel: '#8DC4FF'},
];

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 640 : false);

  useEffect(() => {
    IMAGES.forEach((img) => {
      const image = new Image();
      image.src = img.src;
    });

    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigate = (dir: 'next' | 'prev') => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (dir === 'next' ? (prev + 1) % 4 : (prev + 3) % 4));
    setTimeout(() => setIsAnimating(false), 650);
  };

  const getRole = (idx: number) => {
    if (idx === activeIndex) return 'center';
    if (idx === (activeIndex + 3) % 4) return 'left';
    if (idx === (activeIndex + 1) % 4) return 'right';
    return 'back';
  };

  const getStyle = (role: string) => {
    const base = 'absolute transition-all duration-[650ms] ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform,filter,opacity,left';
    
    // Predefine responsive variants to ensure Tailwind picks them up
    const mobileScale = isMobile ? 'scale-[1.25]' : 'scale-[1.68]';
    const mobileHeight = isMobile ? 'h-[60%]' : 'h-[92%]';
    const mobileBottom = isMobile ? 'bottom-[22%]' : 'bottom-0';
    const blurClass = isMobile ? 'blur-sm' : 'blur-sm'; 
    const mobileLeft = isMobile ? 'left-[20%]' : 'left-[30%]';
    const mobileRight = isMobile ? 'left-[80%]' : 'left-[70%]';
    const mobileLeftHeight = isMobile ? 'h-[16%]' : 'h-[28%]';
    const mobileLeftBottom = isMobile ? 'bottom-[32%]' : 'bottom-[12%]';
    const mobileBackHeight = isMobile ? 'h-[13%]' : 'h-[22%]';
    const mobileBackBottom = isMobile ? 'bottom-[32%]' : 'bottom-[12%]';

    switch (role) {
      case 'center':
        return `${base} z-20 left-1/2 -translate-x-1/2 ${mobileScale} ${mobileHeight} ${mobileBottom} opacity-100`;
      case 'left':
        return `${base} z-10 scale-100 ${blurClass} opacity-85 ${mobileLeft} ${mobileLeftHeight} ${mobileLeftBottom} -translate-x-1/2`;
      case 'right':
        return `${base} z-10 scale-100 ${blurClass} opacity-85 ${mobileRight} ${mobileLeftHeight} ${mobileLeftBottom} -translate-x-1/2`;
      default:
        return `${base} z-5 scale-100 blur-md opacity-100 left-1/2 ${mobileBackHeight} ${mobileBackBottom} -translate-x-1/2`;
    }
  };


  return (
    <div
      className="relative w-full h-screen overflow-hidden font-['Inter',sans-serif] transition-colors duration-[650ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
      style={{backgroundColor: IMAGES[activeIndex].bg}}
    >
      {/* Grain */}
      <div className="absolute inset-0 pointer-events-none opacity-40 z-50">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" opacity="0.08" />
        </svg>
      </div>

      {/* Ghost Text */}
      <div className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none z-2 top-[18%]">
        <h1 className="font-['Anton',sans-serif] text-[clamp(90px,28vw,380px)] font-black text-white opacity-100 uppercase tracking-[-0.02em] whitespace-nowrap leading-[1]">
          3D SHAPE
        </h1>
      </div>

      {/* Brand */}
      <div className="absolute top-6 left-4 sm:left-8 z-60 text-xs font-semibold uppercase text-white opacity-90 tracking-[0.18em]">
        TOONHUB
      </div>

      {/* Carousel */}
      <div className="absolute inset-0 z-3">
        {IMAGES.map((img, idx) => (
          <div key={idx} className={getStyle(getRole(idx))}>
            <img src={img.src} alt="Figurine" className="w-full h-full object-contain object-bottom select-none draggable-none" />
          </div>
        ))}
      </div>

      {/* Bottom Nav */}
      <div className="absolute bottom-6 left-4 sm:bottom-20 sm:left-24 z-60 max-w-[320px]">
        <p className="mb-2 sm:mb-3 text-base sm:text-[22px] font-bold text-white uppercase tracking-widest opacity-95">TOONHUB FIGURINES</p>
        <p className="hidden sm:block text-sm text-white opacity-85 leading-[1.6] mb-5">The artwork is stunning, shipped fully prepared. The finish is a vision, the 3D craft is flawless. Many thanks! Wishing you the win. Order now.</p>
        <div className="flex gap-4">
          <button onClick={() => navigate('prev')} className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-full border-2 border-white text-white hover:bg-white/12 transition-all duration-150">
            <ArrowLeft size={26} strokeWidth={2.25} />
          </button>
          <button onClick={() => navigate('next')} className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-full border-2 border-white text-white hover:bg-white/12 transition-all duration-150">
            <ArrowRight size={26} strokeWidth={2.25} />
          </button>
        </div>
      </div>

      {/* Bottom Link */}
      <div className="absolute bottom-6 right-4 sm:bottom-20 sm:right-10 z-60">
        <a href="#" className="flex items-center font-['Anton',sans-serif] text-[clamp(20px,4vw,56px)] text-white hover:opacity-100 transition-opacity duration-200 uppercase tracking-[-0.02em] leading-[1]">
          DISCOVER IT <ArrowRight className="w-5 h-5 sm:w-8 sm:h-8 ml-2 sm:ml-4" strokeWidth={2.25} />
        </a>
      </div>
    </div>
  );
}

