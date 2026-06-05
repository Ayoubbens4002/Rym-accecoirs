import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Package, Clock } from 'lucide-react';
import { fetchAdminStats } from '../../services/admin';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, pending: 0, processing: 0, delivered: 0 });

  useEffect(() => {
    fetchAdminStats().then(setStats).catch(() => {});
  }, []);

  const cards = [
    { label: 'Commandes totales', value: stats.total, icon: ShoppingCart, to: '/admin/commandes' },
    { label: 'En attente', value: stats.pending, icon: Clock, to: '/admin/commandes?status=pending' },
    { label: 'En cours', value: stats.processing, icon: Package, to: '/admin/commandes' },
    { label: 'Livrées', value: stats.delivered, icon: ShoppingCart, to: '/admin/commandes?status=delivered' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-serif font-bold text-navy mb-8">Tableau de bord</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map(({ label, value, icon: Icon, to }) => (
          <Link
            key={label}
            to={to}
            className="p-6 bg-white rounded-lg border border-gold/20 hover:border-gold/50 transition-colors"
          >
            <Icon className="h-8 w-8 text-gold mb-3" />
            <p className="text-3xl font-bold text-navy">{value}</p>
            <p className="text-sm text-navy/60 mt-1">{label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
