import { createHashRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import AdminProtectedRoute from '../components/AdminProtectedRoute';
import AdminLayout from '../components/AdminLayout';
import Home from '../pages/Home';
import Catalog from '../pages/Catalog';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Favoris from '../pages/Favoris';
import AdminLogin from '../pages/admin/AdminLogin';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminOrders from '../pages/admin/AdminOrders';
import AdminProducts from '../pages/admin/AdminProducts';
import AdminCoupons from '../pages/admin/AdminCoupons';

const router = createHashRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/catalogue', element: <Catalog /> },
      { path: '/produit/:slug', element: <ProductDetail /> },
      { path: '/panier', element: <Cart /> },
      { path: '/checkout', element: <Checkout /> },
      { path: '/favoris', element: <Favoris /> },
    ],
  },
  { path: '/admin/connexion', element: <AdminLogin /> },
  {
    path: '/admin',
    element: (
      <AdminProtectedRoute>
        <AdminLayout />
      </AdminProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'commandes', element: <AdminOrders /> },
      { path: 'produits', element: <AdminProducts /> },
      { path: 'coupons', element: <AdminCoupons /> },
    ],
  },
]);

export default router;
