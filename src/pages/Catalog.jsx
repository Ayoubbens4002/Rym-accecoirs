import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { fetchCategories, fetchProducts } from '../services/catalog';
import ProductCard from '../components/ProductCard';
import { useTranslation } from 'react-i18next';

export default function Catalog() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [maxPrice, setMaxPrice] = useState(15000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('new'); // price-asc, price-desc, popularity, new
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError('');
    Promise.all([fetchProducts(), fetchCategories()])
      .then(([prods, cats]) => {
        setProducts(prods);
        setCategories(cats);
      })
      .catch(() => setError('Impossible de charger le catalogue.'))
      .finally(() => setLoading(false));
  }, []);

  // Sync state with URL params
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'all');
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  // Handle Filtering & Sorting
  useEffect(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter(
        (p) => p.category?.slug.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Search query filter
    if (searchQuery) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price filter
    result = result.filter((p) => {
      const price = parseFloat(p.sale_price || p.price);
      return price <= maxPrice;
    });

    // Stock filter
    if (inStockOnly) {
      result = result.filter((p) => p.stock > 0);
    }

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => parseFloat(a.sale_price || a.price) - parseFloat(b.sale_price || b.price));
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => parseFloat(b.sale_price || b.price) - parseFloat(a.sale_price || a.price));
    } else if (sortBy === 'popularity') {
      // Sort featured products first
      result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
    } else if (sortBy === 'new') {
      // Mock newness by ID descending
      result.sort((a, b) => b.id - a.id);
    }

    setFilteredProducts(result);
  }, [products, selectedCategory, searchQuery, maxPrice, inStockOnly, sortBy]);

  const handleCategoryChange = (slug) => {
    setSelectedCategory(slug);
    setSearchParams((prev) => {
      if (slug === 'all') {
        prev.delete('category');
      } else {
        prev.set('category', slug);
      }
      return prev;
    });
  };

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setMaxPrice(15000);
    setInStockOnly(false);
    setSortBy('new');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 w-full overflow-x-hidden">
      
      {/* Page Header */}
      <div className="text-center space-y-2 mb-10 animate-fade-up">
        <h1 className="text-4xl md:text-5xl text-navy dark:text-cream-100 font-bold tracking-wide">{t('catalog.title')}</h1>
        <p className="text-navy/60 dark:text-cream-300/60 font-light max-w-lg mx-auto">{t('catalog.explore_desc')}</p>
        <div className="w-12 h-0.5 bg-gold mx-auto"></div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Desktop Sidebar Filters */}
        <aside className="hidden lg:block w-64 space-y-8 flex-shrink-0 text-left border-r border-gold/10 pr-8">
          
          {/* Category Filter */}
          <div className="space-y-3">
            <h3 className="text-navy dark:text-cream-100 font-serif font-bold text-lg tracking-wide uppercase border-b border-gold/20 pb-2">{t('catalog.categories')}</h3>
            <div className="space-y-2">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`block text-sm cursor-pointer hover:text-gold transition-colors ${selectedCategory === 'all' ? 'text-gold font-bold' : 'text-navy-950/70 dark:text-cream-300/70'}`}
              >
                {t('catalog.all_categories')}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={`block text-sm cursor-pointer hover:text-gold transition-colors capitalize ${selectedCategory === cat.slug ? 'text-gold font-bold' : 'text-navy-950/70 dark:text-cream-300/70'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className="space-y-3">
            <h3 className="text-navy dark:text-cream-100 font-serif font-bold text-lg tracking-wide uppercase border-b border-gold/20 pb-2">{t('catalog.price_range')}</h3>
            <div className="space-y-2">
              <input
                type="range"
                min="1000"
                max="15000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-full accent-gold bg-cream-300 rounded-lg appearance-none h-1.5"
              />
              <div className="flex justify-between text-xs text-navy/70 dark:text-cream-300/70">
                <span>1 000 DA</span>
                <span className="font-bold text-navy dark:text-cream-100">{maxPrice.toLocaleString()} DA max</span>
              </div>
            </div>
          </div>

          {/* Availability Filter */}
          <div className="space-y-3">
            <h3 className="text-navy dark:text-cream-100 font-serif font-bold text-lg tracking-wide uppercase border-b border-gold/20 pb-2">{t('catalog.availability')}</h3>
            <label className="flex items-center gap-2 text-sm text-navy-950/75 dark:text-cream-300/75 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded border-gold/40 text-gold focus:ring-gold accent-gold"
              />
              {t('catalog.in_stock_only')}
            </label>
          </div>

          {/* Clear Filters */}
          <button
            onClick={clearAllFilters}
            className="w-full border border-gold/30 text-navy hover:bg-gold hover:text-navy-950 font-bold py-2 rounded text-sm transition-gold cursor-pointer"
          >
            {t('catalog.clear_filters')}
          </button>
        </aside>

        {/* Right Side: Search, Sort and Grid */}
        <main className="flex-1 space-y-6">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-between bg-cream-100/40 dark:bg-navy-800/40 border border-gold/10 p-4 rounded-lg">
            
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchParams((prev) => {
                    if (e.target.value === '') {
                      prev.delete('search');
                    } else {
                      prev.set('search', e.target.value);
                    }
                    return prev;
                  });
                }}
                placeholder={t('catalog.search')}
                className="w-full bg-white dark:bg-navy-800 dark:text-cream-100 border border-gold/20 rounded pl-9 pr-4 py-2 text-sm outline-none focus:border-gold"
              />
              {searchQuery && (
                <button onClick={() => { setSearchQuery(''); setSearchParams((prev) => { prev.delete('search'); return prev; }); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/40 hover:text-navy">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Actions: Sort & Mobile Filters */}
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              
              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-2 border border-gold/20 px-4 py-2 rounded bg-white text-sm hover:border-gold transition-colors"
              >
                <SlidersHorizontal className="h-4 w-4 text-gold" />
                {t('catalog.filters')}
              </button>

              {/* Sort Selector */}
              <div className="flex items-center gap-2 text-sm">
                <ArrowUpDown className="h-4 w-4 text-gold" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white dark:bg-navy-800 dark:text-cream-100 border border-gold/20 rounded px-2 py-2 outline-none text-sm focus:border-gold"
                >
                  <option value="new">{t('catalog.sort.new')}</option>
                  <option value="popularity">{t('catalog.sort.popularity')}</option>
                  <option value="price-asc">{t('catalog.sort.price_asc')}</option>
                  <option value="price-desc">{t('catalog.sort.price_desc')}</option>
                </select>
              </div>

            </div>

          </div>

          {/* Active Filter Badges */}
          <div className="flex flex-wrap gap-2 text-xs">
            {selectedCategory !== 'all' && (
              <span className="bg-gold/10 text-gold border border-gold/30 px-3 py-1 rounded-full flex items-center gap-1.5 capitalize">
                {t('catalog.filter.category')}: {selectedCategory}
                <button onClick={() => handleCategoryChange('all')}><X className="h-3 w-3" /></button>
              </span>
            )}
            {searchQuery && (
              <span className="bg-gold/10 text-gold border border-gold/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                {t('catalog.filter.search')}: "{searchQuery}"
                <button onClick={() => { setSearchQuery(''); setSearchParams((prev) => { prev.delete('search'); return prev; }); }}><X className="h-3 w-3" /></button>
              </span>
            )}
            {maxPrice < 15000 && (
              <span className="bg-gold/10 text-gold border border-gold/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                Max {maxPrice.toLocaleString()} DA
                <button onClick={() => setMaxPrice(15000)}><X className="h-3 w-3" /></button>
              </span>
            )}
            {inStockOnly && (
              <span className="bg-gold/10 text-gold border border-gold/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                {t('catalog.in_stock')}
                <button onClick={() => setInStockOnly(false)}><X className="h-3 w-3" /></button>
              </span>
            )}
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="text-center py-16 text-navy/60">Chargement du catalogue...</div>
          ) : error ? (
            <div className="text-center py-16 text-red-700">{error}</div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-gold/20 rounded-lg">
              <p className="text-lg font-serif text-navy/70 dark:text-cream-300/70">{t('catalog.no_results')}</p>
              <button
                onClick={clearAllFilters}
                className="mt-4 text-gold hover:underline text-sm font-semibold tracking-wider uppercase"
              >
                {t('catalog.clear_filters')}
              </button>
            </div>
          )}

        </main>

      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-navy/50 z-50 flex justify-end lg:hidden">
          <div className="w-80 bg-white h-full p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6 text-left">
              <div className="flex items-center justify-between border-b border-gold/20 pb-4">
                <h2 className="text-xl font-serif font-bold text-navy">{t('catalog.filters')}</h2>
                <button onClick={() => setShowMobileFilters(false)}>
                  <X className="h-6 w-6 text-navy" />
                </button>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <h3 className="font-serif font-bold uppercase text-xs text-gold tracking-widest">{t('catalog.categories')}</h3>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => { handleCategoryChange('all'); setShowMobileFilters(false); }}
                    className={`text-left text-sm ${selectedCategory === 'all' ? 'text-gold font-bold' : 'text-navy-950/70'}`}
                  >
                    Tous les bijoux
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => { handleCategoryChange(cat.slug); setShowMobileFilters(false); }}
                      className={`text-left text-sm capitalize ${selectedCategory === cat.slug ? 'text-gold font-bold' : 'text-navy-950/70'}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <h3 className="font-serif font-bold uppercase text-xs text-gold tracking-widest">{t('catalog.price_max')}</h3>
                <input
                  type="range"
                  min="1000"
                  max="15000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  className="w-full accent-gold"
                />
                <div className="flex justify-between text-xs text-navy/70">
                  <span>{t('catalog.price_min_label')}</span>
                  <span className="font-bold text-navy">{maxPrice.toLocaleString()} DA</span>
                </div>
              </div>

              {/* Stock */}
              <div className="space-y-2">
                <h3 className="font-serif font-bold uppercase text-xs text-gold tracking-widest">{t('catalog.availability')}</h3>
                <label className="flex items-center gap-2 text-sm text-navy-950/75 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded border-gold/40 text-gold accent-gold"
                  />
                  {t('catalog.in_stock_only')}
                </label>
              </div>
            </div>

            <button
              onClick={() => { clearAllFilters(); setShowMobileFilters(false); }}
              className="w-full mt-8 bg-navy text-cream py-3 rounded font-bold hover:bg-gold hover:text-navy transition-colors cursor-pointer"
            >
              {t('catalog.clear_filters')}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
