import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Cpu, Terminal, ArrowRight, Code, Zap, Shield, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import Authentication from './pages/Authentication';
import ResetPassword from './pages/ResetPassword';
import PortfolioView from './pages/PortfolioView';

// ── Feature badge component ────────────────────────────────────────────────────
function FeatureBadge({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/60 border border-slate-800/80 rounded-full text-xs text-slate-400 font-medium">
      <Icon className="h-3.5 w-3.5 text-indigo-400" />
      {label}
    </div>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-900/20 rounded-full blur-3xl pointer-events-none" />

      {/* Navbar */}
      <nav className="max-w-7xl w-full mx-auto px-6 py-5 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Cpu className="h-5 w-5 text-white" />
          </div>
          <span className="font-extrabold tracking-widest text-white text-sm">CODEFOLIO</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-800/50">
            Sign In
          </Link>
          <Link
            to="/register"
            className="text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-4 py-2 rounded-xl transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30"
          >
            Get Started →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12 md:py-20 relative z-10 space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="space-y-7"
        >
          {/* Tagline pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-400 font-mono font-semibold"
          >
            <Terminal className="h-3.5 w-3.5 animate-pulse" />
            The developer portfolio builder
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.05]">
            Your portfolio,{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              built in minutes.
            </span>
          </h1>

          <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed font-light">
            Stop procrastinating. CodeFolio is a no-code CMS that transforms your GitHub links, bios, and skill tags into
            stunning developer portfolios — with multiple themes, vanity URLs, and SEO built in.
          </p>
        </motion.div>

        {/* Feature badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-3"
        >
          <FeatureBadge icon={Zap} label="3 Premium Templates" />
          <FeatureBadge icon={Globe} label="Vanity URLs" />
          <FeatureBadge icon={Shield} label="Live Preview CMS" />
          <FeatureBadge icon={Code} label="Contact Form + Email" />
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.45 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Link
            to="/register"
            className="group flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold py-3.5 px-7 rounded-xl text-sm transition-all duration-200 shadow-xl shadow-indigo-600/20 hover:shadow-indigo-500/30"
          >
            Start Building Free
            <ArrowRight className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            to="/u/demo1"
            className="flex items-center gap-2 bg-slate-900/80 hover:bg-slate-800/80 border border-slate-700/60 hover:border-slate-600 text-slate-300 font-bold py-3.5 px-7 rounded-xl text-sm transition-all"
          >
            <Globe className="h-4 w-4" /> View Demo Portfolio
          </Link>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto px-6 py-5 border-t border-slate-900/80 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600 gap-3 relative z-10">
        <span>© {new Date().getFullYear()} CodeFolio. All rights reserved.</span>
        <div className="flex gap-5">
          <Link to="/login" className="hover:text-slate-400 transition-colors">Sign In</Link>
          <Link to="/register" className="hover:text-slate-400 transition-colors">Sign Up</Link>
          <Link to="/authentication" className="hover:text-slate-400 transition-colors">API Playground</Link>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/authentication" element={<Authentication />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          {/* Public portfolio routes */}
          <Route path="/u/:username" element={<PortfolioView />} />
          {/* Vanity shortcut route — mirrors /u/:username */}
          <Route path="/:username" element={<PortfolioView />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
