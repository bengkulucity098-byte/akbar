import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { ArrowRight, Truck, Shield, MessageCircle, Palette, Mail, Instagram, ChevronLeft, ChevronRight } from 'lucide-react';

function HeroBanner() {
  const { banners } = useApp();
  const [current, setCurrent] = useState(0);
  const activeBanners = banners.filter(b => b.isActive);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % activeBanners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) return null;
  const banner = activeBanners[current];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-soft via-primary to-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[50vh] lg:min-h-[70vh] py-12 lg:py-0">
          {/* Text Content */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-text-primary leading-tight mb-4 lg:mb-6">
              {banner.title}
            </h1>
            <p className="text-base sm:text-lg text-text-secondary mb-6 lg:mb-8 max-w-lg mx-auto lg:mx-0">
              {banner.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                to={banner.buttonLink}
                className="inline-flex items-center justify-center px-8 py-3.5 bg-deep text-white font-medium rounded-lg hover:bg-deep/90 transition-colors shadow-lg shadow-deep/20"
              >
                {banner.buttonText}
                <ArrowRight size={18} className="ml-2" />
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-deep font-medium rounded-lg border-2 border-deep hover:bg-soft transition-colors"
              >
                Jelajahi Koleksi
              </Link>
            </div>
          </div>

          {/* Visual */}
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-[420px] lg:h-[500px]">
              <div className="absolute inset-0 bg-white/30 rounded-3xl blur-3xl" />
              <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/50 shadow-2xl shadow-deep/10">
                <img
                  src="https://image.qwenlm.ai/generated-images/9ddab8eb-a292-4510-8126-49d7efe2ff31/_result.png"
                  alt="Mamaya Hijab - Elegance in Every Fold"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
              </div>
              {/* Decorative circles */}
              <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-accent/30 animate-pulse" />
              <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-secondary/30" />
            </div>
          </div>
        </div>
      </div>

      {/* Banner navigation dots */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
          <button onClick={() => setCurrent((current - 1 + activeBanners.length) % activeBanners.length)} className="p-1 text-deep/50 hover:text-deep">
            <ChevronLeft size={18} />
          </button>
          {activeBanners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-deep w-6' : 'bg-deep/30'}`}
            />
          ))}
          <button onClick={() => setCurrent((current + 1) % activeBanners.length)} className="p-1 text-deep/50 hover:text-deep">
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </section>
  );
}

