import { useEffect, useState } from 'react';
import { X, Plus, Trash2, Upload } from 'lucide-react';
import { fetchCategories } from '../../services/catalog';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  sale_price: '',
  stock: '0',
  category_id: '',
  is_featured: false,
  is_active: true,
};

export default function ProductFormModal({ product, onClose, onSave }) {
  const isEdit = Boolean(product);
  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState(['']);
  const [replaceImages, setReplaceImages] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        description: product.description || '',
        price: String(product.price ?? ''),
        sale_price: product.sale_price != null ? String(product.sale_price) : '',
        stock: String(product.stock ?? 0),
        category_id: String(product.category_id || product.category?.id || ''),
        is_featured: Boolean(product.is_featured),
        is_active: product.is_active !== false,
      });
      setImageUrls(['']);
      setPreviews(
        (product.images || []).map((img) => ({
          id: img.id,
          url: img.url,
          existing: true,
        }))
      );
    } else {
      setForm(emptyForm);
      setPreviews([]);
    }
    setImageFiles([]);
    setReplaceImages(false);
  }, [product]);

  useEffect(() => {
    const filePreviews = imageFiles.map((file) => ({
      url: URL.createObjectURL(file),
      existing: false,
      file,
    }));
    return () => filePreviews.forEach((p) => URL.revokeObjectURL(p.url));
  }, [imageFiles]);

  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files || []);
    setImageFiles((prev) => [...prev, ...files]);
  };

  const removeNewFile = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const buildFormData = () => {
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('description', form.description);
    fd.append('price', form.price);
    if (form.sale_price) fd.append('sale_price', form.sale_price);
    fd.append('stock', form.stock);
    fd.append('category_id', form.category_id);
    fd.append('is_featured', form.is_featured ? '1' : '0');
    fd.append('is_active', form.is_active ? '1' : '0');

    imageUrls.forEach((url, i) => {
      if (url.trim()) fd.append(`image_urls[${i}]`, url.trim());
    });

    imageFiles.forEach((file, i) => {
      fd.append(`images[${i}]`, file);
    });

    if (isEdit && replaceImages) {
      fd.append('replace_images', '1');
    }

    return fd;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.description || !form.price || !form.category_id) {
      setError('Remplissez le nom, la description, le prix et la catégorie.');
      return;
    }

    if (!isEdit && imageFiles.length === 0 && !imageUrls.some((u) => u.trim())) {
      setError('Ajoutez au moins une photo (fichier ou lien).');
      return;
    }

    setSaving(true);
    try {
      await onSave(buildFormData());
      onClose();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        Object.values(err.response?.data?.errors || {}).flat().join(' ') ||
        'Erreur lors de l\'enregistrement.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60">
      <div className="bg-white rounded-lg border border-gold/20 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gold/10 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-serif font-bold text-navy">
            {isEdit ? 'Modifier le bijou' : 'Nouveau bijou'}
          </h2>
          <button type="button" onClick={onClose} className="text-navy/50 hover:text-navy cursor-pointer">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-left">
          {error && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-3">{error}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-navy uppercase tracking-wider">Nom du bijou *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full mt-1 border border-gold/25 rounded px-3 py-2 text-sm outline-none focus:border-gold"

              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-navy uppercase tracking-wider">Description *</label>
              <textarea
                required
                rows={5}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full mt-1 border border-gold/25 rounded px-3 py-2 text-sm outline-none focus:border-gold resize-y"

              />
            </div>

            <div>
              <label className="text-xs font-bold text-navy uppercase tracking-wider">Prix (DA) *</label>
              <input
                type="number"
                required
                min="0"
                step="1"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full mt-1 border border-gold/25 rounded px-3 py-2 text-sm outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-navy uppercase tracking-wider">Prix promo (DA)</label>
              <input
                type="number"
                min="0"
                step="1"
                value={form.sale_price}
                onChange={(e) => setForm({ ...form, sale_price: e.target.value })}
                className="w-full mt-1 border border-gold/25 rounded px-3 py-2 text-sm outline-none focus:border-gold"

              />
            </div>

            <div>
              <label className="text-xs font-bold text-navy uppercase tracking-wider">Stock *</label>
              <input
                type="number"
                required
                min="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full mt-1 border border-gold/25 rounded px-3 py-2 text-sm outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-navy uppercase tracking-wider">Catégorie *</label>
              <select
                required
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                className="w-full mt-1 border border-gold/25 rounded px-3 py-2 text-sm outline-none focus:border-gold"
              >
                <option value="">Choisir...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-navy cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                className="accent-gold"
              />
              Best-seller / vedette
            </label>
            <label className="flex items-center gap-2 text-sm text-navy cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                className="accent-gold"
              />
              Visible sur la boutique
            </label>
          </div>

          {/* Photos existantes (édition) */}
          {previews.length > 0 && (
            <div>
              <p className="text-xs font-bold text-navy uppercase tracking-wider mb-2">Photos actuelles</p>
              <div className="flex flex-wrap gap-3">
                {previews.map((img) => (
                  <div key={img.id || img.url} className="relative w-20 h-20 rounded border border-gold/20 overflow-hidden">
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              {isEdit && (
                <label className="flex items-center gap-2 mt-2 text-sm text-navy cursor-pointer">
                  <input
                    type="checkbox"
                    checked={replaceImages}
                    onChange={(e) => setReplaceImages(e.target.checked)}
                    className="accent-gold"
                  />
                  Remplacer toutes les photos par les nouvelles ci-dessous
                </label>
              )}
            </div>
          )}

          {/* Upload fichiers */}
          <div>
            <label className="text-xs font-bold text-navy uppercase tracking-wider">Photos (fichiers)</label>
            <label className="mt-2 flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gold/30 rounded-lg cursor-pointer hover:border-gold/60 transition-colors">
              <Upload className="h-8 w-8 text-gold mb-1" />
              <span className="text-sm text-navy/60">Cliquez pour ajouter des images (JPG, PNG — max 5 Mo)</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="hidden"
                onChange={handleFilesChange}
              />
            </label>
            {imageFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {imageFiles.map((file, i) => (
                  <div key={i} className="relative w-16 h-16 rounded overflow-hidden border border-gold/20">
                    <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeNewFile(i)}
                      className="absolute top-0 right-0 bg-red-600 text-white p-0.5 cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* URLs images */}
          <div>
            <label className="text-xs font-bold text-navy uppercase tracking-wider">Ou liens photo (URL)</label>
            {imageUrls.map((url, i) => (
              <div key={i} className="flex gap-2 mt-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => {
                    const next = [...imageUrls];
                    next[i] = e.target.value;
                    setImageUrls(next);
                  }}

                  className="flex-1 border border-gold/25 rounded px-3 py-2 text-sm outline-none focus:border-gold"
                />
                {imageUrls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setImageUrls(imageUrls.filter((_, j) => j !== i))}
                    className="text-red-600 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => setImageUrls([...imageUrls, ''])}
              className="mt-2 text-sm text-gold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="h-4 w-4" /> Ajouter un lien
            </button>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gold/10">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gold/30 text-navy py-3 rounded font-bold text-sm cursor-pointer hover:bg-cream-100"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-gold hover:bg-navy text-navy hover:text-gold border border-gold py-3 rounded font-bold text-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              {saving ? 'Enregistrement...' : isEdit ? 'Mettre à jour' : 'Créer le bijou'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
