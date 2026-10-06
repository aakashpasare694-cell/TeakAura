import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { BRAND } from '../../config/brand';

export function AdminLoginPage() {
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate('/admin');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid login credentials';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-teak-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-br from-teak-900/60 via-teak-950 to-charcoal-950" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gold-500/10 blur-3xl pointer-events-none" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-warm-xl border border-teak-200/80 overflow-hidden">
        {/* Header */}
        <div className="bg-teak-900 p-8 text-center text-cream-50 relative">
          <div className="w-14 h-14 rounded-2xl bg-teak-800 border border-gold-500/40 text-gold-400 font-serif font-bold text-2xl flex items-center justify-center mx-auto mb-3 shadow-warm-sm">
            T
          </div>
          <h2 className="font-serif text-2xl font-bold text-cream-50">
            {BRAND.name}
          </h2>
          <p className="text-xs text-gold-300 font-medium tracking-wider uppercase mt-1">
            Workshop Management Portal
          </p>
        </div>

        {/* Form Body */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Demo Quick Fill Banner */}
            <div className="p-3.5 bg-amber-50/90 border border-amber-200/90 rounded-2xl flex items-center justify-between text-xs text-amber-950 shadow-sm">
              <div>
                <span className="font-semibold block text-[11px] uppercase tracking-wider text-amber-800">
                  Workshop Access Credentials
                </span>
                <span className="text-[11px] font-mono text-amber-700">
                  admin@teakaura.com / AdminTeak2026!
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@teakaura.com');
                  setPassword('AdminTeak2026!');
                  setError(null);
                }}
                className="text-xs bg-amber-200 hover:bg-amber-300 text-amber-900 font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                Auto-fill
              </button>
            </div>

            {error && (
              <div className="p-3 text-xs bg-red-50 text-red-700 border border-red-200 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="admin@teakaura.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500 transition-all placeholder:text-stone-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                Secret Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500 transition-all placeholder:text-stone-400"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teak-900 hover:bg-teak-800 text-cream-50 font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-warm-md hover:shadow-warm-lg transition-all text-sm disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-cream-100 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4 text-gold-400" />
                  </>
                )}
              </button>
            </div>

            <div className="text-center pt-2">
              <p className="text-[11px] text-stone-600 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Protected by Signed JWT & Cloudflare Edge Security</span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
