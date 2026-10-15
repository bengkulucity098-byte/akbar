import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { Heart, ShoppingBag } from 'lucide-react';

export default function Wishlist() {
  const { products, wishlist } = useApp();
  const wishlistProducts = products.filter(p => wishlist.includes(p.id) && p.isActive);

  if (wishlistProducts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-soft flex items-center justify-center">
          <Heart size={40} className="text-text-secondary" />
        </div>
        <h1 className="font-heading text-3xl font-bold text-text-primary mb-3">Wishlist Kosong</h1>
        <p className="text-text-secondary mb-6">Belum ada produk favorit. Simpan produk yang kamu sukai di sini.</p>
        <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-deep text-white rounded-lg font-medium hover:bg-deep/90">
          <ShoppingBag size={18} />
          Jelajahi Produk
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      <h1 className="font-heading text-3xl lg:text-4xl font-bold text-text-primary mb-2">Wishlist</h1>
      <p className="text-text-secondary text-sm mb-8">{wishlistProducts.length} produk favorit</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {wishlistProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
