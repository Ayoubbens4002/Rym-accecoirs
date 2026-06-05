import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { User, ShoppingBag, Heart, MapPin, Key, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useWishlistStore } from '../store/useWishlistStore';
import ProductCard from '../components/ProductCard';

export default function Account() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';

  const { user, logout } = useAuthStore();
  const wishlistItems = useWishlistStore((state) => state.items);

  // Profile Form States
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Sofia Ben',
    phone: user?.phone || '0550123456',
    email: user?.email || 'sofia.ben@example.com'
  });

  const handleTabChange = (tabName) => {
    setSearchParams({ tab: tabName });
  };

  const handleLogout = () => {
    logout();
    navigate('/connexion');
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    alert('Profil mis à jour avec succès (simulation).');
  };

  // Mock Orders Data
  const mockOrders = [
    {
      id: 'SR-742918',
      date: '12/05/2026',
      total: 9300,
      status: 'Livré',
      statusColor: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      items: 'Bague Aura Dorée (x1), Collier Perla Baroque (x1)'
    },
    {
      id: 'SR-283941',
      date: '02/05/2026',
      total: 5500,
      status: 'En cours de livraison',
      statusColor: 'bg-amber-50 text-amber-600 border-amber-100',
      items: 'Bracelet Jonc Royal (x1)'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      <h1 className="text-3xl md:text-4xl font-serif font-bold text-navy mb-8 border-b border-gold/10 pb-4">
        Mon Espace Client
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Left Side: Navigation Menu */}
        <aside className="space-y-1">
          <button
            onClick={() => handleTabChange('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === 'profile' 
                ? 'bg-gold text-navy' 
                : 'text-navy-950/70 hover:bg-cream-100/50 hover:text-gold'
            }`}
          >
            <User className="h-5 w-5" />
            Mon Profil
          </button>
          
          <button
            onClick={() => handleTabChange('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === 'orders' 
                ? 'bg-gold text-navy' 
                : 'text-navy-950/70 hover:bg-cream-100/50 hover:text-gold'
            }`}
          >
            <ShoppingBag className="h-5 w-5" />
            Mes Commandes
          </button>

          <button
            onClick={() => handleTabChange('wishlist')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === 'wishlist' 
                ? 'bg-gold text-navy' 
                : 'text-navy-950/70 hover:bg-cream-100/50 hover:text-gold'
            }`}
          >
            <Heart className="h-5 w-5" />
            Mes Favoris ({wishlistItems.length})
          </button>

          <button
            onClick={() => handleTabChange('addresses')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === 'addresses' 
                ? 'bg-gold text-navy' 
                : 'text-navy-950/70 hover:bg-cream-100/50 hover:text-gold'
            }`}
          >
            <MapPin className="h-5 w-5" />
            Carnet d'Adresses
          </button>

          <hr className="border-gold/10 my-2" />

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <LogOut className="h-5 w-5" />
            Déconnexion
          </button>
        </aside>

        {/* Right Side: Tab Contents */}
        <main className="md:col-span-3">
          
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="border border-gold/15 p-6 rounded-lg bg-white shadow-sm space-y-6">
              <h2 className="text-xl font-serif font-bold text-navy border-b border-gold/10 pb-2">
                Informations Personnelles
              </h2>
              <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-lg">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-navy uppercase tracking-wider">Nom Complet</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full border border-gold/25 rounded px-3 py-2 text-sm outline-none focus:border-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-navy uppercase tracking-wider">Téléphone</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full border border-gold/25 rounded px-3 py-2 text-sm outline-none focus:border-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-navy uppercase tracking-wider">Adresse Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full border border-gold/25 rounded px-3 py-2 text-sm outline-none focus:border-gold"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-navy hover:bg-gold text-cream hover:text-navy border border-navy font-bold py-2 px-6 rounded text-sm transition-gold cursor-pointer"
                >
                  Sauvegarder les modifications
                </button>
              </form>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="border border-gold/15 p-6 rounded-lg bg-white shadow-sm space-y-6">
              <h2 className="text-xl font-serif font-bold text-navy border-b border-gold/10 pb-2">
                Historique des Commandes
              </h2>
              {mockOrders.length > 0 ? (
                <div className="space-y-4">
                  {mockOrders.map((order) => (
                    <div key={order.id} className="border border-gold/10 rounded p-4 text-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div className="space-y-1">
                        <p className="font-bold text-navy">{order.id} <span className="text-xs font-normal text-navy/60">({order.date})</span></p>
                        <p className="text-xs text-navy-950/70">{order.items}</p>
                      </div>
                      <div className="flex items-center gap-4 justify-between sm:justify-end">
                        <span className="font-serif font-bold text-navy">{order.total.toLocaleString()} DA</span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${order.statusColor}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-navy/60 italic">Aucune commande passée pour le moment.</p>
              )}
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <div className="border border-gold/15 p-6 rounded-lg bg-white shadow-sm space-y-6">
              <h2 className="text-xl font-serif font-bold text-navy border-b border-gold/10 pb-2">
                Mes Bijoux Favoris
              </h2>
              {wishlistItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlistItems.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-navy/60 italic">Votre liste de favoris est vide.</p>
                  <Link to="/catalogue" className="inline-block mt-4 text-gold font-bold uppercase tracking-wider text-xs hover:underline">
                    Parcourir les bijoux
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className="border border-gold/15 p-6 rounded-lg bg-white shadow-sm space-y-6">
              <h2 className="text-xl font-serif font-bold text-navy border-b border-gold/10 pb-2 flex justify-between items-center">
                Mon Carnet d'Adresses
                <button className="text-xs bg-gold hover:bg-navy text-navy hover:text-gold px-3 py-1.5 rounded font-bold border border-gold transition-colors">
                  Ajouter
                </button>
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-gold/20 rounded p-4 space-y-2 text-sm text-navy">
                  <div className="flex justify-between items-center border-b border-gold/10 pb-2">
                    <strong className="font-serif">Adresse Principale</strong>
                    <span className="text-[10px] bg-gold/20 text-gold px-1.5 py-0.5 rounded font-bold uppercase">Par défaut</span>
                  </div>
                  <p className="font-semibold">{user?.name || 'Sofia Ben'}</p>
                  <p>{user?.phone || '0550123456'}</p>
                  <p>16, Alger - Didouche Mourad</p>
                  <p className="text-xs text-navy/60">15 Rue de la Liberté</p>
                  <div className="flex gap-4 pt-2 text-xs font-semibold">
                    <button className="text-gold hover:underline">Modifier</button>
                    <button className="text-red-400 hover:underline">Supprimer</button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>

      </div>
    </div>
  );
}
