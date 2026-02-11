import React, { useState } from 'react';
import { Edit, Trash2, Package, ShoppingCart, Users, FileText } from 'lucide-react';

export default function GestionArticles() {
    const [articles, setArticles] = useState([
        { id: 1, ref: 'REF-A001', nom: 'Clavier mécanique RGB', prix: 89.99, quantite: 150 },
        { id: 2, ref: 'REF-B002', nom: 'Souris gaming sans fil', prix: 59.99, quantite: 230 },
        { id: 3, ref: 'REF-C003', nom: 'Ecran incurvé 27 pouces', prix: 349.99, quantite: 75 },
        { id: 4, ref: 'REF-D004', nom: 'Webcam HD 1080p', prix: 45.00, quantite: 300 },
        { id: 5, ref: 'REF-E005', nom: 'Casque audio Bluetooth', prix: 79.95, quantite: 180 },
    ]);

    const handleDelete = (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
            setArticles(articles.filter(article => article.id !== id));
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-64 bg-blue-50 flex flex-col">
                {/* Logo */}
                <div className="bg-blue-500 p-4 flex items-center gap-2 text-white">
                    <div className="bg-white rounded p-1">
                        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M4 4h7v7H4V4zm0 9h7v7H4v-7zm9-9h7v7h-7V4zm0 9h7v7h-7v-7z" />
                        </svg>
                    </div>
                    <span className="font-semibold">Molige ERP</span>
                </div>

                {/* Menu */}
                <nav className="flex-1 p-3">
                    <button className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-md flex items-center gap-2 mb-2 transition-colors">
                        <Package size={18} />
                        Articles
                    </button>
                    <button className="w-full text-blue-400 hover:bg-blue-100 px-4 py-2.5 rounded-md flex items-center gap-2 mb-2 transition-colors">
                        <ShoppingCart size={18} />
                        Commandes
                    </button>
                    <button className="w-full text-blue-400 hover:bg-blue-100 px-4 py-2.5 rounded-md flex items-center gap-2 mb-2 transition-colors">
                        <Users size={18} />
                        Clients
                    </button>
                    <button className="w-full text-blue-400 hover:bg-blue-100 px-4 py-2.5 rounded-md flex items-center gap-2 mb-2 transition-colors">
                        <FileText size={18} />
                        Documents
                    </button>
                </nav>

                {/* Logout */}
                <button className="p-4 text-blue-400 hover:bg-blue-100 flex items-center gap-2 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                </button>
            </div>

            {/* Main content */}
            <div className="flex-1 overflow-auto">
                {/* Header */}
                <div className="bg-blue-500 text-white p-4 flex justify-between items-center">
                    <h1 className="text-xl font-semibold">Gestion des Articles</h1>
                    <div className="bg-white rounded-full p-2">
                        <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="bg-white rounded-lg shadow">
                        {/* Table Header with Add Button */}
                        <div className="p-4 border-b flex justify-between items-center bg-blue-50">
                            <div className="flex items-center gap-2 text-blue-500">
                                <Package size={20} />
                                <span className="font-medium">Liste des articles</span>
                            </div>
                            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Ajouter un article
                            </button>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Référence
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nom
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Prix
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Quantité
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {articles.map((article) => (
                                        <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{article.ref}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{article.nom}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{article.prix.toFixed(2)} €</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{article.quantite}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex gap-2">
                                                    <button
                                                        className="text-blue-500 hover:text-blue-700 transition-colors"
                                                        title="Modifier"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        className="text-red-500 hover:text-red-700 transition-colors"
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

                        {/* Table Footer */}
                        <div className="px-6 py-4 bg-gray-50 border-t">
                            <div className="text-sm text-gray-600">
                                Total: {articles.length} article{articles.length > 1 ? 's' : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}