function CategorySection() {
  const { categories } = useApp();
  const activeCategories = categories.filter(c => c.isActive);

  const categoryIcons: Record<string, string> = {
    'cat-1': '🧣',
    'cat-2': '🔷',
    'cat-3': '✨',
    'cat-4': '🎀',
    'cat-5': '💎',
  };

  const categoryGradients: Record<string, string> = {
    'cat-1': 'from-blue-50 to-blue-100',
    'cat-2': 'from-purple-50 to-pink-50',
    'cat-3': 'from-gray-50 to-slate-100',
    'cat-4': 'from-green-50 to-teal-50',
    'cat-5': 'from-amber-50 to-orange-50',
  };

  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 lg:mb-10">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-text-primary mb-2">Kategori Pilihan</h2>
          <p className="text-text-secondary">Temukan hijab sesuai kebutuhanmu</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
          {activeCategories.map(cat => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className="group flex flex-col items-center p-4 lg:p-6 rounded-2xl bg-gradient-to-b hover:shadow-md transition-all duration-300 border border-border hover:border-deep/20"
              style={{ backgroundImage: `linear-gradient(to bottom, var(--tw-gradient-stops))` }}
            >
              <div className={`w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br ${categoryGradients[cat.id] || 'from-gray-50 to-gray-100'} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <span className="text-2xl lg:text-3xl">{categoryIcons[cat.id] || '📦'}</span>
              </div>
              <span className="text-sm font-medium text-text-primary text-center group-hover:text-deep transition-colors">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductSection({ title, subtitle, products, viewAllLink }: { title: string; subtitle: string; products: any[]; viewAllLink: string }) {
  if (products.length === 0) return null;

  return (
    <section className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-text-primary mb-1">{title}</h2>
            <p className="text-text-secondary text-sm sm:text-base">{subtitle}</p>
          </div>
          <Link to={viewAllLink} className="hidden sm:flex items-center gap-1 text-sm font-medium text-deep hover:text-deep/80 transition-colors">
            Lihat Semua <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {products.slice(0, 8).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mt-6 text-center sm:hidden">
          <Link to={viewAllLink} className="inline-flex items-center gap-1 text-sm font-medium text-deep">
            Lihat Semua <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function CollectionBanner() {
  return (
    <section className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-soft to-accent/20 min-h-[300px] lg:min-h-[400px]">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src="https://image.qwenlm.ai/generated-images/bd339177-f333-433e-95f5-d6120412a7fb/_result.png"
              alt="Koleksi Mamaya Hijab"
              className="w-full h-full object-cover opacity-30 lg:opacity-40"
              loading="lazy"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-transparent" />
          <div className="relative z-10 flex items-center p-8 lg:p-16 min-h-[300px] lg:min-h-[400px]">
            <div className="max-w-lg">
              <h2 className="font-heading text-3xl lg:text-4xl font-bold text-text-primary mb-3">
                Soft Colors, Timeless Beauty
              </h2>
              <p className="text-text-secondary mb-6">
                Koleksi warna lembut untuk menemani berbagai momen spesialmu.
              </p>
              <Link
                to="/products"
                className="inline-flex items-center px-6 py-3 bg-deep text-white font-medium rounded-lg hover:bg-deep/90 transition-colors shadow-lg shadow-deep/20"
              >
                Jelajahi Koleksi
                <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyUsSection() {
  const features = [
    { icon: <Palette size={24} />, title: 'Pilihan Warna Menarik', desc: 'Tersedia dalam berbagai warna yang sesuai dengan gaya dan kepribadianmu.' },
    { icon: <Shield size={24} />, title: 'Informasi Produk Jelas', desc: 'Setiap produk dilengkapi detail bahan, ukuran, dan warna yang akurat.' },
    { icon: <MessageCircle size={24} />, title: 'Pemesanan Mudah', desc: 'Pesan langsung melalui WhatsApp dengan proses yang simpel dan cepat.' },
    { icon: <Truck size={24} />, title: 'Layanan Responsif', desc: 'Tim kami siap membantu menjawab pertanyaan dan kebutuhanmu.' },
  ];

  return (
    <section className="py-12 lg:py-16 bg-alt-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-text-primary mb-2">Mengapa Mamaya Hijab?</h2>
          <p className="text-text-secondary">Alasan pelanggan memilih kami</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-border text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-soft flex items-center justify-center text-deep">
                {f.icon}
              </div>
              <h3 className="font-semibold text-text-primary mb-2">{f.title}</h3>
              <p className="text-sm text-text-secondary">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      return;
    }
    setStatus('success');
    setEmail('');
    setTimeout(() => setStatus('idle'), 4000);
  };

  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center">
          <Mail size={32} className="mx-auto text-deep mb-4" />
          <h2 className="font-heading text-2xl lg:text-3xl font-bold text-text-primary mb-2">Dapatkan Info Terbaru</h2>
          <p className="text-text-secondary text-sm mb-6">Berlangganan untuk mengetahui koleksi terbaru dan penawaran spesial.</p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Alamat email kamu"
              className="flex-1 px-4 py-3 rounded-lg border border-border bg-soft focus:outline-none focus:border-deep text-sm"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-deep text-white font-medium rounded-lg hover:bg-deep/90 transition-colors whitespace-nowrap"
            >
              Berlangganan
            </button>
          </form>
          {status === 'success' && <p className="mt-3 text-sm text-green-600">Terima kasih! Kamu akan menerima info terbaru dari kami.</p>}
          {status === 'error' && <p className="mt-3 text-sm text-red-500">Mohon masukkan alamat email yang valid.</p>}
        </div>
      </div>
    </section>
  );
}

function SocialSection() {
  const { settings } = useApp();
  return (
    <section className="py-12 lg:py-16 bg-alt-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Instagram size={32} className="mx-auto text-deep mb-4" />
        <h2 className="font-heading text-2xl lg:text-3xl font-bold text-text-primary mb-2">Ikuti Kami di Instagram</h2>
        <p className="text-text-secondary text-sm mb-6">Lihat inspirasi gaya dan update terbaru dari Mamaya Hijab.</p>
        {settings.instagramUrl ? (
          <a
            href={settings.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-border rounded-lg text-deep font-medium hover:bg-soft transition-colors"
          >
            <Instagram size={18} />
            @mamayahijab
          </a>
        ) : (
          <p className="text-sm text-text-secondary">Tautan Instagram belum dikonfigurasi.</p>
        )}
      </div>
    </section>
  );
}

export default function Home() {
  const { getNewArrivals, getFeaturedProducts } = useApp();
  const newArrivals = getNewArrivals();
  const featured = getFeaturedProducts();

  return (
    <div>
      <HeroBanner />
      <CategorySection />
      <ProductSection
        title="New Arrivals"
        subtitle="Temukan koleksi terbaru dari Mamaya Hijab."
        products={newArrivals}
        viewAllLink="/products?filter=new"
      />
      <CollectionBanner />
      <ProductSection
        title="Favorit Mamaya"
        subtitle="Produk yang paling disukai pelanggan kami."
        products={featured}
        viewAllLink="/products?filter=featured"
      />
      <WhyUsSection />
      <SocialSection />
      <NewsletterSection />
    </div>
  );
}
