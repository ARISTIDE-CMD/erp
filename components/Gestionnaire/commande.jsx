import { useEffect, useMemo, useState } from 'react';
import { Edit, Trash2, Plus, QrCode, X, Search } from 'lucide-react';
import { getClients } from '@/services/clients.service';
import { getArticles } from '@/services/articles.service';
import { createCommande, getCommandes, deleteCommande, updateCommande } from '@/services/commandes.service';
import { incrementNotification } from '@/lib/notifications';
import { formatFCFA } from '@/lib/format';
import QrCodeModal from '@/components/QrCodeModal';

const generateNumero = () => {
  const now = new Date();
  const y = now.getFullYear();
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `CMD-${y}-${rand}`;
};

export default function GestionCommandes() {
  const [commandes, setCommandes] = useState([]);
  const [clients, setClients] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [qrContext, setQrContext] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [newOrder, setNewOrder] = useState({
    client_id: '',
    lignes: [{ id: 1, article_id: '', prix: 0, quantite: 1 }],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [clientsData, articlesData, commandesData] = await Promise.all([
        getClients(),
        getArticles(),
        getCommandes(),
      ]);
      setClients(clientsData);
      setArticles(articlesData);
      setCommandes(commandesData);
    } finally {
      setLoading(false);
    }
  };

  const total = useMemo(
    () => newOrder.lignes.reduce((sum, line) => sum + line.prix * line.quantite, 0),
    [newOrder]
  );

  const filteredCommandes = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return commandes.filter((commande) => {
      const numero = String(commande.numero_commande ?? '').toLowerCase();
      const clientName = String(commande.client?.nom ?? '').toLowerCase();
      const statut = String(commande.statut ?? '');
      const matchesQuery = !query || numero.includes(query) || clientName.includes(query);
      const matchesStatus = statusFilter === 'all' || statut === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [commandes, searchTerm, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredCommandes.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * pageSize;
  const paginatedCommandes = filteredCommandes.slice(pageStart, pageStart + pageSize);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, statusFilter, pageSize]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const getArticleById = (articleId) => articles.find((a) => a.id === articleId);
  const getStockForLine = (line) => getArticleById(line.article_id)?.quantite_stock ?? 0;

  const handleQty = (id, value) => {
    setNewOrder((prev) => ({
      ...prev,
      lignes: prev.lignes.map((line) => {
        if (line.id !== id) return line;
        const stock = getStockForLine(line);
        const wanted = Number(value) || 0;
        if (!line.article_id) {
          return { ...line, quantite: Math.max(1, wanted || 1) };
        }
        if (stock <= 0) {
          return { ...line, quantite: 0 };
        }
        return { ...line, quantite: Math.min(Math.max(1, wanted || 1), stock) };
      }),
    }));
  };

  const handleArticleChange = (id, articleId) => {
    const article = articles.find((a) => a.id === articleId);
    setNewOrder((prev) => ({
      ...prev,
      lignes: prev.lignes.map((line) =>
        line.id === id
          ? {
              ...line,
              article_id: articleId,
              prix: article?.prix_unitaire ?? 0,
              quantite:
                article && article.quantite_stock > 0
                  ? Math.min(Math.max(1, line.quantite), article.quantite_stock)
                  : 0,
            }
          : line
      ),
    }));
  };

  const addLine = () => {
    setNewOrder((prev) => ({
      ...prev,
      lignes: [...prev.lignes, { id: Date.now(), article_id: '', prix: 0, quantite: 1 }],
    }));
  };

  const removeLine = (id) => {
    setNewOrder((prev) => ({
      ...prev,
      lignes: prev.lignes.filter((line) => line.id !== id),
    }));
  };

  const handleCreate = async (statut) => {
    setSaving(true);
    setError('');
    try {
      if (!newOrder.client_id) {
        throw new Error('Veuillez selectionner un client.');
      }
      const lignes = newOrder.lignes
        .filter((l) => l.article_id)
        .map((l) => ({ article_id: l.article_id, quantite: l.quantite, prix: l.prix }));

      if (lignes.length === 0) {
        throw new Error('Ajoutez au moins un article.');
      }

      for (const line of lignes) {
        const article = getArticleById(line.article_id);
        const stock = article?.quantite_stock ?? 0;
        if (line.quantite > stock) {
          throw new Error(`Stock insuffisant pour ${article?.designation ?? 'article'}.`);
        }
        if (stock <= 0) {
          throw new Error(`Stock indisponible pour ${article?.designation ?? 'article'}.`);
        }
      }

      await createCommande(
        {
          numero_commande: generateNumero(),
          statut,
          client_id: newOrder.client_id,
        },
        lignes
      );

      await loadData();
      incrementNotification('admin.commandes', 1, 'ADMIN');
      setNewOrder({ client_id: '', lignes: [{ id: Date.now(), article_id: '', prix: 0, quantite: 1 }] });
      setShowCreateModal(false);
    } catch (e) {
      setError(e.message || 'Erreur lors de la creation.');
    } finally {
      setSaving(false);
    }
  };

  const handleValidate = async (id) => {
    setSaving(true);
    setError('');
    try {
      await updateCommande(id, { statut: 'validee' });
      await loadData();
    } catch (e) {
      setError(e.message || 'Erreur lors de la validation.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Etes-vous sur de vouloir supprimer cette commande ?')) {
      deleteCommande(id)
        .then(loadData)
        .catch((e) => setError(e.message || 'Erreur lors de la suppression.'));
    }
  };

  const getStatutStyle = (statut) => {
    switch (statut) {
      case 'validee':
        return 'bg-green-100 text-green-700';
      case 'en_attente':
        return 'bg-orange-100 text-orange-700';
      case 'livree':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const openCommandeQr = (commande) => {
    const payload = {
      type: 'COMMANDE',
      id: commande.id,
      numero_commande: commande.numero_commande,
      client: commande.client?.nom || '',
      statut: commande.statut || '',
      montant_total: Number(commande.montant_total || 0),
      created_at: commande.created_at || null,
    };
    setQrContext({
      title: `QR Commande ${commande.numero_commande || ''}`.trim(),
      value: JSON.stringify(payload),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-blue-700">Gestion des commandes</h1>
          <p className="text-sm text-gray-500">Creation et suivi des commandes clients.</p>
        </div>
        <button
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
          onClick={() => {
            setError('');
            setShowCreateModal(true);
          }}
          disabled={saving}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nouvelle commande
        </button>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-[80] bg-black/35 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-blue-50 shadow-sm w-full max-w-5xl">
            <div className="p-4 border-b border-blue-50 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-blue-600">Creation d'une commande</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
                title="Fermer"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
                  <select
                    value={newOrder.client_id}
                    onChange={(e) => setNewOrder({ ...newOrder, client_id: e.target.value })}
                    className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selectionner un client</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.nom}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-blue-500 uppercase">Article</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-blue-500 uppercase">Prix</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-blue-500 uppercase">Quantite</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-blue-500 uppercase">Total</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-blue-500 uppercase"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {newOrder.lignes.map((line) => (
                      <tr key={line.id} className="hover:bg-blue-50/40">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <select
                            value={line.article_id}
                            onChange={(e) => handleArticleChange(line.id, e.target.value)}
                            className="w-full border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Selectionner</option>
                            {articles.map((article) => (
                              <option key={article.id} value={article.id}>
                                {article.designation}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{formatFCFA(line.prix, 2)}</td>
                        <td className="px-4 py-3 text-sm">
                          <input
                            type="number"
                            min={getStockForLine(line) > 0 ? 1 : 0}
                            max={getStockForLine(line)}
                            value={line.quantite}
                            onChange={(e) => handleQty(line.id, e.target.value)}
                            className="w-20 border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={getStockForLine(line) <= 0}
                          />
                          {line.article_id && (
                            <div className="text-xs text-gray-500 mt-1">
                              Stock: {getStockForLine(line)}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {formatFCFA(line.prix * line.quantite, 2)}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            className="text-orange-500 hover:text-orange-600"
                            onClick={() => removeLine(line.id)}
                            title="Supprimer ligne"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                className="flex items-center gap-2 text-blue-600 text-sm font-medium"
                onClick={addLine}
              >
                <Plus size={16} /> Ajouter une ligne
              </button>

              <div className="flex items-center justify-between border-t border-blue-50 pt-4">
                <div className="text-sm text-gray-500">Total commande</div>
                <div className="text-xl font-semibold text-orange-500">{formatFCFA(total, 2)}</div>
              </div>

              {error && (
                <div className="text-sm text-orange-600 bg-orange-50 border border-orange-100 rounded-md px-3 py-2">
                  {error}
                </div>
              )}

              <div className="flex flex-wrap justify-center gap-3">
                <button
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-60"
                  onClick={() => handleCreate('en_attente')}
                  disabled={saving}
                >
                  <span className="inline-flex items-center gap-2">
                    {saving && (
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    )}
                    Enregistrer
                  </span>
                </button>
                <button
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-60"
                  onClick={() => handleCreate('validee')}
                  disabled={saving}
                >
                  <span className="inline-flex items-center gap-2">
                    {saving && (
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    )}
                    Valider
                  </span>
                </button>
                <button
                  className="bg-blue-100 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-200 transition-colors"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewOrder({ client_id: '', lignes: [{ id: Date.now(), article_id: '', prix: 0, quantite: 1 }] });
                    setError('');
                  }}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-blue-50 shadow-sm">
        <div className="p-4 border-b border-blue-50 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filtrer par numero ou client..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="en_attente">En attente</option>
            <option value="validee">Validee</option>
            <option value="livree">Livree</option>
          </select>
          <div className="text-sm text-gray-500">{loading ? 'Chargement...' : `${filteredCommandes.length} resultat(s)`}</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">Numero</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">Montant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-6 text-sm text-gray-500 text-center">
                    Chargement des commandes...
                  </td>
                </tr>
              ) : paginatedCommandes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-6 text-sm text-gray-500 text-center">
                    Aucune commande ne correspond au filtre.
                  </td>
                </tr>
              ) : (
                paginatedCommandes.map((commande) => (
                  <tr key={commande.id} className="hover:bg-blue-50/40">
                    <td className="px-6 py-4 text-sm text-gray-900">{commande.numero_commande}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{commande.client?.nom ?? '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {commande.created_at ? new Date(commande.created_at).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${getStatutStyle(commande.statut)}`}>
                        {commande.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {commande.montant_total ? formatFCFA(commande.montant_total, 2) : formatFCFA(0, 2)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {commande.statut === 'en_attente' && (
                          <button
                            className="text-green-600 hover:text-green-700"
                            title="Valider"
                            onClick={() => handleValidate(commande.id)}
                            disabled={saving}
                          >
                            Valider
                          </button>
                        )}
                        <button className="text-blue-500 hover:text-blue-700" title="Modifier">
                          <Edit size={18} />
                        </button>
                        <button
                          className="text-blue-500 hover:text-blue-700"
                          title="QR code"
                          onClick={() => openCommandeQr(commande)}
                        >
                          <QrCode size={18} />
                        </button>
                        <button
                          className="text-orange-500 hover:text-orange-600"
                          onClick={() => handleDelete(commande.id)}
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
            Total: {filteredCommandes.length} commande{filteredCommandes.length > 1 ? 's' : ''} (page {safePage}/{totalPages})
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

      <QrCodeModal
        open={Boolean(qrContext)}
        onClose={() => setQrContext(null)}
        title={qrContext?.title}
        qrValue={qrContext?.value}
      />
    </div>
  );
}
