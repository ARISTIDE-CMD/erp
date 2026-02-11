import React, { useState } from 'react';
import { Edit, Trash2, Users, Package, ShoppingCart, FileText } from 'lucide-react';

export default function GestionCommandes() {
    const [commandes, setCommandes] = useState([
        {
            id: 1,
            numero: 'ORD-2023-001',
            client: 'Alpha Solutions',
            date: '10/01/2023',
            statut: 'Validée',
            montant: 182.45
        },
        {
            id: 2,
            numero: 'ORD-2023-002',
            client: 'Beta Innovations',
            date: '15/01/2023',
            statut: 'En attente',
            montant: 364.75
        },
        {
            id: 3,
            numero: 'ORD-2023-003',
            client: 'Gamma Corp',
            date: '20/01/2023',
            statut: 'Annulée',
            montant: 79.99
        },
        {
            id: 4,
            numero: 'ORD-2023-004',
            client: 'Alpha Solutions',
            date: '25/01/2023',
            statut: 'En attente',
            montant: 299.00
        },
    ]);

    const handleDelete = (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
            setCommandes(commandes.filter(commande => commande.id !== id));
        }
    };

    const getStatutStyle = (statut) => {
        switch (statut) {
            case 'Validée':
                return 'bg-green-100 text-green-700';
            case 'En attente':
                return 'bg-orange-100 text-orange-700';
            case 'Annulée':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
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
                    <button className="w-full text-blue-400 hover:bg-blue-100 px-4 py-2.5 rounded-md flex items-center gap-2 mb-2 transition-colors">
                        <Package size={18} />
                        Articles
                    </button>
                    <button className="w-full text-blue-400 hover:bg-blue-100 px-4 py-2.5 rounded-md flex items-center gap-2 mb-2 transition-colors">
                        <Users size={18} />
                        Clients
                    </button>
                    <button className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-md flex items-center gap-2 mb-2 transition-colors">
                        <ShoppingCart size={18} />
                        Orders
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
                    <h1 className="text-xl font-semibold">Gestion des Commandes</h1>
                    <div className="bg-white rounded-full p-2">
                        <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="bg-white rounded-lg shadow">
                        {/* Header with Add Button */}
                        <div className="p-4 border-b flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-blue-500">Liste des Commandes</h2>
                            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Nouvelle commande
                            </button>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                                            Numéro
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                                            Client
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                                            Statut
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                                            Montant
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {commandes.map((commande) => (
                                        <tr key={commande.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{commande.numero}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{commande.client}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{commande.date}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatutStyle(commande.statut)}`}>
                                                    {commande.statut}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{commande.montant.toFixed(2)} €</div>
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

                        {/* Table Footer */}
                        <div className="px-6 py-4 bg-gray-50 border-t">
                            <div className="text-sm text-gray-600">
                                Total: {commandes.length} commande{commandes.length > 1 ? 's' : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}