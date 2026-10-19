import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatPrice, ProductImage } from '../components/ProductCard';
import { ArrowLeft, MessageCircle, CheckCircle } from 'lucide-react';

type RegionOption = { id: string; name: string };
type VillageOption = RegionOption & { postal_code?: string };

const REGION_API = 'https://www.emsifa.com/api-wilayah-indonesia/v2';

async function fetchRegionData<T>(path: string): Promise<T> {
  const response = await fetch(`${REGION_API}/${path}.json`);
  if (!response.ok) throw new Error('Data wilayah tidak dapat dimuat.');
  const result = await response.json();
  if (!result || !Array.isArray(result.data)) throw new Error('Format data wilayah tidak valid.');
  return result.data as T;
}

export default function Checkout() {
  const { cart, cartTotal, clearCart, settings } = useApp();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    village: '',
    address: '',
    postalCode: '',
    notes: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [provinces, setProvinces] = useState<RegionOption[]>([]);
  const [regencies, setRegencies] = useState<RegionOption[]>([]);
  const [districts, setDistricts] = useState<RegionOption[]>([]);
  const [villages, setVillages] = useState<VillageOption[]>([]);
  const [provinceId, setProvinceId] = useState('');
  const [regencyId, setRegencyId] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [regionsLoading, setRegionsLoading] = useState({ provinces: true, regencies: false, districts: false, villages: false });
  const [regionsError, setRegionsError] = useState('');
  const [shippingOptions, setShippingOptions] = useState<Array<{courier:string;service:string;code:string;price:number;duration:string}>>([]);
  const [selectedShipping, setSelectedShipping] = useState('');
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingError, setShippingError] = useState('');
  const totalWeight = cart.reduce((sum, item) => sum + item.quantity * 200, 0);

  useEffect(() => {
    let active = true;
    fetchRegionData<RegionOption[]>('provinces')
      .then(data => { if (active) { setProvinces(data); setRegionsError(''); } })
      .catch(() => { if (active) setRegionsError('Daftar wilayah gagal dimuat. Muat ulang halaman untuk mencoba lagi.'); })
      .finally(() => { if (active) setRegionsLoading(prev => ({ ...prev, provinces: false })); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!provinceId) { setRegencies([]); return; }
    let active = true;
    setRegionsLoading(prev => ({ ...prev, regencies: true }));
    fetchRegionData<RegionOption[]>(`regencies/${provinceId}`)
      .then(data => { if (active) { setRegencies(data); setRegionsError(''); } })
      .catch(() => { if (active) setRegionsError('Daftar kota/kabupaten gagal dimuat. Coba muat ulang halaman.'); })
      .finally(() => { if (active) setRegionsLoading(prev => ({ ...prev, regencies: false })); });
    return () => { active = false; };
  }, [provinceId]);

  useEffect(() => {
    if (!regencyId) { setDistricts([]); return; }
    let active = true;
    setRegionsLoading(prev => ({ ...prev, districts: true }));
    fetchRegionData<RegionOption[]>(`districts/${regencyId}`)
      .then(data => { if (active) { setDistricts(data); setRegionsError(''); } })
      .catch(() => { if (active) setRegionsError('Daftar kecamatan gagal dimuat. Coba muat ulang halaman.'); })
      .finally(() => { if (active) setRegionsLoading(prev => ({ ...prev, districts: false })); });
    return () => { active = false; };
  }, [regencyId]);

  useEffect(() => {
    if (!districtId) { setVillages([]); return; }
    let active = true;
    setRegionsLoading(prev => ({ ...prev, villages: true }));
    fetchRegionData<VillageOption[]>(`villages/${districtId}`)
      .then(data => { if (active) { setVillages(data); setRegionsError(''); } })
      .catch(() => { if (active) setRegionsError('Daftar kelurahan/desa gagal dimuat. Kode pos bisa diisi manual.'); })
      .finally(() => { if (active) setRegionsLoading(prev => ({ ...prev, villages: false })); });
    return () => { active = false; };
  }, [districtId]);
  const chosenShipping = shippingOptions.find(option => (option.courier + '|' + option.code + '|' + option.price) === selectedShipping);
  const grandTotal = cartTotal + (chosenShipping?.price || 0);
  useEffect(() => {
    const postalCode = formData.postalCode.trim();
    if (!/^\d{5}$/.test(postalCode) || cart.length === 0) { setShippingOptions([]); setSelectedShipping(''); setShippingError(''); return; }
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setShippingLoading(true); setShippingError('');
      try {
        const response = await fetch('/api/shipping', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ destinationPostalCode: postalCode, items: cart.map(item => ({ name: item.product.name, price: item.product.price, quantity: item.quantity })) }), signal: controller.signal });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Gagal menghitung ongkir.');
        setShippingOptions(data.options || []); setSelectedShipping('');
        if (!data.options?.length) setShippingError('Tidak ada layanan reguler/hemat untuk kode pos ini.');
      } catch (error) { if (!controller.signal.aborted) { setShippingOptions([]); setSelectedShipping(''); setShippingError(error instanceof Error ? error.message : 'Gagal menghitung ongkir.'); } }
      finally { if (!controller.signal.aborted) setShippingLoading(false); }
    }, 500);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [formData.postalCode, cart]);

  if (cart.length === 0 && !submitted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="font-heading text-3xl font-bold text-text-primary mb-3">Keranjang Kosong</h1>
        <p className="text-text-secondary mb-6">Tambahkan produk ke keranjang sebelum checkout.</p>
        <Link to="/products" className="inline-flex px-6 py-3 bg-deep text-white rounded-lg font-medium">
          Belanja Sekarang
        </Link>
      </div>
    );
  }

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Nama wajib diisi';
    if (!formData.phone.trim()) newErrors.phone = 'Nomor WhatsApp wajib diisi';
    else if (!/^[0-9+\-\s()]{8,15}$/.test(formData.phone.trim())) newErrors.phone = 'Nomor tidak valid';
    if (!formData.province.trim()) newErrors.province = 'Provinsi wajib dipilih';
    if (!formData.city.trim()) newErrors.city = 'Kota/kabupaten wajib dipilih';
    if (!formData.district.trim()) newErrors.district = 'Kecamatan wajib dipilih';
    if (!formData.village.trim()) newErrors.village = 'Kelurahan/desa wajib dipilih';
    if (!formData.address.trim()) newErrors.address = 'Alamat wajib diisi';
    if (!/^\d{5}$/.test(formData.postalCode.trim())) newErrors.postalCode = 'Masukkan kode pos 5 digit';
    if (!chosenShipping) newErrors.shipping = 'Pilih layanan pengiriman yang tersedia';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Build WhatsApp message
    const fullAddress = `${formData.address}, ${formData.village}, ${formData.district}, ${formData.city}, ${formData.province}${formData.postalCode ? ' ' + formData.postalCode : ''}`;

    let message = `Halo ${settings.storeName}, saya ingin melakukan pemesanan.\n\n`;
    message += `*Data Pemesan:*\n`;
    message += `Nama: ${formData.name}\n`;
    message += `Nomor WhatsApp: ${formData.phone}\n`;
    message += `Alamat: ${fullAddress}\n\n`;
    message += `*Detail Pesanan:*\n`;

    cart.forEach((item, i) => {
      message += `${i + 1}. ${item.product.name}\n`;
      message += `   Warna: ${item.selectedColor || '-'}\n`;
      message += `   Jumlah: ${item.quantity}\n`;
      message += `   Harga: ${formatPrice(item.product.price)} x ${item.quantity} = ${formatPrice(item.product.price * item.quantity)}\n\n`;
    });

    message += `*Ringkasan:*\n`;
    message += `Subtotal: ${formatPrice(cartTotal)}\n`;
    message += `Berat estimasi: ${(totalWeight / 1000).toLocaleString('id-ID')} kg\n`;
    message += `Kurir: ${chosenShipping?.courier} - ${chosenShipping?.service}\n`;
    if (chosenShipping?.duration) message += `Estimasi pengiriman: ${chosenShipping.duration}\n`;
    message += `Ongkir: ${formatPrice(chosenShipping?.price || 0)}\n`;
    message += `Total: ${formatPrice(grandTotal)}\n`;

    if (formData.notes.trim()) {
      message += `\n*Catatan:* ${formData.notes}\n`;
    }

    message += `\nMohon konfirmasi ketersediaan produk dan detail pembayaran. Terima kasih.`;

    const url = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-50 flex items-center justify-center">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h1 className="font-heading text-3xl font-bold text-text-primary mb-3">Pesanan Dikirim!</h1>
        <p className="text-text-secondary mb-2">Pesan WhatsApp telah dibuka di tab baru.</p>
        <p className="text-text-secondary text-sm mb-6">
          Pastikan kamu menekan tombol <strong>kirim</strong> di WhatsApp untuk menyelesaikan pemesanan.
          Pesanan akan diproses setelah admin mengonfirmasi ketersediaan produk dan detail pembayaran.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => { clearCart(); navigate('/'); }}
            className="w-full py-3 bg-deep text-white rounded-lg font-medium hover:bg-deep/90"
          >
            Kembali ke Beranda
          </button>
          <Link to="/products" className="block w-full py-3 border border-border rounded-lg text-sm font-medium text-text-primary hover:bg-soft">
            Lanjut Belanja
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      <Link to="/cart" className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-deep mb-6">
        <ArrowLeft size={16} /> Kembali ke Keranjang
      </Link>

      <h1 className="font-heading text-3xl lg:text-4xl font-bold text-text-primary mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-border p-6">
              <h2 className="font-semibold text-text-primary text-lg mb-4">Data Pemesan</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Nama Lengkap *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg border ${errors.name ? 'border-red-300' : 'border-border'} focus:outline-none focus:border-deep text-sm`}
                    placeholder="Masukkan nama lengkap"
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Nomor WhatsApp *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg border ${errors.phone ? 'border-red-300' : 'border-border'} focus:outline-none focus:border-deep text-sm`}
                    placeholder="08xxxxxxxxxx"
                  />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Provinsi *</label>
                  <select
                    value={provinceId}
                    disabled={regionsLoading.provinces}
                    onChange={e => {
                      const option = provinces.find(item => item.id === e.target.value);
                      setProvinceId(e.target.value);
                      setRegencyId(''); setDistrictId('');
                      setFormData(prev => ({ ...prev, province: option?.name || '', city: '', district: '', village: '', postalCode: '' }));
                      setRegencies([]); setDistricts([]); setVillages([]);
                      setErrors(prev => ({ ...prev, province: '', city: '', district: '', village: '', postalCode: '' }));
                    }}
                    className={`w-full px-4 py-2.5 rounded-lg border ${errors.province ? 'border-red-300' : 'border-border'} focus:outline-none focus:border-deep text-sm bg-white`}
                  >
                    <option value="">{regionsLoading.provinces ? 'Memuat provinsi...' : 'Pilih provinsi'}</option>
                    {provinces.map(option => <option key={option.id} value={option.id}>{option.name}</option>)}
                  </select>
                  {errors.province && <p className="text-xs text-red-500 mt-1">{errors.province}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Kota / Kabupaten *</label>
                  <select
                    value={regencyId}
                    disabled={!provinceId || regionsLoading.regencies}
                    onChange={e => {
                      const option = regencies.find(item => item.id === e.target.value);
                      setRegencyId(e.target.value); setDistrictId('');
                      setFormData(prev => ({ ...prev, city: option?.name || '', district: '', village: '', postalCode: '' }));
                      setDistricts([]); setVillages([]);
                      setErrors(prev => ({ ...prev, city: '', district: '', village: '', postalCode: '' }));
                    }}
                    className={`w-full px-4 py-2.5 rounded-lg border ${errors.city ? 'border-red-300' : 'border-border'} focus:outline-none focus:border-deep text-sm bg-white`}
                  >
                    <option value="">{!provinceId ? 'Pilih provinsi dulu' : regionsLoading.regencies ? 'Memuat kota/kabupaten...' : 'Pilih kota/kabupaten'}</option>
                    {regencies.map(option => <option key={option.id} value={option.id}>{option.name}</option>)}
                  </select>
                  {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Kecamatan *</label>
                  <select
                    value={districtId}
                    disabled={!regencyId || regionsLoading.districts}
                    onChange={e => {
                      const option = districts.find(item => item.id === e.target.value);
                      setDistrictId(e.target.value);
                      setFormData(prev => ({ ...prev, district: option?.name || '', village: '', postalCode: '' }));
                      setVillages([]);
                      setErrors(prev => ({ ...prev, district: '', village: '', postalCode: '' }));
                    }}
                    className={`w-full px-4 py-2.5 rounded-lg border ${errors.district ? 'border-red-300' : 'border-border'} focus:outline-none focus:border-deep text-sm bg-white`}
                  >
                    <option value="">{!regencyId ? 'Pilih kota/kabupaten dulu' : regionsLoading.districts ? 'Memuat kecamatan...' : 'Pilih kecamatan'}</option>
                    {districts.map(option => <option key={option.id} value={option.id}>{option.name}</option>)}
                  </select>
                  {errors.district && <p className="text-xs text-red-500 mt-1">{errors.district}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Kelurahan / Desa *</label>
                  <select
                    value={formData.village}
                    disabled={!districtId || regionsLoading.villages}
                    onChange={e => {
                      const option = villages.find(item => item.id === e.target.value);
                      setFormData(prev => ({ ...prev, village: option?.name || '', postalCode: option?.postal_code || '' }));
                      setErrors(prev => ({ ...prev, village: '', postalCode: '' }));
                    }}
                    className={`w-full px-4 py-2.5 rounded-lg border ${errors.village ? 'border-red-300' : 'border-border'} focus:outline-none focus:border-deep text-sm bg-white`}
                  >
                    <option value="">{!districtId ? 'Pilih kecamatan dulu' : regionsLoading.villages ? 'Memuat kelurahan/desa...' : 'Pilih kelurahan/desa'}</option>
                    {villages.map(option => <option key={option.id} value={option.name}>{option.name}{option.postal_code ? ` • ${option.postal_code}` : ''}</option>)}
                  </select>
                  {errors.village && <p className="text-xs text-red-500 mt-1">{errors.village}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Kode Pos *</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    maxLength={5}
                    inputMode="numeric"
                    className={`w-full px-4 py-2.5 rounded-lg border ${errors.postalCode ? 'border-red-300' : 'border-border'} focus:outline-none focus:border-deep text-sm`}
                    placeholder="Terisi otomatis dari kelurahan/desa"
                  />
                  {errors.postalCode && <p className="text-xs text-red-500 mt-1">{errors.postalCode}</p>}
                </div>
                {regionsError && <div className="sm:col-span-2"><p className="text-xs text-red-500">{regionsError}</p></div>}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Jasa Pengiriman *</label>
                  {shippingLoading ? <p className="text-sm text-text-secondary py-3">Menghitung ongkir...</p> : shippingOptions.length > 0 ? (
                    <select value={selectedShipping} onChange={e => { setSelectedShipping(e.target.value); setErrors(prev => ({...prev, shipping: ""})); }} className="w-full px-4 py-3 rounded-lg border border-border text-sm">
                      <option value="">Pilih kurir dan layanan</option>
                      {shippingOptions.map(option => { const value = option.courier + "|" + option.code + "|" + option.price; return <option key={value} value={value}>{option.courier} {option.service} - {formatPrice(option.price)}{option.duration ? " (" + option.duration + ")" : ""}</option>; })}
                    </select>
                  ) : <p className="text-sm text-text-secondary py-2">{shippingError || "Masukkan kode pos untuk cek ongkir."}</p>}
                  {shippingError && <p className="text-xs text-red-500 mt-1">{shippingError}</p>}
                  {errors.shipping && <p className="text-xs text-red-500 mt-1">{errors.shipping}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Alamat Lengkap *</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full px-4 py-2.5 rounded-lg border ${errors.address ? 'border-red-300' : 'border-border'} focus:outline-none focus:border-deep text-sm resize-none`}
                    placeholder="Nama jalan, nomor rumah, patokan, dll."
                  />
                  {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Catatan Pesanan</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-lg border border-border focus:outline-none focus:border-deep text-sm resize-none"
                    placeholder="Permintaan khusus (opsional)"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white rounded-xl border border-border p-6">
              <h2 className="font-semibold text-text-primary text-lg mb-4">Ringkasan Pesanan</h2>

              {/* Items */}
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {cart.map(item => (
                  <div key={`${item.product.id}-${item.selectedColor}`} className="flex gap-3">
                    <div className="w-12 h-14 rounded-lg overflow-hidden shrink-0 bg-alt-bg">
                      <ProductImage product={item.product} className="w-full h-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-text-primary line-clamp-1">{item.product.name}</p>
                      <p className="text-[10px] text-text-secondary">{item.selectedColor} x{item.quantity}</p>
                      <p className="text-xs font-medium">{formatPrice(item.product.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <hr className="border-border my-4" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Subtotal</span>
                  <span className="font-medium">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between gap-3"><span className="text-text-secondary">Berat estimasi</span><span className="text-xs text-text-secondary">{(totalWeight / 1000).toLocaleString("id-ID")} kg</span></div>
                <div className="flex justify-between gap-3"><span className="text-text-secondary">Ongkir</span><span className="text-xs text-right">{chosenShipping ? formatPrice(chosenShipping.price) : "Pilih jasa kirim"}</span></div>
                <hr className="border-border" />
                <div className="flex justify-between text-base pt-1"><span className="font-semibold">Total</span><span className="font-bold">{formatPrice(grandTotal)}</span></div>
              </div>

              <button
                type="submit"
                className="mt-6 w-full flex items-center justify-center gap-2 py-3.5 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20"
              >
                <MessageCircle size={18} />
                Pesan via WhatsApp
              </button>

              <p className="mt-3 text-[10px] text-text-secondary text-center leading-relaxed">
                Kamu akan diarahkan ke WhatsApp. Pastikan tekan tombol kirim untuk menyelesaikan pemesanan.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
