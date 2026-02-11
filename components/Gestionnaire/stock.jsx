import React, { useState } from 'react';
import { Package, ShoppingCart, Users, FileText, Search, Download } from 'lucide-react';

export default function GestionStocks() {
    const [searchTerm, setSearchTerm] = useState('');
    const [stocks, setStocks] = useState([
        { id: 1, reference: 'ART001', article: 'Disque dur SSD 1TB', quantite: 75, seuilCritique: 20 },
        { id: 2, reference: 'ART002', article: 'Module RAM DDR4 16GB', quantite: 12, seuilCritique: 15 },
        { id: 3, reference: 'ART003', article: 'Processeur Intel i7', quantite: 30, seuilCritique: 10 },
        { id: 4, reference: 'ART004', article: 'Carte graphique RTX 3060', quantite: 5, seuilCritique: 8 },
        { id: 5, reference: 'ART005', article: 'Ecran 27 pouces Full HD', quantite: 45, seuilCritique: 25 },
        { id: 6, reference: 'ART006', article: 'Clavier mécanique RGB', quantite: 18, seuilCritique: 20 },
        { id: 7, reference: 'ART007', article: 'Souris gaming sans fil', quantite: 60, seuilCritique: 30 },
        { id: 8, reference: 'ART008', article: 'Webcam HD 1080p', quantite: 22, seuilCritique: 20 },
        { id: 9, reference: 'ART009', article: 'Casque audio sans fil', quantite: 9, seuilCritique: 10 },
        { id: 10, reference: 'ART010', article: 'Adaptateur USB-C multi-ports', quantite: 35, seuilCritique: 15 },
        { id: 11, reference: 'ART011', article: 'Imprimante multifonction', quantite: 8, seuilCritique: 10 },
        { id: 12, reference: 'ART012', article: 'Routeur Wi-Fi 6', quantite: 7, seuilCritique: 12 },
        { id: 13, reference: 'ART013', article: 'Serveur NAS 8TB', quantite: 3, seuilCritique: 5 },
    ]);

    const filteredStocks = stocks.filter(stock =>
        stock.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.article.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getQuantiteStyle = (quantite, seuilCritique) => {
        if (quantite <= seuilCritique) {
            return 'text-red-600 font-semibold';
        }
        return 'text-gray-900';
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
                    <button className="w-full text-blue-400 hover:bg-blue-100 px-4 py-2.5 rounded-md flex items-center gap-2 mb-2 transition-colors">
                        <Package size={18} />
                        Articles
                    </button>
                    <button className="w-full text-blue-400 hover:bg-blue-100 px-4 py-2.5 rounded-md flex items-center gap-2 mb-2 transition-colors">
                        <ShoppingCart size={18} />
                        Orders
                    </button>
                    <button className="w-full text-blue-400 hover:bg-blue-100 px-4 py-2.5 rounded-md flex items-center gap-2 mb-2 transition-colors">
                        <Users size={18} />
                        Clients
                    </button>
                    <button className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-md flex items-center gap-2 mb-2 transition-colors">
                        <Package size={18} />
                        Stocks
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
                    <h1 className="text-xl font-semibold">Gestion des Stocks</h1>
                    <div className="bg-white rounded-full p-2">
                        <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="bg-white rounded-lg shadow">
                        {/* Search Bar */}
                        <div className="p-4 border-b flex justify-between items-center gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Rechercher par article ou référence..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <button className="text-blue-500 hover:text-blue-700 flex items-center gap-2 transition-colors">
                                <Download size={18} />
                                <span className="text-sm font-medium">Stocks Faibles</span>
                            </button>
                        </div>

                        {/* Section Title */}
                        <div className="p-4 bg-blue-50">
                            <h2 className="text-lg font-semibold text-blue-500">Aperçu des Niveaux de Stock</h2>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                                            Référence
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                                            Article
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                                            Quantité
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                                            Seuil Critique
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredStocks.map((stock) => (
                                        <tr key={stock.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{stock.reference}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">{stock.article}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className={`text-sm ${getQuantiteStyle(stock.quantite, stock.seuilCritique)}`}>
                                                    {stock.quantite}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{stock.seuilCritique}</div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Table Footer */}
                        <div className="px-6 py-4 bg-gray-50 border-t">
                            <div className="text-sm text-gray-600">
                                {filteredStocks.length} article{filteredStocks.length > 1 ? 's' : ''} en stock
                                {searchTerm && ` (filtré${filteredStocks.length > 1 ? 's' : ''} sur ${stocks.length})`}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}