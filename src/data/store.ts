export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  colors: { name: string; hex: string }[];
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  material?: string;
  size?: string;
  careInstructions?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  isActive: boolean;
  sortOrder: number;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  whatsappNumber: string;
  instagramUrl: string;
  email: string;
  announcementText: string;
  address: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  image: string;
  isActive: boolean;
  sortOrder: number;
}

export const defaultSettings: StoreSettings = {
  storeName: 'Mamaya Hijab',
  tagline: 'Temani Cantikmu, Setiap Hari.',
  whatsappNumber: '6281234567890',
  instagramUrl: 'https://instagram.com/mamayahijab',
  email: 'hello@mamayahijab.my.id',
  announcementText: 'Welcome to Mamaya Hijab | Temukan gaya favoritmu.',
  address: ''
};

export const defaultCategories: Category[] = [
  { id: 'cat-1', name: 'Pashmina', slug: 'pashmina', image: '', isActive: true, sortOrder: 1 },
  { id: 'cat-2', name: 'Segi Empat', slug: 'segi-empat', image: '', isActive: true, sortOrder: 2 },
  { id: 'cat-3', name: 'Hijab Instan', slug: 'hijab-instan', image: '', isActive: true, sortOrder: 3 },
  { id: 'cat-4', name: 'Inner Hijab', slug: 'inner-hijab', image: '', isActive: true, sortOrder: 4 },
  { id: 'cat-5', name: 'Aksesori', slug: 'aksesori', image: '', isActive: true, sortOrder: 5 },
];

