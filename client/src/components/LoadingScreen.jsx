import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ───────────── Groom Hand SVG (left side, reaching right-down) ───────────── */
const GroomHand = () => (
  <svg viewBox="0 0 400 500" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    {/* Shirt Sleeve / Cuff */}
    <defs>
      <linearGradient id="sleeveGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#f5f0e8" />
        <stop offset="50%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#f0ebe3" />
      </linearGradient>
      <linearGradient id="skinGroom" x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0%" stopColor="#d4a574" />
        <stop offset="50%" stopColor="#c8956a" />
        <stop offset="100%" stopColor="#bb8660" />
      </linearGradient>
      <linearGradient id="skinGroomDark" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#b87d58" />
        <stop offset="100%" stopColor="#a8704e" />
      </linearGradient>
      <linearGradient id="cuffGold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#d4af37" />
        <stop offset="50%" stopColor="#f0d060" />
        <stop offset="100%" stopColor="#c5a028" />
      </linearGradient>
    </defs>

    {/* Sleeve */}
    <path d="M 0,80 L 0,280 Q 20,290 60,295 L 120,300 Q 140,298 155,290 L 155,70 Q 130,60 100,55 L 40,60 Q 15,65 0,80 Z" fill="url(#sleeveGrad)" />
    {/* Sleeve shadow fold */}
    <path d="M 30,90 Q 50,150 40,220 Q 35,260 55,290" fill="none" stroke="#e0d8cc" strokeWidth="2" opacity="0.5" />
    <path d="M 90,75 Q 100,140 95,200 Q 92,250 110,290" fill="none" stroke="#e0d8cc" strokeWidth="1.5" opacity="0.4" />

    {/* Cuff gold trim */}
    <path d="M 120,295 Q 140,293 155,286 L 157,278 Q 142,285 122,288 Z" fill="url(#cuffGold)" />
    <path d="M 118,300 Q 138,298 153,292 L 155,286 Q 140,292 120,295 Z" fill="url(#cuffGold)" opacity="0.7" />

    {/* Wrist */}
    <path d="M 120,295 Q 155,288 158,285 L 190,310 Q 200,335 195,360 L 170,355 Q 140,340 120,310 Z" fill="url(#skinGroom)" />

    {/* Palm - main hand shape reaching down */}
    <path d="M 170,355 Q 200,340 230,350 Q 270,365 290,395 Q 300,415 295,440 Q 288,460 270,470 L 230,475 Q 200,472 180,455 Q 160,435 155,410 Q 150,385 170,355 Z" fill="url(#skinGroom)" />
    
    {/* Palm center shadow */}
    <path d="M 200,370 Q 230,378 255,400 Q 268,415 265,438 Q 258,455 240,462" fill="url(#skinGroomDark)" opacity="0.3" />

    {/* Thumb */}
    <path d="M 155,395 Q 140,380 130,365 Q 125,355 130,345 Q 138,335 148,340 Q 158,348 162,365 Q 165,380 158,400 Z" fill="url(#skinGroom)" />
    <path d="M 140,365 Q 142,355 145,350" fill="none" stroke="url(#skinGroomDark)" strokeWidth="1" opacity="0.4" />

    {/* Index finger - slightly curved, reaching down */}
    <path d="M 270,470 Q 285,480 300,500 Q 310,515 308,530 Q 304,540 295,538 Q 288,532 280,515 Q 272,498 265,478 Z" fill="url(#skinGroom)" />
    
    {/* Middle finger */}
    <path d="M 250,474 Q 268,488 280,510 Q 288,528 285,545 Q 280,555 272,552 Q 264,545 258,528 Q 250,508 245,485 Z" fill="url(#skinGroom)" />
    
    {/* Ring finger */}
    <path d="M 230,475 Q 248,490 258,512 Q 264,530 260,545 Q 255,552 248,548 Q 242,540 237,522 Q 230,505 228,485 Z" fill="url(#skinGroom)" />
    {/* Wedding ring */}
    <ellipse cx="245" cy="508" rx="10" ry="6" fill="none" stroke="url(#cuffGold)" strokeWidth="3" transform="rotate(15, 245, 508)" />

    {/* Little finger */}
    <path d="M 210,472 Q 225,485 232,502 Q 236,515 232,525 Q 228,530 222,527 Q 218,520 214,508 Q 210,495 208,480 Z" fill="url(#skinGroom)" />

    {/* Knuckle creases */}
    <path d="M 268,472 Q 252,476 235,476" fill="none" stroke="url(#skinGroomDark)" strokeWidth="1" opacity="0.35" />
    <path d="M 260,480 Q 245,484 230,483" fill="none" stroke="url(#skinGroomDark)" strokeWidth="0.8" opacity="0.25" />
  </svg>
);

