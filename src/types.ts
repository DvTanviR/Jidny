export interface Product {
  id: string;
  name: string;
  category: 'earrings' | 'rings' | 'necklaces' | 'bracelets' | 'new';
  price: number;
  originalPrice?: number;
  rating: number;
  image: string;
  description: string;
  isBestSeller: boolean;
  isNew: boolean;
  materials: string[];
  spec?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedMaterial?: string;
}

export type ViewMode = 'aurelia' | 'pavoi';

export interface LayoutSettings {
  overlayOpacity: number;
  blurNavbar: boolean;
  animateEntrance: boolean;
  zoomBackground: boolean;
}
