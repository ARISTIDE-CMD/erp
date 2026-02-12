import { Package, Users, ShoppingCart, AlertCircle } from 'lucide-react';

export default function GestionnaireDashboard() {
  const stats = [
    { id: 1, label: 'Commandes du jour', value: '12', icon: ShoppingCart },
    { id: 2, label: 'Clients actifs', value: '68', icon: Users },
    { id: 3, label: 'Articles en stock', value: '1 240', icon: Package },
    { id: 4, label: 'Alertes stock', value: '6', icon: AlertCircle },
  ];

  const commandes = [
    { id: 1, numero: 'CMD-2401', client: 'Studio Nova', statut: 'En attente' },
    { id: 2, numero: 'CMD-2402', client: 'Kappa SARL', statut: 'Validee' },
    { id: 3, numero: 'CMD-2403', client: 'Delta Pro', statut: 'Preparation' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-blue-700">Tableau de bord</h1>
        <p className="text-sm text-gray-500">Suivi rapide des activites de gestion.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.id} className="bg-white rounded-lg border border-blue-50 shadow-sm p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-600 font-medium">{stat.label}</span>
                <Icon size={18} className="text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-orange-500 mt-3">{stat.value}</div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-white rounded-lg border border-blue-50 shadow-sm">
          <div className="p-4 border-b border-blue-50">
            <h2 className="text-lg font-semibold text-blue-600">Commandes recentes</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">Numero</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">Statut</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {commandes.map((commande) => (
                  <tr key={commande.id} className="hover:bg-blue-50/40">
                    <td className="px-6 py-4 text-sm text-gray-900">{commande.numero}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{commande.client}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{commande.statut}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-blue-50 shadow-sm p-5">
          <h2 className="text-lg font-semibold text-blue-600">A faire</h2>
          <ul className="mt-4 space-y-3 text-sm text-gray-600">
            <li className="flex items-center justify-between">
              Relancer les clients en attente
              <span className="text-orange-500 font-semibold">3</span>
            </li>
            <li className="flex items-center justify-between">
              Reapprovisionnement urgent
              <span className="text-orange-500 font-semibold">2</span>
            </li>
            <li className="flex items-center justify-between">
              Documents a generer
              <span className="text-orange-500 font-semibold">4</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
