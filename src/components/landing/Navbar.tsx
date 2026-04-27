import { useState, useEffect } from 'react';

type Props = {
  onLogin: () => void;
  onGetStarted: () => void;
};

export default function Navbar({ onLogin, onGetStarted }: Props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav
      className="fixed left-0 right-0 top-0 z-40 transition-all duration-500"
      style={{
        background: scrolled
          ? 'rgba(5,8,20,0.9)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg text-lg"
            style={{ background: 'linear-gradient(135deg, #06b6d4, #0e7490)' }}
          >
            ✦
          </div>
          <span className="text-lg font-semibold text-white tracking-tight">InnerGuide</span>
        </div>

        {/* Links */}
        <div className="hidden items-center gap-8 md:flex">
          {['About', 'Mentors', 'Pricing'].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-sm font-medium text-white/60 transition-colors hover:text-white"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onLogin}
            className="text-sm font-medium text-white/70 transition-colors hover:text-white"
          >
            Log in
          </button>
          <button
            onClick={onGetStarted}
            className="rounded-xl px-5 py-2 text-sm font-semibold text-white transition-all hover:opacity-90 hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
              boxShadow: '0 0 20px rgba(6,182,212,0.3)',
            }}
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}
