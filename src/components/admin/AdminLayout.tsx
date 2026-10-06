import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Inbox,
  FolderTree,
  MessageSquareQuote,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { BRAND } from '../../config/brand';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function AdminLayout({ children, title, subtitle, actions }: AdminLayoutProps) {
  const { admin, logout } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Set noindex meta tag for search engines on all admin routes
  useEffect(() => {
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute('content', 'noindex, nofollow');

    return () => {
      // Revert when leaving admin
      robotsMeta?.setAttribute('content', 'index, follow');
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Enquiries & Leads', path: '/admin/enquiries', icon: Inbox },
    { label: 'Categories', path: '/admin/categories', icon: FolderTree },
    { label: 'Testimonials', path: '/admin/testimonials', icon: MessageSquareQuote },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row font-sans">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-teak-950 text-cream-50 p-4 flex items-center justify-between shadow-warm-sm sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teak-800 text-gold-400 font-serif font-bold flex items-center justify-center text-sm border border-gold-500/30">
            T
          </div>
          <span className="font-serif font-bold text-sm tracking-tight">Workshop Admin</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 text-teak-300 hover:text-white"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-teak-950 text-cream-100 flex flex-col justify-between p-6 z-40 transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Logo & Header */}
          <div className="pb-6 mb-6 border-b border-teak-800/80 flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teak-900 border border-gold-500/30 flex items-center justify-center text-gold-400 font-serif font-bold text-lg shadow-sm">
                T
              </div>
              <div>
                <div className="font-serif text-base font-bold text-cream-50 leading-tight">
                  {BRAND.name}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold mt-0.5 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Workshop Admin</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive =
                item.path === '/admin'
                  ? location.pathname === '/admin'
                  : location.pathname.startsWith(item.path);

              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gold-500 text-charcoal-950 font-semibold shadow-warm-sm'
                      : 'text-teak-300 hover:bg-teak-900 hover:text-cream-50'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile & Actions */}
        <div className="pt-6 border-t border-teak-800/80 space-y-3">
          <div className="px-2">
            <div className="text-xs font-semibold text-cream-100 truncate">
              {admin?.name || 'Administrator'}
            </div>
            <div className="text-[11px] text-teak-400 truncate">
              {admin?.email || 'admin@teakaura.com'}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-teak-400 hover:text-gold-400 flex items-center gap-1 transition-colors"
            >
              <span>View Public Site</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <button
              onClick={handleLogout}
              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Stage */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-stone-200 px-6 py-6 sm:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs sm:text-sm text-stone-500 mt-1">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </header>

        {/* Content Body */}
        <div className="p-6 sm:p-8 flex-1">{children}</div>
      </main>
    </div>
  );
}
