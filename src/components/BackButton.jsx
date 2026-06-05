import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function BackButton({ fallback = '/', label = 'Retour', className = '' }) {
  const navigate = useNavigate();
  const location = useLocation();

  const hideOn = ['/', '/admin', '/admin/connexion'];
  if (hideOn.includes(location.pathname)) {
    return null;
  }

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`inline-flex items-center gap-2 text-sm font-medium text-navy/70 hover:text-gold transition-colors cursor-pointer mb-4 ${className}`}
      aria-label={label}
    >
      <ArrowLeft className="h-4 w-4 shrink-0" />
      <span>{label}</span>
    </button>
  );
}
