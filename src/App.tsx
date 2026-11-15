import React, { useState, useEffect, useRef } from 'react';
import { ScratchCard } from './components/ScratchCard';
import {
  Calendar,
  Clock,
  Heart,
  MapPin,
  Music,
  Share2,
  Volume2,
  VolumeX,
  Sparkles,
  Copy,
  Check,
  Navigation,
  PartyPopper,
  Camera,
  Utensils,
  Sun,
  MessageCircle
} from 'lucide-react';

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Ambient Petals Background Generation
  const [petals, setPetals] = useState<Array<{ id: number; left: string; size: string; duration: string; delay: string; emoji: string }>>([]);

  useEffect(() => {
    const symbols = ["🌸", "🌺", "🌼", "❀", "✨", "🥀"];
    const generated = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 98}vw`,
      size: `${12 + Math.random() * 14}px`,
      duration: `${8 + Math.random() * 8}s`,
      delay: `${-Math.random() * 12}s`,
      emoji: symbols[i % symbols.length],
    }));
    setPetals(generated);
  }, []);

  // Lock scroll when invitation is closed
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const openInvitation = () => {
    setIsOpen(true);
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlayingMusic(true);
      }).catch((err) => {
        console.log("Audio play prevented or file not present:", err);
      });
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlayingMusic(true);
      }).catch(() => {
        alert("To enable background music, place your audio file as 'public/music/music.mp3'");
      });
    }
  };

  const addCalendar = () => {
    const url = "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      "&text=" + encodeURIComponent("Engagement Ceremony — Rakesh & Shivani") +
      "&dates=20261120T133000Z/20261120T160000Z" +
      "&location=" + encodeURIComponent("THE MAGHA BANQUET AND LAWNS BASTI, Near Badeban, Charoha Sirapar, Basti, Uttar Pradesh 272001") +
      "&details=" + encodeURIComponent("Cordially invited to the engagement ceremony of Rakesh Sahani and Shivani Sahani.");
    window.open(url, "_blank", "noopener");
  };

  const shareInvite = async () => {
    const shareData = {
      title: "Engagement Invitation — Rakesh & Shivani",
      text: "You are cordially invited to the engagement ceremony of Rakesh Sahani & Shivani Sahani on 20 November 2026 at 7:00 PM onwards.",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Share aborted:", err);
      }
    } else {
      copyLink();
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    } catch {
      prompt("Copy this invitation link:", window.location.href);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#160107] text-[#f9ecd3] font-sans overflow-x-hidden selection:bg-[#d7a94b] selection:text-[#26030b]">
      {/* Audio Element */}
      <audio ref={audioRef} loop preload="auto">
        <source src="/music/music.mp3" type="audio/mpeg" />
      </audio>

      {/* Floating Petals Background */}
      <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
        {petals.map((p) => (
          <div
            key={p.id}
            className="absolute top-[-30px] opacity-0"
            style={{
              left: p.left,
              fontSize: p.size,
              animationName: 'petalFall',
              animationDuration: p.duration,
              animationDelay: p.delay,
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite',
            }}
          >
            {p.emoji}
          </div>
        ))}
      </div>

      {/* Full Screen Opening Splash Screen - 100% Opaque Solid Cover */}
      {!isOpen ? (
        <div className="fixed inset-0 z-50 w-full h-[100dvh] flex flex-col justify-between items-center p-6 sm:p-10 bg-[#180108] bg-gradient-to-b from-[#180108] via-[#3a0512] to-[#180108] select-none overflow-hidden">
          {/* Internal ambient radial glow */}
          <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(circle_at_50%_35%,#d7a94b_0%,transparent_50%)]" />

          {/* Decorative Corner Ornaments */}
          <div className="absolute top-4 left-4 sm:top-8 sm:left-8 w-12 h-12 border-t-2 border-l-2 border-[#d7a94b]/60 rounded-tl-xl pointer-events-none z-10" />
          <div className="absolute top-4 right-4 sm:top-8 sm:right-8 w-12 h-12 border-t-2 border-r-2 border-[#d7a94b]/60 rounded-tr-xl pointer-events-none z-10" />
          <div className="absolute bottom-4 left-4 sm:bottom-8 sm:bottom-8 w-12 h-12 border-b-2 border-l-2 border-[#d7a94b]/60 rounded-bl-xl pointer-events-none z-10" />
          <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 w-12 h-12 border-b-2 border-r-2 border-[#d7a94b]/60 rounded-br-xl pointer-events-none z-10" />

          {/* Top Header Teaser */}
          <div className="pt-6 sm:pt-10 flex flex-col items-center relative z-10">
            <span className="text-[#f4d48a] text-sm tracking-[0.6em] mb-2">✦ ❧ ✦</span>
            <p className="text-[11px] sm:text-xs font-cinzel tracking-[0.35em] text-[#f4d48a] uppercase drop-shadow">
              With Love & Blessings
            </p>
          </div>

          {/* Center Card Teaser (No Names or Date Revealed) */}
          <div className="my-auto flex flex-col items-center max-w-lg w-full px-4 text-center space-y-4 relative z-10">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-[#d7a94b]/30 rounded-full blur-xl animate-pulse" />
              <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full border border-[#d7a94b]/50 bg-[#35040e] text-4xl shadow-2xl">
                💍
              </div>
            </div>

            <p className="text-xs sm:text-sm font-cinzel tracking-[0.3em] text-[#d9c4a7] uppercase">
              You Are Cordially Invited To
            </p>

            <h1 className="text-5xl sm:text-7xl font-cursive text-[#f4d48a] drop-shadow-[0_4px_20px_rgba(215,169,75,0.4)] my-1">
              Engagement
            </h1>

            <p className="text-xl sm:text-2xl font-serif italic text-[#f9ecd3] opacity-90 max-w-xs sm:max-w-md">
              “A celebration of love, togetherness & new beginnings”
            </p>

            <div className="w-36 sm:w-56 h-[1px] bg-gradient-to-r from-transparent via-[#d7a94b] to-transparent mx-auto my-4" />

            <p className="text-[11px] sm:text-xs font-sans tracking-[0.2em] text-[#d9c4a7]/80 uppercase">
              Tap below to open the royal invitation
            </p>

            <button
              onClick={openInvitation}
              className="mt-6 px-10 py-4 rounded-full border-2 border-[#d7a94b] bg-gradient-to-r from-[#d7a94b]/30 via-[#f4d48a]/20 to-[#d7a94b]/30 text-[#f4d48a] hover:bg-[#d7a94b] hover:text-[#25030a] font-sans font-bold text-xs sm:text-sm tracking-[0.25em] uppercase transition-all duration-300 shadow-[0_10px_35px_rgba(215,169,75,0.3)] hover:scale-105 active:scale-95 cursor-pointer"
            >
              ✦ Open Invitation ✦
            </button>
          </div>

          {/* Bottom Footer Teaser */}
          <div className="pb-4 sm:pb-8 text-center relative z-10">
            <p className="text-[10px] font-sans tracking-[0.25em] text-[#bca98f]/70 uppercase">
              Interactive Digital Invitation
            </p>
          </div>
        </div>
      ) : (
        /* Main App Page Wrapper - Renders strictly after clicking Open Invitation */
        <main className="w-full max-w-[1100px] mx-auto bg-gradient-to-b from-[#26030b] via-[#3b0611] to-[#220209] shadow-[0_0_90px_rgba(0,0,0,0.7)] relative overflow-hidden min-h-screen">
        {/* Subtle patterned overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_20%_30%,#d7a94b_1px,transparent_1.5px),radial-gradient(circle_at_70%_65%,#f4d48a_1px,transparent_1.5px)] bg-[size:100px_120px,140px_160px]" />

        {/* Floating background glows */}
        <div className="absolute w-64 h-64 bg-[#b51d45]/25 rounded-full blur-3xl -left-20 top-[12%] pointer-events-none" />
        <div className="absolute w-72 h-72 bg-[#d7a94b]/20 rounded-full blur-3xl -right-24 top-[48%] pointer-events-none" />

        {/* Floating Ambient Music Control Button */}
        <button
          onClick={toggleMusic}
          className={`fixed right-5 bottom-5 z-40 w-12 h-12 rounded-full border border-[#d7a94b] bg-[#470915] text-[#f4d48a] flex items-center justify-center shadow-2xl transition-transform hover:scale-110 ${
            isPlayingMusic ? "animate-spin-slow" : ""
          }`}
          aria-label="Toggle Music"
          title="Toggle Background Music"
        >
          {isPlayingMusic ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>

        {/* HERO SECTION */}
        <section className="relative min-h-[92vh] flex items-center justify-center text-center p-6 sm:p-12 border-b border-[#d7a94b]/20 bg-[radial-gradient(circle_at_50%_40%,rgba(142,21,48,0.5),transparent_40%)]">
          {/* Outer Frame Lines */}
          <div className="absolute inset-4 sm:inset-6 border border-[#d7a94b]/20 pointer-events-none rounded-sm" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <div className="text-2xl sm:text-4xl font-serif text-[#f4d48a] font-bold tracking-widest my-2 drop-shadow-[0_2px_12px_rgba(215,169,75,0.4)]">
              ॥ ॐ श्री गणेशाय नमः ॥
            </div>

            <p className="text-[10px] sm:text-xs font-cinzel tracking-[0.35em] text-[#f4d48a] uppercase pt-2">
              You are cordially invited to
            </p>

            <h1 className="text-4xl sm:text-7xl font-cinzel font-medium text-[#f4d48a] tracking-wider my-2">
              THE ENGAGEMENT
            </h1>

            <p className="text-6xl sm:text-8xl font-cursive text-[#fff3d1] leading-none">
              Celebration
            </p>

            <div className="w-48 sm:w-80 h-[1px] bg-gradient-to-r from-transparent via-[#d7a94b] to-transparent mx-auto my-6" />

            <p className="text-[10px] sm:text-xs font-sans tracking-[0.25em] text-[#d9c4a7] uppercase pt-2">
              FRIDAY · 20 NOVEMBER 2026 · 07:00 PM ONWARDS
            </p>

            <div className="pt-10 flex flex-col items-center">
              <span className="text-[9px] font-sans tracking-[0.25em] text-[#cbb99e] uppercase">
                Scroll to discover
              </span>
              <div className="w-[1px] h-10 bg-gradient-to-b from-[#d7a94b] to-transparent mt-3 animate-pulse" />
            </div>
          </div>
        </section>

        {/* SCRATCH TO REVEAL SECTION */}
        <section className="relative py-20 px-4 sm:px-8 text-center border-b border-[#d7a94b]/15">
          <div className="text-[#f4d48a] text-lg tracking-[0.5em] mb-2">✦ ❧ ✦</div>
          <h2 className="text-4xl sm:text-6xl font-cursive text-[#f4d48a] mb-2">
            A Little Surprise
          </h2>
          <p className="max-w-xl mx-auto text-base sm:text-lg font-serif text-[#d9c4a7] mb-8">
            Scratch the golden heart to reveal the couple's names in custom luxury typography.
          </p>

          <ScratchCard
            groomName="Rakesh Sahani"
            brideName="Shivani Sahani"
          />
        </section>

        {/* COUPLE PHOTO SECTION */}
        <section className="relative py-20 px-4 sm:px-8 text-center bg-gradient-to-b from-white/[0.02] to-transparent border-b border-[#d7a94b]/15">
          <div className="text-[#f4d48a] text-lg tracking-[0.5em] mb-2">❧ ✦ ❧</div>
          <h2 className="text-4xl sm:text-6xl font-cursive text-[#f4d48a] mb-2">
            Two Hearts, One Beautiful Beginning
          </h2>
          <p className="max-w-xl mx-auto text-base sm:text-lg font-serif text-[#d9c4a7] mb-10">
            A moment made more beautiful by the people who mean the most to us.
          </p>

          <div className="relative w-full max-w-[620px] mx-auto aspect-[4/3] p-3 rounded-2xl bg-gradient-to-br from-[#8b5a18] via-[#f0ca75] to-[#71450d] shadow-[0_25px_65px_rgba(0,0,0,0.5)]">
            <div className="w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-[#4b0a16] to-[#1d0208] flex items-center justify-center text-center p-6 border border-[#d7a94b]/30">
              <img
                src="/images/couple.jpeg"
                alt="Rakesh Sahani & Shivani Sahani"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-lg hidden"
                onLoad={(e) => {
                  (e.target as HTMLElement).classList.remove('hidden');
                  const placeholder = document.getElementById('photo-placeholder');
                  if (placeholder) placeholder.style.display = 'none';
                }}
                onError={(e) => {
                  (e.target as HTMLElement).classList.add('hidden');
                  const placeholder = document.getElementById('photo-placeholder');
                  if (placeholder) placeholder.style.display = 'flex';
                }}
              />
              <div id="photo-placeholder" className="flex flex-col items-center justify-center space-y-3">
                <Heart className="w-12 h-12 text-[#f4d48a] animate-pulse" />
                <h3 className="text-2xl sm:text-3xl font-serif text-[#f4d48a]">
                  Rakesh & Shivani
                </h3>
                <p className="text-xs font-sans tracking-widest text-[#d9c4a7] uppercase">
                  Engagement Couple Portrait
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BLESSINGS SECTION */}
        <section className="relative py-16 px-4 sm:px-8 text-center border-b border-[#d7a94b]/15 bg-gradient-to-b from-transparent to-black/10">
          <div className="text-[#f4d48a] text-lg tracking-[0.5em] mb-2">✦ ❧ ✦</div>
          <h2 className="text-3xl sm:text-5xl font-cursive text-[#f4d48a] mb-6">
            With The Blessings Of
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto mt-4">
            <div className="p-6 rounded-xl border border-[#e6be65]/25 bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-sm shadow-md">
              <h3 className="font-cinzel text-xs sm:text-sm font-bold text-[#f4d48a] tracking-[0.2em] uppercase mb-3">
                Groom's Parents
              </h3>
              <p className="text-lg sm:text-xl font-serif text-[#f9ecd3] font-medium leading-relaxed">
                Mr. Dan Bahadur Sahani<br />
                Mrs. Nirmala Devi
              </p>
            </div>

            <div className="p-6 rounded-xl border border-[#e6be65]/25 bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-sm shadow-md">
              <h3 className="font-cinzel text-xs sm:text-sm font-bold text-[#f4d48a] tracking-[0.2em] uppercase mb-3">
                Bride's Parents
              </h3>
              <p className="text-lg sm:text-xl font-serif text-[#f9ecd3] font-medium leading-relaxed">
                Mr. Shyam Sunder Sahani<br />
                Mrs. Indravati Devi
              </p>
            </div>
          </div>
        </section>

        {/* DETAILS & COUNTDOWN SECTION */}
        <section className="relative py-20 px-4 sm:px-8 text-center bg-black/20 border-b border-[#d7a94b]/15">
          <div className="text-[#f4d48a] text-lg tracking-[0.5em] mb-2">✦</div>
          <h2 className="text-4xl sm:text-6xl font-cursive text-[#f4d48a] mb-8">
            Mark Your Calendar
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="p-6 rounded-xl border border-[#e6be65]/35 bg-gradient-to-br from-white/[0.05] to-white/[0.01] backdrop-blur-sm">
              <Calendar className="w-7 h-7 text-[#f4d48a] mx-auto mb-3" />
              <p className="text-[9px] font-sans tracking-[0.2em] text-[#bca98f] uppercase">Date</p>
              <p className="text-2xl font-serif text-[#f4d48a] font-semibold mt-1">20 November 2026</p>
            </div>

            <div className="p-6 rounded-xl border border-[#e6be65]/35 bg-gradient-to-br from-white/[0.05] to-white/[0.01] backdrop-blur-sm">
              <Clock className="w-7 h-7 text-[#f4d48a] mx-auto mb-3" />
              <p className="text-[9px] font-sans tracking-[0.2em] text-[#bca98f] uppercase">Time</p>
              <p className="text-2xl font-serif text-[#f4d48a] font-semibold mt-1">07:00 AM Onwards</p>
            </div>

            <div className="p-6 rounded-xl border border-[#e6be65]/35 bg-gradient-to-br from-white/[0.05] to-white/[0.01] backdrop-blur-sm">
              <Sparkles className="w-7 h-7 text-[#f4d48a] mx-auto mb-3" />
              <p className="text-[9px] font-sans tracking-[0.2em] text-[#bca98f] uppercase">Occasion</p>
              <p className="text-2xl font-serif text-[#f4d48a] font-semibold mt-1">Engagement Ceremony</p>
            </div>
          </div>
        </section>

        {/* VENUE SECTION */}
        <section className="relative py-20 px-4 sm:px-8 text-center border-b border-[#d7a94b]/15">
          <div className="text-[#f4d48a] text-lg tracking-[0.5em] mb-2">⌖</div>
          <h2 className="text-4xl sm:text-6xl font-cursive text-[#f4d48a] mb-8">
            The Venue
          </h2>

          <div className="max-w-4xl mx-auto border border-[#e6be65]/35 rounded-2xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white/[0.035]">
            <div className="relative min-h-[240px] sm:min-h-[280px] rounded-xl border border-[#d7a94b]/50 overflow-hidden group shadow-xl">
              {/* Venue Background Photo */}
              <img
                src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1000"
                alt="The Magha Banquet and Lawns"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />

              {/* Dark Gradient Overlay for typography contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1d0308] via-[#1d0308]/40 to-black/20" />

              {/* Location Badge Overlay */}
              <div className="relative z-10 flex flex-col items-center justify-end h-full min-h-[240px] sm:min-h-[280px] p-5 text-center">
                <div className="bg-[#2b050d]/85 backdrop-blur-md px-4 py-2 rounded-full border border-[#d7a94b]/40 shadow-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#f4d48a] animate-bounce" />
                  <span className="font-cinzel text-xs sm:text-sm font-bold text-[#f4d48a] tracking-wider uppercase">
                    BASTI, UTTAR PRADESH
                  </span>
                </div>
              </div>
            </div>

            <div className="text-left space-y-4">
              <h3 className="text-2xl sm:text-3xl font-cinzel font-semibold text-[#f4d48a] leading-snug">
                THE MAGHA BANQUET AND LAWNS BASTI
              </h3>
              <p className="text-base sm:text-lg font-serif text-[#d9c4a7] leading-relaxed">
                Near Badeban, Charoha Sirapar,<br />
                Basti, Uttar Pradesh 272001
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href="https://maps.app.goo.gl/FETrxs86aHMeVMqP9?g_st=iw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-full bg-gradient-to-r from-[#f3d38a] to-[#b77a20] text-[#2d070c] font-sans font-semibold text-[10px] tracking-wider uppercase inline-flex items-center gap-2 hover:brightness-110 shadow-md transition-all"
                >
                  <Navigation className="w-4 h-4" /> Open Google Maps
                </a>
                <button
                  onClick={addCalendar}
                  className="px-5 py-3 rounded-full border border-[#d7a94b] bg-[#d7a94b]/10 text-[#f4d48a] font-sans font-semibold text-[10px] tracking-wider uppercase inline-flex items-center gap-2 hover:bg-[#d7a94b] hover:text-[#25030a] transition-all"
                >
                  <Calendar className="w-4 h-4" /> Add to Calendar
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* TIMELINE SECTION */}
        <section className="relative py-20 px-4 sm:px-8 text-center border-b border-[#d7a94b]/15">
          <div className="text-[#f4d48a] text-lg tracking-[0.5em] mb-2">❧ ✦ ❧</div>
          <h2 className="text-4xl sm:text-6xl font-cursive text-[#f4d48a] mb-10">
            Evening Schedule
          </h2>

          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-5 gap-4">
            <div className="p-4 border-b sm:border-b-0 sm:border-r border-[#d7a94b]/20">
              <Sun className="w-6 h-6 text-[#f4d48a] mx-auto mb-2" />
              <p className="text-xl font-serif font-semibold text-[#f4d48a]">07:00 AM</p>
              <p className="text-[10px] font-sans tracking-wider text-[#dbc8a9] uppercase mt-1">WELCOME</p>
            </div>
            <div className="p-4 border-b sm:border-b-0 sm:border-r border-[#d7a94b]/20">
              <Camera className="w-6 h-6 text-[#f4d48a] mx-auto mb-2" />
              <p className="text-xl font-serif font-semibold text-[#f4d48a]">07:30 AM</p>
              <p className="text-[10px] font-sans tracking-wider text-[#dbc8a9] uppercase mt-1">PHOTO SESSION</p>
            </div>
            <div className="p-4 border-b sm:border-b-0 sm:border-r border-[#d7a94b]/20">
              <PartyPopper className="w-6 h-6 text-[#f4d48a] mx-auto mb-2" />
              <p className="text-xl font-serif font-semibold text-[#f4d48a]">08:00 AM</p>
              <p className="text-[10px] font-sans tracking-wider text-[#dbc8a9] uppercase mt-1">ENGAGEMENT</p>
            </div>
            <div className="p-4 border-b sm:border-b-0 sm:border-r border-[#d7a94b]/20">
              <Utensils className="w-6 h-6 text-[#f4d48a] mx-auto mb-2" />
              <p className="text-xl font-serif font-semibold text-[#f4d48a]">09:00 AM</p>
              <p className="text-[10px] font-sans tracking-wider text-[#dbc8a9] uppercase mt-1">DINNER</p>
            </div>
            <div className="p-4">
              <Music className="w-6 h-6 text-[#f4d48a] mx-auto mb-2" />
              <p className="text-xl font-serif font-semibold text-[#f4d48a]">10:00 AM</p>
              <p className="text-[10px] font-sans tracking-wider text-[#dbc8a9] uppercase mt-1">CELEBRATION</p>
            </div>
          </div>
        </section>

        {/* MESSAGE & SHARE SECTION */}
        <section className="relative py-20 px-4 sm:px-8 text-center bg-[radial-gradient(circle_at_50%_50%,rgba(120,12,38,0.35),transparent_55%)]">
          <div className="text-[#f4d48a] text-lg tracking-[0.5em] mb-2">♥ ✦ ♥</div>
          <h2 className="text-4xl sm:text-6xl font-cursive text-[#f4d48a] mb-4">
            Your Presence Will Make It Special
          </h2>
          <p className="max-w-2xl mx-auto text-xl sm:text-3xl font-serif italic text-[#f9e8c9] my-6 leading-relaxed">
            “The best moments in life become unforgettable when shared with the people we love.”
          </p>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-[#f4d48a] mb-12 tracking-wider">
            ॥ ॐ श्री गणेशाय नमः ॥
          </p>

          <div className="pt-10 border-t border-[#d7a94b]/20 max-w-2xl mx-auto">
            <h3 className="text-3xl font-cursive text-[#f4d48a] mb-2">Share With Friends & Family</h3>
            <p className="text-sm font-serif text-[#d9c4a7] mb-6">
              We would be delighted to celebrate this beautiful beginning with you.
            </p>

            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href="https://wa.me/918448173092?text=Hello!%20I%20would%20like%20to%20RSVP%20for%20the%20Engagement%20Ceremony."
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-sans font-semibold text-xs tracking-wider uppercase inline-flex items-center gap-2 hover:brightness-110 shadow-lg transition-all"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp (+91 84481 73092)
              </a>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-8 px-4 text-center border-t border-[#e6be65]/35 text-[10px] font-sans tracking-[0.2em] text-[#bda98d] uppercase">
          With love & blessings · <strong className="text-[#f4d48a]">Rakesh Sahani & Shivani Sahani</strong> · 20 November 2026
        </footer>
      </main>
      )}
    </div>
  );
}
