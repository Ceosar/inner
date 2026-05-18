import { useState, useEffect } from 'react';
import { Check, Zap, Shield, Star } from 'lucide-react';
import Navbar from '../components/landing/Navbar';
import MentorCard from '../components/landing/MentorCard';
import AuthModal from '../components/AuthModal';
import { Mentor } from '../lib/mentors';
import { supabase } from '../lib/supabase';

export default function Landing() {
  const [showAuth, setShowAuth] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('signup');
  const [visible, setVisible] = useState(false);
  const [mentors, setMentors] = useState<Mentor[]>([]);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    supabase
      .from('mentors')
      .select('*')
      .order('name')
      .then(({ data }) => {
        if (data) setMentors(data as Mentor[]);
      });
  }, []);

  const openLogin = () => {
    setAuthTab('login');
    setShowAuth(true);
  };
  const openSignup = () => {
    setAuthTab('signup');
    setShowAuth(true);
  };

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{
        background: 'linear-gradient(160deg, #020812 0%, #050d1e 40%, #030a18 70%, #060c1a 100%)',
        color: 'white',
      }}
    >
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -left-40 top-1/4 h-96 w-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #06b6d4, transparent)' }}
        />
        <div
          className="absolute -right-40 top-1/3 h-80 w-80 rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, #f59e0b, transparent)' }}
        />
        <div
          className="absolute bottom-1/4 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #10b981, transparent)' }}
        />
      </div>

      <Navbar onLogin={openLogin} onGetStarted={openSignup} />
      <section className="relative flex min-h-screen flex-col items-center justify-center px-4 pt-20 text-center md:px-6">
        <div
          className="mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-all md:mb-8 md:px-4"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.7s ease',
            background: 'rgba(6,182,212,0.08)',
            borderColor: 'rgba(6,182,212,0.25)',
            color: '#06b6d4',
          }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
          AI-powered self-reflection · Available 24/7
        </div>
        <h1
          className="mb-6 max-w-3xl text-3xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl xl:text-7xl"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s ease 0.1s',
          }}
        >
          Find clarity faster.{' '}
          <span
            style={{
              background: 'linear-gradient(90deg, #06b6d4, #22d3ee, #f59e0b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            The answer is already inside you.
          </span>
        </h1>
        <p
          className="mb-8 max-w-xl text-base text-white/60 leading-relaxed md:text-lg"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s ease 0.2s',
          }}
        >
          AI mentors help you see your situation clearly — without noise, without endless searching.
        </p>
        <div
          className="flex flex-col items-center gap-4 sm:flex-row"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s ease 0.3s',
          }}
        >
          <button
            onClick={openSignup}
            className="group relative rounded-2xl px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-105 active:scale-95 md:px-8 md:py-4 md:text-base"
            style={{
              background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
              boxShadow: '0 0 40px rgba(6,182,212,0.35), 0 8px 20px rgba(0,0,0,0.3)',
            }}
          >
            Start for free
            <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
          </button>
          <p className="text-xs text-white/30">No credit card required</p>
        </div>
        <div
          className="mt-12 flex flex-wrap justify-center gap-6 border-t border-white/5 pt-12 md:mt-16 md:gap-8 md:pt-16"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'all 0.8s ease 0.5s',
          }}
        >
          {[
            { value: '6', label: 'Expert Mentors', suffix: '' },
            { value: '24', label: 'Hour Availability', suffix: '/7' },
            { value: '100', label: 'Private & Secure', suffix: '%' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-white md:text-3xl">
                {stat.value}
                <span className="text-cyan-400">{stat.suffix}</span>
              </div>
              <div className="mt-1 text-xs text-white/40 md:text-xs">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
      <section id="mentors" className="relative px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center md:mb-16">
            <h2 className="mb-4 text-2xl font-bold text-white md:text-4xl">
              Choose your{' '}
              <span
                style={{
                  background: 'linear-gradient(90deg, #06b6d4, #f59e0b)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                guide
              </span>
            </h2>
            <p className="text-white/50 max-w-md mx-auto text-sm md:text-base">
              Each mentor brings a unique perspective. Pick the one that resonates — or try them
              all.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mentors.map(mentor => (
              <MentorCard key={mentor.id} mentor={mentor} onClick={openSignup} />
            ))}
          </div>
        </div>
      </section>
      <section id="about" className="relative px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <div
            className="rounded-3xl border border-white/8 p-8 md:p-12"
            style={{
              background: 'linear-gradient(135deg, rgba(6,182,212,0.06), rgba(245,158,11,0.04))',
              backdropFilter: 'blur(20px)',
            }}
          >
            <p className="mb-6 text-xl font-light leading-relaxed text-white/80 md:text-3xl">
              Stop overthinking. Stop searching endlessly.{' '}
              <span className="font-semibold text-white">Talk, reflect, understand</span> — in one
              place.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {[
                {
                  icon: <Zap size={20} />,
                  title: 'Instant Clarity',
                  desc: 'Get perspective on any situation within seconds, not days.',
                },
                {
                  icon: <Shield size={20} />,
                  title: 'Completely Private',
                  desc: 'Your conversations are encrypted and only visible to you.',
                },
                {
                  icon: <Star size={20} />,
                  title: 'Always Available',
                  desc: 'Your mentor is ready at 3am, on weekends, in any timezone.',
                },
              ].map(item => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/6 p-5 text-left sm:text-center"
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                >
                  <div
                    className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-cyan-400"
                    style={{ background: 'rgba(6,182,212,0.1)' }}
                  >
                    {item.icon}
                  </div>
                  <h3 className="mb-1 text-sm font-semibold text-white">{item.title}</h3>
                  <p className="text-xs leading-relaxed text-white/45">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section id="pricing" className="relative px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center md:mb-16">
            <h2 className="mb-4 text-2xl font-bold text-white md:text-4xl">Simple pricing</h2>
            <p className="text-white/50 text-sm md:text-base">
              Start free. Go deeper when you're ready.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div
              className="rounded-3xl border border-white/8 p-6 md:p-8"
              style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(10px)' }}
            >
              <div className="mb-2 text-xs font-medium uppercase tracking-wider text-white/40">
                Free
              </div>
              <div className="mb-1 text-3xl font-bold text-white md:text-4xl">$0</div>
              <div className="mb-6 text-sm text-white/40">forever</div>
              <ul className="space-y-3">
                {['10 messages per day', 'Access to 2 mentors', 'Basic chat history'].map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-white/60">
                    <Check size={15} className="shrink-0 text-cyan-400" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={openSignup}
                className="mt-8 w-full rounded-xl border border-white/10 py-3 text-sm font-medium text-white/70 transition-all hover:border-white/20 hover:text-white"
              >
                Get started free
              </button>
            </div>
            <div
              className="relative rounded-3xl border p-6 md:p-8"
              style={{
                background: 'linear-gradient(135deg, rgba(6,182,212,0.1), rgba(8,145,178,0.06))',
                borderColor: 'rgba(6,182,212,0.3)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 0 40px rgba(6,182,212,0.1)',
              }}
            >
              <div
                className="absolute -top-3 right-4 rounded-full px-3 py-1 text-xs font-semibold text-white md:right-6"
                style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}
              >
                Most Popular
              </div>
              <div className="mb-2 text-xs font-medium uppercase tracking-wider text-cyan-400">
                Premium
              </div>
              <div className="mb-1 text-3xl font-bold text-white md:text-4xl">$1</div>
              <div className="mb-6 text-sm text-white/40">for 7 days, then $12/mo</div>
              <ul className="space-y-3">
                {[
                  'Unlimited messages',
                  'All 6 AI mentors',
                  'Deep Thinking mode',
                  'Custom mentor prompts',
                  'Full chat history',
                  'Priority responses',
                ].map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-white/70">
                    <Check size={15} className="shrink-0 text-cyan-400" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={openSignup}
                className="mt-8 w-full rounded-xl py-3 text-sm font-semibold text-white transition-all hover:opacity-90 hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                  boxShadow: '0 0 20px rgba(6,182,212,0.3)',
                }}
              >
                Try 7 days for $1
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="relative px-4 py-16 text-center md:px-6 md:py-24">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 text-2xl font-bold text-white md:text-4xl">
            Ready to understand yourself?
          </h2>
          <p className="mb-8 text-white/50 text-sm md:text-base">
            Join thousands who have already found clarity with InnerGuide.
          </p>
          <button
            onClick={openSignup}
            className="rounded-2xl px-8 py-3 text-sm font-semibold text-white transition-all hover:scale-105 active:scale-95 md:px-10 md:py-4 md:text-base"
            style={{
              background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
              boxShadow: '0 0 40px rgba(6,182,212,0.3)',
            }}
          >
            Start for free
          </button>
        </div>
      </section>
      <footer className="border-t border-white/5 px-4 py-6 text-center md:px-6 md:py-8">
        <div className="flex items-center justify-center gap-2 text-white/30 text-xs md:text-sm">
          <span className="text-cyan-500">✦</span>
          <span className="font-medium text-white/50">InnerGuide</span>
          <span className="text-xs">— Your AI mentor, always.</span>
        </div>
      </footer>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} defaultTab={authTab} />}
    </div>
  );
}
