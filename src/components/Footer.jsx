import { Link } from 'react-router-dom';
import TelegramLink from './TelegramLink';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-navy-950 text-cream-100/80 border-t border-gold/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="text-center sm:text-left">
            <Link to="/" className="text-2xl sm:text-3xl font-serif text-gold tracking-widest inline-block">
              Rym_accesoire
            </Link>
            <p className="text-xs sm:text-sm text-cream-100/60 mt-2 max-w-xs mx-auto sm:mx-0">
              {t('footer.desc')}
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <TelegramLink />

          </div>
        </div>
            <p className="text-center text-xs text-cream-100/60 mt-4">© 2026 Rym_accesoire</p>

      </div>
    </footer>
  );
}