/* ───────────── Bride Hand SVG (right side, reaching left-up) ───────────── */
const BrideHand = () => (
  <svg viewBox="0 0 400 500" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="skinBride" x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0%" stopColor="#d4a574" />
        <stop offset="50%" stopColor="#c8956a" />
        <stop offset="100%" stopColor="#bb8660" />
      </linearGradient>
      <linearGradient id="skinBrideDark" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#b87d58" />
        <stop offset="100%" stopColor="#a07050" />
      </linearGradient>
      <linearGradient id="mehndi" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#8B2500" />
        <stop offset="100%" stopColor="#6B1C00" />
      </linearGradient>
      <linearGradient id="redFabric" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#b91c1c" />
        <stop offset="50%" stopColor="#dc2626" />
        <stop offset="100%" stopColor="#991b1b" />
      </linearGradient>
      <linearGradient id="bangle1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#d4af37" />
        <stop offset="50%" stopColor="#f5d060" />
        <stop offset="100%" stopColor="#c5a028" />
      </linearGradient>
      <linearGradient id="bangle2" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#dc2626" />
        <stop offset="50%" stopColor="#ef4444" />
        <stop offset="100%" stopColor="#b91c1c" />
      </linearGradient>
    </defs>

    {/* Red Saree / Sleeve */}
    <path d="M 400,200 L 400,420 Q 380,430 340,435 L 280,440 Q 255,438 245,428 L 245,190 Q 265,180 300,175 L 360,180 Q 385,185 400,200 Z" fill="url(#redFabric)" />
    {/* Gold embroidery on saree */}
    <path d="M 370,210 Q 355,280 360,360 Q 362,400 345,430" fill="none" stroke="#d4af37" strokeWidth="1.5" opacity="0.5" />
    <path d="M 350,215 Q 340,270 342,340 Q 344,390 330,428" fill="none" stroke="#d4af37" strokeWidth="1" opacity="0.3" />
    {/* Gold border on sleeve */}
    <path d="M 280,435 Q 255,433 247,425 L 244,418 Q 256,426 278,430 Z" fill="url(#bangle1)" />

    {/* Bangles / Chooda */}
    <ellipse cx="262" cy="400" rx="22" ry="14" fill="none" stroke="url(#bangle1)" strokeWidth="5" transform="rotate(-5,262,400)" />
    <ellipse cx="258" cy="385" rx="20" ry="13" fill="none" stroke="url(#bangle2)" strokeWidth="4" transform="rotate(-5,258,385)" />
    <ellipse cx="255" cy="372" rx="19" ry="12" fill="none" stroke="url(#bangle1)" strokeWidth="4" transform="rotate(-5,255,372)" />
    <ellipse cx="252" cy="360" rx="18" ry="11" fill="none" stroke="url(#bangle2)" strokeWidth="3.5" transform="rotate(-5,252,360)" />
    <ellipse cx="250" cy="350" rx="17" ry="10" fill="none" stroke="#22c55e" strokeWidth="3" transform="rotate(-5,250,350)" opacity="0.8" />
    <ellipse cx="248" cy="340" rx="16" ry="10" fill="none" stroke="url(#bangle1)" strokeWidth="3" transform="rotate(-5,248,340)" />

    {/* Wrist */}
    <path d="M 280,435 Q 250,430 245,425 L 218,400 Q 205,375 208,350 L 232,345 Q 258,345 278,365 Z" fill="url(#skinBride)" />

    {/* Palm - reaching upward */}
    <path d="M 232,345 Q 205,350 180,338 Q 148,320 128,290 Q 118,268 122,245 Q 128,225 145,218 L 185,215 Q 210,220 228,238 Q 248,258 252,285 Q 256,310 232,345 Z" fill="url(#skinBride)" />

    {/* Palm shadow */}
    <path d="M 208,330 Q 178,318 158,295 Q 145,275 148,252 Q 152,238 168,230" fill="url(#skinBrideDark)" opacity="0.25" />

    {/* Mehndi designs on palm */}
    <circle cx="190" cy="275" r="18" fill="none" stroke="url(#mehndi)" strokeWidth="1.5" opacity="0.6" />
    <circle cx="190" cy="275" r="10" fill="none" stroke="url(#mehndi)" strokeWidth="1" opacity="0.5" />
    <circle cx="190" cy="275" r="4" fill="url(#mehndi)" opacity="0.4" />
    {/* Mehndi petals */}
    <path d="M 190,257 Q 195,250 190,243" fill="none" stroke="url(#mehndi)" strokeWidth="1" opacity="0.4" />
    <path d="M 208,275 Q 215,280 222,275" fill="none" stroke="url(#mehndi)" strokeWidth="1" opacity="0.4" />
    <path d="M 190,293 Q 185,300 190,307" fill="none" stroke="url(#mehndi)" strokeWidth="1" opacity="0.4" />
    <path d="M 172,275 Q 165,270 158,275" fill="none" stroke="url(#mehndi)" strokeWidth="1" opacity="0.4" />
    {/* Mehndi vine from wrist */}
    <path d="M 240,370 Q 225,355 215,340 Q 210,330 208,318" fill="none" stroke="url(#mehndi)" strokeWidth="1.2" opacity="0.45" />
    <path d="M 215,340 Q 220,335 225,340" fill="none" stroke="url(#mehndi)" strokeWidth="1" opacity="0.35" />
    <path d="M 210,325 Q 205,320 210,315" fill="none" stroke="url(#mehndi)" strokeWidth="1" opacity="0.35" />

    {/* Thumb */}
    <path d="M 250,295 Q 265,308 272,325 Q 278,340 272,350 Q 265,358 255,352 Q 248,342 244,325 Q 240,308 245,290 Z" fill="url(#skinBride)" />
    {/* Mehndi on thumb */}
    <path d="M 260,320 Q 262,325 260,330" fill="none" stroke="url(#mehndi)" strokeWidth="1" opacity="0.4" />

    {/* Index finger - reaching up */}
    <path d="M 145,218 Q 130,205 118,185 Q 108,168 110,152 Q 114,142 122,145 Q 130,150 136,168 Q 144,188 148,208 Z" fill="url(#skinBride)" />
    {/* Mehndi on index finger */}
    <path d="M 128,175 Q 130,170 132,175" fill="none" stroke="url(#mehndi)" strokeWidth="1.5" opacity="0.5" />
    <path d="M 126,185 Q 128,180 130,185" fill="none" stroke="url(#mehndi)" strokeWidth="1" opacity="0.4" />

    {/* Middle finger */}
    <path d="M 160,215 Q 143,200 133,178 Q 126,160 128,142 Q 133,132 140,136 Q 148,142 152,160 Q 160,180 162,200 Z" fill="url(#skinBride)" />
    {/* Mehndi dots */}
    <circle cx="142" cy="165" r="2" fill="url(#mehndi)" opacity="0.4" />
    <circle cx="145" cy="175" r="1.5" fill="url(#mehndi)" opacity="0.35" />

    {/* Ring finger */}
    <path d="M 178,216 Q 162,202 155,182 Q 150,165 153,150 Q 158,142 164,146 Q 170,153 172,170 Q 178,190 180,208 Z" fill="url(#skinBride)" />
    {/* Ring */}
    <ellipse cx="163" cy="172" rx="8" ry="5" fill="none" stroke="url(#bangle1)" strokeWidth="2.5" transform="rotate(-20, 163, 172)" />

    {/* Little finger */}
    <path d="M 195,220 Q 182,208 176,192 Q 172,178 175,168 Q 180,162 185,166 Q 190,172 192,185 Q 195,200 197,215 Z" fill="url(#skinBride)" />

    {/* Nail polish on fingertips */}
    <ellipse cx="115" cy="150" rx="5" ry="4" fill="#dc2626" opacity="0.7" transform="rotate(-20, 115, 150)" />
    <ellipse cx="132" cy="138" rx="5" ry="4" fill="#dc2626" opacity="0.7" transform="rotate(-15, 132, 138)" />
    <ellipse cx="155" cy="148" rx="5" ry="4" fill="#dc2626" opacity="0.7" transform="rotate(-10, 155, 148)" />
    <ellipse cx="177" cy="165" rx="4" ry="3.5" fill="#dc2626" opacity="0.7" transform="rotate(-5, 177, 165)" />

    {/* Knuckle creases */}
    <path d="M 148,218 Q 162,216 180,218" fill="none" stroke="url(#skinBrideDark)" strokeWidth="1" opacity="0.3" />
  </svg>
);

