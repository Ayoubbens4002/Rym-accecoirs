import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Heart, Clock } from 'lucide-react';
import { fetchCategories, fetchProducts } from '../services/catalog';
import ProductCard from '../components/ProductCard';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [timeLeft, setTimeLeft] = useState({ heures: 12, minutes: 45, secondes: 10 });

  // Countdown timer simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.secondes > 0) return { ...prev, secondes: prev.secondes - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, secondes: 59 };
        if (prev.heures > 0) return { heures: prev.heures - 1, minutes: 59, secondes: 59 };
        return { heures: 0, minutes: 0, secondes: 0 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchProducts()
      .then((products) => {
        setNewArrivals(products.slice(0, 4));
        setBestsellers(products.filter((p) => p.is_featured));
      })
      .catch(() => {
        setNewArrivals([]);
        setBestsellers([]);
      });
    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. Hero Section */}
      <section className="relative min-h-[60vh] sm:min-h-[70vh] lg:h-[80vh] flex items-center justify-center bg-navy text-center px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=1800"
            alt="Fonds Bijoux Rym_accesoire"
            className="w-full h-full object-cover opacity-30 object-center"
          />
        </div>
        
        <div className="relative z-10 max-w-3xl space-y-6 animate-fade-up">
          <h1 className="text-4xl sm:text-5xl md:text-7xl text-gold font-serif font-light tracking-widest uppercase">
            {t('home.hero_title')}
          </h1>
          <p className="text-cream-100 text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto">
            {t('home.hero_subtitle')}
          </p>
          <div className="pt-4">
            <Link
              to="/catalogue"
              className="inline-flex items-center gap-2 bg-gold hover:bg-navy-800 text-navy hover:text-gold font-bold py-3.5 px-8 rounded-full border border-gold shadow-xl hover:shadow-2xl transition-all duration-300 tracking-wider text-sm uppercase cursor-pointer animate-glow"
            >
              {t('home.hero_cta')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10 animate-fade-up">
          <h2 className="text-3xl md:text-4xl text-navy dark:text-cream-100 font-bold tracking-wide">{t('home.categories_title')}</h2>
          <div className="w-12 h-0.5 bg-gold mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              to={`/catalogue?category=${cat.slug}`}
              className="group relative h-64 rounded-lg overflow-hidden border border-gold/10 shadow-sm block hover:shadow-md transition-all duration-300 animate-fade-up"
            >
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/20 to-transparent flex items-end p-6">
                <div>
                  <h3 className="text-cream-100 text-xl font-serif font-bold tracking-widest">{cat.name}</h3>
                  <span className="text-gold text-xs tracking-wider flex items-center gap-1 mt-1 group-hover:underline">
                    {t('home.view_collection')} &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Promotional Banner / Countdown */}
      <section className="bg-cream border-y border-gold/20 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-1 animate-fade-up">
            <span className="bg-gold/20 text-gold text-xs uppercase tracking-widest font-bold px-2 py-0.5 rounded border border-gold/30">
              {t('home.promo_tag')}
            </span>
            <h3 className="text-2xl text-navy font-serif font-bold pt-1">
              {t('home.promo_title')} <span className="text-gold font-mono font-bold select-all">{t('home.promo_code')}</span>
            </h3>
          </div>
          <div className="flex items-center gap-4 animate-fade-up">
            <Clock className="h-6 w-6 text-gold" />
            <div className="flex gap-2 text-navy text-center font-mono">
              <div className="bg-white border border-gold/20 rounded p-2 min-w-12">
                <span className="block text-xl font-bold">{timeLeft.heures.toString().padStart(2, '0')}</span>
                <span className="text-[10px] uppercase text-navy/50">Hrs</span>
              </div>
              <div className="bg-white border border-gold/20 rounded p-2 min-w-12">
                <span className="block text-xl font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                <span className="text-[10px] uppercase text-navy/50">Min</span>
              </div>
              <div className="bg-white border border-gold/20 rounded p-2 min-w-12">
                <span className="block text-xl font-bold">{timeLeft.secondes.toString().padStart(2, '0')}</span>
                <span className="text-[10px] uppercase text-navy/50">Sec</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="flex items-end justify-between border-b border-gold/10 pb-4 mb-8 animate-fade-up">
          <div>
            <h2 className="text-3xl text-navy dark:text-cream-100 font-bold tracking-wide">{t('home.new_arrivals_title')}</h2>
            <p className="text-sm text-navy/60 dark:text-cream-300/60">{t('home.new_arrivals_desc')}</p>
          </div>
          <Link to="/catalogue" className="text-gold hover:text-navy dark:hover:text-cream-100 text-sm font-semibold tracking-wider flex items-center gap-1 uppercase hover:underline">
            {t('home.view_all')} &rarr;
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Best Sellers */}
      <section className="bg-cream-100/50 dark:bg-navy-800/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-10 animate-fade-up">
            <span className="text-gold uppercase tracking-widest text-xs font-semibold">{t('home.best_sellers_label')}</span>
            <h2 className="text-3xl md:text-4xl text-navy dark:text-cream-100 font-bold tracking-wide">{t('home.best_sellers_title')}</h2>
            <div className="w-12 h-0.5 bg-gold mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {bestsellers.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
