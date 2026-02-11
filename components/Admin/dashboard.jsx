import React from 'react';
import { Eye, Edit, TrendingUp, Package, AlertCircle } from 'lucide-react';

export default function MoligeERPDashboard() {
    const recentActivities = [
        { date: '2024-07-20', description: 'Nouvelle commande #2024-0102', type: 'Commande', id: 1 },
        { date: '2024-07-19', description: 'Mise à jour article "Casier électronique"', type: 'Article', id: 2 },
        { date: '2024-07-19', description: 'Client "Tech Solutions" ajouté', type: 'Client', id: 3 },
        { date: '2024-07-18', description: 'Stock bas pour "Souris sans fil"', type: 'Alerte', id: 4 },
        { date: '2024-07-17', description: 'Commande #2024-0101 traitée', type: 'Commande', id: 5 },
    ];

    const stockAlerts = [
        { date: '2024-07-20', description: 'USB Drive 64GB - Quantité: 5', type: 'Équipement', id: 1 },
        { date: '2024-07-19', description: 'Moniteur 24 pouces - Quantité: 3', type: 'Urgence', id: 2 },
        { date: '2024-07-18', description: 'Souris sans fil - Quantité: 8', type: 'Faible', id: 3 },
        { date: '2024-07-17', description: 'Webcam HD - Quantité: 2', type: 'Urgence', id: 4 },
        { date: '2024-07-16', description: "Disque dur externe 1TB - Quantité: 7", type: 'Faible', id: 5 },
    ];

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
                        Dashboard
                    </button>
                    <button className="w-full text-blue-400 hover:bg-blue-100 px-4 py-2.5 rounded-md flex items-center gap-2 mb-2 transition-colors">
                        <Package size={18} />
                        Commandes
                    </button>
                    <button className="w-full text-blue-400 hover:bg-blue-100 px-4 py-2.5 rounded-md flex items-center gap-2 mb-2 transition-colors">
                        <Package size={18} />
                        Articles
                    </button>
                    <button className="w-full text-blue-400 hover:bg-blue-100 px-4 py-2.5 rounded-md flex items-center gap-2 mb-2 transition-colors">
                        <Package size={18} />
                        Clients
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
                    <h1 className="text-xl font-semibold">Tableau de bord</h1>
                    <div className="bg-white rounded-full p-2">
                        <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="p-6">
                    <div className="grid grid-cols-3 gap-6 mb-6">
                        {/* Card 1 */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-blue-500 font-medium">Chiffre d'affaires</span>
                                <TrendingUp size={18} className="text-gray-400" />
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">€ 125 450.75</div>
                            <div className="text-xs text-green-600">↑ Augmentation de 12% ce mois</div>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-blue-500 font-medium">Commandes en cours</span>
                                <Package size={18} className="text-gray-400" />
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">42 Commandes</div>
                            <div className="text-xs text-gray-600">→ 8 nouvelle cette semaine</div>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-blue-500 font-medium">Articles en stock critique</span>
                                <AlertCircle size={18} className="text-gray-400" />
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">15 Articles</div>
                            <div className="text-xs text-red-600">↓ Action requise</div>
                        </div>
                    </div>

                    {/* Recent Activities Table */}
                    <div className="bg-white rounded-lg shadow mb-6">
                        <div className="p-4 border-b">
                            <h2 className="text-lg font-semibold text-blue-500">Activités récentes</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {recentActivities.map((activity) => (
                                        <tr key={activity.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-900">{activity.date}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{activity.description}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{activity.type}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="flex gap-2">
                                                    <button className="text-blue-500 hover:text-blue-700">
                                                        <Eye size={18} />
                                                    </button>
                                                    <button className="text-blue-500 hover:text-blue-700">
                                                        <Edit size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Stock Alerts Table */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="p-4 border-b">
                            <h2 className="text-lg font-semibold text-blue-500">Alertes de stock critique</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {stockAlerts.map((alert) => (
                                        <tr key={alert.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-900">{alert.date}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{alert.description}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{alert.type}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="flex gap-2">
                                                    <button className="text-blue-500 hover:text-blue-700">
                                                        <Eye size={18} />
                                                    </button>
                                                    <button className="text-blue-500 hover:text-blue-700">
                                                        <Edit size={18} />
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
            </div>
        </div>
    );
}