import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'best-1',
    name: 'Mila Eternity Band',
    category: 'rings',
    price: 29.95,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=600&h=600',
    description: 'A sleek, radiant stackable eternity band featuring precision-set brilliant cubic zirconia stones in high-polish 14k gold vermeil.',
    isBestSeller: true,
    isNew: false,
    materials: ['Yellow Gold', 'White Gold', 'Rose Gold'],
    spec: 'YELLOW GOLD AND WHITE GOLD / 4'
  },
  {
    id: 'cz-studs',
    name: 'Cubic Zirconia Flat Back Studs',
    category: 'earrings',
    price: 24.95,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600&h=600',
    description: 'Look gorgeous even when sleeping with our new Must-have Screw Back earrings. These Cubic Zirconia Screw Back Studs are breathtakingly worn solo or as part of an earring stack.',
    isBestSeller: true,
    isNew: true,
    materials: ['Yellow Gold', 'White Gold', 'Rose Gold'],
    spec: 'YELLOW GOLD / 3-PACK (ALL SIZES)'
  },
  {
    id: 'best-2',
    name: 'Teardrop Hoop Earrings',
    category: 'earrings',
    price: 14.95,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=600&h=600',
    description: 'Gracefully polished teardrop-shaped gold hoops. Bold, organic, and designed with a lightweight hollow core for daily comfort.',
    isBestSeller: true,
    isNew: true,
    materials: ['Yellow Gold', 'Sterling Silver', 'Rose Gold'],
    spec: 'YELLOW GOLD / 31 MILLIMETERS'
  },
  {
    id: 'best-3',
    name: 'Marquise Cut Tennis Bracelet',
    category: 'bracelets',
    price: 20.95,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600&h=600',
    description: 'An elegant marquise-cut tennis bracelet that catches the light from every angle. Featuring dazzling premium hand-set crystals.',
    isBestSeller: true,
    isNew: false,
    materials: ['Yellow Gold', 'Sterling Silver'],
    spec: 'YELLOW GOLD / 6.5 INCHES'
  },
  {
    id: 'best-4',
    name: 'Cubic Zirconia Cross Pendant',
    category: 'necklaces',
    price: 13.95,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600&h=600',
    description: 'A delicate high-polish cross pendant necklace embellished with brilliant cubic zirconia, hanging elegantly from a gold chain.',
    isBestSeller: true,
    isNew: true,
    materials: ['Yellow Gold', 'White Gold', 'Rose Gold'],
    spec: 'YELLOW GOLD'
  },
  {
    id: 'pair-1',
    name: 'Tiny Star Flat Back Studs',
    category: 'earrings',
    price: 12.95,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600&h=600',
    description: 'Delicate five-point star stud earrings, featuring a brilliant diamond-cut cubic zirconia stone in a starburst setting with comfortable flat disc backs.',
    isBestSeller: false,
    isNew: true,
    materials: ['Yellow Gold', 'White Gold', 'Rose Gold'],
    spec: 'YELLOW GOLD / 2.5 MILLIMETERS'
  },
  {
    id: 'pair-2',
    name: 'Small Crystal Screw Back Stud',
    category: 'earrings',
    price: 11.95,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600&h=600',
    description: 'A gorgeous petite solitaire crystal screw-back stud earring. Classic, comfortable, and perfect for sleeping in or active days.',
    isBestSeller: false,
    isNew: true,
    materials: ['Yellow Gold', 'White Gold', 'Rose Gold'],
    spec: 'YELLOW GOLD / 3 MILLIMETERS'
  },
  {
    id: 'pair-3',
    name: 'Small Sphere Screw Back Stud',
    category: 'earrings',
    price: 11.95,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600&h=600',
    description: 'High-polish sphere stud earrings with secure and smooth screw-back closure. A minimalist staple piece for any ear stack.',
    isBestSeller: false,
    isNew: false,
    materials: ['Yellow Gold', 'White Gold', 'Rose Gold'],
    spec: 'YELLOW GOLD / 3 MILLIMETERS'
  },
  {
    id: 'pair-4',
    name: 'Tear Screw Back Stud',
    category: 'earrings',
    price: 12.95,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=600&h=600',
    description: 'Elegant pear-cut cubic zirconia stud earrings with signature flat-back disc screw posts. Beautiful and comfortable for all-day wear.',
    isBestSeller: false,
    isNew: true,
    materials: ['Yellow Gold', 'White Gold', 'Rose Gold'],
    spec: 'YELLOW GOLD / 4 MILLIMETERS'
  },
  {
    id: 'e1',
    name: 'Aurelia 14K Gold Ribbed Hoop Earrings',
    category: 'earrings',
    price: 128,
    originalPrice: 165,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600&h=600',
    description: 'Timeless thick ribbed hoop earrings crafted in durable 14k gold vermeil. Elegant, lightweight, and perfect for daily sophistication.',
    isBestSeller: true,
    isNew: false,
    materials: ['14K Yellow Gold', 'Sterling Silver', '14K Rose Gold'],
    spec: '14K YELLOW GOLD'
  },
  {
    id: 'r2',
    name: 'Sculptural Organic Dome Ring',
    category: 'rings',
    price: 78,
    originalPrice: 98,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600&h=600',
    description: 'A bold, chunky dome ring that redefines contemporary luxury. Hollowed inside for an exceptionally comfortable weight.',
    isBestSeller: true,
    isNew: false,
    materials: ['14K Yellow Gold', 'Sterling Silver', '14K Rose Gold'],
    spec: '14K YELLOW GOLD'
  },
  {
    id: 'n2',
    name: 'Lustrous Pearl Choker Necklace',
    category: 'necklaces',
    price: 210,
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600&h=600',
    description: 'Selected AAAA-quality white round freshwater pearls knotted on pure silk thread, secured by an elegant 14K solid gold ball clasp.',
    isBestSeller: true,
    isNew: false,
    materials: ['14K Yellow Gold', 'White Gold'],
    spec: 'AAAA PEARL / 14K GOLD'
  }
];

export const CATEGORIES = [
  { id: 'all', label: 'ALL COLLECTIONS' },
  { id: 'earrings', label: 'EARRINGS' },
  { id: 'rings', label: 'RINGS' },
  { id: 'necklaces', label: 'NECKLACES' },
  { id: 'bracelets', label: 'BRACELETS' }
];

export const CAMPAIGN_DETAILS = {
  aurelia: {
    title: 'A U R E L I A',
    subtitle: 'CONFIDENT. MODERN. UNAPOLOGETIC.',
    tagline: 'AUTUMN / WINTER COLLECTION 2026',
    description: 'A structural exploration of raw form and polished refinement. Featuring bold sculptural silhouettes, luxury fringe tailoring, and modern golden vermeil geometry.',
    buttonText: 'EXPLORE EDITORIAL'
  },
  pavoi: {
    title: 'AFFORDABLE LUXURY, TRUSTED QUALITY.',
    subtitle: 'PAVOI COUTURE',
    tagline: 'THE NEW MODERN ESSENTIALS',
    description: 'Expertly designed, sustainable daily jewelry. Made to be lived in, layered, and loved. Crafted entirely with 100% recycled metals and high-purity lab diamonds.',
    buttonText: 'BEST SELLERS'
  }
};
