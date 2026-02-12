import { useEffect, useMemo, useRef, useState } from 'react';
import { Edit, Trash2, Package, X, QrCode, Search } from 'lucide-react';
import { getArticles, createArticle, updateArticle, deleteArticle, uploadArticleImage } from '@/services/articles.service';
import { formatFCFA } from '@/lib/format';
import { syncStockAlerts } from '@/lib/notifications';
import QrCodeModal from '@/components/QrCodeModal';

export default function GestionArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [reference, setReference] = useState('');
  const [designation, setDesignation] = useState('');
  const [prixUnitaire, setPrixUnitaire] = useState('');
  const [quantiteStock, setQuantiteStock] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [editingImageFile, setEditingImageFile] = useState(null);
  const [removeEditingImage, setRemoveEditingImage] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [qrContext, setQrContext] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const preloadedImageUrlsRef = useRef(new Set());

  useEffect(() => {
    loadArticles();
  }, []);

  useEffect(() => {
    articles.forEach((article) => {
      const imageUrl = article?.image_url;
      if (imageUrl && !preloadedImageUrlsRef.current.has(imageUrl)) {
        preloadedImageUrlsRef.current.add(imageUrl);
        const img = new Image();
        img.decoding = 'async';
        img.src = imageUrl;
      }
    });
  }, [articles]);

  useEffect(() => {
    const handleWheelOutsideImage = (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const isOnImageTrigger = target.closest('[data-article-image-trigger="true"]');
      if (!isOnImageTrigger) {
        setPreviewImage(null);
      }
    };

    window.addEventListener('wheel', handleWheelOutsideImage, { passive: true });
    return () => window.removeEventListener('wheel', handleWheelOutsideImage);
  }, []);

  useEffect(() => {
    if (!previewImage) return;

    const handleMouseMoveOutsideImage = (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const isOnImageTrigger = target.closest('[data-article-image-trigger="true"]');
      if (!isOnImageTrigger) {
        setPreviewImage(null);
      }
    };

    window.addEventListener('mousemove', handleMouseMoveOutsideImage, true);
    return () => window.removeEventListener('mousemove', handleMouseMoveOutsideImage, true);
  }, [previewImage]);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const data = await getArticles();
      setArticles(data);
      syncStockAlerts(data, -5, 'ADMIN');
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return articles.filter((article) => {
      const ref = String(article.reference ?? article.ref ?? '').toLowerCase();
      const designationValue = String(article.designation ?? article.nom ?? '').toLowerCase();
      const qty = Number(article.quantite_stock ?? article.quantite ?? 0);
      const matchesQuery = !query || ref.includes(query) || designationValue.includes(query);
      const matchesStock =
        stockFilter === 'all' ||
        (stockFilter === 'in_stock' && qty > 0) ||
        (stockFilter === 'low_stock' && qty > 0 && qty <= 5) ||
        (stockFilter === 'out_stock' && qty <= 0);
      return matchesQuery && matchesStock;
    });
  }, [articles, searchTerm, stockFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * pageSize;
  const paginatedArticles = filteredArticles.slice(pageStart, pageStart + pageSize);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, stockFilter, pageSize]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const handleCreate = async () => {
    setError('');
    setCreating(true);
    try {
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadArticleImage(imageFile, reference || designation || 'article');
      }
      await createArticle({
        reference,
        designation,
        prix_unitaire: Number(prixUnitaire) || 0,
        quantite_stock: Number(quantiteStock) || 0,
        image_url: imageUrl,
      });
      await loadArticles();
      setShowModal(false);
      setReference('');
      setDesignation('');
      setPrixUnitaire('');
      setQuantiteStock('');
      setImageFile(null);
    } catch (e) {
      setError(e.message || 'Erreur lors de la creation.');
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = (article) => {
    setError('');
    setEditingArticle(article);
    setReference(article.reference ?? article.ref ?? '');
    setDesignation(article.designation ?? article.nom ?? '');
    setPrixUnitaire(String(article.prix_unitaire ?? article.prix ?? ''));
    setQuantiteStock(String(article.quantite_stock ?? article.quantite ?? ''));
    setEditingImageFile(null);
    setRemoveEditingImage(false);
  };

  const handleUpdate = async () => {
    if (!editingArticle) return;
    setError('');
    setUpdating(true);
    try {
      let nextImageUrl = editingArticle.image_url ?? null;
      if (editingImageFile) {
        nextImageUrl = await uploadArticleImage(
          editingImageFile,
          reference || designation || editingArticle.id
        );
      } else if (removeEditingImage) {
        nextImageUrl = null;
      }

      await updateArticle(editingArticle.id, {
        reference,
        designation,
        prix_unitaire: Number(prixUnitaire) || 0,
        quantite_stock: Number(quantiteStock) || 0,
        image_url: nextImageUrl,
      });
      await loadArticles();
      setEditingArticle(null);
      setReference('');
      setDesignation('');
      setPrixUnitaire('');
      setQuantiteStock('');
      setEditingImageFile(null);
      setRemoveEditingImage(false);
    } catch (e) {
      setError(e.message || 'Erreur lors de la modification.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Etes-vous sur de vouloir supprimer cet article ?')) {
      deleteArticle(id)
        .then(loadArticles)
        .catch((e) => {
          setError(e.message || 'Erreur lors de la suppression.');
        });
    }
  };

  const openArticleQr = (article) => {
    const payload = {
      type: 'ARTICLE',
      id: article.id,
      reference: article.reference ?? article.ref ?? '',
      designation: article.designation ?? article.nom ?? '',
      prix_unitaire: Number(article.prix_unitaire ?? article.prix ?? 0),
      quantite_stock: Number(article.quantite_stock ?? article.quantite ?? 0),
    };

    setQrContext({
      title: `QR Article ${payload.reference || payload.id?.slice(0, 8) || ''}`.trim(),
      value: JSON.stringify(payload),
    });
  };

  const ProductImage = ({ article }) => {
    const computePreviewPosition = (anchorX, anchorY) => {
      const previewWidth = 224;
      const previewHeight = 268;
      const margin = 12;
      let x = anchorX + 16;
      let y = anchorY - previewHeight / 2;

      if (x + previewWidth > window.innerWidth - margin) {
        x = anchorX - previewWidth - 16;
      }
      if (x < margin) x = margin;

      if (y + previewHeight > window.innerHeight - margin) {
        y = window.innerHeight - previewHeight - margin;
      }
      if (y < margin) y = margin;

      return { x, y };
    };

    const showImagePreview = (event) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const fallbackX = rect.right;
      const fallbackY = rect.top + rect.height / 2;
      const anchorX = Number.isFinite(event.clientX) && event.clientX > 0 ? event.clientX : fallbackX;
      const anchorY = Number.isFinite(event.clientY) && event.clientY > 0 ? event.clientY : fallbackY;
      const { x, y } = computePreviewPosition(anchorX, anchorY);

      setPreviewImage({
        imageUrl: article?.image_url || null,
        designation: article?.designation ?? article?.nom ?? 'Produit',
        x,
        y,
      });
    };

    if (article?.image_url) {
      return (
        <div
          data-article-image-trigger="true"
          onMouseEnter={showImagePreview}
          onMouseMove={showImagePreview}
          onWheel={showImagePreview}
          onMouseLeave={() => setPreviewImage(null)}
          className="inline-flex"
        >
          <img
            src={article.image_url}
            alt={article.designation ?? article.nom ?? 'Produit'}
            className="h-10 w-10 rounded-md object-cover border border-blue-100 bg-white"
            loading="eager"
            decoding="async"
          />
        </div>
      );
    }

    return (
      <div
        data-article-image-trigger="true"
        onMouseEnter={showImagePreview}
        onMouseMove={showImagePreview}
        onWheel={showImagePreview}
        onMouseLeave={() => setPreviewImage(null)}
        className="inline-flex"
      >
        <div className="h-10 w-10 rounded-md border border-blue-100 bg-blue-50 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-blue-300" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5z" />
            <path d="M7.5 15.5l2.5-2.5 2 2 2.5-3 2.5 3.5" />
            <circle cx="9" cy="9" r="1.2" />
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-blue-700">Gestion des articles</h1>
          <p className="text-sm text-gray-500">Suivez vos references, prix et quantites en stock.</p>
        </div>
        <button
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
          onClick={() => {
            setError('');
            setImageFile(null);
            setShowModal(true);
          }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Ajouter un article
        </button>
      </div>

      <div className="bg-white rounded-lg border border-blue-50 shadow-sm">
        <div className="p-4 border-b border-blue-50 flex items-center gap-2 text-blue-600">
          <Package size={20} />
          <span className="font-medium">Liste des articles</span>
        </div>
        <div className="p-4 border-b border-blue-50 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Filtrer par reference ou designation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les stocks</option>
            <option value="in_stock">En stock</option>
            <option value="low_stock">Stock faible (1-5)</option>
            <option value="out_stock">Rupture</option>
          </select>
          <div className="text-sm text-gray-500">{loading ? 'Chargement...' : `${filteredArticles.length} resultat(s)`}</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">Reference</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">Designation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">Prix</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">Quantite</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-6 text-sm text-gray-500 text-center">
                    Chargement des articles...
                  </td>
                </tr>
              ) : paginatedArticles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-6 text-sm text-gray-500 text-center">
                    Aucun article ne correspond au filtre.
                  </td>
                </tr>
              ) : (
                paginatedArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-blue-50/40">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <ProductImage article={article} />
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {article.reference ?? article.ref}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {article.designation ?? article.nom}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatFCFA(Number(article.prix_unitaire ?? article.prix), 2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {article.quantite_stock ?? article.quantite}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          className="text-blue-500 hover:text-blue-700"
                          title="Modifier"
                          onClick={() => handleEdit(article)}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="text-blue-500 hover:text-blue-700"
                          title="QR code"
                          onClick={() => openArticleQr(article)}
                        >
                          <QrCode size={18} />
                        </button>
                        <button
                          className="text-orange-500 hover:text-orange-600"
                          onClick={() => handleDelete(article.id)}
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-blue-50 border-t border-blue-100 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600">
          <div>
            Total: {filteredArticles.length} article{filteredArticles.length > 1 ? 's' : ''} (page {safePage}/{totalPages})
          </div>
          <div className="flex items-center gap-2">
            <span>Par page</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="border border-blue-200 rounded-md px-2 py-1 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={safePage <= 1}
              className="px-3 py-1 rounded-md border border-blue-200 text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-100"
            >
              Precedent
            </button>
            <button
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={safePage >= totalPages}
              className="px-3 py-1 rounded-md border border-blue-200 text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-100"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[80] bg-black/35 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-blue-50">
              <h2 className="text-lg font-semibold text-blue-700">Nouvel article</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setImageFile(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reference</label>
                  <input
                    type="text"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="REF-0001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nom de l'article"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prix unitaire</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={prixUnitaire}
                    onChange={(e) => setPrixUnitaire(e.target.value)}
                    className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantite</label>
                  <input
                    type="number"
                    min="0"
                    value={quantiteStock}
                    onChange={(e) => setQuantiteStock(e.target.value)}
                    className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Image du produit (optionnel)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {error && (
                <div className="text-sm text-orange-600 bg-orange-50 border border-orange-100 rounded-md px-3 py-2">
                  {error}
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-blue-50 flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-md text-blue-600 border border-blue-200 hover:bg-blue-50"
                onClick={() => {
                  setShowModal(false);
                  setImageFile(null);
                }}
              >
                Annuler
              </button>
              <button
                className="px-4 py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-60"
                onClick={handleCreate}
                disabled={creating}
              >
                <span className="inline-flex items-center gap-2">
                  {creating && (
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  )}
                  {creating ? 'Enregistrement...' : 'Enregistrer'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {editingArticle && (
        <div className="fixed inset-0 z-[80] bg-black/35 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-blue-50">
              <h2 className="text-lg font-semibold text-blue-700">Modifier l'article</h2>
              <button
                onClick={() => {
                  setEditingArticle(null);
                  setEditingImageFile(null);
                  setRemoveEditingImage(false);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reference</label>
                  <input
                    type="text"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prix unitaire</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={prixUnitaire}
                    onChange={(e) => setPrixUnitaire(e.target.value)}
                    className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantite</label>
                  <input
                    type="number"
                    min="0"
                    value={quantiteStock}
                    onChange={(e) => setQuantiteStock(e.target.value)}
                    className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Image du produit</label>
                <div className="mb-2">
                  {editingArticle?.image_url && !removeEditingImage && !editingImageFile ? (
                    <img
                      src={editingArticle.image_url}
                      alt={designation || 'Article'}
                      className="h-24 w-24 rounded-md object-cover border border-blue-100 bg-white"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-md border border-blue-100 bg-blue-50 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="h-8 w-8 text-blue-300" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5z" />
                        <path d="M7.5 15.5l2.5-2.5 2 2 2.5-3 2.5 3.5" />
                        <circle cx="9" cy="9" r="1.2" />
                      </svg>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    setEditingImageFile(file);
                    if (file) setRemoveEditingImage(false);
                  }}
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {editingArticle?.image_url && (
                  <button
                    type="button"
                    className="mt-2 text-xs text-orange-600 hover:text-orange-700"
                    onClick={() => {
                      setRemoveEditingImage((v) => !v);
                      setEditingImageFile(null);
                    }}
                  >
                    {removeEditingImage ? "Conserver l'image actuelle" : "Supprimer l'image actuelle"}
                  </button>
                )}
              </div>

              {error && (
                <div className="text-sm text-orange-600 bg-orange-50 border border-orange-100 rounded-md px-3 py-2">
                  {error}
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-blue-50 flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-md text-blue-600 border border-blue-200 hover:bg-blue-50"
                onClick={() => {
                  setEditingArticle(null);
                  setEditingImageFile(null);
                  setRemoveEditingImage(false);
                }}
              >
                Annuler
              </button>
              <button
                className="px-4 py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-60"
                onClick={handleUpdate}
                disabled={updating}
              >
                <span className="inline-flex items-center gap-2">
                  {updating && (
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  )}
                  {updating ? 'Mise a jour...' : 'Enregistrer'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      <QrCodeModal
        open={Boolean(qrContext)}
        onClose={() => setQrContext(null)}
        title={qrContext?.title}
        qrValue={qrContext?.value}
      />

      {previewImage && (
        <div
          className="fixed z-[120] pointer-events-none rounded-lg border border-blue-100 bg-white shadow-2xl p-2"
          style={{ left: `${previewImage.x}px`, top: `${previewImage.y}px` }}
        >
          {previewImage.imageUrl ? (
            <img
              src={previewImage.imageUrl}
              alt={previewImage.designation}
              className="h-52 w-52 rounded object-cover"
              loading="eager"
              decoding="async"
            />
          ) : (
            <div className="h-52 w-52 rounded bg-blue-50 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="h-12 w-12 text-blue-300" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5z" />
                <path d="M7.5 15.5l2.5-2.5 2 2 2.5-3 2.5 3.5" />
                <circle cx="9" cy="9" r="1.2" />
              </svg>
            </div>
          )}
          <div className="mt-1 text-[11px] text-gray-600 max-w-[208px] truncate">{previewImage.designation}</div>
        </div>
      )}
    </div>
  );
}
