import React, { useState } from 'react';
import { Terminal, MapPin, Github, Linkedin, Twitter, FileText, Send, ShieldCheck, ShieldAlert } from 'lucide-react';

export default function CyberpunkLayout({ data, preview = false }) {
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
      setSuccess("SYSTEM MESSAGE: Secure package dispatched to host (Simulation)!");
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
        throw new Error(resData.error || "Package transmission failed.");
      }

      setSuccess("SYSTEM SUCCESS: Secure notification dispatched successfully.");
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setError(`CRITICAL FAULT: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-black text-green-400 font-mono p-6 md:p-12 relative selection:bg-green-500/30 selection:text-green-200">
      {/* Scanline CRT overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] z-10" />
      
      <div className="max-w-5xl mx-auto space-y-12 relative z-0">
        
        {/* Header Panel */}
        <header className="border-2 border-green-500/40 bg-black/80 p-6 md:p-8 rounded-xl shadow-[0_0_15px_rgba(34,197,94,0.15)] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-1.5 w-1/4 bg-gradient-to-r from-green-500 to-cyan-500 animate-pulse" />
          <div className="space-y-2">
            <div className="text-[10px] text-green-500/60 tracking-widest uppercase font-bold flex items-center gap-2">
              <Terminal className="h-3.5 w-3.5 animate-pulse text-cyan-400" /> 
              <span>System Interface // Active</span>
              {plan === 'pro' && (
                <span className="bg-cyan-500/20 text-cyan-400 px-2 py-0.5 border border-cyan-500/45 rounded text-[8px] tracking-widest animate-pulse font-mono">
                  [PRO_LEVEL]
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tighter text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]">
              {name || username || 'OPERATOR'}
            </h1>
            <p className="text-xs font-semibold text-cyan-400 tracking-wide uppercase">
              &gt; {title || 'Netrunner'}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3 text-[11px]">
            {location && (
              <div className="flex items-center gap-2 border border-green-500/20 px-3 py-1.5 bg-green-500/5 rounded">
                <MapPin className="h-3.5 w-3.5 text-cyan-400" /> {location}
              </div>
            )}
            {resumeUrl && (
              <a 
                href={resumeUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-2 border border-cyan-500/20 hover:border-cyan-400 px-3 py-1.5 bg-cyan-500/5 rounded text-cyan-400 transition-all font-semibold"
              >
                <FileText className="h-3.5 w-3.5" /> [RESUME_DIR]
              </a>
            )}
          </div>
        </header>

        {/* Main Workspace Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column: Bio & Skills */}
          <div className="md:col-span-1 space-y-8">
            
            {/* Bio Card */}
            {bio && (
              <section className="border-2 border-green-500/40 bg-black/80 p-6 rounded-xl shadow-[0_0_15px_rgba(34,197,94,0.15)] space-y-4">
                <h2 className="text-xs uppercase font-bold text-white border-b border-green-500/20 pb-2 tracking-widest flex items-center gap-2">
                  <span>[01_CORE_BIO]</span>
                </h2>
                <p className="text-xs leading-relaxed text-green-300 whitespace-pre-line">
                  {bio}
                </p>
              </section>
            )}

            {/* Skills Card */}
            <section className="border-2 border-green-500/40 bg-black/80 p-6 rounded-xl shadow-[0_0_15px_rgba(34,197,94,0.15)] space-y-4">
              <h2 className="text-xs uppercase font-bold text-white border-b border-green-500/20 pb-2 tracking-widest flex items-center gap-2">
                <span>[02_SYS_SKILLS]</span>
              </h2>
              {(!skills || skills.length === 0) ? (
                <p className="text-xs text-green-500/40 italic">No subsystems found.</p>
              ) : (
                <div className="space-y-4">
                  {skills.map((sk, i) => (
                    <div key={i} className="text-xs">
                      <div className="flex justify-between mb-1 text-[11px] text-green-300">
                        <span>{sk.name}</span>
                        <span className="text-cyan-400 font-semibold">{sk.level}</span>
                      </div>
                      <div className="w-full h-2 bg-green-950 border border-green-500/20 rounded-sm">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-cyan-500 shadow-[0_0_8px_rgba(34,197,94,0.7)]" 
                          style={{ 
                            width: sk.level === 'Expert' ? '100%' :
                                   sk.level === 'Advanced' ? '75%' :
                                   sk.level === 'Intermediate' ? '50%' : '25%' 
                          }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Center & Right Column: Projects & Contact */}
          <div className="md:col-span-2 space-y-8">
            
            {/* Projects Card */}
            <section className="border-2 border-green-500/40 bg-black/80 p-6 rounded-xl shadow-[0_0_15px_rgba(34,197,94,0.15)] space-y-6">
              <h2 className="text-xs uppercase font-bold text-white border-b border-green-500/20 pb-2 tracking-widest flex items-center gap-2">
                <span>[03_PROJECT_REGISTRY]</span>
              </h2>

              {(!projects || projects.length === 0) ? (
                <p className="text-xs text-green-500/40 italic">No project units registered.</p>
              ) : (
                <div className="space-y-8">
                  {projects.map((proj, i) => (
                    <div key={i} className="border border-green-500/30 p-5 rounded bg-black/40 hover:border-cyan-400 hover:shadow-[0_0_12px_rgba(34,211,238,0.1)] transition-all space-y-4 group">
                      
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                          <span className="text-green-500 font-mono">&gt;</span> {proj.title}
                        </h3>
                        <div className="flex gap-3">
                          {proj.repoLink && (
                            <a href={proj.repoLink} target="_blank" rel="noreferrer" className="text-green-400 hover:text-white transition-colors">
                              [CODE]
                            </a>
                          )}
                          {proj.liveLink && (
                            <a href={proj.liveLink} target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-white transition-colors">
                              [LIVE]
                            </a>
                          )}
                        </div>
                      </div>

                      {proj.screenshot?.url && (
                        <div className="w-full max-h-48 overflow-hidden rounded border border-green-500/20 bg-black group-hover:border-cyan-500/30 transition-colors">
                          <img 
                            src={proj.screenshot.url} 
                            alt={proj.title} 
                            className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                            loading="lazy"
                          />
                        </div>
                      )}

                      <p className="text-xs text-green-300/80 leading-relaxed">{proj.description}</p>
                      
                      {proj.techStack && proj.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {proj.techStack.map((tech, i) => (
                            <span key={i} className="text-[10px] border border-green-500/20 px-2 py-0.5 rounded text-green-400 font-mono">
                              #{tech.toLowerCase()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Terminal Contact Form Card */}
            <section className="border-2 border-green-500/40 bg-black/80 p-6 rounded-xl shadow-[0_0_15px_rgba(34,197,94,0.15)] space-y-6">
              <h2 className="text-xs uppercase font-bold text-white border-b border-green-500/20 pb-2 tracking-widest flex items-center gap-2">
                <span>[04_SECURE_COMMS]</span>
              </h2>

              <form onSubmit={handleContactSubmit} className="space-y-4 text-xs text-green-400">
                {success && (
                  <div className="p-3 bg-green-500/10 text-green-400 rounded border border-green-500/30 flex items-center gap-2 font-mono">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-cyan-400 animate-pulse" />
                    <span>{success}</span>
                  </div>
                )}
                {error && (
                  <div className="p-3 bg-red-500/10 text-red-400 rounded border border-red-500/30 flex items-center gap-2 font-mono">
                    <ShieldAlert className="h-4 w-4 shrink-0 animate-bounce" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-green-500/50">NAME_INPUT:</span>
                    <input 
                      type="text" 
                      required
                      placeholder="ENTER NAME" 
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-black border border-green-500/30 rounded p-2.5 text-xs text-green-400 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_8px_rgba(34,211,238,0.2)] font-mono uppercase placeholder-green-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-green-500/50">EMAIL_INPUT:</span>
                    <input 
                      type="email" 
                      required
                      placeholder="ENTER EMAIL" 
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-black border border-green-500/30 rounded p-2.5 text-xs text-green-400 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_8px_rgba(34,211,238,0.2)] font-mono uppercase placeholder-green-800"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-green-500/50">PACKET_payload_text:</span>
                  <textarea 
                    rows={4}
                    required
                    placeholder="ENTER TRANSACTION MESSAGE PAYLOAD..." 
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-black border border-green-500/30 rounded p-2.5 text-xs text-green-400 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_8px_rgba(34,211,238,0.2)] resize-none font-mono placeholder-green-800"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 border-2 border-green-500/40 hover:border-cyan-400 hover:text-white bg-green-500/5 active:scale-[0.98] text-green-400 font-bold px-4 py-2.5 rounded transition-all disabled:border-green-950 disabled:text-green-900 cursor-pointer uppercase tracking-wider"
                >
                  {loading ? (
                    <div className="h-3 w-3 border-2 border-green-500 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="h-3.5 w-3.5" />
                  )}
                  <span>{loading ? "TRANSMITTING..." : "DISPATCH_PACKET"}</span>
                </button>
              </form>
            </section>
          </div>
        </div>

        {/* Footer */}
        <footer className="pt-8 border-t border-green-500/20 flex justify-between items-center text-[10px] text-green-500/40 uppercase">
          <span>Sys.v.1.0.0 // connection secure</span>
          <div className="flex gap-4">
            {socialLinks?.github && <a href={socialLinks.github} target="_blank" rel="noreferrer" className="hover:text-green-300">GH_NODE</a>}
            {socialLinks?.linkedin && <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="hover:text-green-300">LI_NODE</a>}
            {socialLinks?.twitter && <a href={socialLinks.twitter} target="_blank" rel="noreferrer" className="hover:text-green-300">TW_NODE</a>}
          </div>
        </footer>

      </div>
    </div>
  );
}
