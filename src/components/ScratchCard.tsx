import React, { useRef, useEffect, useState, useCallback } from 'react';

interface ScratchCardProps {
  groomName?: string;
  brideName?: string;
  onReveal?: () => void;
}

export const ScratchCard: React.FC<ScratchCardProps> = ({
  groomName = "Rakesh Sahani",
  brideName = "Shivani Sahani",
  onReveal,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const heartRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchProgress, setScratchProgress] = useState(0);
  const [flowers, setFlowers] = useState<{ id: number; emoji: string; left: string; delay: string; duration: string }[]>([]);

  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  // Initialize or re-render scratch surface on canvas
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const heart = heartRef.current;
    if (!canvas || !heart) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const rect = heart.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Rich metallic gold gradient layer
    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, '#8c5914');
    gradient.addColorStop(0.3, '#f7db8b');
    gradient.addColorStop(0.5, '#d49d33');
    gradient.addColorStop(0.75, '#f4d48a');
    gradient.addColorStop(1, '#946018');

    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Delicate metallic sparkle texture
    ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
    for (let y = 6; y < rect.height; y += 14) {
      for (let x = 6; x < rect.width; x += 14) {
        ctx.beginPath();
        ctx.arc(x + (y % 2 === 0 ? 4 : 0), y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Calligraphic instruction text on scratch surface
    ctx.fillStyle = '#3a1107';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '600 11px Montserrat, sans-serif';
    ctx.fillText('SCRATCH TO REVEAL', rect.width / 2, rect.height / 2 - 10);
    ctx.font = '700 11px Montserrat, sans-serif';
    ctx.fillText('OUR NAMES ♥', rect.width / 2, rect.height / 2 + 10);

    // Prepare for erasure (destination-out)
    ctx.globalCompositeOperation = 'destination-out';
  }, []);

  useEffect(() => {
    initCanvas();
    const handleResize = () => {
      if (!isRevealed) {
        initCanvas();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initCanvas, isRevealed]);

  // Check how much percentage is erased
  const checkProgress = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;
    let transparentCount = 0;
    const totalSampled = pixels.length / 32;

    for (let i = 3; i < pixels.length; i += 32) {
      if (pixels[i] < 90) {
        transparentCount++;
      }
    }

    const ratio = transparentCount / totalSampled;
    setScratchProgress(Math.min(Math.round(ratio * 100), 100));

    if (ratio > 0.25) {
      triggerReveal();
    }
  }, [isRevealed]);

  const resetCard = () => {
    setIsRevealed(false);
    setScratchProgress(0);
    setFlowers([]);
    setTimeout(() => {
      initCanvas();
    }, 100);
  };

  const triggerReveal = () => {
    if (isRevealed) return;
    setIsRevealed(true);
    setScratchProgress(100);

    const emojis = ['🌸', '🌺', '🌼', '✨', '💐', '🌹', '💖'];
    const newFlowers = Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      emoji: emojis[i % emojis.length],
      left: `${5 + Math.random() * 90}%`,
      delay: `${(i * 0.12).toFixed(2)}s`,
      duration: `${(4.5 + Math.random() * 2).toFixed(2)}s`,
    }));
    setFlowers(newFlowers);

    if (onReveal) {
      onReveal();
    }
  };

  const getCanvasPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const eraseAt = (p: { x: number; y: number }) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.save();
    ctx.beginPath();
    ctx.arc(p.x, p.y, 22, 0, Math.PI * 2);
    ctx.fill();

    if (lastPointRef.current) {
      ctx.lineWidth = 44;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
    ctx.restore();

    lastPointRef.current = p;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isRevealed) return;
    isDrawingRef.current = true;
    const pt = getCanvasPoint(e);
    lastPointRef.current = pt;
    eraseAt(pt);

    if (e.currentTarget.setPointerCapture) {
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {}
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || isRevealed) return;
    const pt = getCanvasPoint(e);
    eraseAt(pt);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    lastPointRef.current = null;

    if (e.currentTarget.releasePointerCapture) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
    }

    checkProgress();
  };

  return (
    <div className="scratch-wrap relative w-full max-w-[720px] mx-auto p-3 sm:p-6 border border-[#e6be65]/35 bg-gradient-to-br from-white/[0.045] to-white/[0.015] rounded-2xl shadow-[0_20px_70px_rgba(0,0,0,0.45)]">
      {/* SVG Defs for 100% Fluid Responsive Heart Clip Path */}
      <svg width="0" height="0" className="absolute top-0 left-0 w-0 h-0 pointer-events-none">
        <defs>
          <clipPath id="responsiveHeartClip" clipPathUnits="objectBoundingBox">
            <path d="M 0.5,0.94 C 0.38,0.83 0.04,0.58 0.04,0.35 C 0.04,0.15 0.18,0.04 0.35,0.04 C 0.44,0.04 0.48,0.11 0.5,0.17 C 0.52,0.11 0.56,0.04 0.65,0.04 C 0.82,0.04 0.96,0.15 0.96,0.35 C 0.96,0.58 0.62,0.83 0.5,0.94 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Decorative corner brackets */}
      <div className="absolute top-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-t-2 border-l-2 border-[#d7a94b] rounded-tl-xl" />
      <div className="absolute top-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-t-2 border-r-2 border-[#d7a94b] rounded-tr-xl" />
      <div className="absolute bottom-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-b-2 border-l-2 border-[#d7a94b] rounded-bl-xl" />
      <div className="absolute bottom-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-b-2 border-r-2 border-[#d7a94b] rounded-br-xl" />

      <div
        ref={containerRef}
        className="scratch-card relative min-h-[380px] sm:min-h-[460px] flex flex-col items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_50%,rgba(255,211,120,0.12),transparent_50%)] bg-[#2b050d] border border-[#d7a94b]/30 rounded-xl p-3 sm:p-6"
      >
        {/* Heart Container with Responsive SVG clip-path */}
        <div className="relative w-full max-w-[310px] sm:max-w-[380px] aspect-square flex items-center justify-center my-2">
          {/* Outer Gold Glow Border Outline */}
          <div
            className="absolute -inset-1 bg-gradient-to-tr from-[#d7a94b] via-[#f4d48a] to-[#a86f1e] opacity-80"
            style={{
              clipPath: 'url(#responsiveHeartClip)',
              WebkitClipPath: 'url(#responsiveHeartClip)',
            }}
          />

          <div
            ref={heartRef}
            className="scratch-heart relative w-full h-full shadow-[0_0_50px_rgba(215,169,75,0.35)] overflow-hidden transition-all duration-500"
            style={{
              clipPath: 'url(#responsiveHeartClip)',
              WebkitClipPath: 'url(#responsiveHeartClip)',
              background: 'linear-gradient(135deg, #250309 0%, #4a0715 50%, #1a0207 100%)',
            }}
          >
            {/* Inner Revealed Names Layer - Positioned to fit perfectly within the heart shape */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-4 sm:p-6 select-none">
              {/* Soft decorative glow behind names */}
              <div className="absolute w-28 h-28 bg-[#d7a94b]/20 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center justify-center space-y-0.5 sm:space-y-1 max-w-[85%] mx-auto">
                <span className="text-[9px] sm:text-[11px] font-cinzel tracking-[0.25em] uppercase text-[#f4d48a] opacity-90 drop-shadow-sm">
                  Forever Together
                </span>

                {/* Groom Name */}
                <h3 className="font-serif font-bold text-xl sm:text-3xl text-[#fff0d0] tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] leading-tight mt-0.5">
                  {groomName}
                </h3>

                {/* Ampersand */}
                <div className="font-cursive text-2xl sm:text-4xl text-[#f4d48a] leading-none my-0 drop-shadow-[0_2px_8px_rgba(215,169,75,0.5)]">
                  &
                </div>

                {/* Bride Name */}
                <h3 className="font-serif font-bold text-xl sm:text-3xl text-[#fff0d0] tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] leading-tight">
                  {brideName}
                </h3>

                <div className="w-12 sm:w-16 h-[1px] bg-gradient-to-r from-transparent via-[#d7a94b] to-transparent my-1 sm:my-2" />

                <p className="text-[8px] sm:text-[10px] font-sans tracking-[0.2em] text-[#d9c4a7] uppercase">
                  20 · 11 · 2026
                </p>
              </div>
            </div>

            {/* Scratchable Canvas Overlay */}
            <canvas
              ref={canvasRef}
              className={`absolute inset-0 z-20 w-full h-full touch-none cursor-pointer transition-opacity duration-700 ${
                isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            />
          </div>
        </div>

        {/* Floating Celebration Flowers on Reveal */}
        {flowers.map((f) => (
          <div
            key={f.id}
            className="absolute top-0 z-30 pointer-events-none text-xl sm:text-2xl animate-fall"
            style={{
              left: f.left,
              animationDelay: f.delay,
              animationDuration: f.duration,
            }}
          >
            {f.emoji}
          </div>
        ))}

        {/* Scratch Progress & Interactive Controls */}
        <div className="relative mt-2 z-30 flex flex-col items-center space-y-2 text-center w-full px-2">
          {!isRevealed ? (
            <div className="flex flex-col items-center space-y-1.5">
              <p className="text-[10px] sm:text-xs font-sans tracking-[0.2em] text-[#f9ecd3] uppercase bg-[#25030a]/90 px-4 py-1.5 rounded-full border border-[#d7a94b]/40 shadow-md backdrop-blur-sm">
                ✦ Scratch with finger or cursor ✦
              </p>
              {scratchProgress > 0 && (
                <div className="w-32 h-1.5 bg-black/50 rounded-full overflow-hidden border border-[#d7a94b]/30">
                  <div
                    className="h-full bg-gradient-to-r from-[#d7a94b] to-[#f4d48a] transition-all duration-300"
                    style={{ width: `${scratchProgress}%` }}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="animate-fade-in flex flex-col items-center">
              <span className="text-xs font-cinzel tracking-widest text-[#f4d48a] bg-[#4c0715]/90 px-4 py-1.5 rounded-full border border-[#d7a94b] shadow-lg">
                ✨ Names Revealed ✨
              </span>
            </div>
          )}

          <button
            onClick={isRevealed ? resetCard : triggerReveal}
            className="text-[10px] text-[#d9c4a7]/80 hover:text-[#f4d48a] underline tracking-wider transition-colors pt-0.5 cursor-pointer"
          >
            {isRevealed ? "Scratch again" : "Quick reveal"}
          </button>
        </div>
      </div>
    </div>
  );
};

