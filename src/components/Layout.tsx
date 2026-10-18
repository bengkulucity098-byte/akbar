import React, { useState, useEffect, ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Search, ShoppingBag, Heart, Menu, X, ChevronDown, MessageCircle } from 'lucide-react';

function Header() {
  const { settings, categories, cartCount, wishlist } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsMenuOpen(false); setIsSearchOpen(false); }, [location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const activeCategories = categories.filter(c => c.isActive);

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-deep text-white text-center py-2 px-4 text-xs sm:text-sm">
        <p>{settings.announcementText}</p>
      </div>

      {/* Main Header */}
      <header className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${isScrolled ? 'shadow-md' : 'shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden p-2 text-text-primary hover:text-deep transition-colors"
              aria-label="Buka menu"
            >
              <Menu size={24} />
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center">
              <h1 className="font-heading text-2xl lg:text-3xl font-bold text-deep tracking-wide">
                Mamaya<span className="text-accent">.</span>
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              <Link to="/" className="text-sm font-medium text-text-primary hover:text-deep transition-colors">Beranda</Link>
              <Link to="/products" className="text-sm font-medium text-text-primary hover:text-deep transition-colors">Semua Produk</Link>
              <div className="relative group">
                <button className="text-sm font-medium text-text-primary hover:text-deep transition-colors flex items-center gap-1">
                  Kategori <ChevronDown size={14} />
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                  {activeCategories.map(cat => (
                    <Link
                      key={cat.id}
                      to={`/products?category=${cat.slug}`}
                      className="block px-4 py-2 text-sm text-text-primary hover:bg-soft hover:text-deep transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
              <Link to="/products?filter=new" className="text-sm font-medium text-text-primary hover:text-deep transition-colors">New Arrivals</Link>
              <Link to="/products?filter=featured" className="text-sm font-medium text-text-primary hover:text-deep transition-colors">Best Sellers</Link>
              <Link to="/admin" className="text-sm font-medium text-text-secondary hover:text-deep transition-colors">Admin</Link>
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-text-primary hover:text-deep transition-colors"
                aria-label="Cari produk"
              >
                <Search size={20} />
              </button>
              <Link to="/wishlist" className="hidden sm:block p-2 text-text-primary hover:text-deep transition-colors relative">
                <Heart size={20} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-accent text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>
              <Link to="/cart" className="p-2 text-text-primary hover:text-deep transition-colors relative">
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-deep text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          {isSearchOpen && (
            <div className="pb-4 animate-fade-in">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari produk..."
                  className="w-full px-4 py-3 pl-10 rounded-lg border border-border bg-soft focus:outline-none focus:border-deep text-sm"
                  autoFocus
                />
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-deep font-medium text-sm">
                  Cari
                </button>
              </form>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsMenuOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-xl overflow-y-auto">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold text-deep">Mamaya<span className="text-accent">.</span></h2>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 text-text-primary hover:text-deep" aria-label="Tutup menu">
                <X size={24} />
              </button>
            </div>
            <nav className="p-4 space-y-1">
              <Link to="/" className="block py-3 px-3 rounded-lg text-text-primary hover:bg-soft font-medium">Beranda</Link>
              <Link to="/products" className="block py-3 px-3 rounded-lg text-text-primary hover:bg-soft font-medium">Semua Produk</Link>
              <div className="py-2">
                <p className="px-3 py-1 text-xs uppercase text-text-secondary font-semibold">Kategori</p>
                {activeCategories.map(cat => (
                  <Link
                    key={cat.id}
                    to={`/products?category=${cat.slug}`}
                    className="block py-2.5 px-6 text-sm text-text-primary hover:bg-soft rounded-lg"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
              <Link to="/products?filter=new" className="block py-3 px-3 rounded-lg text-text-primary hover:bg-soft font-medium">New Arrivals</Link>
              <Link to="/products?filter=featured" className="block py-3 px-3 rounded-lg text-text-primary hover:bg-soft font-medium">Best Sellers</Link>
              <hr className="my-3 border-border" />
              <Link to="/wishlist" className="block py-3 px-3 rounded-lg text-text-primary hover:bg-soft font-medium">Wishlist ({wishlist.length})</Link>
              <Link to="/cart" className="block py-3 px-3 rounded-lg text-text-primary hover:bg-soft font-medium">Keranjang ({cartCount})</Link>
              <Link to="/about" className="block py-3 px-3 rounded-lg text-text-primary hover:bg-soft font-medium">Tentang Kami</Link>
              <Link to="/faq" className="block py-3 px-3 rounded-lg text-text-primary hover:bg-soft font-medium">FAQ</Link>
              <hr className="my-3 border-border" />
              <Link to="/admin" className="block py-3 px-3 rounded-lg text-text-secondary hover:bg-soft text-sm">Admin</Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

function Footer() {
  const { settings, categories } = useApp();
  const activeCategories = categories.filter(c => c.isActive);

  return (
    <footer className="bg-alt-bg border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="font-heading text-2xl font-bold text-deep mb-3">
              Mamaya<span className="text-accent">.</span>
            </h3>
            <p className="text-sm text-text-secondary mb-4">{settings.tagline}</p>
            <p className="text-xs text-text-secondary leading-relaxed">
              Toko online hijab dan aksesori muslimah yang menghadirkan koleksi berkualitas dengan harga terjangkau.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4 text-sm uppercase tracking-wider">Belanja</h4>
            <ul className="space-y-2.5">
              <li><Link to="/products" className="text-sm text-text-secondary hover:text-deep transition-colors">Semua Produk</Link></li>
              <li><Link to="/products?filter=new" className="text-sm text-text-secondary hover:text-deep transition-colors">New Arrivals</Link></li>
              <li><Link to="/products?filter=featured" className="text-sm text-text-secondary hover:text-deep transition-colors">Best Sellers</Link></li>
              {activeCategories.slice(0, 3).map(cat => (
                <li key={cat.id}>
                  <Link to={`/products?category=${cat.slug}`} className="text-sm text-text-secondary hover:text-deep transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4 text-sm uppercase tracking-wider">Informasi</h4>
            <ul className="space-y-2.5">
              <li><Link to="/about" className="text-sm text-text-secondary hover:text-deep transition-colors">Tentang Kami</Link></li>
              <li><Link to="/how-to-order" className="text-sm text-text-secondary hover:text-deep transition-colors">Cara Pemesanan</Link></li>
              <li><Link to="/faq" className="text-sm text-text-secondary hover:text-deep transition-colors">FAQ</Link></li>
              <li><Link to="/shipping" className="text-sm text-text-secondary hover:text-deep transition-colors">Pengiriman</Link></li>
              <li><Link to="/privacy" className="text-sm text-text-secondary hover:text-deep transition-colors">Kebijakan Privasi</Link></li>
              <li><Link to="/terms" className="text-sm text-text-secondary hover:text-deep transition-colors">Syarat & Ketentuan</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4 text-sm uppercase tracking-wider">Hubungi Kami</h4>
            <ul className="space-y-2.5">
              {settings.whatsappNumber && (
                <li>
                  <a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="text-sm text-text-secondary hover:text-deep transition-colors">
                    WhatsApp
                  </a>
                </li>
              )}
              {settings.instagramUrl && (
                <li>
                  <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-text-secondary hover:text-deep transition-colors">
                    Instagram
                  </a>
                </li>
              )}
              {settings.email && (
                <li>
                  <a href={`mailto:${settings.email}`} className="text-sm text-text-secondary hover:text-deep transition-colors">
                    {settings.email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-xs text-text-secondary">
            © {new Date().getFullYear()} {settings.storeName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FloatingWhatsApp() {
  const { settings } = useApp();
  if (!settings.whatsappNumber) return null;

  return (
    <a
      href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('Halo Mamaya Hijab, saya ingin bertanya tentang produk.')}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 hover:bg-green-600 hover:scale-110 transition-all"
      aria-label="Chat via WhatsApp"
    >
      <MessageCircle size={24} />
    </a>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}


