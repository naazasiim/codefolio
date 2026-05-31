import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, LogIn, LogOut, User, Key, 
  HelpCircle, RefreshCw, CheckCircle, Send, Code, Terminal 
} from 'lucide-react';

const BASE_URL = "http://localhost:5000/api/auth";

const AUTH_ACTIONS = [
  { id: 1, name: 'Register', method: 'POST', endpoint: '/register', icon: UserPlus, payload: { email: "naaz@example.com", password: "123456", username: "naaz" } },
  { id: 2, name: 'Login', method: 'POST', endpoint: '/login', icon: LogIn, payload: { email: "naaz@example.com", password: "123456" } },
  { id: 3, name: 'Logout', method: 'POST', endpoint: '/logout', icon: LogOut, requiresToken: true, note: "Frontend action: localStorage.removeItem('token')" },
  { id: 4, name: 'Get Current User', method: 'GET', endpoint: '/me', icon: User, requiresToken: true },
  { id: 5, name: 'Change Password', method: 'PUT', endpoint: '/change-password', icon: Key, requiresToken: true, payload: { currentPassword: "123456", newPassword: "abcdef" } },
  { id: 6, name: 'Forgot Password', method: 'POST', endpoint: '/forgot-password', icon: HelpCircle, payload: { email: "naaz@example.com" } },
  { id: 7, name: 'Reset Password', method: 'POST', endpoint: '/reset-password/:token', icon: RefreshCw, payload: { password: "newpassword123" }, hasParam: true, paramName: "token" },
  { id: 8, name: 'Verify JWT Token', method: 'GET', endpoint: '/verify', icon: CheckCircle, requiresToken: true },
  { id: 9, name: 'Refresh Token', method: 'POST', endpoint: '/refresh-token', icon: RefreshCw, payload: { refreshToken: "YOUR_REFRESH_TOKEN" } },
];

