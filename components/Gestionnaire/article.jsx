import { useState } from 'react';
import { Edit, Trash2, Package } from 'lucide-react';

export default function GestionArticles() {
  const [articles, setArticles] = useState([
    { id: 1, ref: 'REF-A001', nom: 'Clavier mecanique RGB', prix: 89.99, quantite: 150 },
    { id: 2, ref: 'REF-B002', nom: 'Souris gaming sans fil', prix: 59.99, quantite: 230 },
    { id: 3, ref: 'REF-C003', nom: 'Ecran incurve 27 pouces', prix: 349.99, quantite: 75 },
    { id: 4, ref: 'REF-D004', nom: 'Webcam HD 1080p', prix: 45.0, quantite: 300 },
    { id: 5, ref: 'REF-E005', nom: 'Casque audio Bluetooth', prix: 79.95, quantite: 180 },
  ]);

  const handleDelete = (id) => {
    if (window.confirm('Etes-vous sur de vouloir supprimer cet article ?')) {
      setArticles(articles.filter((article) => article.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-blue-700">Gestion des articles</h1>
          <p className="text-sm text-gray-500">Suivez vos references, prix et quantites en stock.</p>
        </div>
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors">
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

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">Reference</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">Designation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">Prix</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">Quantite</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-blue-50/40">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{article.ref}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{article.nom}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{article.prix.toFixed(2)} €</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{article.quantite}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="text-blue-500 hover:text-blue-700" title="Modifier">
                        <Edit size={18} />
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
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-blue-50 border-t border-blue-100 text-sm text-gray-600">
          Total: {articles.length} article{articles.length > 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}
