const COURIERS = 'jne,sicepat,anteraja,jnt,tiki,pos';
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Metode tidak didukung' });
  const key = process.env.BITESHIP_API_KEY;
  const origin = process.env.SHIPPING_ORIGIN_POSTAL_CODE;
  if (!key || !/^\d{5}$/.test(origin || '')) return res.status(503).json({ error: 'Layanan ongkir belum dikonfigurasi admin.' });
  const { destinationPostalCode, items } = req.body || {};
  if (!/^\d{5}$/.test(String(destinationPostalCode || '')) || !Array.isArray(items) || items.length === 0 || items.length > 100) return res.status(400).json({ error: 'Kode pos atau keranjang tidak valid.' });
  if (items.some(x => !Number.isInteger(x.quantity) || x.quantity < 1 || x.quantity > 100 || !Number.isFinite(x.price) || x.price < 0 || x.price > 100000000 || typeof x.name !== 'string')) return res.status(400).json({ error: 'Detail produk tidak valid.' });
  const weight = items.reduce((sum,x) => sum + x.quantity * 200, 0);
  if (weight > 30000) return res.status(400).json({ error: 'Berat pesanan melebihi batas cek ongkir.' });
  try {
    const response = await fetch('https://api.biteship.com/v1/rates/couriers', {
      method: 'POST',
      headers: { authorization: key, 'content-type': 'application/json' },
      body: JSON.stringify({
        origin_postal_code: Number(origin),
        destination_postal_code: Number(destinationPostalCode),
        couriers: COURIERS,
        items: items.map(x => ({ name: x.name.slice(0,100), description: 'Produk Mamaya Hijab', value: Math.round(x.price), weight: 200, quantity: x.quantity }))
      }),
      signal: AbortSignal.timeout(12000)
    });
    const data = await response.json();
    if (!response.ok || data.success === false) {
      // Keep provider details server-side for diagnosis without exposing API credentials.
      console.error('Biteship rates API error', response.status, JSON.stringify(data).slice(0, 1200));
      return res.status(502).json({ error: 'Biteship menolak permintaan tarif. Periksa API key, format kode pos, dan dukungan layanan pada Vercel Logs.' });
    }
    const options = (Array.isArray(data.pricing) ? data.pricing : [])
      .filter(x => Number.isFinite(x.price) && x.price >= 0 && (/(reg|regular|reguler|standard|standar|economy|eco|hemat|ekonom)/i.test([x.courier_service_name,x.courier_service_code,x.service_type,x.description].join(' '))))
      .map(x => ({ courier: String(x.courier_name || x.company || ''), service: String(x.courier_service_name || x.courier_service_code || ''), code: String(x.courier_service_code || ''), price: x.price, duration: String(x.duration || '') }))
      .sort((a,b) => a.price - b.price);
    return res.status(200).json({ options, weight });
  } catch {
    return res.status(502).json({ error: 'Gagal menghubungi layanan ongkir. Coba lagi.' });
  }
}