/* ───────────── Golden Particle Burst ───────────── */
const Particles = ({ count = 35 }) => {
  const particles = Array.from({ length: count });
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {particles.map((_, i) => {
        const angle = (Math.PI * 2 * i) / count;
        const radius = 60 + Math.random() * 160;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const size = Math.random() * 6 + 2;
        const duration = 1.2 + Math.random() * 1.2;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0.8, 0], x, y, scale: [0, 1.8, 0.6, 0] }}
            transition={{ duration, ease: 'easeOut', delay: 2.0 + Math.random() * 0.3 }}
            className="absolute rounded-full"
            style={{
              width: size, height: size,
              background: 'radial-gradient(circle, rgba(255,215,0,1) 0%, rgba(218,165,32,0.8) 60%, transparent 100%)',
              boxShadow: `0 0 ${size * 3}px ${size}px rgba(255,215,0,0.6)`,
            }}
          />
        );
      })}
    </div>
  );
};

/* ───────────── Ambient Floating Sparkles ───────────── */
const AmbientParticles = () => {
  const particles = Array.from({ length: 20 });
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((_, i) => {
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        const size = Math.random() * 3 + 1;
        return (
          <motion.div
            key={`a-${i}`}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.5, 0.8, 0.5, 0],
              y: [0, -60 - Math.random() * 80],
              x: [0, (Math.random() - 0.5) * 60],
            }}
            transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 5, ease: 'linear' }}
            className="absolute rounded-full"
            style={{
              left: `${startX}%`, top: `${startY}%`, width: size, height: size,
              background: 'radial-gradient(circle, rgba(255,223,100,0.9), transparent)',
              boxShadow: `0 0 ${size * 2}px rgba(255,215,0,0.5)`,
            }}
          />
        );
      })}
    </div>
  );
};

