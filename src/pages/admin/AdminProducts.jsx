import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import ProductFormModal from '../../components/admin/ProductFormModal';
import {
  fetchAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductActive,
} from '../../services/admin';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalProduct, setModalProduct] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  const load = () => {
    setLoading(true);
    fetchAdminProducts()
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (formData) => {
    await createProduct(formData);
    load();
  };

  const handleUpdate = async (formData) => {
    await updateProduct(modalProduct.id, formData);
    load();
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Supprimer « ${product.name} » ? Cette action est irréversible.`)) {
      return;
    }
    try {
      await deleteProduct(product.id);
      load();
    } catch {
      alert('Impossible de supprimer ce produit.');
    }
  };

  const handleToggle = async (product) => {
    await toggleProductActive(product.id);
    load();
  };

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-serif font-bold text-navy">Produits</h1>
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 bg-gold hover:bg-navy text-navy hover:text-gold border border-gold px-5 py-2.5 rounded font-bold text-sm transition-colors cursor-pointer"
        >
          <Plus className="h-5 w-5" />
          Ajouter un bijou
        </button>
      </div>

      {loading ? (
        <p className="text-navy/60">Chargement...</p>
      ) : products.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gold/20 rounded-lg">
          <p className="text-navy/60 mb-4">Aucun produit. Créez votre premier bijou.</p>
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="text-gold font-bold hover:underline cursor-pointer"
          >
            + Ajouter un bijou
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gold/20 overflow-x-auto">
          <table className="w-full text-sm text-left min-w-[800px]">
            <thead className="bg-cream-100 text-navy uppercase text-xs tracking-wider">
              <tr>
                <th className="px-4 py-3">Photo</th>
                <th className="px-4 py-3">Produit</th>
                <th className="px-4 py-3">Catégorie</th>
                <th className="px-4 py-3">Prix</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-cream-100/50">
                  <td className="px-4 py-3">
                    <img
                      src={
                        product.primary_image?.url ||
                        product.images?.[0]?.url ||
                        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=100'
                      }
                      alt=""
                      className="w-12 h-12 object-cover rounded border border-gold/20"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-navy">{product.name}</p>
                    <p className="text-xs text-navy/50 line-clamp-1 max-w-xs">
                      {product.description}
                    </p>
                  </td>
                  <td className="px-4 py-3 capitalize">{product.category?.name}</td>
                  <td className="px-4 py-3">
                    {Number(product.sale_price || product.price).toLocaleString()} DA
                    {product.sale_price && (
                      <span className="block text-xs text-navy/40 line-through">
                        {Number(product.price).toLocaleString()} DA
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">{product.stock}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleToggle(product)}
                      className={`px-3 py-1 rounded text-xs font-bold cursor-pointer ${
                        product.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {product.is_active ? 'Actif' : 'Inactif'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setModalProduct(product)}
                        className="p-2 text-navy hover:text-gold border border-gold/20 rounded cursor-pointer"
                        title="Modifier"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(product)}
                        className="p-2 text-red-600 hover:bg-red-50 border border-red-200 rounded cursor-pointer"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showCreate && (
        <ProductFormModal
          onClose={() => setShowCreate(false)}
          onSave={handleCreate}
        />
      )}

      {modalProduct && (
        <ProductFormModal
          product={modalProduct}
          onClose={() => setModalProduct(null)}
          onSave={handleUpdate}
        />
      )}
    </div>
  );
}
