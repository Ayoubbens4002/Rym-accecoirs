import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Menu, X, Sun, Moon, Globe } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { useTranslation } from 'react-i18next';
import { useThemeAndLang } from './ThemeAndLangContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const navigate = useNavigate();
  const { items } = useCartStore();
  const wishlistItems = useWishlistStore((state) => state.items);
  const { t } = useTranslation();
  const { theme, toggleTheme, changeLanguage, currentLang } = useThemeAndLang();

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  const switchLang = (lng) => {
    changeLanguage(lng);
    setLangOpen(false);
  };

  return (
    <nav className="bg-navy border-b border-gold/20 text-cream-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gold hover:text-white focus:outline-none cursor-pointer"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          <div className="hidden md:flex space-x-8">
            <Link to="/catalogue?category=bagues" className="text-cream-100/80 hover:text-gold transition-gold text-sm tracking-widest uppercase">{t('nav.rings')}</Link>
            <Link to="/catalogue?category=colliers" className="text-cream-100/80 hover:text-gold transition-gold text-sm tracking-widest uppercase">{t('nav.necklaces')}</Link>
            <Link to="/catalogue?category=bracelets" className="text-cream-100/80 hover:text-gold transition-gold text-sm tracking-widest uppercase">{t('nav.bracelets')}</Link>
          </div>

          <div className="flex-1 flex justify-center md:justify-center">
            <Link to="/" className="text-3xl font-serif text-gold tracking-widest flex items-center gap-1 font-medium transition hover:opacity-90 animate-fade-up">
              {t('nav.brand_name')}
            </Link>
          </div>

          <div className="flex items-center space-x-4 sm:space-x-6">
            <div className="relative">
              <button onClick={() => setLangOpen(!langOpen)} className="text-cream-100/80 hover:text-gold flex items-center gap-1 cursor-pointer">
                <Globe className="h-5 w-5" />
                <span className="text-xs uppercase">{currentLang}</span>
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-24 bg-navy border border-gold/20 rounded shadow-lg overflow-hidden z-50">
                  <button onClick={() => switchLang('fr')} className="block w-full text-left px-4 py-2 text-sm text-cream-100 hover:bg-gold/20 cursor-pointer">FR</button>
                  <button onClick={() => switchLang('ar')} className="block w-full text-left px-4 py-2 text-sm text-cream-100 hover:bg-gold/20 cursor-pointer">AR</button>
                  <button onClick={() => switchLang('en')} className="block w-full text-left px-4 py-2 text-sm text-cream-100 hover:bg-gold/20 cursor-pointer">EN</button>
                </div>
              )}
            </div>

            <button onClick={toggleTheme} className="text-cream-100/80 hover:text-gold cursor-pointer" title={theme === 'dark' ? t('nav.theme_light') : t('nav.theme_dark')}>
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>


            <Link to="/favoris" className="text-cream-100/80 hover:text-gold transition-gold relative">
              <Heart className="h-6 w-6" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-navy text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link to="/panier" className="text-cream-100/80 hover:text-gold transition-gold relative">
              <ShoppingBag className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-navy text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-gold/20 bg-navy-950 px-4 pt-2 pb-4 space-y-1">
          <Link to="/catalogue?category=bagues" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-cream-100 hover:text-gold hover:bg-navy">Bagues</Link>
          <Link to="/catalogue?category=colliers" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-cream-100 hover:text-gold hover:bg-navy">Colliers</Link>
          <Link to="/catalogue?category=bracelets" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-cream-100 hover:text-gold hover:bg-navy">Bracelets</Link>
          <hr className="border-gold/10 my-2" />
          <Link to="/catalogue" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-cream-300 hover:text-gold">{t('nav.catalog')}</Link>
          <Link to="/favoris" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-cream-300 hover:text-gold">{t('nav.favorites')}</Link>
        </div>
      )}
    </nav>
  );
}
