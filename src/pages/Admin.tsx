import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../components/ProductCard';
import { Product, Category, Banner } from '../data/store';
import {
  LayoutDashboard, Package, Tags, Settings, LogOut, Plus, Edit, Trash2,
  Eye, EyeOff, Save, X, ChevronRight, Image
} from 'lucide-react';

type AdminTab = 'dashboard' | 'products' | 'categories' | 'banners' | 'settings';

export default function Admin() {
  const { isAdmin, adminLogin, adminLogout, products, categories, settings, banners, addProduct, updateProduct, deleteProduct, addCategory, updateCategory, updateSettings, updateBanners } = useApp();
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl border border-border p-8 shadow-sm">
            <h1 className="font-heading text-2xl font-bold text-text-primary text-center mb-2">Admin Login</h1>
            <p className="text-sm text-text-secondary text-center mb-6">Masukkan kata sandi untuk mengakses dashboard.</p>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!adminLogin(password)) {
                setLoginError('Kata sandi salah.');
              }
            }}>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setLoginError(''); }}
                placeholder="Kata sandi"
                className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:border-deep text-sm mb-3"
              />
              {loginError && <p className="text-xs text-red-500 mb-3">{loginError}</p>}
              <button type="submit" className="w-full py-3 bg-deep text-white rounded-lg font-medium hover:bg-deep/90 text-sm">
                Masuk
              </button>
            </form>
            <p className="mt-4 text-[10px] text-text-secondary text-center">
              Demo password: mamaya2024
            </p>
          </div>
        </div>
      </div>
    );
  }

  const tabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Ringkasan', icon: <LayoutDashboard size={18} /> },
    { id: 'products', label: 'Produk', icon: <Package size={18} /> },
    { id: 'categories', label: 'Kategori', icon: <Tags size={18} /> },
    { id: 'banners', label: 'Banner', icon: <Image size={18} /> },
    { id: 'settings', label: 'Pengaturan', icon: <Settings size={18} /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-3xl font-bold text-text-primary">Dashboard Admin</h1>
        <button onClick={adminLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:text-red-500 border border-border rounded-lg hover:border-red-200 transition-colors">
          <LogOut size={16} /> Keluar
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 border-b border-border">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg whitespace-nowrap transition-colors ${
              activeTab === tab.id ? 'text-deep border-b-2 border-deep bg-soft' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'dashboard' && <DashboardTab products={products} categories={categories} />}
      {activeTab === 'products' && <ProductsTab products={products} categories={categories} addProduct={addProduct} updateProduct={updateProduct} deleteProduct={deleteProduct} />}
      {activeTab === 'categories' && <CategoriesTab categories={categories} addCategory={addCategory} updateCategory={updateCategory} />}
      {activeTab === 'banners' && <BannersTab banners={banners} updateBanners={updateBanners} />}
      {activeTab === 'settings' && <SettingsTab settings={settings} updateSettings={updateSettings} />}
    </div>
  );
}

function DashboardTab({ products, categories }: { products: Product[]; categories: Category[] }) {
  const activeProducts = products.filter(p => p.isActive).length;
  const totalStock = products.reduce((s, p) => s + p.stock, 0);
  const outOfStock = products.filter(p => p.stock <= 0 && p.isActive).length;

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Total Produk" value={products.length.toString()} color="bg-blue-50 text-deep" />
      <StatCard label="Produk Aktif" value={activeProducts.toString()} color="bg-green-50 text-green-600" />
      <StatCard label="Total Stok" value={totalStock.toString()} color="bg-purple-50 text-purple-600" />
      <StatCard label="Stok Habis" value={outOfStock.toString()} color="bg-red-50 text-red-500" />
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className={`p-5 rounded-xl border border-border ${color.split(' ')[0]}`}>
      <p className="text-sm text-text-secondary mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color.split(' ')[1]}`}>{value}</p>
    </div>
  );
}