export default function AuthPlayground() {
  const [activeAction, setActiveAction] = useState(AUTH_ACTIONS[0]);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [urlParam, setUrlParam] = useState('abc123token');
  const [customPayload, setCustomPayload] = useState(JSON.stringify(AUTH_ACTIONS[0].payload || {}, null, 2));
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  // Sync payload when changing tabs
  const handleActionChange = (action) => {
    setActiveAction(action);
    setResponse(null);
    setCustomPayload(action.payload ? JSON.stringify(action.payload, null, 2) : '');
  };

  const executeAction = async () => {
    setLoading(true);
    setResponse(null);

    let url = `${BASE_URL}${activeAction.endpoint}`;
    if (activeAction.hasParam) {
      url = url.replace(`:${activeAction.paramName}`, urlParam);
    }

    const headers = { 'Content-Type': 'application/json' };
    if (activeAction.requiresToken && token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
      method: activeAction.method,
      headers,
    };

    if (activeAction.method !== 'GET' && customPayload) {
      try {
        options.body = JSON.stringify(JSON.parse(customPayload));
      } catch (e) {
        setResponse({ error: "Invalid JSON payload structure." });
        setLoading(false);
        return;
      }
    }

    try {
      // Logic for simulating frontend changes
      if (activeAction.id === 3) {
        localStorage.removeItem('token');
        setToken('');
      }

      const res = await fetch(url, options);
      const data = await res.json();
      
      // Auto-save token if login or register returns one
      if (data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
      }
      
      setResponse({ status: res.status, data });
    } catch (err) {
      setResponse({ error: err.message || "Failed to connect to the backend server." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans selection:bg-indigo-500/30">
      
      {/* Sidebar Navigation */}
      <aside className="w-80 bg-slate-900/50 border-r border-slate-800/60 p-6 flex flex-col justify-between hidden md:flex backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Code className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-md tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Auth Control Hub</h1>
              <p className="text-xs text-slate-500 font-medium">9 Actions • Complete Suite</p>
            </div>
          </div>

          <div className="space-y-1">
            {AUTH_ACTIONS.map((action) => {
              const Icon = action.icon;
              const isActive = activeAction.id === action.id;
              return (
                <button
                  key={action.id}
                  onClick={() => handleActionChange(action)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group ${
                    isActive 
                      ? 'bg-indigo-600 text-white font-medium shadow-md shadow-indigo-600/10' 
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-400'}`} />
                    <span>{action.name}</span>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider ${
                    action.method === 'POST' ? 'bg-emerald-500/10 text-emerald-400' :
                    action.method === 'GET' ? 'bg-sky-500/10 text-sky-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {action.method}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Global Token Input */}
        <div className="bg-slate-900/80 border border-slate-800/80 p-4 rounded-xl space-y-2">
          <label className="text-xs font-semibold tracking-wider uppercase text-slate-400 flex items-center gap-2">
            <Key className="h-3 w-3 text-indigo-400" /> Environment JWT Token
          </label>
          <input 
            type="text" 
            value={token}
            onChange={(e) => { setToken(e.target.value); localStorage.setItem('token', e.target.value); }}
            placeholder="No token saved. Log in or paste here..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 font-mono transition-all"
          />
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col p-6 lg:p-10 max-w-7xl mx-auto w-full overflow-y-auto">
        
        {/* Dynamic header title */}
        <div className="mb-8">
          <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Interactive API Playground</div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">{activeAction.name}</h2>
          <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-xs bg-slate-900 border border-slate-800 p-2.5 rounded-lg w-fit text-slate-300">
            <span className={`px-2 py-0.5 rounded font-bold ${
              activeAction.method === 'POST' ? 'bg-emerald-500/20 text-emerald-400' :
              activeAction.method === 'GET' ? 'bg-sky-500/20 text-sky-400' : 'bg-amber-500/20 text-amber-400'
            }`}>{activeAction.method}</span>
            <span className="text-slate-500">{BASE_URL}</span>
            <span className="text-white font-medium">{activeAction.endpoint}</span>
          </div>
        </div>

        {/* Workspace Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start flex-1">
          
          {/* Left Block: Configuration */}
          <div className="space-y-6">
            <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 backdrop-blur-md space-y-5">
              <h3 className="text-sm font-semibold text-slate-200 tracking-wide flex items-center gap-2 border-b border-slate-800/60 pb-3">
                <Terminal className="h-4 w-4 text-indigo-400" /> Request Parameters
              </h3>

              {/* Dynamic URL parameters input if route has dynamic tokens */}
              {activeAction.hasParam && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400">Route URL Parameter (:{activeAction.paramName})</label>
                  <input 
                    type="text" 
                    value={urlParam} 
                    onChange={(e) => setUrlParam(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-indigo-300 font-mono focus:outline-none focus:border-indigo-500" 
                  />
                </div>
              )}

              {/* Body Editor */}
              {activeAction.payload ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-400">JSON Request Body</label>
                    <span className="text-[10px] text-slate-500">Editable</span>
                  </div>
                  <textarea
                    rows={6}
                    value={customPayload}
                    onChange={(e) => setCustomPayload(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-emerald-400 font-mono focus:outline-none focus:border-indigo-500 leading-relaxed shadow-inner"
                  />
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                  No request body payload required for this action.
                </div>
              )}

              {/* Security Context Header Indicator */}
              <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-950 border border-slate-800/60 text-slate-400">
                <span>Requires Auth Header:</span>
                <span className={`font-semibold ${activeAction.requiresToken ? 'text-amber-400' : 'text-slate-500'}`}>
                  {activeAction.requiresToken ? '✓ Yes (Bearer Token)' : '✕ No'}
                </span>
              </div>

              {/* Action specific code notes */}
              {activeAction.note && (
                <div className="p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-xl text-xs text-indigo-300 leading-relaxed">
                  <strong>Note:</strong> {activeAction.note}
                </div>
              )}

              {/* Big Trigger Button */}
              <button
                onClick={executeAction}
                disabled={loading}
                className="w-full relative group overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-[0.99] text-white font-semibold py-3.5 px-4 rounded-xl text-sm transition-all duration-200 shadow-xl shadow-indigo-500/10 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Execute Request</span>
                    <Send className="h-4 w-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Block: Live Response Screen */}
          <div className="h-full flex flex-col">
            <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 flex-1 flex flex-col backdrop-blur-md min-h-[400px]">
              <div className="flex justify-between items-center border-b border-slate-800/60 pb-3 mb-4">
                <h3 className="text-sm font-semibold text-slate-200 tracking-wide flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-purple-400" /> Response Terminal
                </h3>
                {response?.status && (
                  <span className={`text-xs px-2 py-0.5 rounded font-mono font-bold ${
                    response.status >= 200 && response.status < 300 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    Status: {response.status}
                  </span>
                )}
              </div>

              {/* Animated Response Body */}
              <div className="flex-1 bg-slate-950 border border-slate-800/80 rounded-xl p-4 font-mono text-xs overflow-auto relative min-h-[300px]">
                <AnimatePresence mode="wait">
                  {response ? (
                    <motion.pre
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`leading-relaxed ${response.error || response.status >= 400 ? 'text-rose-400' : 'text-slate-300'}`}
                    >
                      {JSON.stringify(response.data || response, null, 2)}
                    </motion.pre>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 gap-2"
                    >
                      <Terminal className="h-8 w-8 stroke-[1.5]" />
                      <p className="text-center font-sans">Awaiting execution run...</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}