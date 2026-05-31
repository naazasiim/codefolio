import React, { useState } from 'react';
import { MapPin, Github, Linkedin, Twitter, FileText, Send, Mail, Check, AlertTriangle } from 'lucide-react';

export default function CorporateLayout({ data, preview = false }) {
  const { username, profile, projects, skills, plan } = data || {};
  const { name, title, bio, location, resumeUrl, socialLinks } = profile || {};

  // Group skills by category
  const skillsByCategory = (skills || []).reduce((acc, skill) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

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
        throw new Error(resData.error || "Failed to deliver contact message.");
      }

      setSuccess("Thank you! Your message has been sent successfully.");
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800 font-sans p-6 md:p-16 selection:bg-slate-200">
      <div className="max-w-4xl mx-auto space-y-12 bg-white border border-slate-200 shadow-xl rounded-2xl p-6 md:p-12 relative overflow-hidden">
        
        {/* Banner element */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        
        {/* Main Header Block */}
        <header className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-slate-100 pb-8 pt-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                {name || username || 'Developer Name'}
              </h1>
              {plan === 'pro' && (
                <span className="text-[10px] bg-gradient-to-r from-indigo-600 to-purple-650 text-white px-3 py-1 rounded-full font-bold uppercase tracking-wider shadow-sm">
                  PRO MEMBER
                </span>
              )}
            </div>
            <p className="text-base md:text-lg font-semibold text-indigo-600 uppercase tracking-wider">
              {title || 'Professional Software Engineer'}
            </p>
            
            {location && (
              <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                <MapPin className="h-4 w-4 text-slate-400" /> {location}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 items-start md:items-end w-full md:w-auto">
            {resumeUrl && (
              <a 
                href={resumeUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-2 text-xs border border-indigo-200 hover:border-indigo-600 text-indigo-600 px-4 py-2 rounded-xl transition-all font-semibold shadow-sm hover:shadow"
              >
                <FileText className="h-4 w-4" /> Download Resume
              </a>
            )}
            
            <div className="flex gap-2">
              {socialLinks?.github && (
                <a href={socialLinks.github} target="_blank" rel="noreferrer" className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 hover:text-indigo-650 transition-colors shadow-sm">
                  <Github className="h-4 w-4" />
                </a>
              )}
              {socialLinks?.linkedin && (
                <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 hover:text-indigo-650 transition-colors shadow-sm">
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
              {socialLinks?.twitter && (
                <a href={socialLinks.twitter} target="_blank" rel="noreferrer" className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 hover:text-indigo-650 transition-colors shadow-sm">
                  <Twitter className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </header>

        {/* Executive Bio */}
        {bio && (
          <section className="space-y-3">
            <h2 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Executive Summary</h2>
            <p className="text-sm md:text-base leading-relaxed text-slate-650 whitespace-pre-line font-light">
              {bio}
            </p>
          </section>
        )}

        {/* Structured Skills Grid */}
        <section className="space-y-6">
          <h2 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Technical Proficiency</h2>
          
          {Object.keys(skillsByCategory).length === 0 ? (
            <p className="text-xs text-slate-400 italic">No proficiencies added.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(skillsByCategory).map(([category, items]) => (
                <div key={category} className="p-5 border border-slate-100 bg-slate-50/50 rounded-xl space-y-3 shadow-sm">
                  <h3 className="text-xs font-bold text-slate-700 border-b border-slate-250/20 pb-1.5 uppercase tracking-wide">
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {items.map((sk, idx) => (
                      <span key={idx} className="text-xs bg-white border border-slate-200 px-3 py-1 rounded-lg text-slate-700 shadow-sm">
                        {sk.name} <span className="text-[10px] text-indigo-600 font-bold ml-1">{sk.level}</span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Featured Projects */}
        <section className="space-y-6">
          <h2 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Featured Projects</h2>

          {(!projects || projects.length === 0) ? (
            <p className="text-xs text-slate-400 italic">No showcased works found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj, i) => (
                <div key={i} className="bg-white border border-slate-200/80 shadow-sm rounded-xl hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
                  {proj.screenshot?.url && (
                    <div className="w-full h-40 overflow-hidden border-b border-slate-100 bg-slate-50">
                      <img 
                        src={proj.screenshot.url} 
                        alt={proj.title} 
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  )}
                  
                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-extrabold text-slate-900 text-base">{proj.title}</h3>
                        <div className="flex gap-2">
                          {proj.repoLink && (
                            <a href={proj.repoLink} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-600 transition-colors">
                              <Github className="h-4.5 w-4.5" />
                            </a>
                          )}
                          {proj.liveLink && (
                            <a href={proj.liveLink} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-600 transition-colors">
                              <ExternalLinkIcon className="h-4.5 w-4.5" />
                            </a>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed font-light">{proj.description}</p>
                    </div>

                    {proj.techStack && proj.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-50">
                        {proj.techStack.map((tech, i) => (
                          <span key={i} className="text-[9px] bg-slate-50 border border-slate-150 px-2 py-0.5 rounded font-medium text-slate-600">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Contact Form Section */}
        <section className="space-y-6 pt-6 border-t border-slate-100">
          <div className="space-y-1">
            <h2 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Contact Request</h2>
            <p className="text-xs text-slate-500 font-light">Send an official inquiry message directly. Responses will be routed securely.</p>
          </div>

          <form onSubmit={handleContactSubmit} className="space-y-4">
            {success && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-150 flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{success}</span>
              </div>
            )}
            {error && (
              <div className="p-3 bg-amber-50 text-amber-800 text-xs rounded-xl border border-amber-150 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="text" 
                required
                placeholder="Full Name" 
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-light"
              />
              <input 
                type="email" 
                required
                placeholder="Business Email" 
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-light"
              />
            </div>
            
            <textarea 
              rows={4}
              required
              placeholder="Inquiry Details..." 
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none font-light leading-relaxed"
            />

            <button 
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-indigo-650 hover:bg-indigo-700 active:scale-[0.99] text-white text-xs font-semibold px-5 py-3 rounded-xl transition-all shadow shadow-indigo-600/10 hover:shadow-md disabled:bg-slate-300 disabled:shadow-none cursor-pointer"
            >
              {loading ? (
                <div className="h-3 w-3 border-2 border-slate-300 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
              <span>{loading ? "Sending Request..." : "Submit Inquiry"}</span>
            </button>
          </form>
        </section>

      </div>
    </div>
  );
}

// Inline fallback for ExternalLink icon to avoid React 19 / Vite import mismatches
function ExternalLinkIcon(props) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}