function ProductsTab({ products, categories, addProduct, updateProduct, deleteProduct }: any) {
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  const emptyProduct: Product = {
    id: `prod-${Date.now()}`,
    name: '',
    slug: '',
    description: '',
    categoryId: categories[0]?.id || '',
    price: 0,
    images: [],
    colors: [],
    stock: 0,
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    createdAt: new Date().toISOString().split('T')[0]
  };

  const handleSave = (product: Product) => {
    if (editing && products.find((p: Product) => p.id === editing.id)) {
      updateProduct(product.id, product);
    } else {
      addProduct(product);
    }
    setShowForm(false);
    setEditing(null);
  };

  if (showForm) {
    return <ProductForm product={editing || emptyProduct} categories={categories} onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(null); }} />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-text-secondary">{products.length} produk</p>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-deep text-white text-sm rounded-lg hover:bg-deep/90">
          <Plus size={16} /> Tambah Produk
        </button>
      </div>
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-alt-bg border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Produk</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary hidden sm:table-cell">Kategori</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Harga</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary hidden md:table-cell">Stok</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Status</th>
                <th className="text-right px-4 py-3 font-medium text-text-secondary">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product: Product) => (
                <tr key={product.id} className="hover:bg-soft/50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-text-primary">{product.name}</p>
                    <p className="text-xs text-text-secondary">{product.slug}</p>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-text-secondary">
                    {categories.find((c: Category) => c.id === product.categoryId)?.name || '-'}
                  </td>
                  <td className="px-4 py-3 font-medium">{formatPrice(product.price)}</td>
                  <td className="px-4 py-3 hidden md:table-cell">{product.stock}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${product.isActive ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                      {product.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                      {product.isActive ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => { setEditing(product); setShowForm(true); }} className="p-1.5 text-text-secondary hover:text-deep" title="Edit">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => { if (confirm('Hapus produk ini?')) deleteProduct(product.id); }} className="p-1.5 text-text-secondary hover:text-red-500 ml-1" title="Hapus">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ProductForm({ product, categories, onSave, onCancel }: { product: Product; categories: Category[]; onSave: (p: Product) => void; onCancel: () => void }) {
  const [form, setForm] = useState<Product>({ ...product });
  const [colorName, setColorName] = useState('');
  const [colorHex, setColorHex] = useState('#DCEBFA');

  const addColor = () => {
    if (colorName.trim()) {
      setForm(prev => ({ ...prev, colors: [...prev.colors, { name: colorName.trim(), hex: colorHex }] }));
      setColorName('');
    }
  };

  const removeColor = (index: number) => {
    setForm(prev => ({ ...prev, colors: prev.colors.filter((_, i) => i !== index) }));
  };

  return (
    <div className="bg-white rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-semibold text-lg text-text-primary">{product.name ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
        <button onClick={onCancel} className="p-2 text-text-secondary hover:text-text-primary"><X size={20} /></button>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">Nama Produk *</label>
          <input type="text" value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-deep" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">Deskripsi</label>
          <textarea value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} rows={3} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-deep resize-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Kategori</label>
          <select value={form.categoryId} onChange={e => setForm(prev => ({ ...prev, categoryId: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-deep">
            {categories.map((c: Category) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Harga (IDR) *</label>
          <input type="number" value={form.price} onChange={e => setForm(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-deep" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Harga Coret (IDR)</label>
          <input type="number" value={form.compareAtPrice || ''} onChange={e => setForm(prev => ({ ...prev, compareAtPrice: e.target.value ? parseInt(e.target.value) : undefined }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-deep" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Stok</label>
          <input type="number" value={form.stock} onChange={e => setForm(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-deep" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bahan</label>
          <input type="text" value={form.material || ''} onChange={e => setForm(prev => ({ ...prev, material: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-deep" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Ukuran</label>
          <input type="text" value={form.size || ''} onChange={e => setForm(prev => ({ ...prev, size: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-deep" />
        </div>

        {/* Colors */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-2">Warna</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {form.colors.map((c, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-soft rounded-full text-xs">
                <span className="w-3 h-3 rounded-full border border-border" style={{ backgroundColor: c.hex }} />
                {c.name}
                <button onClick={() => removeColor(i)} className="text-text-secondary hover:text-red-500"><X size={12} /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text" value={colorName} onChange={e => setColorName(e.target.value)} placeholder="Nama warna" className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-deep" />
            <input type="color" value={colorHex} onChange={e => setColorHex(e.target.value)} className="w-10 h-9 rounded border border-border cursor-pointer" />
            <button onClick={addColor} className="px-3 py-2 bg-deep text-white rounded-lg text-sm">+</button>
          </div>
        </div>

        {/* Toggles */}
        <div className="sm:col-span-2 flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={e => setForm(prev => ({ ...prev, isActive: e.target.checked }))} className="w-4 h-4 rounded" />
            <span className="text-sm">Aktif</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isNewArrival} onChange={e => setForm(prev => ({ ...prev, isNewArrival: e.target.checked }))} className="w-4 h-4 rounded" />
            <span className="text-sm">New Arrival</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(prev => ({ ...prev, isFeatured: e.target.checked }))} className="w-4 h-4 rounded" />
            <span className="text-sm">Best Seller</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3 mt-6 pt-4 border-t border-border">
        <button onClick={() => onSave(form)} className="flex items-center gap-2 px-6 py-2.5 bg-deep text-white rounded-lg text-sm font-medium hover:bg-deep/90">
          <Save size={16} /> Simpan
        </button>
        <button onClick={onCancel} className="px-6 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-soft">Batal</button>
      </div>
    </div>
  );
}

function CategoriesTab({ categories, addCategory, updateCategory }: any) {
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleAdd = () => {
    if (!newName.trim()) return;
    addCategory({
      id: `cat-${Date.now()}`,
      name: newName.trim(),
      slug: newName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      image: '',
      isActive: true,
      sortOrder: categories.length + 1
    });
    setNewName('');
  };

  return (
    <div>
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          placeholder="Nama kategori baru"
          className="flex-1 px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-deep"
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
        />
        <button onClick={handleAdd} className="px-4 py-2.5 bg-deep text-white rounded-lg text-sm font-medium hover:bg-deep/90">
          <Plus size={16} />
        </button>
      </div>
      <div className="bg-white rounded-xl border border-border divide-y divide-border">
        {categories.map((cat: Category) => (
          <div key={cat.id} className="flex items-center justify-between px-4 py-3">
            {editingId === cat.id ? (
              <div className="flex gap-2 flex-1">
                <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="flex-1 px-3 py-1.5 border border-border rounded text-sm" />
                <button onClick={() => { updateCategory(cat.id, { name: editName, slug: editName.toLowerCase().replace(/[^a-z0-9]+/g, '-') }); setEditingId(null); }} className="px-3 py-1.5 bg-deep text-white rounded text-xs">Simpan</button>
                <button onClick={() => setEditingId(null)} className="px-3 py-1.5 border border-border rounded text-xs">Batal</button>
              </div>
            ) : (
              <>
                <div>
                  <p className="font-medium text-text-primary text-sm">{cat.name}</p>
                  <p className="text-xs text-text-secondary">/{cat.slug}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${cat.isActive ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                    {cat.isActive ? 'Aktif' : 'Nonaktif'}
                  </span>
                  <button onClick={() => { setEditingId(cat.id); setEditName(cat.name); }} className="p-1.5 text-text-secondary hover:text-deep"><Edit size={14} /></button>
                  <button onClick={() => updateCategory(cat.id, { isActive: !cat.isActive })} className="p-1.5 text-text-secondary hover:text-deep">
                    {cat.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function BannersTab({ banners, updateBanners }: { banners: Banner[]; updateBanners: (b: Banner[]) => void }) {
  const [editing, setEditing] = useState<Banner | null>(null);

  const handleSave = (banner: Banner) => {
    const exists = banners.find(b => b.id === banner.id);
    if (exists) {
      updateBanners(banners.map(b => b.id === banner.id ? banner : b));
    } else {
      updateBanners([...banners, banner]);
    }
    setEditing(null);
  };

  if (editing) {
    return (
      <div className="bg-white rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Edit Banner</h3>
          <button onClick={() => setEditing(null)} className="p-1 text-text-secondary hover:text-text-primary"><X size={18} /></button>
        </div>
        <div className="space-y-3">
          <input type="text" value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} placeholder="Judul" className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
          <input type="text" value={editing.subtitle} onChange={e => setEditing({ ...editing, subtitle: e.target.value })} placeholder="Subjudul" className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
          <input type="text" value={editing.buttonText} onChange={e => setEditing({ ...editing, buttonText: e.target.value })} placeholder="Teks Tombol" className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
          <input type="text" value={editing.buttonLink} onChange={e => setEditing({ ...editing, buttonLink: e.target.value })} placeholder="Tautan Tombol" className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={editing.isActive} onChange={e => setEditing({ ...editing, isActive: e.target.checked })} className="w-4 h-4" />
            <span className="text-sm">Aktif</span>
          </label>
          <button onClick={() => handleSave(editing)} className="px-4 py-2 bg-deep text-white rounded-lg text-sm font-medium">Simpan</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-text-secondary">{banners.length} banner</p>
        <button onClick={() => setEditing({ id: `banner-${Date.now()}`, title: '', subtitle: '', buttonText: '', buttonLink: '', image: '', isActive: true, sortOrder: banners.length + 1 })} className="flex items-center gap-2 px-4 py-2 bg-deep text-white text-sm rounded-lg">
          <Plus size={16} /> Tambah Banner
        </button>
      </div>
      <div className="space-y-3">
        {banners.map(banner => (
          <div key={banner.id} className="bg-white rounded-xl border border-border p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">{banner.title || '(Tanpa judul)'}</p>
              <p className="text-xs text-text-secondary">{banner.subtitle}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded-full ${banner.isActive ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                {banner.isActive ? 'Aktif' : 'Nonaktif'}
              </span>
              <button onClick={() => setEditing(banner)} className="p-1.5 text-text-secondary hover:text-deep"><Edit size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsTab({ settings, updateSettings }: { settings: any; updateSettings: (s: any) => void }) {
  const [form, setForm] = useState({ ...settings });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-white rounded-xl border border-border p-6">
      <h2 className="font-semibold text-lg text-text-primary mb-6">Pengaturan Website</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nama Toko</label>
          <input type="text" value={form.storeName} onChange={e => setForm({ ...form, storeName: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-deep" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tagline</label>
          <input type="text" value={form.tagline} onChange={e => setForm({ ...form, tagline: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-deep" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Nomor WhatsApp</label>
          <input type="text" value={form.whatsappNumber} onChange={e => setForm({ ...form, whatsappNumber: e.target.value })} placeholder="6281234567890" className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-deep" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Instagram URL</label>
          <input type="text" value={form.instagramUrl} onChange={e => setForm({ ...form, instagramUrl: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-deep" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-deep" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">Teks Announcement Bar</label>
          <input type="text" value={form.announcementText} onChange={e => setForm({ ...form, announcementText: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-deep" />
        </div>
      </div>
      <div className="mt-6 flex items-center gap-3">
        <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 bg-deep text-white rounded-lg text-sm font-medium hover:bg-deep/90">
          <Save size={16} /> Simpan Pengaturan
        </button>
        {saved && <span className="text-sm text-green-600">✓ Pengaturan berhasil disimpan (lokal)</span>}
      </div>
      <p className="mt-4 text-xs text-text-secondary">
        * Perubahan disimpan di penyimpanan lokal browser. Untuk penyimpanan permanen, hubungkan dengan backend/database.
      </p>
    </div>
  );
}
