import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { SlidersHorizontal, X, ChevronDown, Grid3X3, LayoutGrid } from 'lucide-react';

export default function Products() {
  const { products, categories } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [gridCols, setGridCols] = useState(3);

  const categorySlug = searchParams.get('category') || '';
  const filterType = searchParams.get('filter') || '';
  const searchQuery = searchParams.get('search') || '';
  const sortBy = searchParams.get('sort') || 'newest';

  const activeCategories = categories.filter(c => c.isActive);
  const currentCategory = activeCategories.find(c => c.slug === categorySlug);

  // Get all unique colors
  const allColors = useMemo(() => {
    const colorSet = new Set<string>();
    products.forEach(p => {
      if (p.isActive) p.colors.forEach(c => colorSet.add(c.name));
    });
    return Array.from(colorSet);
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = products.filter(p => p.isActive);

    // Category filter
    if (categorySlug) {
      const cat = categories.find(c => c.slug === categorySlug);
      if (cat) result = result.filter(p => p.categoryId === cat.id);
    }

    // Special filters
    if (filterType === 'new') result = result.filter(p => p.isNewArrival);
    if (filterType === 'featured') result = result.filter(p => p.isFeatured);

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    // Price filter
    if (priceMin) result = result.filter(p => p.price >= parseInt(priceMin));
    if (priceMax) result = result.filter(p => p.price <= parseInt(priceMax));

    // Color filter
    if (selectedColor) result = result.filter(p => p.colors.some(c => c.name === selectedColor));

    // Stock filter
    if (inStockOnly) result = result.filter(p => p.stock > 0);

    // Sort
    switch (sortBy) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'name-asc': result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'name-desc': result.sort((a, b) => b.name.localeCompare(a.name)); break;
      case 'newest': default: result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
    }

    return result;
  }, [products, categories, categorySlug, filterType, searchQuery, priceMin, priceMax, selectedColor, inStockOnly, sortBy]);

  const clearFilters = () => {
    setPriceMin('');
    setPriceMax('');
    setSelectedColor('');
    setInStockOnly(false);
    setSearchParams({});
  };

  const hasActiveFilters = priceMin || priceMax || selectedColor || inStockOnly;

  const pageTitle = searchQuery
    ? `Hasil Pencarian: "${searchQuery}"`
    : currentCategory
    ? currentCategory.name
    : filterType === 'new'
    ? 'New Arrivals'
    : filterType === 'featured'
    ? 'Best Sellers'
    : 'Semua Produk';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-text-secondary mb-4">
        <Link to="/" className="hover:text-deep">Beranda</Link>
        <span>/</span>
        <span className="text-text-primary font-medium">{pageTitle}</span>
      </nav>

      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="font-heading text-3xl lg:text-4xl font-bold text-text-primary mb-2">{pageTitle}</h1>
        <p className="text-text-secondary text-sm">
          {filteredProducts.length} produk ditemukan
          {searchQuery && ` untuk "${searchQuery}"`}
        </p>
      </div>

      <div className="flex gap-6 lg:gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-28 space-y-6">
            {/* Sort */}
            <div>
              <h3 className="font-semibold text-sm text-text-primary mb-3">Urutkan</h3>
              <select
                value={sortBy}
                onChange={(e) => setSearchParams(prev => { prev.set('sort', e.target.value); return prev; })}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:border-deep"
              >
                <option value="newest">Terbaru</option>
                <option value="price-low">Harga Terendah</option>
                <option value="price-high">Harga Tertinggi</option>
                <option value="name-asc">Nama A-Z</option>
                <option value="name-desc">Nama Z-A</option>
              </select>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-semibold text-sm text-text-primary mb-3">Kategori</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSearchParams({})}
                  className={`block text-sm py-1.5 px-2 rounded transition-colors w-full text-left ${!categorySlug && !filterType ? 'text-deep font-medium bg-soft' : 'text-text-secondary hover:text-deep'}`}
                >
                  Semua
                </button>
                {activeCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSearchParams({ category: cat.slug })}
                    className={`block text-sm py-1.5 px-2 rounded transition-colors w-full text-left ${categorySlug === cat.slug ? 'text-deep font-medium bg-soft' : 'text-text-secondary hover:text-deep'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="font-semibold text-sm text-text-primary mb-3">Harga</h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:border-deep"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:border-deep"
                />
              </div>
            </div>

            {/* Colors */}
            {allColors.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm text-text-primary mb-3">Warna</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedColor('')}
                    className={`px-3 py-1 text-xs rounded-full border transition-colors ${!selectedColor ? 'border-deep text-deep bg-soft' : 'border-border text-text-secondary hover:border-deep'}`}
                  >
                    Semua
                  </button>
                  {allColors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(selectedColor === color ? '' : color)}
                      className={`px-3 py-1 text-xs rounded-full border transition-colors ${selectedColor === color ? 'border-deep text-deep bg-soft' : 'border-border text-text-secondary hover:border-deep'}`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-deep focus:ring-deep"
                />
                <span className="text-sm text-text-primary">Tersedia stok</span>
              </label>
            </div>

            {/* Clear */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="w-full py-2 text-sm text-deep border border-deep rounded-lg hover:bg-soft transition-colors"
              >
                Hapus Semua Filter
              </button>
            )}
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Mobile filter/sort bar */}
          <div className="lg:hidden flex items-center gap-3 mb-4">
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium text-text-primary hover:border-deep transition-colors"
            >
              <SlidersHorizontal size={16} />
              Filter & Urutkan
            </button>
            <span className="text-sm text-text-secondary">{filteredProducts.length} produk</span>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-soft flex items-center justify-center">
                <Grid3X3 size={32} className="text-text-secondary" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-text-primary mb-2">Produk Tidak Ditemukan</h3>
              <p className="text-text-secondary text-sm mb-4">Produk yang kamu cari belum ditemukan. Coba ubah filter atau kata kunci pencarian.</p>
              <button onClick={clearFilters} className="px-6 py-2.5 bg-deep text-white rounded-lg text-sm font-medium hover:bg-deep/90 transition-colors">
                Lihat Semua Produk
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilters(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-xl overflow-y-auto">
            <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="font-semibold text-text-primary">Filter & Urutkan</h2>
              <button onClick={() => setShowFilters(false)} className="p-2 text-text-primary hover:text-deep">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 space-y-6">
              {/* Sort */}
              <div>
                <h3 className="font-semibold text-sm text-text-primary mb-3">Urutkan</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSearchParams(prev => { prev.set('sort', e.target.value); return prev; })}
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-white"
                >
                  <option value="newest">Terbaru</option>
                  <option value="price-low">Harga Terendah</option>
                  <option value="price-high">Harga Tertinggi</option>
                  <option value="name-asc">Nama A-Z</option>
                  <option value="name-desc">Nama Z-A</option>
                </select>
              </div>

              {/* Categories */}
              <div>
                <h3 className="font-semibold text-sm text-text-primary mb-3">Kategori</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => { setSearchParams({}); setShowFilters(false); }}
                    className={`block text-sm py-2 px-3 rounded-lg w-full text-left ${!categorySlug && !filterType ? 'text-deep font-medium bg-soft' : 'text-text-secondary'}`}
                  >
                    Semua
                  </button>
                  {activeCategories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => { setSearchParams({ category: cat.slug }); setShowFilters(false); }}
                      className={`block text-sm py-2 px-3 rounded-lg w-full text-left ${categorySlug === cat.slug ? 'text-deep font-medium bg-soft' : 'text-text-secondary'}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <h3 className="font-semibold text-sm text-text-primary mb-3">Harga</h3>
                <div className="flex gap-2">
                  <input type="number" placeholder="Min" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} className="flex-1 px-3 py-2.5 text-sm border border-border rounded-lg" />
                  <input type="number" placeholder="Max" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} className="flex-1 px-3 py-2.5 text-sm border border-border rounded-lg" />
                </div>
              </div>

              {/* Colors */}
              {allColors.length > 0 && (
                <div>
                  <h3 className="font-semibold text-sm text-text-primary mb-3">Warna</h3>
                  <div className="flex flex-wrap gap-2">
                    {allColors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(selectedColor === color ? '' : color)}
                        className={`px-3 py-1.5 text-xs rounded-full border ${selectedColor === color ? 'border-deep text-deep bg-soft' : 'border-border text-text-secondary'}`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="w-4 h-4 rounded" />
                <span className="text-sm text-text-primary">Tersedia stok</span>
              </label>

              {/* Actions */}
              <div className="pt-4 border-t border-border space-y-2">
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="w-full py-2.5 text-sm text-deep border border-deep rounded-lg hover:bg-soft">
                    Hapus Semua Filter
                  </button>
                )}
                <button onClick={() => setShowFilters(false)} className="w-full py-2.5 bg-deep text-white rounded-lg text-sm font-medium">
                  Tampilkan {filteredProducts.length} Produk
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
