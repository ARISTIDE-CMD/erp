import { useState } from 'react';
import { Search, Eye } from 'lucide-react';

export default function AdminCommandes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [commandes] = useState([
    { id: 1, numero: 'ORD-2024-011', client: 'Alpha Solutions', date: '02/01/2024', statut: 'Validee', montant: 182.45 },
    { id: 2, numero: 'ORD-2024-012', client: 'Beta Innovations', date: '05/01/2024', statut: 'En attente', montant: 364.75 },
    { id: 3, numero: 'ORD-2024-013', client: 'Gamma Corp', date: '08/01/2024', statut: 'Annulee', montant: 79.99 },
    { id: 4, numero: 'ORD-2024-014', client: 'Studio Nova', date: '10/01/2024', statut: 'Validee', montant: 299.0 },
  ]);

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

  const filtered = commandes.filter((commande) =>
    commande.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    commande.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-blue-700">Suivi des commandes</h1>
          <p className="text-sm text-gray-500">
            Vue en lecture seule pour l'administration. Les commandes sont enregistrees par les gestionnaires.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-white rounded-lg border border-blue-50 shadow-sm p-4">
          <div className="text-sm text-blue-600">Total commandes</div>
          <div className="text-2xl font-semibold text-orange-500 mt-2">{commandes.length}</div>
        </div>
        <div className="bg-white rounded-lg border border-blue-50 shadow-sm p-4">
          <div className="text-sm text-blue-600">En attente</div>
          <div className="text-2xl font-semibold text-orange-500 mt-2">
            {commandes.filter((c) => c.statut === 'En attente').length}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-blue-50 shadow-sm p-4">
          <div className="text-sm text-blue-600">Validees</div>
          <div className="text-2xl font-semibold text-orange-500 mt-2">
            {commandes.filter((c) => c.statut === 'Validee').length}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-blue-50 shadow-sm">
        <div className="p-4 border-b border-blue-50 flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Rechercher une commande..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="text-sm text-gray-500">{filtered.length} resultat(s)</div>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">Details</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filtered.map((commande) => (
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
                    <button className="text-blue-500 hover:text-blue-700" title="Voir">
                      <Eye size={18} />
                    </button>
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
