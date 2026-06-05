import { Link } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const adminLinks = [
  { labelKey: 'admin.links.products', icon: Package, href: '#', descriptionKey: 'admin.links.products_desc' },
  { labelKey: 'admin.links.orders', icon: ShoppingCart, href: '#', descriptionKey: 'admin.links.orders_desc' },
  { labelKey: 'admin.links.customers', icon: Users, href: '#', descriptionKey: 'admin.links.customers_desc' },
];

export default function AdminDashboard() {
  const { t } = useTranslation();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-3 mb-10">
        <LayoutDashboard className="h-8 w-8 text-gold" />
        <div>
          <h1 className="text-3xl text-navy font-serif font-bold">{t('admin.dashboard_title')}</h1>
          <p className="text-sm text-navy/60">{t('admin.dashboard_subtitle')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {adminLinks.map(({ labelKey, icon: Icon, href, descriptionKey }) => (
          <a
            key={labelKey}
            href={href}
            className="block p-6 rounded-lg border border-gold/20 bg-cream-100/50 hover:border-gold/50 transition-gold animate-fade-up"
          >
            <Icon className="h-6 w-6 text-gold mb-3" />
            <h2 className="text-lg font-serif font-bold text-navy">{t(labelKey)}</h2>
            <p className="text-sm text-navy/60 mt-1">{t(descriptionKey)}</p>
          </a>
        ))}
      </div>

      <p className="mt-10 text-sm text-navy/50">
        <Link to="/" className="text-gold hover:underline">
          ← Retour à la boutique
        </Link>
      </p>
    </div>
  );
}
