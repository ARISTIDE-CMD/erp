import { useMemo, useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';

export default function GestionCommandes() {
  const [commandes, setCommandes] = useState([
    { id: 1, numero: 'ORD-2024-021', client: 'Alpha Solutions', date: '10/01/2024', statut: 'Validee', montant: 182.45 },
    { id: 2, numero: 'ORD-2024-022', client: 'Beta Innovations', date: '12/01/2024', statut: 'En attente', montant: 364.75 },
    { id: 3, numero: 'ORD-2024-023', client: 'Gamma Corp', date: '15/01/2024', statut: 'Annulee', montant: 79.99 },
  ]);

  const [newOrder, setNewOrder] = useState({
    client: 'Alpha Solutions',
    lignes: [
      { id: 1, article: 'Clavier mecanique', prix: 89.99, quantite: 1 },
      { id: 2, article: 'Souris sans fil', prix: 59.99, quantite: 2 },
    ],
  });

  const total = useMemo(
    () => newOrder.lignes.reduce((sum, line) => sum + line.prix * line.quantite, 0),
    [newOrder]
  );

  const handleQty = (id, value) => {
    setNewOrder((prev) => ({
      ...prev,
      lignes: prev.lignes.map((line) =>
        line.id === id ? { ...line, quantite: Math.max(1, Number(value) || 1) } : line
      ),
    }));
  };

  const handleDelete = (id) => {
    if (window.confirm('Etes-vous sur de vouloir supprimer cette commande ?')) {
      setCommandes(commandes.filter((commande) => commande.id !== id));
    }
  };

  const getStatutStyle = (statut) => {
    switch (statut) {
      case 'Validee':
        return 'bg-green-100 text-green-700';
      case 'En attente':
        return 'bg-orange-100 text-orange-700';
      case 'Annulee':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-blue-700">Gestion des commandes</h1>
          <p className="text-sm text-gray-500">Creation et suivi des commandes clients.</p>
        </div>
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nouvelle commande
        </button>
      </div>

      <div className="bg-white rounded-lg border border-blue-50 shadow-sm">
        <div className="p-4 border-b border-blue-50">
          <h2 className="text-lg font-semibold text-blue-600">Creation d'une commande</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
              <select
                value={newOrder.client}
                onChange={(e) => setNewOrder({ ...newOrder, client: e.target.value })}
                className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Alpha Solutions</option>
                <option>Beta Innovations</option>
                <option>Gamma Corp</option>
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {newOrder.lignes.map((line) => (
                  <tr key={line.id} className="hover:bg-blue-50/40">
                    <td className="px-4 py-3 text-sm text-gray-900">{line.article}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{line.prix.toFixed(2)} €</td>
                    <td className="px-4 py-3 text-sm">
                      <input
                        type="number"
                        min="1"
                        value={line.quantite}
                        onChange={(e) => handleQty(line.id, e.target.value)}
                        className="w-20 border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {(line.prix * line.quantite).toFixed(2)} €
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-blue-50 pt-4">
            <div className="text-sm text-gray-500">Total commande</div>
            <div className="text-xl font-semibold text-orange-500">{total.toFixed(2)} €</div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors">
              Enregistrer
            </button>
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md transition-colors">
              Valider
            </button>
            <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-200 transition-colors">
              Annuler
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-blue-50 shadow-sm">
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
              {commandes.map((commande) => (
                <tr key={commande.id} className="hover:bg-blue-50/40">
                  <td className="px-6 py-4 text-sm text-gray-900">{commande.numero}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{commande.client}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{commande.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${getStatutStyle(commande.statut)}`}>
                      {commande.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{commande.montant.toFixed(2)} €</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="text-blue-500 hover:text-blue-700" title="Modifier">
                        <Edit size={18} />
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
