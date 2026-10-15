import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ProductCard, formatPrice, ProductImage } from '../components/ProductCard';
import { Heart, ShoppingBag, MessageCircle, Minus, Plus, ChevronRight, Truck, RotateCcw, Shield } from 'lucide-react';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { getProductBySlug, products, addToCart, toggleWishlist, isInWishlist, settings, categories } = useApp();
  const navigate = useNavigate();
  const product = getProductBySlug(slug || '');

  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="font-heading text-3xl font-bold text-text-primary mb-4">Produk Tidak Ditemukan</h1>
        <p className="text-text-secondary mb-6">Produk yang kamu cari tidak tersedia atau sudah dihapus.</p>
        <Link to="/products" className="inline-flex px-6 py-3 bg-deep text-white rounded-lg font-medium hover:bg-deep/90">
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  const category = categories.find(c => c.id === product.categoryId);
  const inWishlist = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const relatedProducts = products
    .filter(p => p.isActive && p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const color = selectedColor || product.colors[0]?.name || '';
    addToCart(product, quantity, color);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    const color = selectedColor || product.colors[0]?.name || '';
    addToCart(product, quantity, color);
    navigate('/checkout');
  };

  const handleWhatsApp = () => {
    const color = selectedColor || product.colors[0]?.name || '';
    const message = `Halo ${settings.storeName}, saya ingin bertanya tentang produk:\n\n*Nama:* ${product.name}\n*Warna:* ${color}\n*Jumlah:* ${quantity}\n*Harga:* ${formatPrice(product.price)}\n\nMohon informasi ketersediaan dan detail pembayaran. Terima kasih.`;
    const url = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-text-secondary mb-6 flex-wrap">
        <Link to="/" className="hover:text-deep">Beranda</Link>
        <ChevronRight size={14} />
        <Link to="/products" className="hover:text-deep">Produk</Link>
        <ChevronRight size={14} />
        {category && (
          <>
            <Link to={`/products?category=${category.slug}`} className="hover:text-deep">{category.name}</Link>
            <ChevronRight size={14} />
          </>
        )}
        <span className="text-text-primary font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-alt-bg border border-border">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <ProductImage product={product} className="w-full h-full" />
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-colors ${i === activeImage ? 'border-deep' : 'border-border'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            {category && (
              <Link to={`/products?category=${category.slug}`} className="text-xs font-medium text-deep uppercase tracking-wider">
                {category.name}
              </Link>
            )}
            <h1 className="font-heading text-3xl lg:text-4xl font-bold text-text-primary mt-2 mb-3">{product.name}</h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-2xl font-bold text-text-primary">{formatPrice(product.price)}</span>
              {product.compareAtPrice && (
                <>
                  <span className="text-lg text-text-secondary line-through">{formatPrice(product.compareAtPrice)}</span>
                  <span className="text-sm font-medium text-accent bg-accent/10 px-2 py-0.5 rounded">
                    -{Math.round((1 - product.price / product.compareAtPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-4">
              {isOutOfStock ? (
                <span className="text-sm font-medium text-red-500 bg-red-50 px-3 py-1 rounded-full">Stok Habis</span>
              ) : product.stock <= 5 ? (
                <span className="text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full">Sisa {product.stock} pcs</span>
              ) : (
                <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">Tersedia</span>
              )}
            </div>
          </div>

          {/* Colors */}
          {product.colors.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-3">
                Warna: {selectedColor && <span className="font-normal text-text-secondary">{selectedColor}</span>}
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                      selectedColor === color.name
                        ? 'border-deep bg-soft shadow-sm'
                        : 'border-border hover:border-deep/50'
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-full border border-border"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-sm">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          {!isOutOfStock && (
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-3">Jumlah</h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2.5 hover:bg-soft rounded-l-lg transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center text-sm font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2.5 hover:bg-soft rounded-r-lg transition-colors"
                    disabled={quantity >= product.stock}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <span className="text-xs text-text-secondary">Maks. {product.stock} pcs</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-lg font-medium transition-all ${
                  isOutOfStock
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : addedToCart
                    ? 'bg-green-500 text-white'
                    : 'bg-deep text-white hover:bg-deep/90 shadow-lg shadow-deep/20'
                }`}
              >
                <ShoppingBag size={18} />
                {addedToCart ? 'Ditambahkan!' : 'Tambah ke Keranjang'}
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3.5 rounded-lg border transition-colors ${
                  inWishlist ? 'border-accent bg-accent/10 text-accent' : 'border-border hover:border-accent text-text-secondary'
                }`}
              >
                <Heart size={20} className={inWishlist ? 'fill-accent' : ''} />
              </button>
            </div>
            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className={`w-full py-3.5 rounded-lg font-medium transition-colors ${
                isOutOfStock ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-text-primary text-white hover:bg-text-primary/90'
              }`}
            >
              Beli Sekarang
            </button>
            <button
              onClick={handleWhatsApp}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg border border-green-500 text-green-600 font-medium hover:bg-green-50 transition-colors"
            >
              <MessageCircle size={18} />
              Pesan via WhatsApp
            </button>
          </div>

          {/* Description */}
          <div className="pt-6 border-t border-border">
            <h3 className="font-semibold text-text-primary mb-3">Deskripsi</h3>
            <p className="text-sm text-text-secondary leading-relaxed">{product.description}</p>
          </div>

          {/* Details */}
          <div className="pt-4 border-t border-border space-y-3">
            {product.material && (
              <div className="flex gap-3 text-sm">
                <span className="text-text-secondary w-24 shrink-0">Bahan</span>
                <span className="text-text-primary">{product.material}</span>
              </div>
            )}
            {product.size && (
              <div className="flex gap-3 text-sm">
                <span className="text-text-secondary w-24 shrink-0">Ukuran</span>
                <span className="text-text-primary">{product.size}</span>
              </div>
            )}
            {product.careInstructions && (
              <div className="flex gap-3 text-sm">
                <span className="text-text-secondary w-24 shrink-0">Perawatan</span>
                <span className="text-text-primary">{product.careInstructions}</span>
              </div>
            )}
          </div>

          {/* Info badges */}
          <div className="grid grid-cols-3 gap-3 pt-4">
            <div className="flex flex-col items-center p-3 bg-soft rounded-lg text-center">
              <Truck size={18} className="text-deep mb-1" />
              <span className="text-[10px] text-text-secondary">Pengiriman tersedia</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-soft rounded-lg text-center">
              <RotateCcw size={18} className="text-deep mb-1" />
              <span className="text-[10px] text-text-secondary">Penukaran barang</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-soft rounded-lg text-center">
              <Shield size={18} className="text-deep mb-1" />
              <span className="text-[10px] text-text-secondary">Produk terjamin</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 pt-12 border-t border-border">
          <h2 className="font-heading text-2xl lg:text-3xl font-bold text-text-primary mb-6">Produk Serupa</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
