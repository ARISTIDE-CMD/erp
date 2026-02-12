import { useEffect, useMemo, useState } from 'react';
import { Eye, Edit, TrendingUp, Package, AlertCircle, BarChart3 } from 'lucide-react';
import { getCommandes } from '@/services/commandes.service';
import { getArticles } from '@/services/articles.service';
import { getClients } from '@/services/clients.service';

export default function MoligeERPDashboard() {
  const [commandes, setCommandes] = useState([]);
  const [articles, setArticles] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('year');
  const criticalThreshold = 10;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [orders, items, customers] = await Promise.all([
        getCommandes(),
        getArticles(),
        getClients(),
      ]);
      setCommandes(orders);
      setArticles(items);
      setClients(customers);
    } finally {
      setLoading(false);
    }
  };

  const revenue = useMemo(
    () => commandes.reduce((sum, cmd) => sum + Number(cmd.montant_total || 0), 0),
    [commandes]
  );

  const ordersByBucket = useMemo(() => {
    const now = new Date();
    const buckets = [];

    const makeDayKey = (date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    const makeMonthKey = (date) => `${date.getFullYear()}-${date.getMonth()}`;

    if (range === 'week' || range === 'month') {
      const days = range === 'week' ? 7 : 30;
      for (let i = 0; i < days; i += 1) {
        const date = new Date(now);
        date.setDate(now.getDate() - (days - 1 - i));
        buckets.push({
          key: makeDayKey(date),
          label: date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
          count: 0,
          total: 0,
        });
      }

      commandes.forEach((cmd) => {
        if (!cmd.created_at) return;
        const date = new Date(cmd.created_at);
        const key = makeDayKey(date);
        const bucket = buckets.find((b) => b.key === key);
        if (bucket) {
          bucket.count += 1;
          bucket.total += Number(cmd.montant_total || 0);
        }
      });

      return buckets;
    }

    const months = range === 'six_months' ? 6 : 12;
    for (let i = 0; i < months; i += 1) {
      const date = new Date();
      date.setMonth(now.getMonth() - (months - 1 - i));
      buckets.push({
        key: makeMonthKey(date),
        label: date.toLocaleString('fr-FR', { month: 'short' }),
        count: 0,
        total: 0,
      });
    }

    commandes.forEach((cmd) => {
      if (!cmd.created_at) return;
      const date = new Date(cmd.created_at);
      const key = makeMonthKey(date);
      const bucket = buckets.find((b) => b.key === key);
      if (bucket) {
        bucket.count += 1;
        bucket.total += Number(cmd.montant_total || 0);
      }
    });

    return buckets;
  }, [commandes, range]);

  const maxOrders = Math.max(1, ...ordersByBucket.map((m) => m.count));
  const maxRevenue = Math.max(1, ...ordersByBucket.map((m) => m.total));

  const stockAlerts = articles.filter((a) => (a.quantite_stock ?? 0) <= criticalThreshold);
  const recentOrders = commandes.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-blue-700">Tableau de bord analytique</h1>
        <p className="text-sm text-gray-500">Analyse des commandes et suivi de la performance.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-white rounded-lg border border-blue-50 shadow-sm p-5">
          <div className="text-sm text-blue-600 font-medium">Chiffre d'affaires</div>
          <div className="text-3xl font-bold text-orange-500 mt-3">
            {loading ? '...' : `${revenue.toFixed(2)} €`}
          </div>
          <div className="text-xs text-gray-500 mt-1">Total cumule</div>
        </div>

        <div className="bg-white rounded-lg border border-blue-50 shadow-sm p-5">
          <div className="text-sm text-blue-600 font-medium">Commandes totales</div>
          <div className="text-3xl font-bold text-orange-500 mt-3">
            {loading ? '...' : commandes.length}
          </div>
          <div className="text-xs text-gray-500 mt-1">Toutes periodes</div>
        </div>

        <div className="bg-white rounded-lg border border-blue-50 shadow-sm p-5">
          <div className="text-sm text-blue-600 font-medium">Articles critiques</div>
          <div className="text-3xl font-bold text-orange-500 mt-3">
            {loading ? '...' : stockAlerts.length}
          </div>
          <div className="text-xs text-gray-500 mt-1">Sous le seuil</div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-white rounded-lg border border-blue-50 shadow-sm">
          <div className="p-4 border-b border-blue-50 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-blue-600">
              <BarChart3 size={18} />
              <h2 className="text-lg font-semibold">Analyse des commandes</h2>
            </div>
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="border border-blue-100 rounded-md px-3 py-2 text-sm text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">Semaine</option>
              <option value="month">Mois</option>
              <option value="six_months">6 mois</option>
              <option value="year">Annee</option>
            </select>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto max-w-full">
              {(() => {
                const chartHeight = 200;
                const padding = 24;
                const labelWidth = 40;
                const chartWidth = Math.max(600, ordersByBucket.length * labelWidth);
                const step = ordersByBucket.length > 1
                  ? (chartWidth - 2 * padding) / (ordersByBucket.length - 1)
                  : 0;

                const points = ordersByBucket.map((bucket, index) => {
                  const ratio = maxOrders ? bucket.count / maxOrders : 0;
                  const x = padding + index * step;
                  const y = chartHeight - padding - ratio * (chartHeight - 2 * padding);
                  return { x, y };
                });

                const linePoints = points.map((p) => `${p.x},${p.y}`).join(' ');
                const areaPath = points.length
                  ? `M ${points[0].x} ${chartHeight - padding} L ${points
                      .map((p) => `${p.x} ${p.y}`)
                      .join(' ')} L ${points[points.length - 1].x} ${chartHeight - padding} Z`
                  : '';

                return (
                  <div className="min-w-max">
                    <svg
                      width={chartWidth}
                      height={chartHeight}
                      viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                      className="block"
                    >
                      <path d={areaPath} fill="rgba(59, 130, 246, 0.12)" />
                      <polyline
                        points={linePoints}
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="3"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                      />
                      {points.map((point, idx) => (
                        <circle key={idx} cx={point.x} cy={point.y} r="4" fill="#f97316" />
                      ))}
                    </svg>
                    <div
                      className="flex text-[10px] text-gray-500 mt-2"
                      style={{ width: chartWidth, paddingLeft: padding, paddingRight: padding }}
                    >
                      {ordersByBucket.map((bucket) => (
                        <div
                          key={bucket.key}
                          className="text-center whitespace-nowrap"
                          style={{ width: labelWidth }}
                        >
                          {bucket.label}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Volume des commandes sur la periode selectionnee.
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-blue-50 shadow-sm p-5">
          <div className="flex items-center gap-2 text-blue-600">
            <TrendingUp size={18} />
            <h2 className="text-lg font-semibold">Revenus mensuels</h2>
          </div>
          <div className="mt-6 space-y-3">
            {ordersByBucket.slice(-6).map((bucket) => (
              <div key={bucket.key} className="flex items-center gap-3">
                <div className="w-10 text-xs text-gray-500">{bucket.label}</div>
                <div className="flex-1 h-2 bg-blue-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-400"
                    style={{ width: `${(bucket.total / maxRevenue) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500">{bucket.total.toFixed(1)}€</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-lg border border-blue-50 shadow-sm">
          <div className="p-4 border-b border-blue-50 flex items-center gap-2 text-blue-600">
            <Package size={18} />
            <h2 className="text-lg font-semibold">Stocks sensibles</h2>
          </div>
          <div className="p-4 space-y-3 text-sm text-gray-600">
            {loading ? (
              <div>Chargement...</div>
            ) : stockAlerts.length ? (
              stockAlerts.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  {item.designation}
                  <span className="text-orange-500 font-semibold">{item.quantite_stock} restants</span>
                </div>
              ))
            ) : (
              <div>Aucune alerte stock.</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-blue-50 shadow-sm">
          <div className="p-4 border-b border-blue-50 flex items-center gap-2 text-blue-600">
            <AlertCircle size={18} />
            <h2 className="text-lg font-semibold">Dernieres commandes</h2>
          </div>
          <div className="p-4 space-y-3 text-sm text-gray-600">
            {loading ? (
              <div>Chargement...</div>
            ) : recentOrders.length ? (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  {order.numero_commande}
                  <span className="text-orange-500 font-semibold">{order.client?.nom ?? '-'}</span>
                </div>
              ))
            ) : (
              <div>Aucune commande recente.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
