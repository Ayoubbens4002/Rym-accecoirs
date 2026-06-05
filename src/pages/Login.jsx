import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, Mail, User, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/useAuthStore';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';

  const [mode, setMode] = useState(initialMode);
  const { t } = useTranslation();
  const { login, register, isAuthenticated, error, clearError, isLoading } = useAuthStore();

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });

  const [validationError, setValidationError] = useState('');

  // Clear errors on page/mode change
  useEffect(() => {
    clearError();
    setValidationError('');
  }, [mode]);

  // If already authenticated, redirect to account dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/compte');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (mode === 'login') {
      const result = await login({ email: formData.email, password: formData.password });
      if (result.success) {
        navigate('/compte');
      }
    } else {
      if (formData.password !== formData.password_confirmation) {
        setValidationError(t('login.passwords_do_not_match'));
        return;
      }
      const result = await register(formData);
      if (result.success) {
        navigate('/compte');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-left">
      <div className="border border-gold/15 rounded-lg bg-white dark:bg-navy-800 shadow-lg overflow-hidden">
        
        {/* Tab switch header */}
        <div className="flex border-b border-gold/10 text-center font-serif text-base">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-4 font-bold border-b-2 cursor-pointer transition-colors ${
              mode === 'login' 
                ? 'border-gold text-gold bg-gold/5' 
                : 'border-transparent text-navy/60 dark:text-cream-300/60 hover:text-gold'
            }`}
          >
            {t('login.sign_in_tab')}
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-4 font-bold border-b-2 cursor-pointer transition-colors ${
              mode === 'register' 
                ? 'border-gold text-gold bg-gold/5' 
                : 'border-transparent text-navy/60 dark:text-cream-300/60 hover:text-gold'
            }`}
          >
            {t('login.register_tab')}
          </button>
        </div>

        {/* Form area */}
        <div className="p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-serif font-bold text-navy dark:text-cream-100">
              {mode === 'login' ? t('login.welcome_back') : t('login.join_brand')}
            </h2>
            <p className="text-xs text-navy/55 dark:text-cream-300/55 mt-1.5">
              {mode === 'login' 
                ? t('login.enter_credentials') 
                : t('login.register_help')}
            </p>
          </div>

          {(error || validationError) && (
            <div className="bg-red-50 border border-red-100 text-red-500 rounded p-3 text-xs leading-relaxed">
              {error || validationError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-navy dark:text-cream-300 uppercase tracking-wider">{t('login.full_name')}</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy/40" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-gold/25 rounded pl-9 pr-4 py-2 text-sm outline-none focus:border-gold bg-white dark:bg-navy-800 dark:text-cream-100"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-navy dark:text-cream-300 uppercase tracking-wider">{t('login.email_address')}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy/40" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-gold/25 rounded pl-9 pr-4 py-2 text-sm outline-none focus:border-gold bg-white dark:bg-navy-800 dark:text-cream-100"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-navy dark:text-cream-300 uppercase tracking-wider">{t('login.password')}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy/40" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full border border-gold/25 rounded pl-9 pr-4 py-2 text-sm outline-none focus:border-gold bg-white dark:bg-navy-800 dark:text-cream-100"
                />
              </div>
            </div>

            {mode === 'register' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-navy dark:text-cream-300 uppercase tracking-wider">{t('login.confirm_password')}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy/40" />
                  <input
                    type="password"
                    required
                    value={formData.password_confirmation}
                    onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                    className="w-full border border-gold/25 rounded pl-9 pr-4 py-2 text-sm outline-none focus:border-gold bg-white dark:bg-navy-800 dark:text-cream-100"
                  />
                </div>
              </div>
            )}

            {mode === 'login' && (
              <div className="text-right">
                <a href="#" className="text-xs text-gold hover:underline">{t('login.forgot_password')}</a>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-navy hover:bg-gold text-cream hover:text-navy border border-navy hover:border-gold font-bold rounded transition-gold flex items-center justify-center gap-2 uppercase tracking-wider text-xs cursor-pointer disabled:opacity-50"
            >
              {isLoading ? t('login.loading') : mode === 'login' ? t('login.submit_login') : t('login.submit_register')}
            </button>
          </form>
          
          <div className="pt-4 border-t border-gold/10 text-center">
            <button
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-xs text-navy/60 dark:text-cream-300/60 hover:text-gold transition-colors font-medium"
            >
              {mode === 'login' 
                ? t('login.new_to_brand') 
                : t('login.already_have_account')}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
