import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product } from '../data/store';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
}

function ProductImage({ product, className = '' }: { product: Product; className?: string }) {
  const categoryColors: Record<string, string> = {
    'cat-1': 'from-blue-100 to-blue-200',
    'cat-2': 'from-purple-100 to-pink-100',
    'cat-3': 'from-gray-100 to-gray-200',
    'cat-4': 'from-green-100 to-teal-100',
    'cat-5': 'from-amber-100 to-orange-100',
  };
  const gradient = categoryColors[product.categoryId] || 'from-primary to-secondary';

  if (product.images && product.images.length > 0) {
    return <img src={product.images[0]} alt={product.name} className={`object-cover w-full h-full ${className}`} loading="lazy" />;
  }

  return (
    <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
      <div className="text-center p-4">
        <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-white/50 flex items-center justify-center">
          <ShoppingBag size={20} className="text-deep" />
        </div>
        <p className="text-xs text-deep/70 font-medium">{product.name}</p>
      </div>
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const { toggleWishlist, isInWishlist, addToCart } = useApp();
  const inWishlist = isInWishlist(product.id);
  const hasVariations = product.colors.length > 1;
  const isOutOfStock = product.stock <= 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasVariations) return;
    addToCart(product, 1, product.colors[0]?.name || '');
  };

  return (
    <div className="group relative bg-white rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Image */}
      <Link to={`/product/${product.slug}`} className="block relative aspect-[3/4] overflow-hidden">
        <ProductImage product={product} className="group-hover:scale-105 transition-transform duration-500" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNewArrival && (
            <span className="bg-deep text-white text-[10px] font-semibold px-2 py-1 rounded-full">NEW</span>
          )}
          {product.compareAtPrice && (
            <span className="bg-accent text-white text-[10px] font-semibold px-2 py-1 rounded-full">SALE</span>
          )}
          {isOutOfStock && (
            <span className="bg-gray-500 text-white text-[10px] font-semibold px-2 py-1 rounded-full">HABIS</span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product.id); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
          aria-label={inWishlist ? 'Hapus dari wishlist' : 'Tambah ke wishlist'}
        >
          <Heart size={16} className={inWishlist ? 'fill-accent text-accent' : 'text-text-secondary'} />
        </button>

        {/* Quick add overlay */}
        {!hasVariations && !isOutOfStock && (
          <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleQuickAdd}
              className="w-full py-2 bg-deep/90 backdrop-blur-sm text-white text-xs font-medium rounded-lg hover:bg-deep transition-colors"
            >
              + Keranjang
            </button>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-3 sm:p-4">
        <Link to={`/product/${product.slug}`}>
          <h3 className="text-sm font-medium text-text-primary line-clamp-2 mb-1.5 group-hover:text-deep transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Colors */}
        {product.colors.length > 0 && (
          <div className="flex items-center gap-1 mb-2">
            {product.colors.slice(0, 4).map((color, i) => (
              <span
                key={i}
                className="w-3.5 h-3.5 rounded-full border border-border"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-[10px] text-text-secondary">+{product.colors.length - 4}</span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-text-primary">{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-xs text-text-secondary line-through">{formatPrice(product.compareAtPrice)}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export { formatPrice, ProductImage };
