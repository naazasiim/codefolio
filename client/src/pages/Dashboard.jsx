import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import {
  User, LayoutGrid, Award, LogOut, Plus, Trash2, Save, CheckCircle,
  Globe, Eye, Cpu, ShieldAlert, Settings, Zap, Mail, ExternalLink,
  Github, Linkedin, Twitter, Monitor, Crown, Loader2, Link2
} from 'lucide-react';

import MinimalistLayout from '../components/templates/MinimalistLayout';
import CyberpunkLayout from '../components/templates/CyberpunkLayout';
import CorporateLayout from '../components/templates/CorporateLayout';

const templateMap = {
  minimalist: MinimalistLayout,
  cyberpunk: CyberpunkLayout,
  corporate: CorporateLayout,
};

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const INPUT_CLASS =
  'w-full bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-colors placeholder-slate-600';
const LABEL_CLASS = 'block text-xs font-semibold text-slate-400 mb-1.5';

// ── Reusable Field ─────────────────────────────────────────────────────────────
function Field({ label, error, children }) {
  return (
    <div className="space-y-1">
      {label && <label className={LABEL_CLASS}>{label}</label>}
      {children}
      {error && <p className="text-[10px] text-rose-400 mt-1">{error}</p>}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [token] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [activeSection, setActiveSection] = useState('profile');
  const [showPreview, setShowPreview] = useState(true);

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Project / Skill add forms
  const [projectForm, setProjectForm] = useState({
    title: '', description: '', techStack: '', repoLink: '', liveLink: ''
  });
  const [skillForm, setSkillForm] = useState({ name: '', category: 'Frontend', level: 'Intermediate' });

  // Live preview data — mirrors the form in real-time
  const [previewData, setPreviewData] = useState(null);

  // React Hook Form for profile
  const { register, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm({
    defaultValues: {
      name: '', title: '', bio: '', location: '', resumeUrl: '',
      github: '', linkedin: '', twitter: '',
      contactEmail: '', templateId: 'minimalist', isPublic: true,
      plan: 'free', customDomain: '',
    }
  });

  // Watch all fields for live preview
  const watchedFields = watch();

  // Sync live preview whenever form values change
  useEffect(() => {
    if (!user) return;
    setPreviewData({
      username: user.username,
      templateId: watchedFields.templateId || user.templateId,
      plan: watchedFields.plan || user.plan,
      isPublic: watchedFields.isPublic,
      profile: {
        name: watchedFields.name,
        title: watchedFields.title,
        bio: watchedFields.bio,
        location: watchedFields.location,
        resumeUrl: watchedFields.resumeUrl,
        socialLinks: {
          github: watchedFields.github,
          linkedin: watchedFields.linkedin,
          twitter: watchedFields.twitter,
        },
      },
      projects: user.projects || [],
      skills: user.skills || [],
    });
  }, [watchedFields, user]);

  // Auto-dismiss notifications
  useEffect(() => {
    if (successMsg) {
      const t = setTimeout(() => setSuccessMsg(''), 3500);
      return () => clearTimeout(t);
    }
  }, [successMsg]);
  useEffect(() => {
    if (errorMsg) {
      const t = setTimeout(() => setErrorMsg(''), 4000);
      return () => clearTimeout(t);
    }
  }, [errorMsg]);

  // Load user data from API
  const loadUser = useCallback(async () => {
    if (!token) { navigate('/login'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Session expired');

      setUser(data);

      // Populate react-hook-form
      reset({
        name: data.profile?.name || '',
        title: data.profile?.title || '',
        bio: data.profile?.bio || '',
        location: data.profile?.location || '',
        resumeUrl: data.profile?.resumeUrl || '',
        github: data.profile?.socialLinks?.github || '',
        linkedin: data.profile?.socialLinks?.linkedin || '',
        twitter: data.profile?.socialLinks?.twitter || '',
        contactEmail: data.contactEmail || '',
        templateId: data.templateId || 'minimalist',
        isPublic: data.isPublic !== undefined ? data.isPublic : true,
        plan: data.plan || 'free',
        customDomain: data.customDomain || '',
      });
    } catch (err) {
      setErrorMsg(err.message);
      localStorage.removeItem('token');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [token, navigate, reset]);

  useEffect(() => { loadUser(); }, [loadUser]);

  // Save profile + config
  const onSaveProfile = async (formData) => {
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      // 1. Update profile
      const r1 = await fetch(`${API_BASE}/api/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: formData.name,
          title: formData.title,
          bio: formData.bio,
          location: formData.location,
          resumeUrl: formData.resumeUrl,
          socialLinks: {
            github: formData.github,
            linkedin: formData.linkedin,
            twitter: formData.twitter,
          },
        }),
      });
      if (!r1.ok) throw new Error((await r1.json()).error || 'Profile update failed');

      // 2. Update config
      const r2 = await fetch(`${API_BASE}/api/profile/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          templateId: formData.templateId,
          isPublic: formData.isPublic,
          contactEmail: formData.contactEmail,
          plan: formData.plan,
          customDomain: formData.plan === 'pro' ? formData.customDomain : '',
        }),
      });
      if (!r2.ok) throw new Error((await r2.json()).error || 'Config update failed');

      setSuccessMsg('All changes saved successfully!');
      loadUser();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Add Project
  const handleAddProject = async (e) => {
    e.preventDefault();
    setErrorMsg(''); setSuccessMsg('');
    try {
      const res = await fetch(`${API_BASE}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...projectForm,
          techStack: projectForm.techStack.split(',').map(s => s.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add project');
      setSuccessMsg('Project added!');
      setProjectForm({ title: '', description: '', techStack: '', repoLink: '', liveLink: '' });
      loadUser();
    } catch (err) { setErrorMsg(err.message); }
  };

  // Delete Project
  const handleDeleteProject = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to delete');
      setSuccessMsg('Project removed!');
      loadUser();
    } catch (err) { setErrorMsg(err.message); }
  };

  // Add Skill
  const handleAddSkill = async (e) => {
    e.preventDefault();
    setErrorMsg(''); setSuccessMsg('');
    try {
      const res = await fetch(`${API_BASE}/api/skills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(skillForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add skill');
      setSuccessMsg('Skill added!');
      setSkillForm({ name: '', category: 'Frontend', level: 'Intermediate' });
      loadUser();
    } catch (err) { setErrorMsg(err.message); }
  };

  // Delete Skill
  const handleDeleteSkill = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/skills/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to delete');
      setSuccessMsg('Skill removed!');
      loadUser();
    } catch (err) { setErrorMsg(err.message); }
  };

  const handleLogout = (e) => {
    if (e) e.preventDefault(); // Stop any ghost bubble click actions
    
    localStorage.removeItem('token'); // Kill the auth session
    
    // 💡 FORCE AN ABSOLUTE ROUTE REDIRECT
    window.location.href = '/'; 
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
          <p className="text-slate-400 text-sm font-mono">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  const isPro = watchedFields.plan === 'pro' || user?.plan === 'pro';
  const publicLink = `/u/${user?.username}`;
  const PreviewLayout = templateMap[watchedFields.templateId] || MinimalistLayout;

  const navItems = [
    { id: 'profile', icon: User, label: 'Profile & Theme' },
    { id: 'projects', icon: LayoutGrid, label: 'Projects' },
    { id: 'skills', icon: Award, label: 'Skills' },
    { id: 'settings', icon: Settings, label: 'Settings & Pro' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">

      {/* ── Top Header ── */}
      <header className="bg-slate-900/60 border-b border-slate-800/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Cpu className="h-4 w-4 text-white" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-extrabold text-white tracking-wider text-sm">CODEFOLIO</span>
              <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">dashboard</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Preview Toggle */}
            <button
              onClick={() => setShowPreview(v => !v)}
              className={`hidden lg:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all font-semibold ${
                showPreview
                  ? 'bg-indigo-500/15 text-indigo-400 border-indigo-500/25 hover:bg-indigo-500/25'
                  : 'bg-slate-800/50 text-slate-400 border-slate-700/50 hover:bg-slate-800'
              }`}
            >
              <Monitor className="h-3.5 w-3.5" />
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>

            <a
              href={publicLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-all font-semibold"
            >
              <Eye className="h-3.5 w-3.5" /> Live Portfolio
            </a>

            <button
              onClick={handleLogout} 
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Body ── */}
      <div className="flex-1 flex overflow-hidden max-w-screen-2xl mx-auto w-full">

        {/* ── Sidebar ── */}
        <aside className="w-56 shrink-0 border-r border-slate-800/60 bg-slate-900/30 flex flex-col p-4 gap-3 hidden md:flex">
          {/* User Card */}
          <div className="bg-slate-900/60 border border-slate-800/60 p-4 rounded-xl text-center space-y-2">
            <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-lg shadow-lg mx-auto">
              {user?.profile?.name ? user.profile.name[0].toUpperCase() : user?.username?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <p className="font-bold text-white text-sm leading-tight">{user?.profile?.name || `@${user?.username}`}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{user?.profile?.title || 'No Title'}</p>
            </div>
            {isPro && (
              <span className="inline-flex items-center gap-1 text-[9px] bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                <Crown className="h-2.5 w-2.5" /> Pro
              </span>
            )}
            <a
              href={publicLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between text-[10px] p-1.5 rounded-lg bg-slate-950 border border-slate-800/80 text-indigo-400 font-mono hover:border-indigo-500/30 transition-colors mt-1"
            >
              <span className="truncate">{user?.username}.codefolio</span>
              <ExternalLink className="h-3 w-3 shrink-0 ml-1" />
            </a>
          </div>

          {/* Nav */}
          <nav className="space-y-1 flex-1">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs transition-all duration-150 text-left ${
                    activeSection === item.id
                      ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/20'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 font-medium'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* ── Workspace Area ── */}
        <div className={`flex-1 flex overflow-hidden ${showPreview ? 'divide-x divide-slate-800/60' : ''}`}>

          {/* ── Forms Panel ── */}
          <div className={`flex flex-col overflow-y-auto ${showPreview ? 'w-full lg:w-[480px] xl:w-[520px] shrink-0' : 'w-full'}`}>
            <div className="flex-1 p-5 space-y-5">

              {/* Notifications */}
              <AnimatePresence>
                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 font-semibold flex items-center gap-2"
                  >
                    <ShieldAlert className="h-4 w-4 shrink-0" /> {errorMsg}
                  </motion.div>
                )}
                {successMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 font-semibold flex items-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4 shrink-0" /> {successMsg}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ══════════════════════════════════════════════════════════
                  SECTION: Profile & Theme
              ══════════════════════════════════════════════════════════ */}
              {activeSection === 'profile' && (
                <form onSubmit={handleSubmit(onSaveProfile)} className="space-y-6">
                  <div>
                    <h2 className="text-base font-bold text-white">Profile & Theme</h2>
                    <p className="text-[11px] text-slate-500 mt-0.5">Your public identity and selected template</p>
                  </div>

                  {/* Name & Title */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Full Name" error={errors.name?.message}>
                      <input
                        {...register('name', { required: 'Name is required', maxLength: { value: 60, message: 'Max 60 chars' } })}
                        placeholder="Alex Rivera"
                        className={INPUT_CLASS}
                      />
                    </Field>
                    <Field label="Professional Title">
                      <input
                        {...register('title')}
                        placeholder="Full Stack Developer"
                        className={INPUT_CLASS}
                      />
                    </Field>
                  </div>

                  {/* Bio */}
                  <Field label="Short Bio">
                    <textarea
                      {...register('bio', { maxLength: { value: 500, message: 'Max 500 characters' } })}
                      rows={4}
                      placeholder="Describe your expertise, passions and what you build..."
                      className={`${INPUT_CLASS} resize-none leading-relaxed`}
                    />
                    <p className="text-[10px] text-slate-600 text-right">{(watchedFields.bio || '').length}/500</p>
                  </Field>

                  {/* Location & Resume */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Location">
                      <input
                        {...register('location')}
                        placeholder="San Francisco, USA"
                        className={INPUT_CLASS}
                      />
                    </Field>
                    <Field label="Resume URL">
                      <input
                        {...register('resumeUrl')}
                        placeholder="https://drive.google.com/..."
                        className={INPUT_CLASS}
                      />
                    </Field>
                  </div>

                  {/* Social Links */}
                  <div className="space-y-3 p-4 bg-slate-900/50 rounded-xl border border-slate-800/60">
                    <h3 className="text-xs font-bold text-slate-300 flex items-center gap-2">
                      <Link2 className="h-4 w-4 text-indigo-400" /> Social Links
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Github className="h-4 w-4 text-slate-500 shrink-0" />
                        <input
                          {...register('github')}
                          placeholder="https://github.com/username"
                          className={INPUT_CLASS}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Linkedin className="h-4 w-4 text-slate-500 shrink-0" />
                        <input
                          {...register('linkedin')}
                          placeholder="https://linkedin.com/in/username"
                          className={INPUT_CLASS}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Twitter className="h-4 w-4 text-slate-500 shrink-0" />
                        <input
                          {...register('twitter')}
                          placeholder="https://twitter.com/username"
                          className={INPUT_CLASS}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Template Picker */}
                  <Field label="Portfolio Theme">
                    <div className="grid grid-cols-3 gap-3">
                      {Object.keys(templateMap).map(t => (
                        <button
                          type="button"
                          key={t}
                          onClick={() => setValue('templateId', t)}
                          className={`p-3 rounded-xl border text-xs font-semibold capitalize transition-all ${
                            watchedFields.templateId === t
                              ? 'border-indigo-500 bg-indigo-500/15 text-indigo-300 shadow-lg shadow-indigo-500/10'
                              : 'border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-600'
                          }`}
                        >
                          <div className={`h-10 rounded-md mb-2 ${
                            t === 'minimalist' ? 'bg-stone-200' :
                            t === 'cyberpunk' ? 'bg-black border border-green-500/40' :
                            'bg-white border border-slate-200'
                          }`} />
                          {t}
                        </button>
                      ))}
                    </div>
                  </Field>

                  {/* Public Toggle */}
                  <div className="flex items-center justify-between p-4 bg-slate-900/60 border border-slate-800/70 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-indigo-400" />
                      <div>
                        <p className="text-sm font-semibold text-white">Public Visibility</p>
                        <p className="text-[10px] text-slate-500">Allow anyone to view your portfolio</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        {...register('isPublic')}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-slate-700 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] disabled:bg-indigo-900 disabled:text-indigo-600 transition-all font-bold text-sm shadow-lg shadow-indigo-600/20"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {saving ? 'Saving...' : 'Save Profile & Theme'}
                  </button>
                </form>
              )}

              {/* ══════════════════════════════════════════════════════════
                  SECTION: Projects
              ══════════════════════════════════════════════════════════ */}
              {activeSection === 'projects' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-base font-bold text-white">Manage Projects</h2>
                    <p className="text-[11px] text-slate-500 mt-0.5">Showcase your best work</p>
                  </div>

                  {/* Add Project */}
                  <form onSubmit={handleAddProject} className="p-5 bg-slate-900/50 border border-slate-800/60 rounded-xl space-y-4">
                    <h3 className="text-xs font-bold text-white flex items-center gap-2">
                      <Plus className="h-4 w-4 text-indigo-400" /> Add New Project
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Project Title *">
                        <input
                          type="text" required value={projectForm.title}
                          onChange={e => setProjectForm({ ...projectForm, title: e.target.value })}
                          placeholder="My Awesome App"
                          className={INPUT_CLASS}
                        />
                      </Field>
                      <Field label="Tech Stack (comma-separated)">
                        <input
                          type="text" value={projectForm.techStack}
                          onChange={e => setProjectForm({ ...projectForm, techStack: e.target.value })}
                          placeholder="React, Node.js, MongoDB"
                          className={INPUT_CLASS}
                        />
                      </Field>
                    </div>

                    <Field label="Description">
                      <textarea
                        rows={3} value={projectForm.description}
                        onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
                        placeholder="What this project does and how it's built..."
                        className={`${INPUT_CLASS} resize-none leading-relaxed`}
                      />
                    </Field>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Repository Link">
                        <input
                          type="url" value={projectForm.repoLink}
                          onChange={e => setProjectForm({ ...projectForm, repoLink: e.target.value })}
                          placeholder="https://github.com/..."
                          className={INPUT_CLASS}
                        />
                      </Field>
                      <Field label="Live Demo Link">
                        <input
                          type="url" value={projectForm.liveLink}
                          onChange={e => setProjectForm({ ...projectForm, liveLink: e.target.value })}
                          placeholder="https://my-app.vercel.app"
                          className={INPUT_CLASS}
                        />
                      </Field>
                    </div>

                    <button
                      type="submit"
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-xs font-bold transition-all active:scale-[0.99] shadow shadow-indigo-500/20"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add Project
                    </button>
                  </form>

                  {/* Project List */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-300">
                      Your Projects ({user?.projects?.length || 0})
                    </h3>
                    {!user?.projects?.length ? (
                      <div className="py-12 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                        No projects yet. Add your first build above.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {user.projects.map(proj => (
                          <div key={proj._id} className="p-4 bg-slate-900/50 border border-slate-800/70 rounded-xl flex justify-between items-start gap-4">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-slate-100 text-sm truncate">{proj.title}</h4>
                              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">{proj.description || 'No description'}</p>
                              {proj.techStack?.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                  {proj.techStack.map((t, i) => (
                                    <span key={i} className="text-[10px] bg-slate-800 px-2 py-0.5 rounded font-mono text-slate-300">{t}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => handleDeleteProject(proj._id)}
                              className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg transition-all shrink-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════════════════════
                  SECTION: Skills
              ══════════════════════════════════════════════════════════ */}
              {activeSection === 'skills' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-base font-bold text-white">Manage Skills</h2>
                    <p className="text-[11px] text-slate-500 mt-0.5">Define your technical expertise</p>
                  </div>

                  <form onSubmit={handleAddSkill} className="p-5 bg-slate-900/50 border border-slate-800/60 rounded-xl space-y-4">
                    <h3 className="text-xs font-bold text-white flex items-center gap-2">
                      <Plus className="h-4 w-4 text-indigo-400" /> Add New Skill
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Field label="Skill Name *">
                        <input
                          type="text" required value={skillForm.name}
                          onChange={e => setSkillForm({ ...skillForm, name: e.target.value })}
                          placeholder="React / Docker / Figma"
                          className={INPUT_CLASS}
                        />
                      </Field>
                      <Field label="Category">
                        <select
                          value={skillForm.category}
                          onChange={e => setSkillForm({ ...skillForm, category: e.target.value })}
                          className={`${INPUT_CLASS} cursor-pointer`}
                        >
                          {['Frontend', 'Backend', 'DevOps', 'Design', 'Other'].map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Level">
                        <select
                          value={skillForm.level}
                          onChange={e => setSkillForm({ ...skillForm, level: e.target.value })}
                          className={`${INPUT_CLASS} cursor-pointer`}
                        >
                          {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map(l => (
                            <option key={l} value={l}>{l}</option>
                          ))}
                        </select>
                      </Field>
                    </div>

                    <button
                      type="submit"
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-xs font-bold transition-all active:scale-[0.99]"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add Skill
                    </button>
                  </form>

                  {/* Skills Grid */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-300">Your Skills ({user?.skills?.length || 0})</h3>
                    {!user?.skills?.length ? (
                      <div className="py-12 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                        No skills yet. Define your stack above.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {user.skills.map(sk => (
                          <div key={sk._id} className="p-3.5 bg-slate-900/50 border border-slate-800/70 rounded-xl flex justify-between items-center gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs shrink-0">
                                {sk.category?.[0] || 'S'}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-slate-100 text-sm truncate">{sk.name}</p>
                                <p className="text-[10px] text-slate-500">{sk.category} · {sk.level}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteSkill(sk._id)}
                              className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg transition-all shrink-0"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════════════════════
                  SECTION: Settings & Pro
              ══════════════════════════════════════════════════════════ */}
              {activeSection === 'settings' && (
                <form onSubmit={handleSubmit(onSaveProfile)} className="space-y-6">
                  <div>
                    <h2 className="text-base font-bold text-white">Settings & Pro Features</h2>
                    <p className="text-[11px] text-slate-500 mt-0.5">Contact email, custom domains, and plan</p>
                  </div>

                  {/* Contact Email */}
                  <div className="p-5 bg-slate-900/50 border border-slate-800/60 rounded-xl space-y-4">
                    <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-indigo-400" /> Contact Form Email
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Messages from your portfolio contact form will be privately forwarded to this email. Your email is never exposed publicly.
                    </p>
                    <Field label="Email to receive contact messages">
                      <input
                        {...register('contactEmail')}
                        type="email"
                        placeholder="you@example.com"
                        className={INPUT_CLASS}
                      />
                    </Field>
                  </div>

                  {/* Pro Plan Toggle */}
                  <div className={`p-5 border rounded-xl space-y-4 transition-all ${
                    isPro ? 'bg-gradient-to-br from-amber-500/5 to-orange-500/5 border-amber-500/20' : 'bg-slate-900/50 border-slate-800/60'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                          <Crown className="h-4 w-4 text-amber-400" /> Pro Plan
                        </h3>
                        <p className="text-[11px] text-slate-500">Unlock custom domains and Pro badge</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={watchedFields.plan === 'pro'}
                          onChange={e => setValue('plan', e.target.checked ? 'pro' : 'free')}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-slate-700 rounded-full peer peer-checked:bg-amber-500 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                      </label>
                    </div>

                    {/* Pro Features */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {['Custom domain mapping', 'Pro badge on portfolio', 'Priority support', 'Advanced analytics'].map(feat => (
                        <div key={feat} className={`flex items-center gap-2 text-[11px] ${isPro ? 'text-amber-300' : 'text-slate-600'}`}>
                          <Zap className={`h-3 w-3 shrink-0 ${isPro ? 'text-amber-400' : 'text-slate-700'}`} />
                          {feat}
                        </div>
                      ))}
                    </div>

                    {/* Custom Domain (only shown for Pro) */}
                    {isPro && (
                      <div className="pt-2 border-t border-amber-500/15 space-y-3">
                        <Field label="Custom Domain (e.g. john.dev)">
                          <input
                            {...register('customDomain')}
                            placeholder="yourname.dev"
                            className={INPUT_CLASS}
                          />
                        </Field>
                        <p className="text-[10px] text-slate-600 leading-relaxed">
                          Point your domain's DNS CNAME to <code className="text-indigo-400 bg-slate-900 px-1 py-0.5 rounded text-[10px]">codefolio.app</code> and enter your domain above.
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] disabled:bg-indigo-900 disabled:text-indigo-600 transition-all font-bold text-sm shadow-lg shadow-indigo-600/20"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {saving ? 'Saving...' : 'Save Settings'}
                  </button>
                </form>
              )}

            </div>
          </div>

          {/* ── Live Preview Panel ── */}
          {showPreview && (
            <div className="flex-1 hidden lg:flex flex-col overflow-hidden bg-slate-950 min-w-0">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800/60 bg-slate-900/40 shrink-0">
                <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
                  <Monitor className="h-4 w-4 text-indigo-400" /> Live Preview
                  <span className="text-[10px] text-slate-600 font-normal ml-1">(updates as you type)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
                </div>
              </div>

              {/* Preview frame */}
              <div className="flex-1 overflow-y-auto">
                {previewData ? (
                  <div className="origin-top-left" style={{ transform: 'scale(0.85)', transformOrigin: 'top center', minHeight: '115%' }}>
                    <PreviewLayout data={previewData} preview={true} />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-600 text-sm">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading preview...
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}