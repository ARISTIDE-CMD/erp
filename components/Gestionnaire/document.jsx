import React, { useState } from 'react';
import { FileText, Download, Eye, Upload, Package, ShoppingCart, Users } from 'lucide-react';

export default function GestionDocuments() {
    const [selectedDocument, setSelectedDocument] = useState(null);

    const [documents, setDocuments] = useState([
        {
            id: 1,
            type: 'Facture',
            icon: '📄',
            typeClass: 'Pro-forma',
            reference: 'FPR-2023-001',
            client: 'Client A S.A.R.L.',
            date: '2023-1-9-26',
            montant: '1 250.00 €',
            color: 'text-orange-500'
        },
        {
            id: 2,
            type: 'Bon de Livraison',
            icon: '📄',
            typeClass: '',
            reference: 'BL-2023-005',
            client: 'Société B Inc.',
            date: '2023-1-9-25',
            montant: '990.50 €',
            color: 'text-blue-500'
        },
        {
            id: 3,
            type: 'Facture',
            icon: '📄',
            typeClass: 'Pro-forma',
            reference: 'FPR-2023-002',
            client: 'Entreprise C Groupe',
            date: '2023-1-9-24',
            montant: '3 400.00 €',
            color: 'text-orange-500'
        },
        {
            id: 4,
            type: 'Bon de Livraison',
            icon: '📄',
            typeClass: '',
            reference: 'BL-2023-006',
            client: 'Client A S.A.R.L.',
            date: '2023-1-9-23',
            montant: '450.00 €',
            color: 'text-blue-500'
        },
        {
            id: 5,
            type: 'Facture',
            icon: '📄',
            typeClass: 'Pro-forma',
            reference: 'FPR-2023-003',
            client: 'InnovTech Sarl',
            date: '2023-1-9-22',
            montant: '7 500.00 €',
            color: 'text-orange-500'
        },
    ]);

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
                    <button className="w-full text-blue-400 hover:bg-blue-100 px-4 py-2.5 rounded-md flex items-center gap-2 mb-2 transition-colors">
                        <Package size={18} />
                        Stocks
                    </button>
                    <button className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-md flex items-center gap-2 mb-2 transition-colors">
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
                    <h1 className="text-xl font-semibold">Documents</h1>
                    <div className="bg-white rounded-full p-2">
                        <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="grid grid-cols-3 gap-6">
                        {/* Documents List - 2/3 width */}
                        <div className="col-span-2 bg-white rounded-lg shadow">
                            {/* Header with Upload Button */}
                            <div className="p-4 border-b flex justify-between items-center">
                                <h2 className="text-lg font-semibold text-blue-500">Liste des Documents</h2>
                                <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors">
                                    <Upload size={18} />
                                    Ajouter un Document
                                </button>
                            </div>

                            {/* Description */}
                            <div className="px-6 py-3 text-sm text-gray-600 border-b bg-gray-50">
                                Gérez et visualisez vos factures pro-forma et bons de livraison.
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Référence</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant Total</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {documents.map((doc) => (
                                            <tr
                                                key={doc.id}
                                                className={`hover:bg-gray-50 transition-colors cursor-pointer ${selectedDocument?.id === doc.id ? 'bg-blue-50' : ''}`}
                                                onClick={() => setSelectedDocument(doc)}
                                            >
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xl">{doc.icon}</span>
                                                        <div>
                                                            <div className={`text-sm font-medium ${doc.color}`}>{doc.type}</div>
                                                            {doc.typeClass && (
                                                                <div className="text-xs text-gray-500">{doc.typeClass}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900">{doc.reference}</td>
                                                <td className="px-4 py-3 text-sm text-gray-900">{doc.client}</td>
                                                <td className="px-4 py-3 text-sm text-gray-900">{doc.date}</td>
                                                <td className="px-4 py-3 text-sm font-medium text-blue-500">{doc.montant}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex gap-2">
                                                        <button
                                                            className="text-blue-500 hover:text-blue-700 transition-colors"
                                                            title="Télécharger"
                                                        >
                                                            <Download size={18} />
                                                        </button>
                                                        <button
                                                            className="text-blue-500 hover:text-blue-700 transition-colors"
                                                            title="Visualiser"
                                                        >
                                                            <Eye size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Preview Panel - 1/3 width */}
                        <div className="col-span-1">
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-lg font-semibold text-blue-500 mb-4">Aperçu du Document</h3>

                                {selectedDocument ? (
                                    <div className="space-y-4">
                                        <div className="flex justify-center">
                                            <FileText size={80} className="text-blue-500" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm text-gray-600 mb-2">
                                                Visualisez le contenu du document sélectionné.
                                            </p>
                                            <div className="space-y-2 text-left bg-gray-50 p-4 rounded">
                                                <p className="text-sm"><span className="font-semibold">Type:</span> {selectedDocument.type}</p>
                                                <p className="text-sm"><span className="font-semibold">Référence:</span> {selectedDocument.reference}</p>
                                                <p className="text-sm"><span className="font-semibold">Client:</span> {selectedDocument.client}</p>
                                                <p className="text-sm"><span className="font-semibold">Date:</span> {selectedDocument.date}</p>
                                                <p className="text-sm"><span className="font-semibold">Montant:</span> {selectedDocument.montant}</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <FileText size={80} className="text-gray-300 mx-auto mb-4" />
                                        <p className="text-sm text-gray-500">
                                            Sélectionnez un document dans la liste pour en prévisualiser son contenu ici.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}