export const defaultProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Pashmina Soft Blue',
    slug: 'pashmina-soft-blue',
    description: 'Pashmina dengan bahan voal premium yang lembut dan adem. Cocok untuk penggunaan sehari-hari maupun acara formal. Jatuh dengan indah dan mudah dibentuk.',
    categoryId: 'cat-1',
    price: 89000,
    compareAtPrice: 120000,
    images: ['https://image.qwenlm.ai/generated-images/ca43a474-135a-4189-9cec-d8afa9a2beac/_result.png'],
    colors: [
      { name: 'Soft Blue', hex: '#DCEBFA' },
      { name: 'Dusty Pink', hex: '#D9C4D7' },
      { name: 'Sage', hex: '#B5C9B3' },
    ],
    stock: 25,
    isActive: true,
    isFeatured: true,
    isNewArrival: true,
    material: 'Voal Premium',
    size: '175cm x 75cm',
    careInstructions: 'Cuci dengan air dingin, jangan diperas terlalu kuat, setrika suhu rendah.',
    createdAt: '2024-12-01'
  },
  {
    id: 'prod-2',
    name: 'Pashmina Daily Flow',
    slug: 'pashmina-daily-flow',
    description: 'Pashmina harian dengan bahan crinkle yang tidak perlu disetrika. Praktis dan nyaman untuk aktivitas sehari-hari.',
    categoryId: 'cat-1',
    price: 75000,
    images: [],
    colors: [
      { name: 'Navy', hex: '#2C3E6B' },
      { name: 'Cream', hex: '#F5F0E8' },
      { name: 'Mocca', hex: '#C4A882' },
    ],
    stock: 40,
    isActive: true,
    isFeatured: false,
    isNewArrival: true,
    material: 'Crinkle Flow',
    size: '180cm x 70cm',
    createdAt: '2024-12-05'
  },
  {
    id: 'prod-3',
    name: 'Square Voal Cloud',
    slug: 'square-voal-cloud',
    description: 'Hijab segi empat dari bahan voal yang sangat lembut seperti awan. Ringan, adem, dan tidak mudah kusut.',
    categoryId: 'cat-2',
    price: 65000,
    compareAtPrice: 85000,
    images: [],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Lavender', hex: '#E6DFF5' },
      { name: 'Baby Blue', hex: '#D4E8F7' },
      { name: 'Peach', hex: '#FDDCC7' },
    ],
    stock: 50,
    isActive: true,
    isFeatured: true,
    isNewArrival: false,
    material: 'Voal Ultrafine',
    size: '115cm x 115cm',
    createdAt: '2024-11-20'
  },
  {
    id: 'prod-4',
    name: 'Square Voal Pastel',
    slug: 'square-voal-pastel',
    description: 'Koleksi segi empat warna pastel yang lembut dan elegan. Sempurna untuk menemani berbagai momen spesialmu.',
    categoryId: 'cat-2',
    price: 69000,
    images: ['https://image.qwenlm.ai/generated-images/d2283d9a-5755-4493-bca7-8d82e4d1ce5c/_result.png'],
    colors: [
      { name: 'Pastel Blue', hex: '#DCEBFA' },
      { name: 'Pastel Pink', hex: '#F7E0E8' },
      { name: 'Pastel Green', hex: '#E0F0E5' },
    ],
    stock: 35,
    isActive: true,
    isFeatured: true,
    isNewArrival: true,
    material: 'Voal Premium',
    size: '115cm x 115cm',
    createdAt: '2024-12-10'
  },
  {
    id: 'prod-5',
    name: 'Instant Hijab Easywear',
    slug: 'instant-hijab-easywear',
    description: 'Hijab instan yang praktis tinggal pakai. Dilengkapi inner yang nyaman dan desain yang membuat wajah terlihat lebih tirus.',
    categoryId: 'cat-3',
    price: 95000,
    compareAtPrice: 130000,
    images: [],
    colors: [
      { name: 'Black', hex: '#1A1A1A' },
      { name: 'Maroon', hex: '#6B1C2A' },
      { name: 'Navy', hex: '#1B2A4A' },
    ],
    stock: 20,
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    material: 'Hyget Premium + Jersey Inner',
    size: 'All Size',
    createdAt: '2024-11-15'
  },
  {
    id: 'prod-6',
    name: 'Inner Hijab Comfort',
    slug: 'inner-hijab-comfort',
    description: 'Inner hijab dari bahan jersey yang adem dan tidak licin. Nyaman digunakan seharian tanpa membuat pusing.',
    categoryId: 'cat-4',
    price: 35000,
    images: [],
    colors: [
      { name: 'Black', hex: '#1A1A1A' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Nude', hex: '#E8D5C4' },
      { name: 'Grey', hex: '#9E9E9E' },
    ],
    stock: 100,
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    material: 'Jersey Cotton',
    size: 'All Size',
    createdAt: '2024-10-01'
  },
  {
    id: 'prod-7',
    name: 'Brooch Pearl Elegance',
    slug: 'brooch-pearl-elegance',
    description: 'Brooch mutiara elegan untuk mempercantik tampilan hijabmu. Cocok untuk acara formal maupun semi-formal.',
    categoryId: 'cat-5',
    price: 45000,
    images: ['https://image.qwenlm.ai/generated-images/a9c07068-95f9-4307-866021763b80/_result.png'],
    colors: [
      { name: 'Gold', hex: '#D4AF37' },
      { name: 'Silver', hex: '#C0C0C0' },
    ],
    stock: 30,
    isActive: true,
    isFeatured: true,
    isNewArrival: true,
    material: 'Alloy + Pearl',
    size: '3cm x 3cm',
    createdAt: '2024-12-08'
  },
  {
    id: 'prod-8',
    name: 'Pashmina Plaid Classic',
    slug: 'pashmina-plaid-classic',
    description: 'Pashmina bermotif plaid klasik yang timeless. Bahan voal yang nyaman dengan motif yang tidak pasaran.',
    categoryId: 'cat-1',
    price: 99000,
    images: [],
    colors: [
      { name: 'Blue Plaid', hex: '#7BA3C7' },
      { name: 'Brown Plaid', hex: '#A67B5B' },
    ],
    stock: 15,
    isActive: true,
    isFeatured: false,
    isNewArrival: true,
    material: 'Voal Plaid',
    size: '175cm x 75cm',
    createdAt: '2024-12-12'
  },
  {
    id: 'prod-9',
    name: 'Magnetic Hijab Pin Set',
    slug: 'magnetic-hijab-pin-set',
    description: 'Set pin magnet hijab yang kuat dan tidak merusak kain. Satu set berisi 3 pcs dengan ukuran berbeda.',
    categoryId: 'cat-5',
    price: 55000,
    compareAtPrice: 75000,
    images: [],
    colors: [
      { name: 'Rose Gold', hex: '#B76E79' },
      { name: 'Silver', hex: '#C0C0C0' },
    ],
    stock: 45,
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    material: 'Magnet + Stainless Steel',
    size: 'Set of 3',
    createdAt: '2024-11-25'
  },
  {
    id: 'prod-10',
    name: 'Square Ceruty Premium',
    slug: 'square-ceruty-premium',
    description: 'Hijab segi empat dari bahan ceruty premium yang sangat lembut dan ringan. Tepi sudah dijahit rapi.',
    categoryId: 'cat-2',
    price: 79000,
    images: [],
    colors: [
      { name: 'Caramel', hex: '#C4883E' },
      { name: 'Lilac', hex: '#C8A2C8' },
      { name: 'Seafoam', hex: '#9FE2BF' },
      { name: 'Charcoal', hex: '#36454F' },
    ],
    stock: 0,
    isActive: true,
    isFeatured: true,
    isNewArrival: false,
    material: 'Ceruty Premium',
    size: '115cm x 115cm',
    createdAt: '2024-10-20'
  },
  {
    id: 'prod-11',
    name: 'Inner Hijab Rajut',
    slug: 'inner-hijab-rajut',
    description: 'Inner hijab rajut yang adem dan menyerap keringat. Cocok untuk aktivitas outdoor atau olahraga.',
    categoryId: 'cat-4',
    price: 39000,
    images: [],
    colors: [
      { name: 'Black', hex: '#1A1A1A' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Sage', hex: '#B5C9B3' },
    ],
    stock: 60,
    isActive: true,
    isFeatured: false,
    isNewArrival: true,
    material: 'Cotton Knit',
    size: 'All Size',
    createdAt: '2024-12-15'
  },
  {
    id: 'prod-12',
    name: 'Instant Hijab Sport',
    slug: 'instant-hijab-sport',
    description: 'Hijab instan khusus untuk olahraga. Bahan sport yang adem, ringan, dan tidak mudah lepas saat bergerak.',
    categoryId: 'cat-3',
    price: 85000,
    images: [],
    colors: [
      { name: 'Black', hex: '#1A1A1A' },
      { name: 'Navy', hex: '#1B2A4A' },
      { name: 'Grey', hex: '#808080' },
    ],
    stock: 18,
    isActive: true,
    isFeatured: false,
    isNewArrival: true,
    material: 'Sport Fabric + Mesh',
    size: 'All Size',
    createdAt: '2024-12-18'
  },
];

export const defaultBanners: Banner[] = [
  {
    id: 'banner-1',
    title: 'Elegance in Every Fold',
    subtitle: 'Temukan hijab yang menemani setiap langkahmu dengan nyaman dan penuh percaya diri.',
    buttonText: 'Belanja Sekarang',
    buttonLink: '/products',
    image: '',
    isActive: true,
    sortOrder: 1
  },
  {
    id: 'banner-2',
    title: 'Soft Colors, Timeless Beauty',
    subtitle: 'Koleksi warna lembut untuk menemani berbagai momen spesialmu.',
    buttonText: 'Jelajahi Koleksi',
    buttonLink: '/products?category=segi-empat',
    image: '',
    isActive: true,
    sortOrder: 2
  }
];
