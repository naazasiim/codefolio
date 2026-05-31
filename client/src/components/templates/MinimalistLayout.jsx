import React, { useState } from 'react';
import { MapPin, Github, Linkedin, Twitter, FileText, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function MinimalistLayout({ data, preview = false }) {
  const { username, profile, projects, skills, plan } = data || {};
  const { name, title, bio, location, resumeUrl, socialLinks } = profile || {};

  // Contact Form State
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (preview) {
      setSuccess("Simulated: Message sent successfully (Preview Mode)!");
      setForm({ name: '', email: '', message: '' });
      setTimeout(() => setSuccess(''), 3000);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiBase}/u/${username}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "Failed to send message.");
      }

      setSuccess("Your message has been delivered to the developer!");
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-stone-50 text-stone-900 font-sans px-6 py-12 md:py-20 selection:bg-stone-200">
      <div className="max-w-2xl mx-auto space-y-16">
        
        {/* Header Name & Title */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-baseline gap-3">
            <h1 className="text-4xl font-light tracking-tight text-stone-950">{name || username || 'Developer'}</h1>
            {plan === 'pro' && (
              <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse">
                PRO
              </span>
            )}
          </div>
          <p className="text-sm text-stone-500 italic font-serif">{title || 'Software Engineer'}</p>
          
          <div className="flex flex-wrap gap-4 text-xs text-stone-400">
            {location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {location}
              </div>
            )}
            {resumeUrl && (
              <a 
                href={resumeUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-1 hover:text-stone-750 transition-colors font-medium"
              >
                <FileText className="h-3.5 w-3.5" /> Resume
              </a>
            )}
          </div>
        </header>

        {/* Bio */}
        {bio && (
          <section className="space-y-3">
            <h2 className="text-[10px] uppercase tracking-widest font-bold text-stone-400 border-b border-stone-200 pb-1">About</h2>
            <p className="text-sm leading-relaxed text-stone-700 font-serif whitespace-pre-line">
              {bio}
            </p>
          </section>
        )}

        {/* Skills list */}
        <section className="space-y-4">
          <h2 className="text-[10px] uppercase tracking-widest font-bold text-stone-400 border-b border-stone-200 pb-1">Expertise</h2>
          {(!skills || skills.length === 0) ? (
            <p className="text-xs text-stone-400 italic">No expertise added.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {skills.map((sk, i) => (
                <span key={i} className="text-xs bg-stone-200/50 border border-stone-300/30 px-3 py-1 rounded-full text-stone-800">
                  {sk.name} <span className="text-[10px] text-stone-400 italic ml-1">({sk.level})</span>
                </span>
              ))}
            </div>
          )}
        </section>

        {/* Projects list */}
        <section className="space-y-8">
          <h2 className="text-[10px] uppercase tracking-widest font-bold text-stone-400 border-b border-stone-200 pb-1">Works</h2>
          
          {(!projects || projects.length === 0) ? (
            <p className="text-xs text-stone-400 italic">No registered work.</p>
          ) : (
            <div className="space-y-12">
              {projects.map((proj, i) => (
                <div key={i} className="space-y-3 group">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold text-stone-900 group-hover:text-stone-750 transition-colors text-sm">
                      {proj.title}
                    </h3>
                    <div className="flex gap-3 text-xs">
                      {proj.repoLink && (
                        <a href={proj.repoLink} target="_blank" rel="noreferrer" className="text-stone-400 hover:text-stone-700 transition-colors font-medium">
                          Code
                        </a>
                      )}
                      {proj.liveLink && (
                        <a href={proj.liveLink} target="_blank" rel="noreferrer" className="text-stone-400 hover:text-stone-700 transition-colors font-medium">
                          Demo
                        </a>
                      )}
                    </div>
                  </div>
                  
                  {proj.screenshot?.url && (
                    <div className="w-full max-h-56 overflow-hidden rounded-lg border border-stone-200/80 bg-stone-100">
                      <img 
                        src={proj.screenshot.url} 
                        alt={proj.title} 
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-350"
                        loading="lazy"
                      />
                    </div>
                  )}

                  <p className="text-xs text-stone-600 leading-relaxed font-serif">{proj.description}</p>
                  
                  {proj.techStack && proj.techStack.length > 0 && (
                    <p className="text-[10px] font-mono text-stone-400">
                      {proj.techStack.join(" / ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Contact Form Section */}
        <section className="space-y-6 pt-4 border-t border-stone-200">
          <div className="space-y-1">
            <h2 className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Get In Touch</h2>
            <p className="text-xs text-stone-500 font-serif">Drop a message. The developer will receive an email notification.</p>
          </div>

          <form onSubmit={handleContactSubmit} className="space-y-4">
            {success && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded border border-emerald-200/50 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{success}</span>
              </div>
            )}
            {error && (
              <div className="p-3 bg-rose-50 text-rose-800 text-xs rounded border border-rose-200/50 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="text" 
                required
                placeholder="Name" 
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-white border border-stone-200 rounded p-2.5 text-xs text-stone-800 focus:outline-none focus:border-stone-450 focus:ring-1 focus:ring-stone-400 font-serif"
              />
              <input 
                type="email" 
                required
                placeholder="Email Address" 
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-white border border-stone-200 rounded p-2.5 text-xs text-stone-800 focus:outline-none focus:border-stone-450 focus:ring-1 focus:ring-stone-400 font-serif"
              />
            </div>
            
            <textarea 
              rows={4}
              required
              placeholder="Your Message..." 
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full bg-white border border-stone-200 rounded p-2.5 text-xs text-stone-800 focus:outline-none focus:border-stone-450 focus:ring-1 focus:ring-stone-400 resize-none font-serif leading-relaxed"
            />

            <button 
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-stone-900 hover:bg-stone-850 active:scale-[0.99] text-stone-100 text-xs font-semibold px-4 py-2.5 rounded transition-all disabled:bg-stone-400 cursor-pointer"
            >
              {loading ? (
                <div className="h-3.5 w-3.5 border-2 border-stone-400 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
              <span>{loading ? "Sending..." : "Send Message"}</span>
            </button>
          </form>
        </section>

        {/* Social connections */}
        <footer className="pt-8 border-t border-stone-250/60 flex justify-between items-center text-xs text-stone-400">
          <span>Connected channels</span>
          <div className="flex gap-4">
            {socialLinks?.github && (
              <a href={socialLinks.github} target="_blank" rel="noreferrer" className="hover:text-stone-700 transition-colors">
                Github
              </a>
            )}
            {socialLinks?.linkedin && (
              <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="hover:text-stone-700 transition-colors">
                LinkedIn
              </a>
            )}
            {socialLinks?.twitter && (
              <a href={socialLinks.twitter} target="_blank" rel="noreferrer" className="hover:text-stone-700 transition-colors">
                Twitter
              </a>
            )}
          </div>
        </footer>

      </div>
    </div>
  );
}
