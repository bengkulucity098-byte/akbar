import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ChevronDown, MessageCircle, Mail } from 'lucide-react';

function InfoLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <nav className="flex items-center gap-2 text-sm text-text-secondary mb-6">
        <Link to="/" className="hover:text-deep">Beranda</Link>
        <span>/</span>
        <span className="text-text-primary font-medium">{title}</span>
      </nav>
      <h1 className="font-heading text-3xl lg:text-4xl font-bold text-text-primary mb-6">{title}</h1>
      <div className="prose prose-sm max-w-none text-text-secondary">
        {children}
      </div>
    </div>
  );
}

export function About() {
  const { settings } = useApp();
  return (
    <InfoLayout title="Tentang Kami">
      <div className="space-y-4 text-sm leading-relaxed">
        <p>
          <strong className="text-text-primary">{settings.storeName}</strong> adalah toko online yang menyediakan koleksi hijab dan aksesori muslimah berkualitas. Kami hadir untuk menemani cantikmu setiap hari dengan produk-produk yang nyaman, elegan, dan mudah didapat.
        </p>
        <p>
          Kami percaya bahwa setiap perempuan berhak tampil percaya diri dengan gaya yang sesuai dengan kepribadiannya. Oleh karena itu, kami menghadirkan berbagai pilihan hijab dengan warna-warna menarik, bahan yang nyaman, dan harga yang terjangkau.
        </p>
        <p>
          <strong className="text-text-primary">Visi Kami</strong><br />
          Menjadi toko online hijab terpercaya yang memudahkan setiap muslimah menemukan gaya hijab favoritnya.
        </p>
        <p>
          <strong className="text-text-primary">Misi Kami</strong><br />
          Menyediakan koleksi hijab berkualitas dengan informasi produk yang jelas, proses pemesanan yang mudah, dan layanan pelanggan yang responsif.
        </p>
        <div className="mt-8 p-4 bg-soft rounded-lg">
          <p className="text-text-primary font-medium mb-2">Hubungi Kami</p>
          <div className="space-y-1">
            {settings.whatsappNumber && (
              <p><a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="text-deep hover:underline">WhatsApp</a></p>
            )}
            {settings.email && <p><a href={`mailto:${settings.email}`} className="text-deep hover:underline">{settings.email}</a></p>}
            {settings.instagramUrl && <p><a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-deep hover:underline">Instagram</a></p>}
          </div>
        </div>
      </div>
    </InfoLayout>
  );
}

export function HowToOrder() {
  return (
    <InfoLayout title="Cara Pemesanan">
      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { step: '1', title: 'Pilih Produk', desc: 'Jelajahi katalog dan pilih produk yang kamu sukai. Gunakan filter untuk memudahkan pencarian.' },
            { step: '2', title: 'Pilih Variasi', desc: 'Pilih warna dan jumlah yang diinginkan pada halaman detail produk.' },
            { step: '3', title: 'Masukkan Keranjang', desc: 'Klik "Tambah ke Keranjang" untuk menyimpan produk. Kamu bisa melanjutkan belanja atau langsung checkout.' },
            { step: '4', title: 'Checkout', desc: 'Isi data pengiriman dan klik "Pesan via WhatsApp". Pesan akan otomatis terbuat.' },
            { step: '5', title: 'Konfirmasi WhatsApp', desc: 'Kirim pesan di WhatsApp. Admin akan mengonfirmasi ketersediaan dan detail pembayaran.' },
            { step: '6', title: 'Pembayaran & Pengiriman', desc: 'Setelah pembayaran diterima, produk akan dikirim ke alamat yang kamu berikan.' },
          ].map(item => (
            <div key={item.step} className="flex gap-3 p-4 bg-white rounded-xl border border-border">
              <div className="w-8 h-8 rounded-full bg-deep text-white flex items-center justify-center text-sm font-bold shrink-0">
                {item.step}
              </div>
              <div>
                <p className="font-medium text-text-primary text-sm">{item.title}</p>
                <p className="text-xs text-text-secondary mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 bg-soft rounded-lg">
          <p className="text-sm text-text-primary">
            <strong>Catatan:</strong> Pesanan diproses melalui WhatsApp. Pastikan kamu mengirim pesan agar pesanan tercatat.
          </p>
        </div>
      </div>
    </InfoLayout>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  const { settings } = useApp();

  const faqs = [
    { q: 'Bagaimana cara memesan produk?', a: 'Pilih produk, masukkan ke keranjang, isi data pengiriman, lalu klik "Pesan via WhatsApp". Kamu akan diarahkan ke WhatsApp dengan pesan otomatis yang berisi detail pesanan.' },
    { q: 'Bagaimana cara memilih warna?', a: 'Pada halaman detail produk, klik warna yang kamu inginkan sebelum menambahkan ke keranjang. Setiap warna ditampilkan dengan swatch warna yang sesuai.' },
    { q: 'Bagaimana jika stok habis?', a: 'Jika stok habis, produk akan ditandai "Stok Habis" dan tombol pembelian akan dinonaktifkan. Kamu bisa menghubungi kami via WhatsApp untuk menanyakan ketersediaan restock.' },
    { q: 'Apakah bisa mengirim ke seluruh Indonesia?', a: 'Ya, kami melayani pengiriman ke seluruh Indonesia. Biaya pengiriman akan dikonfirmasi melalui WhatsApp setelah pesanan diterima.' },
    { q: 'Metode pembayaran apa yang tersedia?', a: 'Informasi metode pembayaran akan diberikan melalui WhatsApp setelah pesanan dikonfirmasi. Biasanya tersedia transfer bank dan e-wallet.' },
    { q: 'Bagaimana kebijakan penukaran barang?', a: 'Penukaran barang dapat dilakukan jika terdapat kesalahan produk atau cacat produksi. Hubungi kami dalam waktu 2x24 jam setelah barang diterima untuk proses penukaran.' },
    { q: 'Bagaimana cara menghubungi admin?', a: `Kamu bisa menghubungi kami melalui WhatsApp di ${settings.whatsappNumber ? 'nomor yang tertera' : 'halaman kontak'}, email di ${settings.email}, atau melalui Instagram kami.` },
  ];

  return (
    <InfoLayout title="Pertanyaan Umum (FAQ)">
      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <div key={i} className="border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-soft/50 transition-colors"
            >
              <span className="text-sm font-medium text-text-primary pr-4">{faq.q}</span>
              <ChevronDown size={18} className={`shrink-0 text-text-secondary transition-transform ${openIndex === i ? 'rotate-180' : ''}`} />
            </button>
            {openIndex === i && (
              <div className="px-4 pb-4 text-sm text-text-secondary border-t border-border pt-3">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </InfoLayout>
  );
}

export function Shipping() {
  return (
    <InfoLayout title="Kebijakan Pengiriman">
      <div className="space-y-4 text-sm leading-relaxed">
        <p>Kami melayani pengiriman ke seluruh wilayah Indonesia melalui jasa ekspedisi terpercaya.</p>
        <div className="space-y-3">
          <h3 className="font-semibold text-text-primary text-base">Proses Pengiriman</h3>
          <ol className="list-decimal list-inside space-y-2">
            <li>Setelah pembayaran dikonfirmasi, pesanan akan diproses dalam 1-2 hari kerja.</li>
            <li>Nomor resi akan diberikan melalui WhatsApp setelah barang dikirim.</li>
            <li>Kamu dapat melacak pengiriman menggunakan nomor resi yang diberikan.</li>
          </ol>
        </div>
        <div className="space-y-3">
          <h3 className="font-semibold text-text-primary text-base">Biaya Pengiriman</h3>
          <p>Biaya pengiriman dihitung berdasarkan lokasi tujuan dan berat paket. Detail biaya akan dikonfirmasi melalui WhatsApp sebelum pembayaran.</p>
        </div>
        <div className="space-y-3">
          <h3 className="font-semibold text-text-primary text-base">Estimasi Waktu</h3>
          <p>Estimasi waktu pengiriman bergantung pada lokasi dan jasa ekspedisi yang dipilih. Informasi lebih lanjut akan diberikan saat konfirmasi pesanan.</p>
        </div>
      </div>
    </InfoLayout>
  );
}

export function Privacy() {
  return (
    <InfoLayout title="Kebijakan Privasi">
      <div className="space-y-4 text-sm leading-relaxed">
        <p>Kami menghargai privasi kamu. Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi kamu.</p>
        <div className="space-y-3">
          <h3 className="font-semibold text-text-primary text-base">Informasi yang Dikumpulkan</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Nama lengkap</li>
            <li>Nomor WhatsApp / telepon</li>
            <li>Alamat pengiriman</li>
            <li>Alamat email (jika berlangganan newsletter)</li>
          </ul>
        </div>
        <div className="space-y-3">
          <h3 className="font-semibold text-text-primary text-base">Tujuan Penggunaan</h3>
          <p>Informasi yang dikumpulkan digunakan untuk:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Memproses dan mengirimkan pesanan</li>
            <li>Menghubungi pelanggan terkait pesanan</li>
            <li>Mengirim informasi promo (jika pelanggan berlangganan)</li>
          </ul>
        </div>
        <div className="space-y-3">
          <h3 className="font-semibold text-text-primary text-base">Perlindungan Data</h3>
          <p>Kami tidak akan membagikan informasi pribadi kamu kepada pihak ketiga tanpa persetujuan, kecuali untuk keperluan pengiriman pesanan.</p>
        </div>
      </div>
    </InfoLayout>
  );
}

export function Terms() {
  return (
    <InfoLayout title="Syarat dan Ketentuan">
      <div className="space-y-4 text-sm leading-relaxed">
        <p>Dengan menggunakan website Mamaya Hijab, kamu menyetujui syarat dan ketentuan berikut:</p>
        <div className="space-y-3">
          <h3 className="font-semibold text-text-primary text-base">Pemesanan</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Pesanan dianggap valid setelah dikonfirmasi melalui WhatsApp dan pembayaran diterima.</li>
            <li>Kami berhak menolak pesanan jika stok tidak tersedia atau terjadi kesalahan harga.</li>
            <li>Informasi produk ditampilkan sebaik mungkin, namun warna aktual mungkin sedikit berbeda karena pencahayaan dan layar perangkat.</li>
          </ul>
        </div>
        <div className="space-y-3">
          <h3 className="font-semibold text-text-primary text-base">Pembayaran</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Pembayaran dilakukan melalui metode yang dikonfirmasi via WhatsApp.</li>
            <li>Pesanan akan diproses setelah pembayaran diterima dan diverifikasi.</li>
          </ul>
        </div>
        <div className="space-y-3">
          <h3 className="font-semibold text-text-primary text-base">Pengembalian & Penukaran</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Penukaran dapat dilakukan jika terdapat cacat produksi atau kesalahan pengiriman.</li>
            <li>Klaim harus diajukan dalam waktu 2x24 jam setelah barang diterima.</li>
            <li>Barang yang dikembalikan harus dalam kondisi asli dan belum digunakan.</li>
          </ul>
        </div>
        <div className="space-y-3">
          <h3 className="font-semibold text-text-primary text-base">Perubahan</h3>
          <p>Kami berhak mengubah syarat dan ketentuan sewaktu-waktu. Perubahan akan diumumkan melalui website.</p>
        </div>
      </div>
    </InfoLayout>
  );
}

export function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <h1 className="font-heading text-6xl font-bold text-deep mb-4">404</h1>
      <p className="text-xl text-text-primary mb-2">Halaman Tidak Ditemukan</p>
      <p className="text-text-secondary mb-6">Halaman yang kamu cari tidak tersedia atau sudah dipindahkan.</p>
      <Link to="/" className="inline-flex px-6 py-3 bg-deep text-white rounded-lg font-medium hover:bg-deep/90">
        Kembali ke Beranda
      </Link>
    </div>
  );
}
