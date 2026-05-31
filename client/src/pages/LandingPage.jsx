import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Terminal, 
  Zap, 
  Globe, 
  Eye, 
  Code, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

const LandingPage = () => {
  const features = [
    { icon: Zap, label: '3 Premium Templates', color: 'text-amber-400' },
    { icon: Globe, label: 'Vanity URLs', color: 'text-emerald-400' },
    { icon: Eye, label: 'Live Preview CMS', color: 'text-blue-400' },
    { icon: Code, label: 'Contact Form + Email', color: 'text-purple-400' },
  ];

  // Animation variants for staggered orchestration
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: 'spring', stiffness: 100, damping: 15 } 
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col relative overflow-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Decorative Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none opacity-[0.15] bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.5)_0%,transparent_60%)]" />
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] pointer-events-none opacity-[0.05] blur-[100px] bg-cyan-400 rounded-full" />
      <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] pointer-events-none opacity-[0.05] blur-[100px] bg-purple-500 rounded-full" />

      {/* Header */}
      <header className="w-full px-6 lg:px-16 py-5 flex items-center justify-between border-b border-zinc-800/60 backdrop-blur-md sticky top-0 z-50 bg-[#09090b]/80">
        <Link to="/" className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white group">
          <div className="w-9 h-9 bg-zinc-800 border border-zinc-700 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:border-indigo-500 group-hover:bg-indigo-950/30">
            <Terminal className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
          </div>
          <span className="bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text">CODEFOLIO</span>
        </Link>
        
        <nav className="flex items-center gap-6">
          <Link 
            to="/login" 
            className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            Sign In
          </Link>
          <Link 
            to="/register" 
            className="text-sm font-medium bg-zinc-100 text-zinc-950 px-4 py-2.5 rounded-xl hover:bg-zinc-200 transition-all shadow-md hover:shadow-zinc-100/10 flex items-center gap-1.5 group font-semibold"
          >
            Get Started 
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center z-10 relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-flex mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800/80 text-xs font-medium text-zinc-300 shadow-xl backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span className="tracking-wide uppercase text-[10px] text-zinc-400 font-semibold mr-1">New</span>
              The developer portfolio builder
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1 
            variants={itemVariants}
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white mb-8 tracking-tight leading-[1.1]"
          >
            Your portfolio, <br />
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">
              done right.
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p 
            variants={itemVariants}
            className="text-zinc-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            Stop procrastinating. CodeFolio is a elegant developer CMS that transforms your GitHub projects, 
            bios, and tech stacks into breathtaking web spaces — custom themes, vanity domains, and SEO setup natively.
          </motion.p>

          {/* Feature Pills */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-3 mb-12 max-w-3xl mx-auto"
          >
            {features.map((feature, index) => (
              <div 
                key={index}
                className="inline-flex items-center gap-2.5 px-4 py-2 bg-zinc-900/40 rounded-xl text-sm font-medium text-zinc-300 border border-zinc-800/60 hover:border-zinc-700 hover:bg-zinc-900/90 transition-all duration-300 shadow-sm group cursor-default"
              >
                <feature.icon className={`w-4 h-4 ${feature.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
                <span>{feature.label}</span>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-7 py-3.5 rounded-xl font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:from-indigo-400 hover:to-indigo-500 transition-all duration-300 group"
            >
              Start Building Free 
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/u/demo1"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-zinc-300 bg-zinc-900/50 backdrop-blur-sm px-7 py-3.5 rounded-xl font-semibold hover:text-white hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all duration-300"
            >
              <Globe className="w-4 h-4 text-zinc-400" />
              View Live Demo
            </Link>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full px-6 py-10 text-center border-t border-zinc-900/60 bg-[#09090b]/50 z-10 backdrop-blur-sm">
        <p className="text-sm text-zinc-500 mb-4 tracking-wide">
          © 2026 CodeFolio. Crafted mindfully for developers worldwide.
        </p>
        <div className="flex items-center justify-center gap-6 text-xs font-medium tracking-wider uppercase">
          <Link to="/login" className="text-zinc-500 hover:text-zinc-300 transition-colors">
            Sign In
          </Link>
          <span className="w-1 h-1 rounded-full bg-zinc-800" />
          <Link to="/register" className="text-zinc-500 hover:text-zinc-300 transition-colors">
            Sign Up
          </Link>
          <span className="w-1 h-1 rounded-full bg-zinc-800" />
          <Link to="/api-docs" className="text-zinc-500 hover:text-zinc-300 transition-colors text-indigo-400/80">
            API Playground
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;