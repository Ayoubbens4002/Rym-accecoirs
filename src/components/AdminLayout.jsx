import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, LogOut, Store, ArrowLeft, Tag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/useAuthStore';
import ScrollToTopButton from './ScrollToTopButton';

const navItems = [
  { to: '/admin', labelKey: 'admin.dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/commandes', labelKey: 'admin.orders', icon: ShoppingCart },
  { to: '/admin/produits', labelKey: 'admin.products', icon: Package },
  { to: '/admin/coupons', labelKey: 'admin.coupons', icon: Tag },
];

export default function AdminLayout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const showBack = location.pathname !== '/admin';

  const handleLogout = async () => {
    await logout();
    navigate('/admin/connexion');
  };

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-navy-950 flex flex-col md:flex-row overflow-x-hidden">
      <aside className="w-full md:w-64 bg-navy text-cream-100 flex flex-col md:flex-col border-b md:border-b-0 md:border-r border-gold/20 shrink-0">
        <div className="p-4 sm:p-6 border-b border-gold/20">
          <Link to="/admin" className="text-2xl font-serif text-gold tracking-widest">
            {t('nav.brand_name')} {t('admin.title_suffix')}
          </Link>
          <p className="text-xs text-cream-100/50 mt-1">{user?.name}</p>
        </div>
        <nav className="flex md:flex-col flex-row overflow-x-auto md:overflow-visible p-2 md:p-4 gap-1 md:gap-0 md:space-y-1">
          {navItems.map(({ to, labelKey, icon: Icon, end }) => {
            const active = end ? location.pathname === to : location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded text-sm whitespace-nowrap transition-colors ${
                  active ? 'bg-gold/20 text-gold' : 'text-cream-100/80 hover:bg-navy-800 hover:text-gold'
                }`}
              >
                <Icon className="h-5 w-5" />
                {t(labelKey)}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gold/20 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2 text-sm text-cream-100/70 hover:text-gold"
          >
            <Store className="h-4 w-4" />
            {t('admin.view_store')}
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 text-sm text-cream-100/70 hover:text-red-400 w-full cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            {t('admin.logout')}
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto overflow-x-hidden">
        {showBack && (
          <div className="px-4 sm:px-8 pt-4">
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="inline-flex items-center gap-2 text-sm text-navy/70 hover:text-gold cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('admin.back_to_dashboard')}
            </button>
          </div>
        )}
        <Outlet />
      </main>
      <ScrollToTopButton />
    </div>
  );
}
