import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/useAuthStore';

export default function AdminLogin() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, fetchUser, isAuthenticated, error, clearError, isLoading } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (isAuthenticated) navigate('/admin');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form);
    if (result.success) navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg border border-gold/20 shadow-xl p-8">
        <h1 className="text-2xl font-serif font-bold text-navy text-center mb-2">{t('admin.login.title')}</h1>
        <p className="text-sm text-navy/60 text-center mb-8">{t('admin.login.subtitle')}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-navy uppercase tracking-wider">{t('admin.login.email_label')}</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy/40" />
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gold/25 rounded pl-10 pr-3 py-2 text-sm outline-none focus:border-gold"

              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-navy uppercase tracking-wider">{t('admin.login.password_label')}</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy/40" />
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border border-gold/25 rounded pl-10 pr-3 py-2 text-sm outline-none focus:border-gold"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gold hover:bg-navy text-navy hover:text-gold border border-gold font-bold py-3 rounded transition-colors cursor-pointer disabled:opacity-50"
          >
            {isLoading ? t('admin.login.loading') : t('admin.login.submit')}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-navy/50">
          <Link to="/" className="text-gold hover:underline">← Retour à la boutique</Link>
        </p>
      </div>
    </div>
  );
}
