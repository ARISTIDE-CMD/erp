import { TrendingUp, Users, Package, ShoppingCart, FileText } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import AppShell from './layouts/AppShell.jsx';
import MoligeERPLogin from '../components/login.jsx';
import AdminDashboard from '../components/Admin/dashboard.jsx';
import AdminClients from '../components/Admin/client.jsx';
import AdminUsers from '../components/Admin/users.jsx';
import AdminCommandes from '../components/Admin/commandes.jsx';
import GestionnaireDashboard from '../components/Gestionnaire/dashboard.jsx';
import GestionnaireArticles from '../components/Gestionnaire/article.jsx';
import GestionnaireClients from '../components/Gestionnaire/client.jsx';
import GestionnaireCommandes from '../components/Gestionnaire/commande.jsx';
import GestionnaireStocks from '../components/Gestionnaire/stock.jsx';
import GestionnaireDocuments from '../components/Gestionnaire/document.jsx';

const adminUser = { name: 'Diallo Awa', role: 'Administrateur' };
const managerUser = { name: 'Kone Idris', role: 'Gestionnaire' };

const adminNav = [
  { to: '/admin/dashboard', label: 'Analyses', icon: TrendingUp, notificationKey: 'admin.total' },
  { to: '/admin/users', label: 'Utilisateurs', icon: Users },
  { to: '/admin/articles', label: 'Articles', icon: Package },
  { to: '/admin/clients', label: 'Clients', icon: Users, notificationKey: 'admin.clients' },
  { to: '/admin/commandes', label: 'Commandes', icon: ShoppingCart, notificationKey: 'admin.commandes' },
  { to: '/admin/stocks', label: 'Stocks', icon: Package },
  { to: '/admin/documents', label: 'Documents', icon: FileText },
];

const managerNav = [
  { to: '/gestionnaire/dashboard', label: 'Tableau de bord', icon: TrendingUp },
  { to: '/gestionnaire/articles', label: 'Articles', icon: Package },
  { to: '/gestionnaire/clients', label: 'Clients', icon: Users },
  { to: '/gestionnaire/commandes', label: 'Commandes', icon: ShoppingCart },
  { to: '/gestionnaire/stocks', label: 'Stocks', icon: Package },
  { to: '/gestionnaire/documents', label: 'Documents', icon: FileText },
];

const withShell = (Component, options) => (
  <AppShell
    title={options.title}
    roleLabel={options.roleLabel}
    user={options.user}
    navItems={options.navItems}
  >
    <Component />
  </AppShell>
);

export const appRoutes = [
  { path: '/', element: <MoligeERPLogin /> },
  { path: '/admin', element: <Navigate to="/admin/dashboard" replace /> },
  {
    path: '/admin/dashboard',
    element: withShell(AdminDashboard, {
      title: 'Analyses des commandes',
      roleLabel: 'Administrateur',
      user: adminUser,
      navItems: adminNav,
    }),
  },
  {
    path: '/admin/users',
    element: withShell(AdminUsers, {
      title: 'Gestion des utilisateurs',
      roleLabel: 'Administrateur',
      user: adminUser,
      navItems: adminNav,
    }),
  },
  {
    path: '/admin/articles',
    element: withShell(GestionnaireArticles, {
      title: 'Gestion des articles',
      roleLabel: 'Administrateur',
      user: adminUser,
      navItems: adminNav,
    }),
  },
  {
    path: '/admin/clients',
    element: withShell(AdminClients, {
      title: 'Gestion des clients',
      roleLabel: 'Administrateur',
      user: adminUser,
      navItems: adminNav,
    }),
  },
  {
    path: '/admin/commandes',
    element: withShell(AdminCommandes, {
      title: 'Suivi des commandes',
      roleLabel: 'Administrateur',
      user: adminUser,
      navItems: adminNav,
    }),
  },
  {
    path: '/admin/stocks',
    element: withShell(GestionnaireStocks, {
      title: 'Gestion des stocks',
      roleLabel: 'Administrateur',
      user: adminUser,
      navItems: adminNav,
    }),
  },
  {
    path: '/admin/documents',
    element: withShell(GestionnaireDocuments, {
      title: 'Documents',
      roleLabel: 'Administrateur',
      user: adminUser,
      navItems: adminNav,
    }),
  },
  { path: '/gestionnaire', element: <Navigate to="/gestionnaire/dashboard" replace /> },
  {
    path: '/gestionnaire/dashboard',
    element: withShell(GestionnaireDashboard, {
      title: 'Tableau de bord',
      roleLabel: 'Gestionnaire',
      user: managerUser,
      navItems: managerNav,
    }),
  },
  {
    path: '/gestionnaire/articles',
    element: withShell(GestionnaireArticles, {
      title: 'Gestion des articles',
      roleLabel: 'Gestionnaire',
      user: managerUser,
      navItems: managerNav,
    }),
  },
  {
    path: '/gestionnaire/clients',
    element: withShell(GestionnaireClients, {
      title: 'Gestion des clients',
      roleLabel: 'Gestionnaire',
      user: managerUser,
      navItems: managerNav,
    }),
  },
  {
    path: '/gestionnaire/commandes',
    element: withShell(GestionnaireCommandes, {
      title: 'Gestion des commandes',
      roleLabel: 'Gestionnaire',
      user: managerUser,
      navItems: managerNav,
    }),
  },
  {
    path: '/gestionnaire/stocks',
    element: withShell(GestionnaireStocks, {
      title: 'Gestion des stocks',
      roleLabel: 'Gestionnaire',
      user: managerUser,
      navItems: managerNav,
    }),
  },
  {
    path: '/gestionnaire/documents',
    element: withShell(GestionnaireDocuments, {
      title: 'Documents',
      roleLabel: 'Gestionnaire',
      user: managerUser,
      navItems: managerNav,
    }),
  },
];