/* ───────────── Light Trail Ring ───────────── */
const LightTrails = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0, rotate: 0 }}
    animate={{ opacity: [0, 0.6, 0.3, 0], scale: [0.3, 1.8, 2.5], rotate: 180 }}
    transition={{ duration: 2, ease: 'easeOut', delay: 2.0 }}
    className="absolute w-48 h-48 rounded-full pointer-events-none"
    style={{
      border: '2px solid rgba(255,215,0,0.4)',
      boxShadow: '0 0 40px 10px rgba(255,215,0,0.2), inset 0 0 40px 10px rgba(255,215,0,0.1)',
    }}
  />
);

/* ───────────── Main Loading Screen ───────────── */
const LoadingScreen = ({ onComplete }) => {
  const [phase, setPhase] = useState('ENTER');

  const handleComplete = useCallback(() => { onComplete(); }, [onComplete]);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('MEET'), 800),
      setTimeout(() => setPhase('GLOW'), 2200),
      setTimeout(() => setPhase('REVEAL'), 3200),
      setTimeout(() => setPhase('SHIMMER'), 4600),
      setTimeout(() => setPhase('FADEOUT'), 5600),
      setTimeout(() => handleComplete(), 6400),
    ];
    return () => timers.forEach(clearTimeout);
  }, [handleComplete]);

  const showHands = phase === 'ENTER' || phase === 'MEET' || phase === 'GLOW' || phase === 'REVEAL' || phase === 'SHIMMER';
  const showGlow = phase === 'GLOW' || phase === 'REVEAL' || phase === 'SHIMMER';
  const showLogo = phase === 'REVEAL' || phase === 'SHIMMER';

  return (
    <AnimatePresence>
      {phase !== 'FADEOUT' ? (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.08 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
          style={{ background: 'radial-gradient(ellipse at center, #fffdf7 0%, #fef9ef 40%, #fdf2f8 100%)' }}
        >
          <AmbientParticles />

          <div className="relative flex flex-col items-center justify-center">

            {/* ─── Logo ABOVE the hands ─── */}
            {showLogo && (
              <motion.div
                initial={{ opacity: 0, scale: 0.7, filter: 'brightness(3) blur(15px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'brightness(1) blur(0px)' }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                className="z-30 flex flex-col items-center justify-center mb-2"
              >
                <div className="relative flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute w-56 h-56 rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(255,215,0,0.25), rgba(236,72,153,0.1), transparent)', filter: 'blur(30px)' }}
                  />
                  <img src="/logo.png" alt="JOD Matrimony" className="w-32 md:w-44 relative z-10 animate-shimmer select-none" draggable="false" />
                </div>
              </motion.div>
            )}

            {/* ─── Hands joining area ─── */}
            <div className="relative w-[85vw] max-w-md h-64 md:h-80 flex items-center justify-center">

              {/* Groom Hand — enters from top-left, hand reaching down-right */}
              <motion.div
                initial={{ x: '-55vw', y: '-25vh', opacity: 0, rotate: -10 }}
                animate={
                  showHands
                    ? { x: '-8%', y: '0%', opacity: 1, rotate: 25 }
                    : { opacity: 0, filter: 'blur(12px)' }
                }
                transition={
                  showHands
                    ? { duration: 1.8, ease: [0.22, 1, 0.36, 1] }
                    : { duration: 0.5, ease: 'easeIn' }
                }
                className="absolute left-0 top-0 w-[55%] h-full z-20 origin-top-left"
              >
                <GroomHand />
              </motion.div>

              {/* Bride Hand — enters from bottom-right, hand reaching up-left */}
              <motion.div
                initial={{ x: '55vw', y: '25vh', opacity: 0, rotate: 10 }}
                animate={
                  showHands
                    ? { x: '8%', y: '0%', opacity: 1, rotate: -25 }
                    : { opacity: 0, filter: 'blur(12px)' }
                }
                transition={
                  showHands
                    ? { duration: 1.8, ease: [0.22, 1, 0.36, 1] }
                    : { duration: 0.5, ease: 'easeIn' }
                }
                className="absolute right-0 bottom-0 w-[55%] h-full z-20 origin-bottom-right"
              >
                <BrideHand />
              </motion.div>

              {/* ─── Golden Glow at meeting point ─── */}
              {showGlow && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={phase === 'GLOW' ? { opacity: 0.85, scale: 1 } : { opacity: 0.35, scale: 2.5 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="absolute w-36 h-36 rounded-full z-10"
                    style={{
                      background: 'radial-gradient(circle, rgba(255,215,0,0.8) 0%, rgba(218,165,32,0.4) 40%, transparent 70%)',
                      boxShadow: '0 0 60px 25px rgba(255,215,0,0.35)',
                    }}
                  />
                  <LightTrails />
                  <Particles />
                </div>
              )}
            </div>

            {/* Tagline */}
            {showLogo && (
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
                className="mt-2 text-sm md:text-base tracking-[0.3em] uppercase font-medium z-10"
                style={{ color: '#8B6914' }}
              >
                Find Your Perfect Match
              </motion.p>
            )}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
export default LoadingScreen;
