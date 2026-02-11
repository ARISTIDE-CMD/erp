import MoligeERPLogin from '../components/login.jsx';
import MoligeERPDashboard from '../components/Admin/dashboard.jsx';
import GestionArticles from '../components/Gestionnaire/article.jsx';
import GestionClients from '../components/Admin/client.jsx';
import GestionCommandes from '../components/Gestionnaire/commande.jsx';
import GestionStocks from '../components/Gestionnaire/stock.jsx';
import GestionDocuments from '../components/Gestionnaire/document.jsx';

// import GestionFournisseurs from '../components/Gestionnaire/fournisseur.jsx';



export const appRoutes = [
  {
    path: '/',
    component: MoligeERPLogin,
    },
    {
        path: '/dashboard',
        component: MoligeERPDashboard,
    },
    {
        path: '/article',
        component: GestionArticles,
    },
    {
        path: '/client',
        component: GestionClients,
    },
    {
        path: '/commande',
        component: GestionCommandes,
    },
    {
        path: '/stock',
        component: GestionStocks,
    },
    {
        path: '/document',
        component: GestionDocuments,
    },



];
