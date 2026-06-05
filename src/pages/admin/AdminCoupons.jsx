import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import {
  fetchAdminCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from '../../services/admin';

const EMPTY_FORM = {
  code: '',
  type: 'fixed',
  value: '0',
  min_order: '0',
  max_uses: '',
  expires_at: '',
};

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadCoupons = () => {
    setLoading(true);
    fetchAdminCoupons()
      .then((data) => {
        setCoupons(Array.isArray(data) ? data : data.data || []);
      })
      .catch(() => setCoupons([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingCoupon(null);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const payload = {
      code: form.code.trim().toUpperCase(),
      type: form.type,
      value: parseFloat(form.value) || 0,
      min_order: parseFloat(form.min_order) || 0,
      max_uses: form.max_uses ? parseInt(form.max_uses, 10) : null,
      expires_at: form.expires_at || null,
    };

    try {
      if (editingCoupon) {
        await updateCoupon(editingCoupon.id, payload);
        setSuccess('Coupon mis à jour.');
      } else {
        await createCoupon(payload);
        setSuccess('Coupon créé.');
      }
      resetForm();
      loadCoupons();
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible d’enregistrer le coupon.');
    }
  };

  const startEdit = (coupon) => {
    setEditingCoupon(coupon);
    setError('');
    setSuccess('');
    setForm({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value.toString(),
      min_order: coupon.min_order.toString(),
      max_uses: coupon.max_uses ? coupon.max_uses.toString() : '',
      expires_at: coupon.expires_at ? coupon.expires_at.slice(0, 10) : '',
    });
  };

  const handleDelete = async (coupon) => {
    if (!window.confirm(`Supprimer le coupon « ${coupon.code} » ?`)) {
      return;
    }

    try {
      await deleteCoupon(coupon.id);
      loadCoupons();
    } catch {
      setError('Impossible de supprimer le coupon.');
    }
  };

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-navy">Coupons</h1>
          <p className="text-navy/60 mt-1">Gérez les codes promo et leur validité.</p>
        </div>
        <button
          type="button"
          onClick={resetForm}
          className="inline-flex items-center gap-2 bg-gold hover:bg-navy text-navy hover:text-gold border border-gold px-5 py-2.5 rounded font-bold text-sm transition-colors cursor-pointer"
        >
          <Plus className="h-5 w-5" />
          {editingCoupon ? 'Annuler l’édition' : 'Nouveau coupon'}
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-[1.2fr_.8fr]">
        <div className="bg-white rounded-lg border border-gold/20 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-navy mb-4">{editingCoupon ? 'Modifier un coupon' : 'Ajouter un coupon'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-navy/80">
                Code
                <input
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  required
                  className="w-full border border-gold/25 rounded px-3 py-2 text-sm outline-none focus:border-gold"
                />
              </label>

              <label className="space-y-2 text-sm text-navy/80">
                Type
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full border border-gold/25 rounded px-3 py-2 text-sm outline-none focus:border-gold"
                >
                  <option value="fixed">Montant fixe</option>
                  <option value="percent">Pourcentage</option>
                </select>
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-navy/80">
                Valeur
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                  required
                  className="w-full border border-gold/25 rounded px-3 py-2 text-sm outline-none focus:border-gold"
                />
              </label>
              <label className="space-y-2 text-sm text-navy/80">
                Montant minimum
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.min_order}
                  onChange={(e) => setForm({ ...form, min_order: e.target.value })}
                  className="w-full border border-gold/25 rounded px-3 py-2 text-sm outline-none focus:border-gold"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-navy/80">
                Nombre max. d’utilisations
                <input
                  type="number"
                  min="1"
                  value={form.max_uses}
                  onChange={(e) => setForm({ ...form, max_uses: e.target.value })}
                  className="w-full border border-gold/25 rounded px-3 py-2 text-sm outline-none focus:border-gold"
                />
              </label>
              <label className="space-y-2 text-sm text-navy/80">
                Date d’expiration
                <input
                  type="date"
                  value={form.expires_at}
                  onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
                  className="w-full border border-gold/25 rounded px-3 py-2 text-sm outline-none focus:border-gold"
                />
              </label>
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}
            {success && <p className="text-xs text-emerald-600">{success}</p>}

            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-gold hover:bg-navy text-navy hover:text-gold border border-gold px-5 py-2.5 rounded font-bold text-sm transition-colors"
            >
              <Check className="h-4 w-4" />
              {editingCoupon ? 'Enregistrer' : 'Créer le coupon'}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg border border-gold/20 p-6 shadow-sm overflow-x-auto">
          <h2 className="text-xl font-semibold text-navy mb-4">Liste des coupons</h2>
          {loading ? (
            <p className="text-navy/60">Chargement...</p>
          ) : coupons.length === 0 ? (
            <p className="text-navy/60">Aucun coupon pour le moment.</p>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-cream-100 text-navy uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-3 py-2">Code</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">Valeur</th>
                  <th className="px-3 py-2">Min. commande</th>
                  <th className="px-3 py-2">Utilisations</th>
                  <th className="px-3 py-2">Expire le</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/10">
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-cream-100/50">
                    <td className="px-3 py-3 font-bold text-navy">{coupon.code}</td>
                    <td className="px-3 py-3 capitalize">{coupon.type}</td>
                    <td className="px-3 py-3">{coupon.type === 'percent' ? `${coupon.value}%` : `${coupon.value.toLocaleString()} DA`}</td>
                    <td className="px-3 py-3">{coupon.min_order.toLocaleString()} DA</td>
                    <td className="px-3 py-3">{coupon.used_count}{coupon.max_uses ? ` / ${coupon.max_uses}` : ''}</td>
                    <td className="px-3 py-3">{coupon.expires_at ? coupon.expires_at.slice(0, 10) : 'Aucune'}</td>
                    <td className="px-3 py-3 text-right space-x-1">
                      <button
                        type="button"
                        onClick={() => startEdit(coupon)}
                        className="inline-flex items-center justify-center p-2 rounded border border-gold/25 text-navy hover:bg-gold/10"
                        title="Modifier"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(coupon)}
                        className="inline-flex items-center justify-center p-2 rounded border border-red-200 text-red-600 hover:bg-red-50"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
