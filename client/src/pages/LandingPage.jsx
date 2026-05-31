import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Cpu, Terminal, ArrowRight, Zap, Globe, Shield, Code2, CheckCircle,
  Crown, Mail, Github, Twitter, Linkedin, ChevronDown, Monitor,
  LayoutGrid, Palette, Search, Sparkles, ExternalLink, Menu, X
} from 'lucide-react';

// ── Smooth scroll helper ───────────────────────────────────────────────────────
const scrollTo = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

// ── Nav links ──────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: 'Features', target: 'features' },
  { label: 'Templates', target: 'templates' },
  { label: 'How It Works', target: 'how-it-works' },
  { label: 'Pricing', target: 'pricing' },
];

// ── Reusable components ────────────────────────────────────────────────────────
function GradientText({ children, className = '' }) {
  return (
    <span className={`bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 ${className}`}>
      {children}
    </span>
  );
}

function SectionLabel({ children }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-400 font-mono font-semibold mb-6">
      <Sparkles className="h-3 w-3" />
      {children}
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, color = 'indigo' }) {
  const colors = {
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    pink: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  };
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="p-6 bg-slate-900/50 border border-slate-800/60 rounded-2xl hover:border-slate-700/80 transition-all group"
    >
      <div className={`h-11 w-11 rounded-xl border flex items-center justify-center mb-4 ${colors[color]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-bold text-white text-base mb-2">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function StepCard({ number, title, desc }) {
  return (
    <div className="relative flex gap-6">
      <div className="flex flex-col items-center">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-indigo-500/30 shrink-0">
          {number}
        </div>
        {number < 4 && <div className="w-px flex-1 bg-gradient-to-b from-indigo-500/40 to-transparent mt-2 min-h-[40px]" />}
      </div>
      <div className="pb-10">
        <h3 className="font-bold text-white mb-1.5">{title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function TemplatePreview({ name, description, accent, bg, textColor, badgeColor, href }) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="group relative overflow-hidden rounded-2xl border border-slate-800/60 hover:border-slate-600/80 transition-all shadow-xl"
    >
      {/* Preview mockup */}
      <div className={`h-56 ${bg} relative overflow-hidden`}>
        <div className="absolute inset-0 p-5">
          {/* Minimalist preview */}
          {name === 'Minimalist' && (
            <div className="space-y-3">
              <div className="h-5 w-28 bg-stone-700/40 rounded" />
              <div className="h-3 w-20 bg-stone-600/30 rounded" />
              <div className="h-px w-full bg-stone-600/30 mt-4" />
              <div className="space-y-1.5 mt-3">
                <div className="h-2 w-full bg-stone-600/25 rounded" />
                <div className="h-2 w-4/5 bg-stone-600/25 rounded" />
                <div className="h-2 w-3/5 bg-stone-600/25 rounded" />
              </div>
              <div className="flex gap-2 mt-3 flex-wrap">
                {['React', 'Node.js', 'Python'].map(t => (
                  <div key={t} className="h-5 px-2 bg-stone-600/30 rounded-full flex items-center">
                    <div className="h-1.5 w-8 bg-stone-500/50 rounded" />
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Cyberpunk preview */}
          {name === 'Cyberpunk' && (
            <div className="font-mono text-green-400 space-y-2">
              <div className="text-[10px] text-green-500/60">▶ system boot :: active</div>
              <div className="h-6 w-36 bg-green-500/10 border border-green-500/30 rounded flex items-center px-2">
                <div className="h-2 w-20 bg-white/40 rounded" />
              </div>
              <div className="text-[9px] text-cyan-400 mt-1">&gt; NETRUNNER</div>
              <div className="mt-2 space-y-1.5">
                {['▓▓▓▓▓▓▓▓░░', '▓▓▓▓▓▓░░░░', '▓▓▓░░░░░░░'].map((b, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="h-1.5 w-20 bg-green-950 rounded overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: i === 0 ? '80%' : i === 1 ? '60%' : '30%' }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute bottom-3 right-3 border border-green-500/30 px-2 py-0.5 rounded text-[8px]">[ CONTACT ]</div>
            </div>
          )}
          {/* Corporate preview */}
          {name === 'Corporate' && (
            <div className="space-y-3">
              <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded absolute top-0 left-0 right-0" />
              <div className="mt-3 flex justify-between items-start">
                <div className="space-y-1.5">
                  <div className="h-5 w-32 bg-slate-200/80 rounded" />
                  <div className="h-3 w-20 bg-indigo-400/60 rounded" />
                </div>
                <div className="flex gap-1">
                  {[0,1,2].map(i => <div key={i} className="h-6 w-6 bg-slate-100 rounded border border-slate-200" />)}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {[0,1,2,3].map(i => (
                  <div key={i} className="h-12 bg-white border border-slate-200 rounded-lg p-2 space-y-1">
                    <div className="h-2 w-10 bg-slate-300 rounded" />
                    <div className="h-1.5 w-14 bg-indigo-300/70 rounded" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold text-white bg-white/10 backdrop-blur border border-white/20 px-3 py-1.5 rounded-lg hover:bg-white/20 transition-all"
          >
            <ExternalLink className="h-3.5 w-3.5" /> View Demo
          </a>
        </div>
      </div>

      <div className={`p-5 bg-slate-900/80 border-t border-slate-800/60`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white">{name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{description}</p>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
            {name === 'Cyberpunk' || name === 'Corporate' ? 'PRO' : 'FREE'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function PricingCard({ plan, price, desc, features, cta, ctaLink, highlighted = false }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`relative p-8 rounded-2xl border flex flex-col ${
        highlighted
          ? 'bg-gradient-to-b from-indigo-600/20 to-purple-600/10 border-indigo-500/40 shadow-2xl shadow-indigo-500/10'
          : 'bg-slate-900/50 border-slate-800/60'
      }`}
    >
      {highlighted && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-lg">
          Most Popular
        </div>
      )}
      <div className="mb-6">
        <h3 className="font-extrabold text-xl text-white">{plan}</h3>
        <p className="text-slate-400 text-sm mt-1">{desc}</p>
        <div className="flex items-baseline gap-1 mt-4">
          <span className="text-4xl font-extrabold text-white">{price}</span>
          {price !== 'Free' && <span className="text-slate-400 text-sm">/month</span>}
        </div>
      </div>

      <ul className="space-y-3 flex-1 mb-8">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
            <CheckCircle className={`h-4 w-4 shrink-0 mt-0.5 ${highlighted ? 'text-indigo-400' : 'text-emerald-500'}`} />
            {f}
          </li>
        ))}
      </ul>

      <Link
        to={ctaLink}
        className={`text-center py-3 px-6 rounded-xl font-bold text-sm transition-all ${
          highlighted
            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/20'
            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
        }`}
      >
        {cta}
      </Link>
    </motion.div>
  );
}

// ── MAIN LANDING PAGE ─────────────────────────────────────────────────────────
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 overflow-x-hidden">

      {/* ── Background ambient glows ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-200px] left-1/3 w-[700px] h-[700px] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-[400px] right-[-100px] w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-indigo-900/15 rounded-full blur-[120px]" />
      </div>

      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/60 shadow-xl shadow-black/20' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Cpu className="h-5 w-5 text-white" />
            </div>
            <span className="font-extrabold tracking-widest text-white text-sm">CODEFOLIO</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <button
                key={link.target}
                onClick={() => scrollTo(link.target)}
                className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="text-sm font-semibold text-slate-400 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-all">
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-5 py-2 rounded-xl transition-all shadow-lg shadow-indigo-600/20"
            >
              Get Started Free
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(v => !v)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-slate-900/95 backdrop-blur-xl border-t border-slate-800/60 px-6 py-4 space-y-1"
          >
            {NAV_LINKS.map(link => (
              <button
                key={link.target}
                onClick={() => { scrollTo(link.target); setMobileOpen(false); }}
                className="w-full text-left px-4 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-3 border-t border-slate-800/60 flex flex-col gap-2">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="text-center py-2.5 text-sm font-semibold text-slate-300 hover:text-white border border-slate-700 rounded-xl transition-all">
                Sign In
              </Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="text-center py-2.5 text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl">
                Get Started Free
              </Link>
            </div>
          </motion.div>
        )}
      </nav>

      <div className="relative z-10">

        {/* ══════════════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════════════ */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-400 font-mono font-semibold"
            >
              <Terminal className="h-3.5 w-3.5 animate-pulse" />
              The Developer Portfolio Builder
              <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-pulse" />
            </motion.div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.05]">
              Your portfolio,{' '}
              <GradientText>built in minutes.</GradientText>
            </h1>

            <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed font-light">
              Stop procrastinating. CodeFolio is a no-code CMS that transforms your GitHub links, bios, and skills into stunning developer portfolios — with multiple themes, vanity URLs, live preview, and SEO baked in.
            </p>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-8 py-2"
            >
              {[['3', 'Premium Templates'], ['100%', 'No-Code CMS'], ['∞', 'Free Portfolio']].map(([n, l]) => (
                <div key={l} className="text-center">
                  <div className="text-2xl font-extrabold text-white">{n}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{l}</div>
                </div>
              ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link
                to="/register"
                className="group flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold py-4 px-8 rounded-xl text-sm transition-all shadow-2xl shadow-indigo-600/25 hover:shadow-indigo-500/35"
              >
                Start Building Free
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <a
                href="http://localhost:5173/u/demo2"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-slate-900/80 hover:bg-slate-800/80 border border-slate-700/60 hover:border-slate-600 text-slate-300 font-bold py-4 px-8 rounded-xl text-sm transition-all"
              >
                <Globe className="h-4 w-4" /> View Live Demo
              </a>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.button
            onClick={() => scrollTo('features')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 6, 0] }}
            transition={{ delay: 1.2, duration: 2, repeat: Infinity }}
            className="absolute bottom-10 text-slate-600 hover:text-slate-400 transition-colors"
          >
            <ChevronDown className="h-6 w-6" />
          </motion.button>
        </section>

        {/* ══════════════════════════════════════════════════════
            FEATURES
        ══════════════════════════════════════════════════════ */}
        <section id="features" className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <SectionLabel>Why CodeFolio</SectionLabel>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                Everything you need,{' '}
                <GradientText>nothing you don't.</GradientText>
              </h2>
              <p className="text-slate-400 mt-4 max-w-xl mx-auto text-base">
                Built specifically for developers. No bloat, no drag-and-drop nonsense — just a clean CMS that generates beautiful portfolios.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <FeatureCard
                icon={Monitor}
                color="indigo"
                title="Live Split-Screen Preview"
                desc="See exactly how your portfolio looks as you type — template updates in real time on the right pane."
              />
              <FeatureCard
                icon={Palette}
                color="purple"
                title="3 Distinct Themes"
                desc="Minimalist, Cyberpunk, and Corporate. Each template is a completely different visual system — not just a color swap."
              />
              <FeatureCard
                icon={Globe}
                color="cyan"
                title="Vanity URLs"
                desc="Share your portfolio at codefolio.app/username. No subdomains, no random slugs — your name, your link."
              />
              <FeatureCard
                icon={Search}
                color="emerald"
                title="SEO Built-in"
                desc="Dynamic page titles and meta descriptions generated from your bio via React Helmet. Google-ready out of the box."
              />
              <FeatureCard
                icon={Mail}
                color="pink"
                title="Contact Form + Email"
                desc="Built-in contact form on every portfolio. Messages route to your private email — your address is never exposed."
              />
              <FeatureCard
                icon={Crown}
                color="amber"
                title="Pro Custom Domains"
                desc="Map your own domain (e.g. john.dev) to your portfolio. CNAME + host header resolution handled server-side."
              />
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            TEMPLATES
        ══════════════════════════════════════════════════════ */}
        <section id="templates" className="py-24 px-6 bg-slate-900/30 border-y border-slate-800/40">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <SectionLabel>Template Gallery</SectionLabel>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                Pick your <GradientText>aesthetic.</GradientText>
              </h2>
              <p className="text-slate-400 mt-4 max-w-xl mx-auto text-base">
                Switch between templates anytime — your data moves with you. Each theme is a unique design system, not a skin.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TemplatePreview
                name="Minimalist"
                description="Clean typography, warm tones, editorial feel"
                bg="bg-stone-100"
                badgeColor="text-slate-400 border-slate-600"
                href="http://localhost:5173/u/demo1"
              />
              <TemplatePreview
                name="Cyberpunk"
                description="Green glows, CRT scanlines, terminal vibes"
                bg="bg-black"
                badgeColor="text-amber-400 border-amber-500/40"
                href="http://localhost:5173/u/demo2"
              />
              <TemplatePreview
                name="Corporate"
                description="Executive grids, indigo accents, professional"
                bg="bg-slate-100"
                badgeColor="text-amber-400 border-amber-500/40"
                href="http://localhost:5173/u/demo3"
              />
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            HOW IT WORKS
        ══════════════════════════════════════════════════════ */}
        <section id="how-it-works" className="py-24 px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <SectionLabel>How It Works</SectionLabel>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
                From zero to live in <GradientText>4 steps.</GradientText>
              </h2>
              <p className="text-slate-400 text-base leading-relaxed">
                No deployment, no CSS frameworks, no tutorial rabbit holes. Sign up and your portfolio is live at your vanity URL immediately.
              </p>
            </div>

            <div>
              <StepCard number={1} title="Create your account" desc="Register with a username — this becomes your vanity URL instantly. codefolio.app/you." />
              <StepCard number={2} title="Fill in your data" desc="Add your bio, projects with GitHub links and tech stacks, and skill categories. All in a clean dashboard form." />
              <StepCard number={3} title="Pick a theme" desc="Choose Minimalist, Cyberpunk, or Corporate. Watch the live preview update in real time as you switch." />
              <StepCard number={4} title="Share your link" desc="Your portfolio is live. Share /username, set up a custom domain, or embed it in your email signature." />
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            PRICING
        ══════════════════════════════════════════════════════ */}
        <section id="pricing" className="py-24 px-6 bg-slate-900/30 border-y border-slate-800/40">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <SectionLabel>Pricing</SectionLabel>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                Simple, <GradientText>transparent pricing.</GradientText>
              </h2>
              <p className="text-slate-400 mt-4 max-w-xl mx-auto text-base">
                Start for free — forever. Upgrade to Pro when you need custom domains and priority features.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              <PricingCard
                plan="Free"
                price="Free"
                desc="For developers just getting started"
                features={[
                  'Vanity URL (codefolio.app/you)',
                  'All 3 portfolio themes',
                  'Unlimited projects & skills',
                  'Built-in contact form',
                  'SEO meta tags',
                  'Live preview editor',
                ]}
                cta="Get Started Free"
                ctaLink="/register"
              />
              <PricingCard
                plan="Pro"
                price="$9"
                desc="For developers who mean business"
                features={[
                  'Everything in Free',
                  'Custom domain mapping',
                  'Pro badge on portfolio',
                  'Priority email support',
                  'Advanced analytics (soon)',
                  'Early access to new themes',
                ]}
                cta="Upgrade to Pro"
                ctaLink="/register"
                highlighted
              />
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            FINAL CTA
        ══════════════════════════════════════════════════════ */}
        <section className="py-32 px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight">
                Your portfolio is{' '}
                <GradientText>one click away.</GradientText>
              </h2>
              <p className="text-slate-400 text-lg mt-6 leading-relaxed">
                Join developers who built their portfolio in minutes instead of weekends. No design skills required.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link
                to="/register"
                className="group flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold py-4 px-8 rounded-xl text-sm transition-all shadow-2xl shadow-indigo-600/25"
              >
                Build My Portfolio Now
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>

            <p className="text-xs text-slate-600">Free forever. No credit card required.</p>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            FOOTER
        ══════════════════════════════════════════════════════ */}
        <footer className="border-t border-slate-800/60 px-6 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-10">
              {/* Brand */}
              <div className="space-y-3 max-w-xs">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
                    <Cpu className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-extrabold tracking-widest text-white text-sm">CODEFOLIO</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  The developer portfolio builder. From GitHub to live site in minutes.
                </p>
              </div>

              {/* Link columns */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Product</h4>
                  <ul className="space-y-2">
                    {['Features', 'Templates', 'Pricing', 'Changelog'].map(l => (
                      <li key={l}>
                        <button onClick={() => scrollTo(l.toLowerCase())} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                          {l}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Account</h4>
                  <ul className="space-y-2">
                    {[['Sign In', '/login'], ['Sign Up', '/register'], ['Dashboard', '/dashboard']].map(([l, to]) => (
                      <li key={l}>
                        <Link to={to} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">{l}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Demo Portfolios</h4>
                  <ul className="space-y-2">
                    {[['Minimalist', '/u/demo1'], ['Cyberpunk', '/u/demo2'], ['Corporate', '/u/demo3']].map(([l, to]) => (
                      <li key={l}>
                        <Link to={to} className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1">
                          {l} <ExternalLink className="h-2.5 w-2.5" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-slate-800/60">
              <p className="text-xs text-slate-600">© {new Date().getFullYear()} CodeFolio. All rights reserved.</p>
              <p className="text-xs text-slate-600 font-mono">Built with React + Express + MongoDB</p>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
