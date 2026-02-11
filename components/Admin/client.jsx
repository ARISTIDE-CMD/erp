import React, { useState } from 'react';
import { Edit, Trash2, Users, Package, ShoppingCart, FileText, Search } from 'lucide-react';

export default function GestionClients() {
    const [searchTerm, setSearchTerm] = useState('');
    const [clients, setClients] = useState([
        { id: 1, nom: 'Dupont Jean', telephone: '06 12 34 56 78', adresse: '12 Rue de la Paix, 75001 Paris' },
        { id: 2, nom: 'Martin Sophie', telephone: '07 23 45 67 89', adresse: '24 Avenue des Champs, 69002 Lyon' },
        { id: 3, nom: 'Bernard Paul', telephone: '06 34 56 78 90', adresse: "3 Boulevard de l'Europe, 13008 Marseille" },
        { id: 4, nom: 'Petit Marie', telephone: '07 45 67 89 01', adresse: '45 Rue des Lilas, 31000 Toulouse' },
        { id: 5, nom: 'Durand Thomas', telephone: '06 56 78 90 12', adresse: '5 Rue de la Fontaine, 33000 Bordeaux' },
        { id: 6, nom: 'Leroy Claire', telephone: '06 78 90 12 34', adresse: '8 Chemin des Vignes, 44000 Nantes' },
        { id: 7, nom: 'Moreau Antoine', telephone: '07 89 01 23 45', adresse: '5 Place Royale, 06000 Nice' },
    ]);

    const handleDelete = (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
            setClients(clients.filter(client => client.id !== id));
        }
    };

    const filteredClients = clients.filter(client =>
        client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.telephone.includes(searchTerm) ||
        client.adresse.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        Commandes
                    </button>
                    <button className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-md flex items-center gap-2 mb-2 transition-colors">
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
                    <h1 className="text-xl font-semibold">Gestion des Clients</h1>
                    <div className="bg-white rounded-full p-2">
                        <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="bg-white rounded-lg shadow">
                        {/* Search Bar and Add Button */}
                        <div className="p-4 border-b flex justify-between items-center gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Rechercher un client..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors whitespace-nowrap">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Ajouter un client
                            </button>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                                            Nom
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                                            Téléphone
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                                            Adresse
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredClients.map((client) => (
                                        <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{client.nom}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{client.telephone}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">{client.adresse}</div>
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

                        {/* Table Footer */}
                        <div className="px-6 py-4 bg-gray-50 border-t">
                            <div className="text-sm text-gray-600">
                                {filteredClients.length} client{filteredClients.length > 1 ? 's' : ''} trouvé{filteredClients.length > 1 ? 's' : ''}
                                {searchTerm && ` sur ${clients.length} au total`}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}