import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Category, StoreSettings, Banner, defaultProducts, defaultCategories, defaultSettings, defaultBanners } from '../data/store';

interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
}

interface AppContextType {
  // Products
  products: Product[];
  categories: Category[];
  settings: StoreSettings;
  banners: Banner[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: Category) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  updateSettings: (settings: Partial<StoreSettings>) => void;
  updateBanners: (banners: Banner[]) => void;
  getProductBySlug: (slug: string) => Product | undefined;
  getProductsByCategory: (categoryId: string) => Product[];
  getNewArrivals: () => Product[];
  getFeaturedProducts: () => Product[];
  searchProducts: (query: string) => Product[];
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, color: string) => void;
  removeFromCart: (productId: string, color: string) => void;
  updateCartQuantity: (productId: string, color: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  // Admin
  isAdmin: boolean;
  adminLogin: (password: string) => boolean;
  adminLogout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const ADMIN_PASSWORD = 'mamaya2024';

export function AppProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('mamaya_products');
    return saved ? JSON.parse(saved) : defaultProducts;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('mamaya_categories');
    return saved ? JSON.parse(saved) : defaultCategories;
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('mamaya_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const [banners, setBanners] = useState<Banner[]>(() => {
    const saved = localStorage.getItem('mamaya_banners');
    return saved ? JSON.parse(saved) : defaultBanners;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('mamaya_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('mamaya_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem('mamaya_admin') === 'true';
  });

  useEffect(() => { localStorage.setItem('mamaya_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('mamaya_categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('mamaya_settings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('mamaya_banners', JSON.stringify(banners)); }, [banners]);
  useEffect(() => { localStorage.setItem('mamaya_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('mamaya_wishlist', JSON.stringify(wishlist)); }, [wishlist]);

  const addProduct = (product: Product) => setProducts(prev => [...prev, product]);
  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };
  const deleteProduct = (id: string) => setProducts(prev => prev.filter(p => p.id !== id));
  const addCategory = (category: Category) => setCategories(prev => [...prev, category]);
  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };
  const updateSettings = (updates: Partial<StoreSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };
  const updateBanners = (newBanners: Banner[]) => setBanners(newBanners);

  const getProductBySlug = (slug: string) => products.find(p => p.slug === slug && p.isActive);
  const getProductsByCategory = (categoryId: string) => products.filter(p => p.categoryId === categoryId && p.isActive);
  const getNewArrivals = () => products.filter(p => p.isActive && p.isNewArrival).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8);
  const getFeaturedProducts = () => products.filter(p => p.isActive && p.isFeatured).slice(0, 8);
  const searchProducts = (query: string) => {
    const q = query.toLowerCase();
    return products.filter(p => p.isActive && (p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)));
  };

  // Cart functions
  const addToCart = (product: Product, quantity: number, color: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id && item.selectedColor === color);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id && item.selectedColor === color
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      }
      return [...prev, { product, quantity, selectedColor: color }];
    });
  };

  const removeFromCart = (productId: string, color: string) => {
    setCart(prev => prev.filter(item => !(item.product.id === productId && item.selectedColor === color)));
  };

  const updateCartQuantity = (productId: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, color);
      return;
    }
    setCart(prev => prev.map(item =>
      item.product.id === productId && item.selectedColor === color
        ? { ...item, quantity: Math.min(quantity, item.product.stock) }
        : item
    ));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Wishlist functions
  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Admin functions
  const adminLogin = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      sessionStorage.setItem('mamaya_admin', 'true');
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('mamaya_admin');
  };

  return (
    <AppContext.Provider value={{
      products, categories, settings, banners,
      addProduct, updateProduct, deleteProduct,
      addCategory, updateCategory, updateSettings, updateBanners,
      getProductBySlug, getProductsByCategory, getNewArrivals, getFeaturedProducts, searchProducts,
      cart, addToCart, removeFromCart, updateCartQuantity, clearCart, cartTotal, cartCount,
      wishlist, toggleWishlist, isInWishlist,
      isAdmin, adminLogin, adminLogout
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
