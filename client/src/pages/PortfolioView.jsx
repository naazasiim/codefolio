import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ShieldAlert, ArrowLeft, Loader2 } from 'lucide-react';

import MinimalistLayout from '../components/templates/MinimalistLayout';
import CyberpunkLayout from '../components/templates/CyberpunkLayout';
import CorporateLayout from '../components/templates/CorporateLayout';

// ── Template Engine Map ────────────────────────────────────────────────────────
const templateMap = {
  minimalist: MinimalistLayout,
  cyberpunk: CyberpunkLayout,
  corporate: CorporateLayout,
};

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function PortfolioView() {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPortfolio = async () => {
      setLoading(true);
      setError('');
      try {
        // Check if current hostname is a custom domain (not localhost / 127.0.0.1)
        const hostname = window.location.hostname;
        const isCustomDomain =
          hostname !== 'localhost' &&
          hostname !== '127.0.0.1' &&
          !hostname.includes('localhost') &&
          !hostname.includes('5173');

        let res;
        if (isCustomDomain && !username) {
          // Resolve portfolio by custom domain
          res = await fetch(`${API_BASE}/u/by-domain/resolve?domain=${encodeURIComponent(hostname)}`);
        } else {
          // Standard vanity URL lookup by username
          res = await fetch(`${API_BASE}/u/${username}`);
        }

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.error || 'Failed to load portfolio');
        }
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [username]);

  // ── Loading State ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center font-sans text-slate-100">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
          <p className="text-slate-400 text-sm font-mono animate-pulse">
            Fetching portfolio data...
          </p>
        </div>
      </div>
    );
  }

  // ── Error State ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans text-slate-100">
        <Helmet>
          <title>Portfolio Not Found | CodeFolio</title>
        </Helmet>
        <div className="max-w-md w-full text-center space-y-5 bg-slate-900/40 border border-slate-800 p-8 rounded-2xl backdrop-blur-xl">
          <div className="h-12 w-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-400">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Portfolio Unavailable</h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">{error}</p>
          </div>
          <div className="pt-4 border-t border-slate-800">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to CodeFolio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Render Template ────────────────────────────────────────────────────────
  const { templateId, profile } = data || {};
  const { name, bio, title } = profile || {};

  const pageTitle = name
    ? `${name} | ${title ? title + ' | ' : ''}CodeFolio`
    : `${username} | CodeFolio`;

  const metaDescription = bio
    ? bio.slice(0, 155) + (bio.length > 155 ? '...' : '')
    : `${name || username}'s developer portfolio built with CodeFolio.`;

  // Pick the layout from the template map, falling back to Minimalist
  const PortfolioLayout = templateMap[templateId] || MinimalistLayout;

  return (
    <>
      {/* ── SEO Head Tags ── */}
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="profile" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={metaDescription} />
      </Helmet>

      {/* ── Portfolio Layout ── */}
      <PortfolioLayout data={data} preview={false} />
    </>
  );
}
