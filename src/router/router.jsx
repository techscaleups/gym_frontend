import Home from '../pages/Home';
import ProductList from '../pages/ProductList';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';
import Wishlist from '../pages/wishlist';
import Orders from '../pages/Orders';
import SearchResults from '../pages/Search';

const router = [
  {
    path: '/',
    name: 'Home',
    element: Home,
  },
  {
    path: '/products',
    name: 'ProductList',
    element: ProductList,
  },
{
  path: '/ProductDetails/:slug',
  name: 'ProductDetail',
  element: ProductDetail,
},


  {
    path: '/viewcart',
    name: 'viewcart',
    element: Cart,
  },
  {
    path: '/checkout',
    name: 'Checkout',
    element: Checkout,
  },
  {
    path: '/login',
    name: 'Login',
    element: Login,
  },
  {
    path: '/wishlist',
    name: 'Wishlist',
    element: Wishlist,
  },
  {
    path: '/register',
    name: 'Register',
    element: Register,
  },
  {
    path: '/profile',
    name: 'Profile',
    element: Profile,
  },
  {
    path: '/search', 
    name: 'SearchResults',
    element: SearchResults,
  },
   {
    path: '/orders', 
    name: 'orders',
    element: Orders,
  },
  {
    path: '*',
    name: 'NotFound',
    element: NotFound,
  },
];

export default router;
