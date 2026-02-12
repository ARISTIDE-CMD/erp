import { TrendingUp, Package, AlertCircle, BarChart3 } from 'lucide-react';

export default function MoligeERPDashboard() {
  const kpis = [
    { id: 1, label: 'Chiffre d\'affaires', value: '€ 125 450.75', note: '+12% ce mois' },
    { id: 2, label: 'Commandes en cours', value: '42', note: '8 nouvelles cette semaine' },
    { id: 3, label: 'Articles critiques', value: '15', note: 'Action requise' },
  ];

  const months = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'];
  const orders = [22, 28, 18, 35, 40, 32, 38, 44, 29, 31, 36, 48];
  const revenues = [18, 22, 15, 26, 30, 27, 33, 38, 28, 31, 36, 42];
  const maxOrders = Math.max(...orders);
  const maxRevenue = Math.max(...revenues);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-blue-700">Tableau de bord analytique</h1>
        <p className="text-sm text-gray-500">Analyse des commandes et suivi de la performance.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {kpis.map((kpi) => (
          <div key={kpi.id} className="bg-white rounded-lg border border-blue-50 shadow-sm p-5">
            <div className="text-sm text-blue-600 font-medium">{kpi.label}</div>
            <div className="text-3xl font-bold text-orange-500 mt-3">{kpi.value}</div>
            <div className="text-xs text-gray-500 mt-1">{kpi.note}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-white rounded-lg border border-blue-50 shadow-sm">
          <div className="p-4 border-b border-blue-50 flex items-center gap-2 text-blue-600">
            <BarChart3 size={18} />
            <h2 className="text-lg font-semibold">Analyse des commandes (12 mois)</h2>
          </div>
          <div className="p-6">
            <div className="flex items-end gap-3 h-48">
              {orders.map((value, index) => (
                <div key={months[index]} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-md bg-blue-200"
                    style={{ height: `${(value / maxOrders) * 140}px` }}
                  />
                  <div className="text-xs text-gray-500">{months[index]}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Volume des commandes mensuelles. Plus haut = plus de commandes.
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-blue-50 shadow-sm p-5">
          <div className="flex items-center gap-2 text-blue-600">
            <TrendingUp size={18} />
            <h2 className="text-lg font-semibold">Revenus mensuels</h2>
          </div>
          <div className="mt-6 space-y-3">
            {revenues.slice(-6).map((value, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-10 text-xs text-gray-500">{months[6 + index]}</div>
                <div className="flex-1 h-2 bg-blue-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-400"
                    style={{ width: `${(value / maxRevenue) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500">{value}k</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-lg border border-blue-50 shadow-sm p-5">
          <div className="flex items-center gap-2 text-blue-600">
            <Package size={18} />
            <h2 className="text-lg font-semibold">Stocks sensibles</h2>
          </div>
          <div className="mt-4 space-y-3 text-sm text-gray-600">
            <div className="flex items-center justify-between">
              Souris sans fil
              <span className="text-orange-500 font-semibold">8 restants</span>
            </div>
            <div className="flex items-center justify-between">
              Webcam HD
              <span className="text-orange-500 font-semibold">2 restants</span>
            </div>
            <div className="flex items-center justify-between">
              Moniteur 24 pouces
              <span className="text-orange-500 font-semibold">3 restants</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-blue-50 shadow-sm p-5">
          <div className="flex items-center gap-2 text-blue-600">
            <AlertCircle size={18} />
            <h2 className="text-lg font-semibold">Alertes commandes</h2>
          </div>
          <div className="mt-4 space-y-3 text-sm text-gray-600">
            <div className="flex items-center justify-between">
              Commandes en retard
              <span className="text-orange-500 font-semibold">4</span>
            </div>
            <div className="flex items-center justify-between">
              Livraisons a confirmer
              <span className="text-orange-500 font-semibold">7</span>
            </div>
            <div className="flex items-center justify-between">
              Factures pro-forma a generer
              <span className="text-orange-500 font-semibold">3</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
