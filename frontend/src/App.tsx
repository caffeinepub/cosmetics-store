import { useEffect } from 'react';
import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { Toaster } from '@/components/ui/sonner';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import AdminPage from './pages/AdminPage';
import { useGetSiteSettings } from './hooks/useQueries';

// Inner component that applies the color scheme from site settings
function ColorSchemeApplier() {
  const { data: settings } = useGetSiteSettings();

  useEffect(() => {
    const scheme = settings?.colorScheme;
    if (scheme) {
      document.documentElement.setAttribute('data-color-scheme', scheme);
    } else {
      document.documentElement.setAttribute('data-color-scheme', 'default');
    }
  }, [settings?.colorScheme]);

  return null;
}

// Root route with layout — keeps flat route IDs (e.g. /product/$id) intact
const rootRoute = createRootRoute({
  component: () => (
    <>
      <ColorSchemeApplier />
      <Layout />
      <Toaster position="top-right" richColors />
    </>
  ),
});

// Page routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const shopRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shop',
  component: ShopPage,
});

const productDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/product/$id',
  component: ProductDetailPage,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  component: CartPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  component: CheckoutPage,
});

const orderConfirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/order-confirmation',
  component: OrderConfirmationPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  shopRoute,
  productDetailRoute,
  cartRoute,
  checkoutRoute,
  orderConfirmationRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
