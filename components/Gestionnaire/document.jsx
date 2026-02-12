import { useState } from 'react';
import { FileText, Download, Eye, Upload } from 'lucide-react';

export default function GestionDocuments() {
  const [selectedDocument, setSelectedDocument] = useState(null);

  const [documents] = useState([
    {
      id: 1,
      type: 'Facture',
      typeClass: 'Pro-forma',
      reference: 'FPR-2023-001',
      client: 'Client A S.A.R.L.',
      date: '26/09/2023',
      montant: '1 250.00 €',
      color: 'text-orange-500',
    },
    {
      id: 2,
      type: 'Bon de livraison',
      typeClass: '',
      reference: 'BL-2023-005',
      client: 'Societe B Inc.',
      date: '25/09/2023',
      montant: '990.50 €',
      color: 'text-blue-500',
    },
    {
      id: 3,
      type: 'Facture',
      typeClass: 'Pro-forma',
      reference: 'FPR-2023-002',
      client: 'Entreprise C Groupe',
      date: '24/09/2023',
      montant: '3 400.00 €',
      color: 'text-orange-500',
    },
    {
      id: 4,
      type: 'Bon de livraison',
      typeClass: '',
      reference: 'BL-2023-006',
      client: 'Client A S.A.R.L.',
      date: '23/09/2023',
      montant: '450.00 €',
      color: 'text-blue-500',
    },
    {
      id: 5,
      type: 'Facture',
      typeClass: 'Pro-forma',
      reference: 'FPR-2023-003',
      client: 'InnovTech Sarl',
      date: '22/09/2023',
      montant: '7 500.00 €',
      color: 'text-orange-500',
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-blue-700">Documents</h1>
          <p className="text-sm text-gray-500">Factures pro-forma et bons de livraison.</p>
        </div>
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors">
          <Upload size={18} />
          Generer un document
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-white rounded-lg border border-blue-50 shadow-sm">
          <div className="p-4 border-b border-blue-50 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-blue-600">Liste des documents</h2>
            <div className="text-sm text-gray-500">{documents.length} documents</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-blue-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-blue-500 uppercase">Reference</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-blue-500 uppercase">Client</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-blue-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-blue-500 uppercase">Montant</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-blue-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {documents.map((doc) => (
                  <tr
                    key={doc.id}
                    className={`hover:bg-blue-50/40 cursor-pointer ${selectedDocument?.id === doc.id ? 'bg-blue-50/60' : ''}`}
                    onClick={() => setSelectedDocument(doc)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FileText size={18} className={doc.color} />
                        <div>
                          <div className={`text-sm font-medium ${doc.color}`}>{doc.type}</div>
                          {doc.typeClass && <div className="text-xs text-gray-500">{doc.typeClass}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{doc.reference}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{doc.client}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{doc.date}</td>
                    <td className="px-4 py-3 text-sm font-medium text-blue-600">{doc.montant}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="text-blue-500 hover:text-blue-700" title="Telecharger">
                          <Download size={18} />
                        </button>
                        <button className="text-blue-500 hover:text-blue-700" title="Voir">
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

        <div className="bg-white rounded-lg border border-blue-50 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-blue-600 mb-4">Apercu du document</h3>

          {selectedDocument ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <FileText size={80} className="text-blue-500" />
              </div>
              <div className="space-y-2 text-sm text-gray-700 bg-blue-50/50 p-4 rounded">
                <div><span className="font-semibold">Type:</span> {selectedDocument.type}</div>
                <div><span className="font-semibold">Reference:</span> {selectedDocument.reference}</div>
                <div><span className="font-semibold">Client:</span> {selectedDocument.client}</div>
                <div><span className="font-semibold">Date:</span> {selectedDocument.date}</div>
                <div><span className="font-semibold">Montant:</span> {selectedDocument.montant}</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText size={80} className="text-gray-300 mx-auto mb-4" />
              <p className="text-sm text-gray-500">
                Selectionnez un document pour afficher son apercu ici.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
