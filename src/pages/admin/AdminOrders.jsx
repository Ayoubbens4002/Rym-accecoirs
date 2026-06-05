import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchAdminOrders, updateOrderStatus } from '../../services/admin';

const STATUS_LABELS = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  processing: 'En préparation',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
};

const STATUS_OPTIONS = Object.keys(STATUS_LABELS);

export default function AdminOrders() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadOrders = () => {
    setLoading(true);
    fetchAdminOrders({
      status: searchParams.get('status') || undefined,
      search: search || undefined,
    })
      .then((data) => {
        if (Array.isArray(data)) setOrders(data);
        else if (data?.data) setOrders(data.data);
        else setOrders([]);
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, [searchParams]);

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      loadOrders();
    } catch {
      alert('Erreur lors de la mise à jour du statut.');
    }
  };

  return (
    <div className="p-8 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-serif font-bold text-navy">{t('admin.orders_title')}</h1>
        <input
          type="search"

          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && loadOrders()}
          className="border border-gold/25 rounded px-4 py-2 text-sm w-full sm:w-80 outline-none focus:border-gold"
        />
      </div>

      {loading ? (
        <p className="text-navy/60">{t('admin.loading')}</p>
      ) : orders.length === 0 ? (
        <p className="text-navy/60">{t('admin.no_orders')}</p>
      ) : (
        <div className="bg-white rounded-lg border border-gold/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full text-sm text-left">
            <thead className="bg-cream-100 text-navy uppercase text-xs tracking-wider">
              <tr>
                <th className="px-4 py-3">N°</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Téléphone</th>
                <th className="px-4 py-3">Wilaya</th>
                <th className="px-4 py-3">Méthode de paiement</th>
                <th className="px-4 py-3">Coupon</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-cream-100/50">
                  <td className="px-4 py-3 font-mono font-bold text-gold">{order.order_number}</td>
                  <td className="px-4 py-3">
                    {order.first_name} {order.last_name}
                  </td>
                  <td className="px-4 py-3">{order.phone}</td>
                  <td className="px-4 py-3">{order.wilaya_name || order.wilaya_code}</td>
                  <td className="px-4 py-3 capitalize">
                    {order.payment_method === 'cod'
                      ? 'Paiement à la livraison'
                      : order.payment_method === 'baridimob'
                      ? 'BaridiMob / CCP'
                      : order.payment_method}
                  </td>
                  <td className="px-4 py-3">{order.coupon_code || '—'}</td>
                  <td className="px-4 py-3 font-bold">{Number(order.total).toLocaleString()} DA</td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="border border-gold/25 rounded px-2 py-1 text-xs outline-none focus:border-gold"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-navy/60">
                    {order.created_at ? new Date(order.created_at).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}
