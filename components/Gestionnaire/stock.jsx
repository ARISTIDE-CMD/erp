import { useState } from 'react';
import { Search, AlertTriangle } from 'lucide-react';

export default function GestionStocks() {
  const [searchTerm, setSearchTerm] = useState('');
  const [stocks] = useState([
    { id: 1, reference: 'ART001', article: 'Disque dur SSD 1TB', quantite: 75, seuilCritique: 20 },
    { id: 2, reference: 'ART002', article: 'Module RAM DDR4 16GB', quantite: 12, seuilCritique: 15 },
    { id: 3, reference: 'ART003', article: 'Processeur Intel i7', quantite: 30, seuilCritique: 10 },
    { id: 4, reference: 'ART004', article: 'Carte graphique RTX 3060', quantite: 5, seuilCritique: 8 },
    { id: 5, reference: 'ART005', article: 'Ecran 27 pouces Full HD', quantite: 45, seuilCritique: 25 },
    { id: 6, reference: 'ART006', article: 'Clavier mecanique RGB', quantite: 18, seuilCritique: 20 },
    { id: 7, reference: 'ART007', article: 'Souris gaming sans fil', quantite: 60, seuilCritique: 30 },
    { id: 8, reference: 'ART008', article: 'Webcam HD 1080p', quantite: 22, seuilCritique: 20 },
    { id: 9, reference: 'ART009', article: 'Casque audio sans fil', quantite: 9, seuilCritique: 10 },
    { id: 10, reference: 'ART010', article: 'Adaptateur USB-C multi-ports', quantite: 35, seuilCritique: 15 },
    { id: 11, reference: 'ART011', article: 'Imprimante multifonction', quantite: 8, seuilCritique: 10 },
    { id: 12, reference: 'ART012', article: 'Routeur Wi-Fi 6', quantite: 7, seuilCritique: 12 },
    { id: 13, reference: 'ART013', article: 'Serveur NAS 8TB', quantite: 3, seuilCritique: 5 },
  ]);

  const filteredStocks = stocks.filter((stock) =>
    stock.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.article.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getQuantiteStyle = (quantite, seuilCritique) => {
    if (quantite <= seuilCritique) {
      return 'text-orange-600 font-semibold';
    }
    return 'text-gray-900';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-blue-700">Gestion des stocks</h1>
          <p className="text-sm text-gray-500">Surveillez les niveaux de stock et les alertes critiques.</p>
        </div>
        <button className="flex items-center gap-2 text-orange-500 font-medium">
          <AlertTriangle size={18} />
          Stocks faibles
        </button>
      </div>

      <div className="bg-white rounded-lg border border-blue-50 shadow-sm">
        <div className="p-4 border-b border-blue-50 flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher par article ou reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="text-sm text-gray-500">{filteredStocks.length} articles</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">Reference</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">Article</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">Quantite</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">Seuil critique</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredStocks.map((stock) => (
                <tr key={stock.id} className="hover:bg-blue-50/40">
                  <td className="px-6 py-4 text-sm text-gray-900">{stock.reference}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{stock.article}</td>
                  <td className={`px-6 py-4 text-sm ${getQuantiteStyle(stock.quantite, stock.seuilCritique)}`}>
                    {stock.quantite}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{stock.seuilCritique}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
