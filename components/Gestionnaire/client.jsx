import { useState } from 'react';
import { Edit, Trash2, Search } from 'lucide-react';

export default function GestionnaireClients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState([
    { id: 1, nom: 'Dupont Jean', telephone: '06 12 34 56 78', adresse: '12 Rue de la Paix, 75001 Paris' },
    { id: 2, nom: 'Martin Sophie', telephone: '07 23 45 67 89', adresse: '24 Avenue des Champs, 69002 Lyon' },
    { id: 3, nom: 'Bernard Paul', telephone: '06 34 56 78 90', adresse: "3 Boulevard de l'Europe, 13008 Marseille" },
    { id: 4, nom: 'Petit Marie', telephone: '07 45 67 89 01', adresse: '45 Rue des Lilas, 31000 Toulouse' },
  ]);

  const handleDelete = (id) => {
    if (window.confirm('Etes-vous sur de vouloir supprimer ce client ?')) {
      setClients(clients.filter((client) => client.id !== id));
    }
  };

  const filteredClients = clients.filter((client) =>
    client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.telephone.includes(searchTerm) ||
    client.adresse.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-blue-700">Gestion des clients</h1>
          <p className="text-sm text-gray-500">Gerez la base clients et leurs coordonnees.</p>
        </div>
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Ajouter un client
        </button>
      </div>

      <div className="bg-white rounded-lg border border-blue-50 shadow-sm">
        <div className="p-4 border-b border-blue-50 flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher un client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="text-sm text-gray-500">
            {filteredClients.length} client{filteredClients.length > 1 ? 's' : ''}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">Telephone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">Adresse</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-blue-50/40">
                  <td className="px-6 py-4 text-sm text-gray-900">{client.nom}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{client.telephone}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{client.adresse}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="text-blue-500 hover:text-blue-700" title="Modifier">
                        <Edit size={18} />
                      </button>
                      <button
                        className="text-orange-500 hover:text-orange-600"
                        onClick={() => handleDelete(client.id)}
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
