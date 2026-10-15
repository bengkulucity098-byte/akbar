import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatPrice, ProductImage } from '../components/ProductCard';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function Cart() {
  const { cart, removeFromCart, updateCartQuantity, cartTotal, clearCart } = useApp();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-soft flex items-center justify-center">
          <ShoppingBag size={40} className="text-text-secondary" />
        </div>
        <h1 className="font-heading text-3xl font-bold text-text-primary mb-3">Keranjang Kosong</h1>
        <p className="text-text-secondary mb-6">Belum ada produk di keranjangmu. Yuk, mulai belanja!</p>
        <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-deep text-white rounded-lg font-medium hover:bg-deep/90 transition-colors">
          <ShoppingBag size={18} />
          Mulai Belanja
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 lg:mb-8">
        <div>
          <h1 className="font-heading text-3xl lg:text-4xl font-bold text-text-primary">Keranjang Belanja</h1>
          <p className="text-text-secondary text-sm mt-1">{cart.length} item di keranjang</p>
        </div>
        <button
          onClick={clearCart}
          className="text-sm text-text-secondary hover:text-red-500 transition-colors"
        >
          Kosongkan
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={`${item.product.id}-${item.selectedColor}`} className="flex gap-4 p-4 bg-white rounded-xl border border-border">
              {/* Image */}
              <Link to={`/product/${item.product.slug}`} className="w-20 h-24 sm:w-24 sm:h-32 rounded-lg overflow-hidden shrink-0 bg-alt-bg">
                <ProductImage product={item.product} className="w-full h-full" />
              </Link>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.product.slug}`} className="font-medium text-text-primary text-sm sm:text-base hover:text-deep transition-colors line-clamp-2">
                  {item.product.name}
                </Link>
                {item.selectedColor && (
                  <p className="text-xs text-text-secondary mt-1">Warna: {item.selectedColor}</p>
                )}
                <p className="text-sm font-semibold text-text-primary mt-2">{formatPrice(item.product.price)}</p>

                {/* Quantity & Remove */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-border rounded-lg">
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.selectedColor, item.quantity - 1)}
                      className="p-1.5 sm:p-2 hover:bg-soft rounded-l-lg transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 sm:w-10 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.selectedColor, item.quantity + 1)}
                      className="p-1.5 sm:p-2 hover:bg-soft rounded-r-lg transition-colors"
                      disabled={item.quantity >= item.product.stock}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id, item.selectedColor)}
                    className="p-2 text-text-secondary hover:text-red-500 transition-colors"
                    aria-label="Hapus produk"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Subtotal */}
              <div className="text-right shrink-0 hidden sm:block">
                <p className="text-sm font-semibold text-text-primary">{formatPrice(item.product.price * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 bg-white rounded-xl border border-border p-6">
            <h2 className="font-semibold text-text-primary text-lg mb-4">Ringkasan Pesanan</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} item)</span>
                <span className="font-medium">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Ongkos Kirim</span>
                <span className="text-text-secondary text-xs">Dikonfirmasi saat pemesanan</span>
              </div>
              <hr className="border-border" />
              <div className="flex justify-between text-base">
                <span className="font-semibold text-text-primary">Total</span>
                <span className="font-bold text-text-primary">{formatPrice(cartTotal)}</span>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <Link
                to="/checkout"
                className="block w-full text-center py-3.5 bg-deep text-white rounded-lg font-medium hover:bg-deep/90 transition-colors shadow-lg shadow-deep/20"
              >
                Checkout
              </Link>
              <Link
                to="/products"
                className="block w-full text-center py-3 border border-border rounded-lg text-sm font-medium text-text-primary hover:bg-soft transition-colors"
              >
                <ArrowLeft size={16} className="inline mr-2" />
                Lanjut Belanja
              </Link>
            </div>
            <p className="mt-4 text-xs text-text-secondary text-center">
              * Biaya pengiriman akan dikonfirmasi melalui WhatsApp
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
