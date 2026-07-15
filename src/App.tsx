import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Heart,
  User,
  ShoppingBag,
  X,
  Menu,
  Sliders,
  Check,
  Trash2,
  Plus,
  Minus,
  ArrowUpRight,
  Sparkles,
  Gift,
  ChevronRight,
  Play,
  Pause
} from 'lucide-react';
import { PRODUCTS, CATEGORIES, CAMPAIGN_DETAILS } from './data';
import { Product, CartItem, ViewMode, LayoutSettings } from './types';
import heroBg from './assets/images/hero.png';

export default function App() {
  // Brand / Layout Style Mode
  const [viewMode, setViewMode] = useState<ViewMode>('aurelia');

  // Interactive Panel States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Active collection category filter (when browsing collection overlay)
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showCategoryOverlay, setShowCategoryOverlay] = useState(false);

  // Dedicated Shop Page State
  const [currentView, setCurrentView] = useState<'home' | 'shop'>('home');
  const [shopColorFilter, setShopColorFilter] = useState<string>('all');
  const [shopPriceFilter, setShopPriceFilter] = useState<string>('all');
  const [shopRatingFilter, setShopRatingFilter] = useState<string>('all');
  const [shopSortOption, setShopSortOption] = useState<string>('alpha-asc');
  const [activeDropdown, setActiveDropdown] = useState<'color' | 'price' | 'type' | 'rating' | 'sort' | null>(null);

  // State for search query and suggestions
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([
    'Ribbed Hoop Earrings',
    'Diamond Eternity Band',
    'Paperclip Link Chain',
    'Sculptural Cuff Bracelet',
    'Gold Dome Ring'
  ]);

  // E-commerce state
  const [cart, setCart] = useState<CartItem[]>([
    {
      product: PRODUCTS[0], // Pre-populate with one item for high-fidelity feel
      quantity: 1,
      selectedMaterial: '14K Yellow Gold'
    }
  ]);
  const [wishlist, setWishlist] = useState<Product[]>([PRODUCTS[1], PRODUCTS[5]]);

  // Customizer Settings
  const [settings, setSettings] = useState<LayoutSettings>({
    overlayOpacity: 20, // 20% dark overlay by default for readability
    blurNavbar: true,
    animateEntrance: true,
    zoomBackground: true
  });

  // Selected material for the Quick Look details view
  const [detailSelectedMaterial, setDetailSelectedMaterial] = useState<string>('');
  const [activeDetailThumbnail, setActiveDetailThumbnail] = useState<number>(0);
  const [selectedStoneSize, setSelectedStoneSize] = useState<string>('3-PACK (ALL SIZES)');

  // Quick Add Modal States
  const [quickAddProduct, setQuickAddProduct] = useState<Product | null>(null);
  const [quickAddSelectedMaterial, setQuickAddSelectedMaterial] = useState<string>('');
  const [quickAddSelectedSize, setQuickAddSelectedSize] = useState<string>('');

  // Campaign Video Ref & States
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);

  // Navbar transparent/white toggle on scroll
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > window.innerHeight - 80) {
          setHasScrolled(true);
        } else {
          setHasScrolled(false);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-play / pause video when in/out of viewport
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (isVideoPlaying) {
            videoElement.play().catch((err) => {
              console.log("Autoplay blocked or waiting for interaction:", err);
            });
          }
        } else {
          videoElement.pause();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(videoElement);

    return () => {
      observer.unobserve(videoElement);
    };
  }, [isVideoPlaying]);

  const toggleVideoPlayback = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (isVideoPlaying) {
      videoElement.pause();
      setIsVideoPlaying(false);
    } else {
      videoElement.play().catch((err) => {
        console.log("Play failed:", err);
      });
      setIsVideoPlaying(true);
    }
  };

  // 1. Initial SEO Routing Parser on Mount & Back/Forward Navigation
  useEffect(() => {
    const handleInitialAndPopState = () => {
      const path = window.location.pathname;
      const productMatch = path.match(/\/product\/([^/]+)/);
      if (productMatch && productMatch[1]) {
        const prodId = productMatch[1];
        const foundProduct = PRODUCTS.find((p) => p.id === prodId);
        if (foundProduct) {
          setSelectedProduct(foundProduct);
        }
      } else {
        const params = new URLSearchParams(window.location.search);
        const queryProdId = params.get('product');
        if (queryProdId) {
          const foundProduct = PRODUCTS.find((p) => p.id === queryProdId);
          if (foundProduct) {
            setSelectedProduct(foundProduct);
          }
        }
      }
    };

    handleInitialAndPopState();
    window.addEventListener('popstate', handleInitialAndPopState);
    return () => window.removeEventListener('popstate', handleInitialAndPopState);
  }, []);

  // 2. Sync Selected Product to State, push SEO Friendly URLs and update Document Title/Meta
  useEffect(() => {
    if (selectedProduct) {
      setDetailSelectedMaterial(selectedProduct.materials[0]);
      setActiveDetailThumbnail(0);
      setSelectedStoneSize('3-PACK (ALL SIZES)');

      // Scroll to top of page immediately
      window.scrollTo(0, 0);

      // Push browser history state so URL is SEO friendly
      const targetPath = `/product/${selectedProduct.id}`;
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ productId: selectedProduct.id }, '', targetPath);
      }

      // Update document meta & title for SEO optimization
      document.title = `${selectedProduct.name} | ${viewMode === 'aurelia' ? 'Jidny' : 'Jidny Couture'} Jewelry`;
      
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', selectedProduct.description || `${selectedProduct.name} - Exquisite fine jewelry stackable pieces.`);
    } else {
      // Restore URL to home safely
      if (window.location.pathname !== '/' && !window.location.pathname.endsWith('/index.html')) {
        window.history.pushState({}, '', '/');
      }
      document.title = `${viewMode === 'aurelia' ? 'JIDNY' : 'JIDNY COUTURE'} | Fine Jewelry & Accessories`;
    }
  }, [selectedProduct, viewMode]);

  // Auto-init quick add options when a product is clicked for Quick Add
  useEffect(() => {
    if (quickAddProduct) {
      setQuickAddSelectedMaterial(quickAddProduct.materials[0] || 'Yellow Gold');
      
      let defaultSize = '';
      if (quickAddProduct.category === 'rings') {
        defaultSize = 'US 7';
      } else if (quickAddProduct.category === 'earrings') {
        defaultSize = '31 MILLIMETERS';
      } else if (quickAddProduct.category === 'bracelets') {
        defaultSize = '6.5 INCHES';
      } else if (quickAddProduct.category === 'necklaces') {
        defaultSize = '18 INCHES';
      } else {
        defaultSize = 'Standard';
      }
      setQuickAddSelectedSize(defaultSize);
    }
  }, [quickAddProduct]);

  // Derived sizes for Quick Add modal
  const quickAddSizes = useMemo(() => {
    if (!quickAddProduct) return [];
    if (quickAddProduct.category === 'rings') {
      return ['US 6', 'US 7', 'US 8'];
    } else if (quickAddProduct.category === 'earrings') {
      return ['31 MILLIMETERS', '22 MILLIMETERS'];
    } else if (quickAddProduct.category === 'bracelets') {
      return ['6.5 INCHES', '7.0 INCHES'];
    } else if (quickAddProduct.category === 'necklaces') {
      return ['16 INCHES', '18 INCHES'];
    }
    return ['STANDARD'];
  }, [quickAddProduct]);

  // Best sellers carousel inside Quick Add modal
  const bestSellersList = useMemo(() => PRODUCTS.slice(0, 4), []);
  const quickAddCurrentIdx = useMemo(() => {
    if (!quickAddProduct) return -1;
    return bestSellersList.findIndex((p) => p.id === quickAddProduct.id);
  }, [quickAddProduct, bestSellersList]);

  const handleQuickAddPrev = () => {
    if (quickAddCurrentIdx !== -1) {
      const prevIdx = (quickAddCurrentIdx - 1 + bestSellersList.length) % bestSellersList.length;
      setQuickAddProduct(bestSellersList[prevIdx]);
    }
  };

  const handleQuickAddNext = () => {
    if (quickAddCurrentIdx !== -1) {
      const nextIdx = (quickAddCurrentIdx + 1) % bestSellersList.length;
      setQuickAddProduct(bestSellersList[nextIdx]);
    }
  };

  // Dynamic products filtered by collection, color, price, rating, and sorted
  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // Category filter
    if (activeCategory !== 'all') {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Color/Material filter
    if (shopColorFilter !== 'all') {
      result = result.filter((p) => {
        const mats = p.materials.map((m) => m.toLowerCase());
        if (shopColorFilter === 'gold') {
          return mats.some((m) => m.includes('yellow gold') || m.includes('gold'));
        }
        if (shopColorFilter === 'silver') {
          return mats.some((m) => m.includes('silver') || m.includes('sterling') || m.includes('white gold'));
        }
        if (shopColorFilter === 'rose') {
          return mats.some((m) => m.includes('rose gold'));
        }
        return true;
      });
    }

    // Price filter
    if (shopPriceFilter !== 'all') {
      if (shopPriceFilter === 'under-15') {
        result = result.filter((p) => p.price < 15);
      } else if (shopPriceFilter === '15-25') {
        result = result.filter((p) => p.price >= 15 && p.price <= 25);
      } else if (shopPriceFilter === 'over-25') {
        result = result.filter((p) => p.price > 25);
      }
    }

    // Rating filter
    if (shopRatingFilter !== 'all') {
      const minRating = parseFloat(shopRatingFilter);
      result = result.filter((p) => p.rating >= minRating);
    }

    // Sorting
    if (shopSortOption === 'alpha-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (shopSortOption === 'alpha-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (shopSortOption === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (shopSortOption === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (shopSortOption === 'rating-desc') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [activeCategory, shopColorFilter, shopPriceFilter, shopRatingFilter, shopSortOption]);

  // Search filter
  const searchedProducts = useMemo(() => {
    if (!searchQuery) return [];
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Cart totals
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // E-commerce Actions
  const addToCart = (product: Product, material: string) => {
    const existing = cart.find(
      (item) => item.product.id === product.id && item.selectedMaterial === material
    );
    if (existing) {
      setCart(
        cart.map((item) =>
          item.product.id === product.id && item.selectedMaterial === material
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { product, quantity: 1, selectedMaterial: material }]);
    }
    // Simple visual notification/success
    setIsCartOpen(true);
  };

  const updateCartQuantity = (productId: string, material: string, change: number) => {
    setCart(
      cart
        .map((item) => {
          if (item.product.id === productId && item.selectedMaterial === material) {
            const nextQty = item.quantity + change;
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: string, material: string) => {
    setCart(
      cart.filter((item) => !(item.product.id === productId && item.selectedMaterial === material))
    );
  };

  const toggleWishlist = (product: Product) => {
    if (wishlist.some((p) => p.id === product.id)) {
      setWishlist(wishlist.filter((p) => p.id !== product.id));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  const openShopCategory = (category: string) => {
    setActiveCategory(category);
    setCurrentView('shop');
    setSelectedProduct(null);
    setShowCategoryOverlay(false);
  };

  return (
    <div className={`relative min-h-screen overflow-x-hidden font-sans selection:bg-[#d4a373]/30 transition-colors duration-500 ${
      selectedProduct || currentView === 'shop' ? 'bg-white text-neutral-900' : 'bg-[#0d0d0d] text-[#f5f5f5]'
    }`}>
      
      {/* 1. Header/Navbar (Transparent, Absolute on Top of Image) */}
      <header
        id="navbar-header"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          hasScrolled || selectedProduct || currentView === 'shop' ? 'bg-white shadow-[0_1px_8px_rgba(0,0,0,0.05)] text-neutral-900 border-b border-neutral-100' : 'bg-transparent text-[#f5f5f5]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 grid grid-cols-3 items-center">
          
          {/* Navigation Links (Left, clean aesthetic, smaller fonts/icons, no crazy hovers) */}
          <nav className="hidden lg:flex items-center gap-6 text-[10px] font-semibold tracking-[0.15em]">
            <button
              id="nav-best-sellers"
              onClick={() => {
                setActiveCategory('all');
                setShopSortOption('rating-desc');
                setCurrentView('shop');
                setSelectedProduct(null);
              }}
              className={`transition-colors py-2 relative ${
                hasScrolled || selectedProduct || currentView === 'shop' ? 'text-neutral-700 hover:text-black' : 'text-[#f5f5f5]/80 hover:text-white'
              }`}
            >
              BEST SELLERS
            </button>
            <button
              id="nav-new-arrivals"
              onClick={() => {
                setActiveCategory('all');
                setShopSortOption('alpha-asc');
                setCurrentView('shop');
                setSelectedProduct(null);
              }}
              className={`transition-colors py-2 relative ${
                hasScrolled || selectedProduct || currentView === 'shop' ? 'text-neutral-700 hover:text-black' : 'text-[#f5f5f5]/80 hover:text-white'
              }`}
            >
              NEW
            </button>
            <button
              id="nav-earrings"
              onClick={() => {
                setActiveCategory('earrings');
                setCurrentView('shop');
                setSelectedProduct(null);
              }}
              className={`transition-colors py-2 relative ${
                hasScrolled || selectedProduct || currentView === 'shop' ? 'text-neutral-700 hover:text-black' : 'text-[#f5f5f5]/80 hover:text-white'
              }`}
            >
              EARRINGS
            </button>
          </nav>
          
          {/* Mobile menu toggle on the left of grid for mobile layouts */}
          <div className="flex lg:hidden items-center justify-start">
            <button
              id="navbar-mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
              className={`p-1 transition-colors ${
                hasScrolled || selectedProduct || currentView === 'shop' ? 'text-neutral-700 hover:text-black' : 'text-[#f5f5f5]/80 hover:text-white'
              }`}
            >
              <Menu size={16} />
            </button>
          </div>

          {/* Logo (Centered, Cinzel/Display font) */}
          <div className="flex justify-center">
            <button
              id="brand-logo-btn"
              onClick={() => {
                setSelectedProduct(null);
                setCurrentView('home');
              }}
              className={`font-display text-lg md:text-xl font-light tracking-[0.25em] transition-colors duration-300 ${
                hasScrolled || selectedProduct || currentView === 'shop' ? 'text-neutral-900 hover:text-[#d4a373]' : 'text-[#f5f5f5] hover:text-[#d4a373]'
              }`}
            >
              {viewMode === 'aurelia' ? 'JIDNY' : 'JIDNY COUTURE'}
            </button>
          </div>

          {/* Action Icons (Right-aligned, smaller icons, no crazy hovers) */}
          <div className="flex items-center justify-end gap-4">
            {/* Search */}
            <button
              id="navbar-search-btn"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search Collection"
              className={`p-1 transition-all duration-200 ${
                hasScrolled || selectedProduct || currentView === 'shop' ? 'text-neutral-700 hover:text-black' : 'text-[#f5f5f5]/80 hover:text-white'
              }`}
            >
              <Search size={15} strokeWidth={1.5} />
            </button>

            {/* Shopping Bag (Cart) */}
            <button
              id="navbar-cart-btn"
              onClick={() => setIsCartOpen(true)}
              aria-label="Shopping Cart"
              className={`p-1 transition-all duration-200 relative ${
                hasScrolled || selectedProduct || currentView === 'shop' ? 'text-neutral-700 hover:text-[#d4a373]' : 'text-[#f5f5f5]/80 hover:text-[#d4a373]'
              }`}
            >
              <ShoppingBag size={15} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#d4a373] text-[8px] font-bold text-black ring-1 ring-black">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {!selectedProduct ? (
        currentView === 'home' ? (
          <>
          {/* 2. Full-Screen Hero Background Image Container */}
      <section
        id="hero-section"
        className="relative w-full h-screen overflow-hidden flex flex-col justify-between"
      >
        {/* Background Image with optional slow Ken Burns Zoom */}
        <div className="absolute inset-0 z-0">
          <motion.img
            src={heroBg}
            alt="Luxury brand campaign background"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
            initial={{ scale: 1.02, opacity: 0 }}
            animate={{
              scale: settings.zoomBackground ? 1 : 1.01,
              opacity: 1
            }}
            transition={{
              scale: {
                duration: 25,
                ease: 'linear',
                repeat: Infinity,
                repeatType: 'reverse'
              },
              opacity: { duration: 1.5, ease: 'easeOut' }
            }}
          />
          {/* Fully transparent overlay as requested, with no glossy/dark overlay */}
          <div
            className="absolute inset-0 bg-transparent transition-opacity duration-500"
          />
        </div>

        {/* 3. Hero Visual Content */}
        <div className="flex-1 flex items-center justify-center max-w-7xl mx-auto w-full px-6 md:px-12 relative z-10">
          <div className="flex flex-col items-center justify-center text-center">
            
            {/* Centered text: AFFORDABLE LUXURY, TRUSTED QUALITY. */}
            <h1 className="font-sans text-lg sm:text-2xl md:text-[28px] font-medium tracking-[0.15em] text-[#f5f5f5] leading-[1.3] mb-6">
              AFFORDABLE LUXURY,<br />TRUSTED QUALITY.
            </h1>

            {/* Underlined button: BEST SELLERS */}
            <button
              id="hero-best-sellers-btn"
              onClick={() => openShopCategory('all')}
              className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] text-[#f5f5f5] border-b border-white hover:text-[#d4a373] hover:border-[#d4a373] pb-1 uppercase transition-colors duration-300 cursor-pointer"
            >
              BEST SELLERS
            </button>

          </div>
        </div>

        {/* Keep empty space at bottom of hero section for structural stability */}
        <div className="h-10 w-full relative z-10 pointer-events-none" />
      </section>


      {/* --- DIOR-STYLE 3-IMAGE SHOWCASE SECTION --- */}
      <section id="luxury-triptych-section" className="bg-white pt-12 pb-12">
        <div className="w-full px-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[3px]">
            
            {/* Column 1: Dior Initials */}
            <div
              id="triptych-col-1"
              onClick={() => openShopCategory('all')}
              className="relative aspect-[3/4] overflow-hidden cursor-pointer group"
            >
              <img
                src="https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&q=80&w=800&h=1000"
                alt="Dior Initials Luxury Footwear"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {/* Subtle dark gradient overlay at the bottom for text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />
              
              {/* Bottom text overlay */}
              <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                <span className="relative text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-[#f5f5f5]/90 uppercase select-none pb-1">
                  Dior Initials
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white/80 transition-transform duration-300 origin-center scale-x-100 group-hover:scale-x-0" />
                </span>
              </div>
            </div>

            {/* Column 2: Sunglasses */}
            <div
              id="triptych-col-2"
              onClick={() => openShopCategory('all')}
              className="relative aspect-[3/4] overflow-hidden cursor-pointer group"
            >
              <img
                src="https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&q=80&w=800&h=1000"
                alt="Luxury Sunglasses"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />
              
              <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                <span className="relative text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-[#f5f5f5]/90 uppercase select-none pb-1">
                  Sunglasses
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white/80 transition-transform duration-300 origin-center scale-x-100 group-hover:scale-x-0" />
                </span>
              </div>
            </div>

            {/* Column 3: Bags */}
            <div
              id="triptych-col-3"
              onClick={() => openShopCategory('all')}
              className="relative aspect-[3/4] overflow-hidden cursor-pointer group"
            >
              <img
                src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800&h=1000"
                alt="Designer Leather Bags"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />
              
              <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                <span className="relative text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-[#f5f5f5]/90 uppercase select-none pb-1">
                  Bags
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white/80 transition-transform duration-300 origin-center scale-x-100 group-hover:scale-x-0" />
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* --- BEST SELLERS GRID SECTION --- */}
      <section id="best-sellers-showcase-section" className="bg-white py-16">
        <div className="w-full px-4 sm:px-6 md:px-8">
          
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-sans text-xs sm:text-sm font-bold tracking-[0.2em] text-[#111111] uppercase">
              Best Sellers
            </h2>
            <div className="flex items-center">
              <button
                id="shop-all-link-btn"
                onClick={() => openShopCategory('all')}
                className="group relative text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-[#111111] uppercase pb-1 cursor-pointer mr-6"
              >
                Shop All
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-black transition-transform duration-300 origin-center scale-x-100 group-hover:scale-x-0" />
              </button>
              
              {/* Thin arrow navigation circles */}
              <div className="flex gap-2">
                <button
                  id="bestsellers-prev-btn"
                  onClick={() => openShopCategory('all')}
                  aria-label="Previous Best Sellers"
                  className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center hover:border-black/30 text-black/70 hover:text-black transition-all"
                >
                  <span className="text-xs font-light">←</span>
                </button>
                <button
                  id="bestsellers-next-btn"
                  onClick={() => openShopCategory('all')}
                  aria-label="Next Best Sellers"
                  className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center hover:border-black/30 text-black/70 hover:text-black transition-all"
                >
                  <span className="text-xs font-light">→</span>
                </button>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-[3px]">
            {PRODUCTS.slice(0, 4).map((product) => {
              const isWishlisted = wishlist.some((p) => p.id === product.id);
              return (
                <div key={product.id} className="group flex flex-col">
                  {/* Image container with strictly sharp corners and elegant 3:4 portrait aspect ratio */}
                  <div className="relative aspect-[3/4] w-full bg-[#f4f4f4] overflow-hidden cursor-pointer">
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      onClick={() => setSelectedProduct(product)}
                      className="w-full h-full object-cover rounded-none transition-all duration-300"
                    />

                    {/* Left: Pill (e.g. "Best Seller" on the 4th card Cubic Zirconia Cross Pendant) */}
                    {product.id === 'best-4' && (
                      <span className="absolute top-4 left-4 rounded-full text-[8px] sm:text-[9px] font-bold px-2.5 py-0.5 bg-white text-black tracking-widest border border-black/5 uppercase shadow-[0_1px_3px_rgba(0,0,0,0.05)] select-none">
                        Best Seller
                      </span>
                    )}

                    {/* Right: Wishlist Heart Button */}
                    <button
                      onClick={() => toggleWishlist(product)}
                      className="absolute top-4 right-4 p-1.5 text-black hover:scale-110 transition-all duration-200"
                      aria-label="Toggle Wishlist"
                    >
                      <Heart
                        size={16}
                        strokeWidth={1.5}
                        className={isWishlisted ? 'fill-black text-black' : 'text-black'}
                      />
                    </button>

                    {/* Quick Add Button on Hover */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setQuickAddProduct(product);
                      }}
                      className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[85%] bg-white hover:bg-neutral-100 text-neutral-900 font-sans text-[10px] sm:text-xs font-bold py-3 px-4 rounded-full tracking-[0.15em] text-center uppercase transition-all duration-300 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0"
                    >
                      Quick Add
                    </button>
                  </div>

                  {/* Metadata & Description below Image */}
                  <div className="mt-4 flex flex-col px-4 pb-4">
                    {/* Material detail string */}
                    <span className="text-[10px] tracking-wider text-neutral-400 uppercase font-medium">
                      {product.spec || 'Yellow Gold'}
                    </span>

                    {/* Product Name */}
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="text-left font-sans text-xs sm:text-sm font-semibold text-neutral-900 mt-1 hover:text-black hover:underline transition-colors leading-tight cursor-pointer"
                    >
                      {product.name}
                    </button>

                    {/* Price */}
                    <span className="font-sans text-xs sm:text-sm text-neutral-900 mt-1 font-medium">
                      ${product.price.toFixed(2)}
                    </span>

                    {/* Color Swatches */}
                    <div className="flex items-center gap-1.5 mt-2.5">
                      {product.materials.map((material, mIdx) => {
                        let colorClass = 'bg-[#e5c158]'; // Yellow Gold default
                        if (material.toLowerCase().includes('white') || material.toLowerCase().includes('silver') || material.toLowerCase().includes('sterling')) {
                          colorClass = 'bg-[#d1d5db]';
                        } else if (material.toLowerCase().includes('rose')) {
                          colorClass = 'bg-[#e2a899]';
                        }
                        
                        return (
                          <div
                            key={mIdx}
                            title={material}
                            className={`w-3 h-3 rounded-full ${colorClass} border border-white ring-1 ring-black/15 cursor-pointer hover:scale-110 transition-transform`}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>


      {/* --- CAMPAIGN CATEGORIES SECTION --- */}
      <section id="campaign-categories-section" className="bg-white pb-16">
        <div className="w-full px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-2">
            
            {/* Left Category: Shoes */}
            <div 
              onClick={() => {
                setActiveCategory('all');
                setShowCategoryOverlay(true);
              }}
              className="relative aspect-[4/5] w-full overflow-hidden group cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=80&w=1200"
                alt="Shoes Category Campaign"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 transition-colors duration-300 group-hover:bg-black/20" />
              
              {/* Label at bottom center */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
                <span className="text-white text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase border-b border-white pb-1">
                  Shoes
                </span>
              </div>
            </div>

            {/* Right Category: Accessories */}
            <div 
              onClick={() => {
                setActiveCategory('all');
                setShowCategoryOverlay(true);
              }}
              className="relative aspect-[4/5] w-full overflow-hidden group cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=1200"
                alt="Accessories Category Campaign"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 transition-colors duration-300 group-hover:bg-black/20" />
              
              {/* Label at bottom center */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
                <span className="text-white text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase border-b border-white pb-1">
                  Accessories
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* --- CINEMATIC CAMPAIGN VIDEO SECTION (FULL BLEED) --- */}
      <section id="cinematic-campaign-video-section" className="relative w-full bg-black overflow-hidden h-[75vh] md:h-[90vh] flex items-end justify-center pb-24">
        {/* Background Video */}
        <video
          ref={videoRef}
          src="/video.mp4"
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Cinematic Vignette / Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/35 z-10" />

        {/* Content Overlaid */}
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          <p className="text-white/95 font-sans text-[10px] sm:text-xs font-semibold tracking-[0.3em] uppercase mb-4">
            Women's Fall 2026
          </p>
          <h2 className="text-white font-serif text-3xl sm:text-5xl md:text-6xl font-normal tracking-[0.05em] leading-tight mb-8">
            A Certain Attitude
          </h2>
          <button 
            onClick={() => {
              setActiveCategory('all');
              setShowCategoryOverlay(true);
            }}
            className="text-white hover:text-white/80 text-xs sm:text-sm font-bold tracking-[0.25em] uppercase border-b border-white hover:border-white/80 pb-1.5 transition-all duration-300"
          >
            Discover
          </button>
        </div>

        {/* Left Bottom Video Controls Button */}
        <button
          onClick={toggleVideoPlayback}
          className="absolute bottom-8 left-6 md:left-8 w-10 h-10 rounded-full border border-white/20 bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm flex items-center justify-center transition-all duration-300 z-20 hover:scale-105"
          aria-label={isVideoPlaying ? "Pause campaign video" : "Play campaign video"}
        >
          {isVideoPlaying ? <Pause size={14} strokeWidth={1.5} /> : <Play size={14} strokeWidth={1.5} className="ml-0.5" />}
        </button>
      </section>
    </>
    ) : (
      /* --- DEDICATED PRODUCTS/SHOP VIEW --- */
      <div className="bg-white min-h-screen text-neutral-900 font-sans pt-32 pb-24 animate-fadeIn">
        
        {/* A. Sticky Filter and Sort Navigation Row */}
        <div className="sticky top-[116px] bg-white border-b border-neutral-100 z-20 shadow-[0_1px_3px_rgba(0,0,0,0.02)] py-4 px-6 md:px-12">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            
            {/* Left Side: Filter Pill Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              
              {/* 1. Color Filter Pill */}
              <div className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'color' ? null : 'color')}
                  className={`px-4 py-2 text-[11px] font-semibold tracking-wider uppercase rounded-full border transition-all flex items-center gap-1.5 ${
                    shopColorFilter !== 'all'
                      ? 'bg-[#1e2d30] text-white border-[#1e2d30]'
                      : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  <span>Color{shopColorFilter !== 'all' ? `: ${shopColorFilter}` : ''}</span>
                  <span className="text-[9px] opacity-60">▼</span>
                </button>
                {activeDropdown === 'color' && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)} />
                    <div className="absolute left-0 mt-2 w-48 bg-white border border-neutral-200 rounded-lg shadow-lg z-20 py-1.5 text-xs text-neutral-800">
                      <button
                        onClick={() => { setShopColorFilter('all'); setActiveDropdown(null); }}
                        className="w-full text-left px-4 py-2 hover:bg-neutral-50 flex justify-between items-center"
                      >
                        <span>All Colors</span>
                        {shopColorFilter === 'all' && <span className="text-green-600 font-bold">✓</span>}
                      </button>
                      <button
                        onClick={() => { setShopColorFilter('gold'); setActiveDropdown(null); }}
                        className="w-full text-left px-4 py-2 hover:bg-neutral-50 flex justify-between items-center"
                      >
                        <span>Yellow Gold</span>
                        {shopColorFilter === 'gold' && <span className="text-green-600 font-bold">✓</span>}
                      </button>
                      <button
                        onClick={() => { setShopColorFilter('silver'); setActiveDropdown(null); }}
                        className="w-full text-left px-4 py-2 hover:bg-neutral-50 flex justify-between items-center"
                      >
                        <span>Silver / White Gold</span>
                        {shopColorFilter === 'silver' && <span className="text-green-600 font-bold">✓</span>}
                      </button>
                      <button
                        onClick={() => { setShopColorFilter('rose'); setActiveDropdown(null); }}
                        className="w-full text-left px-4 py-2 hover:bg-neutral-50 flex justify-between items-center"
                      >
                        <span>Rose Gold</span>
                        {shopColorFilter === 'rose' && <span className="text-green-600 font-bold">✓</span>}
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* 2. Price Filter Pill */}
              <div className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'price' ? null : 'price')}
                  className={`px-4 py-2 text-[11px] font-semibold tracking-wider uppercase rounded-full border transition-all flex items-center gap-1.5 ${
                    shopPriceFilter !== 'all'
                      ? 'bg-[#1e2d30] text-white border-[#1e2d30]'
                      : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  <span>Price{shopPriceFilter !== 'all' ? `: ${shopPriceFilter.replace('-', ' to ')}` : ''}</span>
                  <span className="text-[9px] opacity-60">▼</span>
                </button>
                {activeDropdown === 'price' && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)} />
                    <div className="absolute left-0 mt-2 w-48 bg-white border border-neutral-200 rounded-lg shadow-lg z-20 py-1.5 text-xs text-neutral-800">
                      <button
                        onClick={() => { setShopPriceFilter('all'); setActiveDropdown(null); }}
                        className="w-full text-left px-4 py-2 hover:bg-neutral-50 flex justify-between items-center"
                      >
                        <span>All Prices</span>
                        {shopPriceFilter === 'all' && <span className="text-green-600 font-bold">✓</span>}
                      </button>
                      <button
                        onClick={() => { setShopPriceFilter('under-15'); setActiveDropdown(null); }}
                        className="w-full text-left px-4 py-2 hover:bg-neutral-50 flex justify-between items-center"
                      >
                        <span>Under $15</span>
                        {shopPriceFilter === 'under-15' && <span className="text-green-600 font-bold">✓</span>}
                      </button>
                      <button
                        onClick={() => { setShopPriceFilter('15-25'); setActiveDropdown(null); }}
                        className="w-full text-left px-4 py-2 hover:bg-neutral-50 flex justify-between items-center"
                      >
                        <span>$15 - $25</span>
                        {shopPriceFilter === '15-25' && <span className="text-green-600 font-bold">✓</span>}
                      </button>
                      <button
                        onClick={() => { setShopPriceFilter('over-25'); setActiveDropdown(null); }}
                        className="w-full text-left px-4 py-2 hover:bg-neutral-50 flex justify-between items-center"
                      >
                        <span>Over $25</span>
                        {shopPriceFilter === 'over-25' && <span className="text-green-600 font-bold">✓</span>}
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* 3. Product Type / Category Filter Pill */}
              <div className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'type' ? null : 'type')}
                  className={`px-4 py-2 text-[11px] font-semibold tracking-wider uppercase rounded-full border transition-all flex items-center gap-1.5 ${
                    activeCategory !== 'all'
                      ? 'bg-[#1e2d30] text-white border-[#1e2d30]'
                      : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  <span>Product Type{activeCategory !== 'all' ? `: ${activeCategory}` : ''}</span>
                  <span className="text-[9px] opacity-60">▼</span>
                </button>
                {activeDropdown === 'type' && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)} />
                    <div className="absolute left-0 mt-2 w-48 bg-white border border-neutral-200 rounded-lg shadow-lg z-20 py-1.5 text-xs text-neutral-800">
                      <button
                        onClick={() => { setActiveCategory('all'); setActiveDropdown(null); }}
                        className="w-full text-left px-4 py-2 hover:bg-neutral-50 flex justify-between items-center"
                      >
                        <span>All Products</span>
                        {activeCategory === 'all' && <span className="text-green-600 font-bold">✓</span>}
                      </button>
                      <button
                        onClick={() => { setActiveCategory('earrings'); setActiveDropdown(null); }}
                        className="w-full text-left px-4 py-2 hover:bg-neutral-50 flex justify-between items-center"
                      >
                        <span>Earrings</span>
                        {activeCategory === 'earrings' && <span className="text-green-600 font-bold">✓</span>}
                      </button>
                      <button
                        onClick={() => { setActiveCategory('rings'); setActiveDropdown(null); }}
                        className="w-full text-left px-4 py-2 hover:bg-neutral-50 flex justify-between items-center"
                      >
                        <span>Rings</span>
                        {activeCategory === 'rings' && <span className="text-green-600 font-bold">✓</span>}
                      </button>
                      <button
                        onClick={() => { setActiveCategory('necklaces'); setActiveDropdown(null); }}
                        className="w-full text-left px-4 py-2 hover:bg-neutral-50 flex justify-between items-center"
                      >
                        <span>Necklaces</span>
                        {activeCategory === 'necklaces' && <span className="text-green-600 font-bold">✓</span>}
                      </button>
                      <button
                        onClick={() => { setActiveCategory('bracelets'); setActiveDropdown(null); }}
                        className="w-full text-left px-4 py-2 hover:bg-neutral-50 flex justify-between items-center"
                      >
                        <span>Bracelets</span>
                        {activeCategory === 'bracelets' && <span className="text-green-600 font-bold">✓</span>}
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* 4. Rating Filter Pill */}
              <div className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'rating' ? null : 'rating')}
                  className={`px-4 py-2 text-[11px] font-semibold tracking-wider uppercase rounded-full border transition-all flex items-center gap-1.5 ${
                    shopRatingFilter !== 'all'
                      ? 'bg-[#1e2d30] text-white border-[#1e2d30]'
                      : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  <span>Rating{shopRatingFilter !== 'all' ? `: ${shopRatingFilter}★+` : ''}</span>
                  <span className="text-[9px] opacity-60">▼</span>
                </button>
                {activeDropdown === 'rating' && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)} />
                    <div className="absolute left-0 mt-2 w-48 bg-white border border-neutral-200 rounded-lg shadow-lg z-20 py-1.5 text-xs text-neutral-800">
                      <button
                        onClick={() => { setShopRatingFilter('all'); setActiveDropdown(null); }}
                        className="w-full text-left px-4 py-2 hover:bg-neutral-50 flex justify-between items-center"
                      >
                        <span>All Ratings</span>
                        {shopRatingFilter === 'all' && <span className="text-green-600 font-bold">✓</span>}
                      </button>
                      <button
                        onClick={() => { setShopRatingFilter('4.8'); setActiveDropdown(null); }}
                        className="w-full text-left px-4 py-2 hover:bg-neutral-50 flex justify-between items-center"
                      >
                        <span>4.8★ & up</span>
                        {shopRatingFilter === '4.8' && <span className="text-green-600 font-bold">✓</span>}
                      </button>
                      <button
                        onClick={() => { setShopRatingFilter('4.6'); setActiveDropdown(null); }}
                        className="w-full text-left px-4 py-2 hover:bg-neutral-50 flex justify-between items-center"
                      >
                        <span>4.6★ & up</span>
                        {shopRatingFilter === '4.6' && <span className="text-green-600 font-bold">✓</span>}
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* 5. Clear / All Filters Pill */}
              <button
                onClick={() => {
                  setShopColorFilter('all');
                  setShopPriceFilter('all');
                  setShopRatingFilter('all');
                  setActiveCategory('all');
                  setShopSortOption('alpha-asc');
                }}
                className="px-4 py-2 text-[11px] font-semibold tracking-wider uppercase rounded-full border border-neutral-200 text-neutral-500 bg-neutral-50 hover:bg-neutral-100 transition-all"
              >
                All Filters ⟲
              </button>

            </div>

            {/* Right Side: Product Count & Sort */}
            <div className="flex items-center gap-6 text-[11px] font-semibold tracking-wider text-neutral-500">
              <span className="uppercase">{filteredProducts.length} Products</span>
              
              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'sort' ? null : 'sort')}
                  className="flex items-center gap-1.5 text-neutral-800 hover:text-black uppercase text-[11px] font-semibold tracking-wider"
                >
                  <span>
                    Sort: {
                      shopSortOption === 'alpha-asc' ? 'Alphabetically, A-Z' :
                      shopSortOption === 'alpha-desc' ? 'Alphabetically, Z-A' :
                      shopSortOption === 'price-asc' ? 'Price, Low to High' :
                      shopSortOption === 'price-desc' ? 'Price, High to Low' : 'Best Sellers'
                    }
                  </span>
                  <span className="text-[9px]">▼</span>
                </button>
                {activeDropdown === 'sort' && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-neutral-200 rounded-lg shadow-lg z-20 py-1.5 text-xs text-neutral-800">
                      <button
                        onClick={() => { setShopSortOption('alpha-asc'); setActiveDropdown(null); }}
                        className="w-full text-left px-4 py-2 hover:bg-neutral-50 flex justify-between items-center"
                      >
                        <span>Alphabetically, A-Z</span>
                        {shopSortOption === 'alpha-asc' && <span className="text-green-600 font-bold">✓</span>}
                      </button>
                      <button
                        onClick={() => { setShopSortOption('alpha-desc'); setActiveDropdown(null); }}
                        className="w-full text-left px-4 py-2 hover:bg-neutral-50 flex justify-between items-center"
                      >
                        <span>Alphabetically, Z-A</span>
                        {shopSortOption === 'alpha-desc' && <span className="text-green-600 font-bold">✓</span>}
                      </button>
                      <button
                        onClick={() => { setShopSortOption('price-asc'); setActiveDropdown(null); }}
                        className="w-full text-left px-4 py-2 hover:bg-neutral-50 flex justify-between items-center"
                      >
                        <span>Price, Low to High</span>
                        {shopSortOption === 'price-asc' && <span className="text-green-600 font-bold">✓</span>}
                      </button>
                      <button
                        onClick={() => { setShopSortOption('price-desc'); setActiveDropdown(null); }}
                        className="w-full text-left px-4 py-2 hover:bg-neutral-50 flex justify-between items-center"
                      >
                        <span>Price, High to Low</span>
                        {shopSortOption === 'price-desc' && <span className="text-green-600 font-bold">✓</span>}
                      </button>
                      <button
                        onClick={() => { setShopSortOption('rating-desc'); setActiveDropdown(null); }}
                        className="w-full text-left px-4 py-2 hover:bg-neutral-50 flex justify-between items-center"
                      >
                        <span>Best Sellers (Rating)</span>
                        {shopSortOption === 'rating-desc' && <span className="text-green-600 font-bold">✓</span>}
                      </button>
                    </div>
                  </>
                )}
              </div>

            </div>

          </div>
        </div>

        {/* B. Products Grid */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 mt-10">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-sm text-neutral-400 tracking-widest uppercase">No products match your filters.</p>
              <button
                onClick={() => {
                  setShopColorFilter('all');
                  setShopPriceFilter('all');
                  setShopRatingFilter('all');
                  setActiveCategory('all');
                }}
                className="mt-6 text-xs font-bold tracking-[0.2em] text-[#d4a373] hover:text-black transition-all border-b border-[#d4a373] pb-1 uppercase"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
              {filteredProducts.map((product) => {
                const isWishlisted = wishlist.some((p) => p.id === product.id);
                const isSoldOut = product.id === 'pair-1' || product.id === 'pair-3';
                const metalTag = (product.spec || 'YELLOW GOLD').split('/')[0].trim().toUpperCase() + (product.materials.length > 1 ? ` / ${product.materials.length}` : '');

                return (
                  <div key={product.id} className="group flex flex-col">
                    
                    {/* Image Frame with strictly sharp corners & luxurious off-white background */}
                    <div 
                      onClick={() => setSelectedProduct(product)}
                      className="relative aspect-[3/4] w-full bg-[#f9f9f9] border border-neutral-100 overflow-hidden cursor-pointer"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />

                      {/* Sold Out Overlay Badge */}
                      {isSoldOut && (
                        <span className="absolute top-4 left-4 bg-white text-black text-[9px] font-bold tracking-[0.2em] px-2.5 py-1.5 uppercase shadow-sm border border-neutral-100">
                          SOLD OUT
                        </span>
                      )}

                      {/* New Arrival Badge */}
                      {!isSoldOut && product.isNew && (
                        <span className="absolute top-4 left-4 bg-[#1e2d30] text-[#f5f5f5] text-[8px] font-bold tracking-[0.2em] px-2.5 py-1 uppercase">
                          NEW
                        </span>
                      )}

                      {/* Wishlist Heart Icon Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product);
                        }}
                        className="absolute top-4 right-4 text-black hover:scale-110 transition-all duration-200"
                        aria-label="Toggle Wishlist"
                      >
                        <Heart
                          size={16}
                          strokeWidth={1.5}
                          className={isWishlisted ? 'fill-black text-black' : 'text-black/70 hover:text-black'}
                        />
                      </button>

                      {/* Quick Add Overlay Button on Hover */}
                      {!isSoldOut && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product, product.materials[0]);
                          }}
                          className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] bg-white hover:bg-neutral-950 hover:text-white text-neutral-900 font-sans text-[10px] font-bold py-3 px-4 rounded-full tracking-[0.15em] text-center uppercase transition-all duration-300 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 shadow-lg"
                        >
                          Add to Bag
                        </button>
                      )}
                    </div>

                    {/* Content block left-aligned underneath image */}
                    <div className="mt-4 flex flex-col text-left">
                      {/* Upper grey category specs */}
                      <span className="text-[10px] tracking-wider text-neutral-400 font-semibold uppercase">
                        {metalTag}
                      </span>

                      {/* Product Title */}
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="text-left font-sans text-xs sm:text-sm font-bold text-neutral-900 mt-1.5 hover:text-black hover:underline transition-colors leading-tight line-clamp-1 cursor-pointer"
                      >
                        {product.name}
                      </button>

                      {/* Price */}
                      <span className="font-sans text-xs sm:text-sm text-neutral-700 mt-1 font-medium">
                        ${product.price.toFixed(2)}
                      </span>

                      {/* Color Swatches */}
                      <div className="flex items-center gap-1.5 mt-2.5">
                        {product.materials.map((material, mIdx) => {
                          let colorClass = 'bg-[#e5c158]'; // Gold default
                          if (material.toLowerCase().includes('white') || material.toLowerCase().includes('silver') || material.toLowerCase().includes('sterling')) {
                            colorClass = 'bg-[#d1d5db]';
                          } else if (material.toLowerCase().includes('rose')) {
                            colorClass = 'bg-[#e2a899]';
                          }
                          
                          return (
                            <div
                              key={mIdx}
                              title={material}
                              className={`w-3 h-3 rounded-full ${colorClass} border border-white ring-1 ring-black/15 cursor-pointer hover:scale-110 transition-transform`}
                            />
                          );
                        })}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    )
  ) : (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white text-neutral-900 font-sans pt-28 pb-12 min-h-[60vh]"
    >
      {/* Main Content Container */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-10">
        
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => setSelectedProduct(null)}
            className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.25em] text-neutral-400 hover:text-black transition-colors uppercase"
          >
            ← BACK TO COLLECTIONS
          </button>
        </div>

        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[10px] sm:text-xs font-semibold tracking-wider text-neutral-400 mb-8 uppercase">
          <button onClick={() => setSelectedProduct(null)} className="hover:text-black transition-colors">
            Home
          </button>
          <span className="text-neutral-300">/</span>
          <button onClick={() => setSelectedProduct(null)} className="hover:text-black transition-colors">
            Best Sellers
          </button>
          <span className="text-neutral-300">/</span>
          <span className="text-neutral-900">{selectedProduct.name}</span>
        </div>

        {/* Product Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">
          
          {/* Left Side: Image Gallery */}
          <div className="lg:col-span-7 flex flex-col md:flex-row gap-4 md:gap-6">
            
            {/* Thumbnails Column (Left of Main Image) */}
            <div className="flex md:flex-col flex-row gap-3 order-2 md:order-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
              {[
                selectedProduct.image,
                'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600&h=600',
                'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600&h=600',
                'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=600&h=600',
                'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=600&h=600'
              ].map((thumbUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveDetailThumbnail(idx)}
                  className={`w-16 h-20 md:w-20 md:h-24 flex-shrink-0 bg-neutral-50 border overflow-hidden transition-all ${
                    activeDetailThumbnail === idx
                      ? 'border-black ring-1 ring-black'
                      : 'border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  <img
                    src={thumbUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main Display Image - Cap height at 500px, keep aspect ratio square and extremely neat */}
            <div className="flex-1 order-1 md:order-2 aspect-square max-h-[500px] bg-neutral-50 overflow-hidden relative border border-neutral-100 rounded-lg">
              <img
                src={[
                  selectedProduct.image,
                  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600&h=600',
                  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600&h=600',
                  'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=600&h=600',
                  'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=600&h=600'
                ][activeDetailThumbnail]}
                alt={selectedProduct.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover select-none"
              />
              
              {selectedProduct.isBestSeller && (
                <span className="absolute top-4 left-4 bg-black text-white text-[9px] font-bold tracking-widest px-3 py-1.5 uppercase">
                  BEST SELLER
                </span>
              )}
            </div>

          </div>

          {/* Right Side: Product Details & Controls */}
          <div className="lg:col-span-5 flex flex-col text-left">
            
            {/* Title */}
            <h1 className="text-xl md:text-2xl font-bold tracking-[0.05em] text-[#111111] uppercase mb-2">
              {selectedProduct.name}
            </h1>

            {/* Price */}
            <p className="text-lg font-semibold text-neutral-900 mb-8">
              ${selectedProduct.price.toFixed(2)}
            </p>

            {/* Color Selector */}
            <div className="mb-8">
              <span className="text-[10px] font-bold tracking-[0.15em] text-neutral-500 uppercase block mb-3">
                COLOR: {detailSelectedMaterial.toUpperCase()}
              </span>
              <div className="flex gap-3">
                {selectedProduct.materials.map((material) => {
                  let colorClass = 'bg-[#f3dfa2]'; // Gold default
                  if (material.toLowerCase().includes('white') || material.toLowerCase().includes('silver') || material.toLowerCase().includes('sterling')) {
                    colorClass = 'bg-[#e5e7eb]';
                  } else if (material.toLowerCase().includes('rose')) {
                    colorClass = 'bg-[#f5d6cd]';
                  }
                  return (
                    <button
                      key={material}
                      onClick={() => setDetailSelectedMaterial(material)}
                      title={material}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        detailSelectedMaterial === material
                          ? 'ring-1 ring-black ring-offset-2 scale-105'
                          : 'border border-neutral-200 hover:scale-105'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-full ${colorClass} block`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stone Size Selector with Rounded-Full Pills */}
            <div className="mb-8">
              <span className="text-[10px] font-bold tracking-[0.15em] text-neutral-500 uppercase block mb-3">
                STONE SIZE
              </span>
              <div className="flex flex-wrap gap-2">
                {['3-PACK (ALL SIZES)', '2 MM', '3 MM', '4 MM'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedStoneSize(size)}
                    className={`px-4 py-2 text-[10px] font-bold tracking-wider transition-all border rounded-full ${
                      selectedStoneSize === size
                        ? 'bg-[#1e2d30] text-white border-[#1e2d30]'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="flex items-center gap-2 text-[11px] text-neutral-500 mb-8 italic">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              <span>In-stock & ready to ship</span>
            </div>

            {/* Add To Cart & Wishlist Actions with fully rounded pill shapes */}
            <div className="flex gap-3 mb-12">
              <button
                onClick={() => {
                  addToCart(selectedProduct, detailSelectedMaterial);
                }}
                className="flex-1 py-4 bg-[#1e2d30] hover:bg-black text-white text-[11px] font-bold tracking-[0.25em] uppercase transition-all duration-300 rounded-full"
              >
                ADD TO CART
              </button>
              <button
                onClick={() => toggleWishlist(selectedProduct)}
                className="p-4 border border-neutral-200 hover:border-black transition-colors flex items-center justify-center rounded-full"
                aria-label="Save to Wishlist"
              >
                <Heart
                  size={18}
                  strokeWidth={1.5}
                  className={
                    wishlist.some((p) => p.id === selectedProduct.id)
                      ? 'fill-black text-black'
                      : 'text-neutral-500 hover:text-black'
                  }
                />
              </button>
            </div>

            {/* Specs & Materials Description */}
            <div className="border-t border-neutral-100 pt-8 text-xs text-neutral-600 leading-relaxed space-y-4">
              <p>
                Look gorgeous even when sleeping with our new Must-have Screw Back earrings. These Cubic Zirconia Screw Back Studs are breathtakingly worn solo or as part of an earring stack.
              </p>
              <div>
                <p className="font-bold text-neutral-900 mb-1">Materials:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>14K yellow, rose or white gold plated.</li>
                  <li>Measurements: Studs of 2mm, 3mm, and 4mm.</li>
                  <li>These small stud earrings are Crafted with a S925 post that screws into our flat back disc.</li>
                </ul>
              </div>
            </div>

          </div>

        </div>

        {/* YOU MAY ALSO LIKE Section */}
        <div className="border-t border-neutral-100 mt-20 pt-16">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs sm:text-sm font-bold tracking-[0.2em] text-[#111111] uppercase">
              YOU MAY ALSO LIKE
            </h3>
            <div className="flex gap-1">
              <button className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-400 hover:text-black hover:border-neutral-300 transition-all text-xs">
                ←
              </button>
              <button className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-400 hover:text-black hover:border-neutral-300 transition-all text-xs">
                →
              </button>
            </div>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { id: 'pair-1', name: 'Tiny Star Flat Back Studs', price: 12.95, img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=400&h=400' },
              { id: 'pair-2', name: 'Small Crystal Screw Back Stud', price: 11.95, img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=400&h=400' },
              { id: 'pair-3', name: 'Small Sphere Screw Back Stud', price: 11.95, img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=400&h=400' },
              { id: 'pair-4', name: 'Tear Screw Back Stud', price: 12.95, img: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=400&h=400' }
            ].map((item) => {
              const isWishlisted = wishlist.some((p) => p.id === item.id);
              return (
                <div
                  key={item.id}
                  className="group flex flex-col cursor-pointer text-left relative"
                  onClick={() => {
                    const product = PRODUCTS.find((p) => p.id === item.id);
                    if (product) setSelectedProduct(product);
                  }}
                >
                  {/* Image Container with SHARP corners as requested */}
                  <div className="aspect-[4/5] bg-neutral-50 overflow-hidden mb-3 relative border border-neutral-100 rounded-none">
                    <img
                      src={item.img}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Wishlist Button with no background and filled with color black when saved */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const product = PRODUCTS.find((p) => p.id === item.id);
                        if (product) toggleWishlist(product);
                      }}
                      className="absolute top-3 right-3 text-neutral-500 hover:text-black transition-all"
                      aria-label="Add to favorites"
                    >
                      <Heart
                        size={16}
                        strokeWidth={1.5}
                        className={isWishlisted ? 'fill-black text-black' : 'text-neutral-500 hover:text-black'}
                      />
                    </button>
                  </div>

                  {/* Text details */}
                  <span className="text-[9px] font-semibold text-neutral-400 tracking-widest uppercase block">
                    YELLOW GOLD
                  </span>
                  <h4 className="text-[11px] font-bold tracking-wide text-neutral-900 mt-1 leading-tight group-hover:text-black transition-colors line-clamp-1">
                    {item.name}
                  </h4>
                  <p className="text-[11px] font-semibold text-neutral-600 mt-1">
                    ${item.price.toFixed(2)}
                  </p>

                  {/* Color indicators */}
                  <div className="flex gap-1 mt-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f3dfa2]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#e5e7eb]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f5d6cd]" />
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </motion.div>
  )}


      {/* --- MINIMALIST HIGH-IMPACT BRAND FOOTER --- */}
      <footer id="brand-minimalist-footer" className="bg-[#fcfcfc] border-t border-neutral-100 pt-16 pb-24 text-[#111111]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Huge Brand Typography */}
          <div className="w-full overflow-hidden mb-16 select-none">
            <h2 className="text-[14vw] md:text-[11vw] font-black tracking-[-0.03em] text-[#111111] leading-none text-center font-sans">
              {viewMode === 'aurelia' ? 'JIDNY' : 'JIDNY COUTURE'}
            </h2>
          </div>

          {/* Minimalist Link Columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            
            {/* Column 1 */}
            <div>
              <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-neutral-950 border-b border-neutral-900 pb-1 inline-block mb-5">
                GROUP
              </h4>
              <ul className="space-y-3">
                <li>
                  <a href="#about" className="text-[10px] font-semibold tracking-widest text-neutral-500 hover:text-black transition-colors uppercase block">
                    Our Approach
                  </a>
                </li>
                <li>
                  <a href="#history" className="text-[10px] font-semibold tracking-widest text-neutral-500 hover:text-black transition-colors uppercase block">
                    History
                  </a>
                </li>
                <li>
                  <a href="#leadership" className="text-[10px] font-semibold tracking-widest text-neutral-500 hover:text-black transition-colors uppercase block">
                    Leadership
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-neutral-950 border-b border-neutral-900 pb-1 inline-block mb-5">
                COLLECTIONS
              </h4>
              <ul className="space-y-3">
                <li>
                  <button 
                    onClick={() => {
                      setActiveCategory('all');
                      setShowCategoryOverlay(true);
                    }}
                    className="text-[10px] font-semibold tracking-widest text-neutral-500 hover:text-black transition-colors uppercase block text-left"
                  >
                    New Arrivals
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      setActiveCategory('all');
                      setShowCategoryOverlay(true);
                    }}
                    className="text-[10px] font-semibold tracking-widest text-neutral-500 hover:text-black transition-colors uppercase block text-left"
                  >
                    Best Sellers
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      setActiveCategory('necklaces');
                      setShowCategoryOverlay(true);
                    }}
                    className="text-[10px] font-semibold tracking-widest text-neutral-500 hover:text-black transition-colors uppercase block text-left"
                  >
                    Gift Sets
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-neutral-950 border-b border-neutral-900 pb-1 inline-block mb-5">
                SUPPORT
              </h4>
              <ul className="space-y-3">
                <li>
                  <a href="#contact" className="text-[10px] font-semibold tracking-widest text-neutral-500 hover:text-black transition-colors uppercase block">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#locator" className="text-[10px] font-semibold tracking-widest text-neutral-500 hover:text-black transition-colors uppercase block">
                    Store Locator
                  </a>
                </li>
                <li>
                  <a href="#faqs" className="text-[10px] font-semibold tracking-widest text-neutral-500 hover:text-black transition-colors uppercase block">
                    FAQs
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4 */}
            <div>
              <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-neutral-950 border-b border-neutral-900 pb-1 inline-block mb-5">
                INFO
              </h4>
              <ul className="space-y-3">
                <li>
                  <a href="#privacy" className="text-[10px] font-semibold tracking-widest text-neutral-500 hover:text-black transition-colors uppercase block">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#terms" className="text-[10px] font-semibold tracking-widest text-neutral-500 hover:text-black transition-colors uppercase block">
                    Terms of Use
                  </a>
                </li>
                <li>
                  <a href="#cookies" className="text-[10px] font-semibold tracking-widest text-neutral-500 hover:text-black transition-colors uppercase block">
                    Cookies Settings
                  </a>
                </li>
              </ul>
            </div>

          </div>


        </div>
      </footer>


      {/* --- DRAWERS & INTERACTIVE OVERLAYS (GLASSMORPHIC DESIGN) --- */}

      {/* A. Search Overlay (Full Screen Minimalist Search) */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            id="search-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0d0d0d]/95 backdrop-blur-xl flex flex-col"
          >
            <div className="max-w-4xl mx-auto w-full px-6 pt-32 flex-1 flex flex-col justify-start">
              
              {/* Close Button */}
              <div className="flex justify-end mb-8">
                <button
                  id="close-search-btn"
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="p-3 text-white/60 hover:text-white border border-white/10 rounded-full transition-all duration-200"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Main Input */}
              <div className="relative border-b border-white/20 pb-4 mb-12">
                <input
                  id="search-input-field"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="SEARCH THE JIDNY COLLECTION..."
                  className="w-full bg-transparent text-2xl sm:text-4xl font-light tracking-[0.1em] text-white placeholder-white/20 border-none outline-none focus:ring-0"
                  autoFocus
                />
                <Search size={24} className="absolute right-0 top-1/2 -translate-y-1/2 text-white/30" />
              </div>

              {/* Quick Suggestions (Only when search is empty) */}
              {searchQuery.length === 0 ? (
                <div>
                  <h3 className="text-xs font-semibold tracking-[0.25em] text-[#d4a373] mb-5 uppercase">
                    SUGGESTED LOOKS & PIECES
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {searchSuggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSearchQuery(suggestion)}
                        className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-full text-xs font-medium tracking-wider hover:bg-white hover:text-black hover:border-white transition-all duration-300"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Search Results */
                <div className="flex-1 overflow-y-auto pb-12">
                  <h3 className="text-xs font-semibold tracking-[0.25em] text-[#d4a373] mb-6 uppercase">
                    SEARCH RESULTS ({searchedProducts.length})
                  </h3>
                  {searchedProducts.length === 0 ? (
                    <p className="text-sm text-white/40 tracking-wider">
                      No boutique pieces match your query. Try searching &apos;Gold&apos; or &apos;Ring&apos;.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {searchedProducts.map((product) => (
                        <div
                          key={product.id}
                          className="flex gap-4 p-4 bg-white/5 border border-white/5 rounded-lg hover:border-white/20 transition-all duration-300"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            referrerPolicy="no-referrer"
                            className="w-20 h-20 object-cover rounded"
                          />
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <h4 className="text-xs font-medium tracking-wide text-white">
                                {product.name}
                              </h4>
                              <p className="text-[11px] text-white/50 line-clamp-1 mt-1">
                                {product.description}
                              </p>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs font-semibold text-[#d4a373]">
                                ${product.price}.00
                              </span>
                              <button
                                onClick={() => {
                                  setSelectedProduct(product);
                                  setIsSearchOpen(false);
                                }}
                                className="text-[10px] tracking-widest text-white/80 hover:text-white border-b border-white/40 hover:border-white pb-0.5"
                              >
                                VIEW PIECE
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* B. Cart Drawer (Slides in from Right) */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <motion.div
              id="cart-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            {/* Slide Drawer */}
            <motion.div
              id="cart-drawer-panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.35 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-[#f9f9f9] border-l border-neutral-200 p-6 sm:p-8 flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-neutral-200 pb-6 mb-6">
                <h2 className="text-sm font-semibold tracking-[0.25em] text-neutral-900 uppercase">
                  SHOPPING BAG ({cartCount})
                </h2>
                <button
                  id="close-cart-btn"
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 text-neutral-400 hover:text-black transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <ShoppingBag size={48} strokeWidth={1} className="text-neutral-300 mb-4" />
                    <p className="text-sm text-neutral-500 tracking-wider">
                      Your luxurious shopping bag is empty.
                    </p>
                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        setShowCategoryOverlay(true);
                      }}
                      className="mt-6 text-xs font-semibold tracking-[0.2em] text-[#d4a373] hover:text-black transition-colors border-b border-[#d4a373] pb-1 uppercase"
                    >
                      Browse Boutique
                    </button>
                  </div>
                ) : (
                  cart.map((item, idx) => (
                    <div
                      key={`${item.product.id}-${item.selectedMaterial}-${idx}`}
                      className="flex gap-4 border-b border-neutral-200/60 pb-6"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-20 h-24 object-cover rounded bg-neutral-100 border border-neutral-200/50"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="text-xs font-medium text-neutral-900 tracking-wide leading-tight max-w-[80%]">
                              {item.product.name}
                            </h3>
                            <button
                              onClick={() => removeFromCart(item.product.id, item.selectedMaterial || '')}
                              className="text-neutral-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <p className="text-[10px] text-[#d4a373] tracking-wider mt-1 uppercase">
                            {item.selectedMaterial}
                          </p>
                        </div>
                        <div className="flex items-end justify-between mt-4">
                          <div className="flex items-center border border-neutral-200 rounded overflow-hidden bg-white">
                            <button
                              onClick={() =>
                                updateCartQuantity(item.product.id, item.selectedMaterial || '', -1)
                              }
                              className="p-1.5 text-neutral-400 hover:text-neutral-950 hover:bg-neutral-50 transition-colors"
                            >
                              <Minus size={11} />
                            </button>
                            <span className="px-3 text-xs font-medium text-neutral-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateCartQuantity(item.product.id, item.selectedMaterial || '', 1)
                              }
                              className="p-1.5 text-neutral-400 hover:text-neutral-950 hover:bg-neutral-50 transition-colors"
                            >
                              <Plus size={11} />
                            </button>
                          </div>
                          <span className="text-xs font-semibold text-neutral-900">
                            ${item.product.price * item.quantity}.00
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Checkout Block */}
              {cart.length > 0 && (
                <div className="border-t border-neutral-200 pt-6 mt-6">
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-xs text-neutral-500 tracking-wider">
                      <span>BOUTIQUE SHIPPING</span>
                      <span className="text-[#d4a373] uppercase font-semibold">COMPLIMENTARY</span>
                    </div>
                    <div className="flex justify-between items-end pt-2">
                      <span className="text-xs font-semibold tracking-wider text-neutral-500">SUBTOTAL</span>
                      <span className="text-lg font-bold text-neutral-900">${cartSubtotal}.00</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      alert('Thank you for experiencing Jidny Modern Luxury! This is a designer concept storefront.');
                    }}
                    className="w-full py-4 bg-[#1e2d30] hover:bg-black text-white text-xs font-bold tracking-[0.25em] uppercase transition-all duration-300 flex items-center justify-center gap-2 rounded-full"
                  >
                    <span>PROCESS CHECKOUT</span>
                    <ArrowUpRight size={14} />
                  </button>

                  <p className="text-center text-[10px] text-neutral-400 tracking-wide mt-4">
                    Insured signature delivery & elegant gift wrapping included.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* C. Wishlist Drawer (Slides in from Right) */}
      <AnimatePresence>
        {isWishlistOpen && (
          <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <motion.div
              id="wishlist-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWishlistOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            {/* Slide Drawer */}
            <motion.div
              id="wishlist-drawer-panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.35 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-[#121212] border-l border-white/5 p-6 sm:p-8 flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-6">
                <h2 className="text-sm font-semibold tracking-[0.25em] text-white uppercase">
                  SAVED FAVORITES ({wishlist.length})
                </h2>
                <button
                  id="close-wishlist-btn"
                  onClick={() => setIsWishlistOpen(false)}
                  className="p-1 text-white/50 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Wishlist Items List */}
              <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                {wishlist.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <Heart size={48} strokeWidth={1} className="text-white/20 mb-4" />
                    <p className="text-sm text-white/50 tracking-wider">
                      No saved pieces yet. Sparkle your favorites!
                    </p>
                  </div>
                ) : (
                  wishlist.map((product) => (
                    <div key={product.id} className="flex gap-4 border-b border-white/5 pb-6">
                      <img
                        src={product.image}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-20 h-24 object-cover rounded bg-white/5"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="text-xs font-medium text-white tracking-wide">
                              {product.name}
                            </h3>
                            <button
                              onClick={() => toggleWishlist(product)}
                              className="text-red-400 hover:text-white transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                          <p className="text-[11px] text-white/50 line-clamp-1 mt-1">
                            {product.description}
                          </p>
                        </div>
                        <div className="flex items-end justify-between mt-4">
                          <span className="text-xs font-semibold text-white">
                            ${product.price}.00
                          </span>
                          <button
                            onClick={() => {
                              setSelectedProduct(product);
                              setIsWishlistOpen(false);
                            }}
                            className="text-[10px] tracking-widest text-[#d4a373] hover:text-white border-b border-[#d4a373] hover:border-white pb-0.5"
                          >
                            QUICK ADD
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* D. Profile Loyalty Account Drawer (Slides in from Right) */}
      <AnimatePresence>
        {isProfileOpen && (
          <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <motion.div
              id="profile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProfileOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            {/* Slide Drawer */}
            <motion.div
              id="profile-drawer-panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.35 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-[#121212] border-l border-white/5 p-6 sm:p-8 flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-6">
                <h2 className="text-sm font-semibold tracking-[0.25em] text-white uppercase">
                  JIDNY PRIVÉ MEMBER
                </h2>
                <button
                  id="close-profile-btn"
                  onClick={() => setIsProfileOpen(false)}
                  className="p-1 text-white/50 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 space-y-8 overflow-y-auto pr-2">
                {/* Virtual Card */}
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-tr from-[#1a1a1a] via-[#242424] to-[#121212] border border-white/10 p-6 shadow-2xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4a373]/5 rounded-full blur-3xl pointer-events-none" />
                  <div className="flex justify-between items-start mb-12">
                    <div>
                      <span className="text-[10px] tracking-[0.3em] text-[#d4a373] uppercase font-semibold">
                        JIDNY PRIVÉ
                      </span>
                      <h3 className="text-base font-light tracking-wider text-white mt-1">
                        Evelyn Sterling
                      </h3>
                    </div>
                    <Sparkles size={18} className="text-[#d4a373]" />
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[9px] tracking-widest text-white/40 uppercase">MEMBER NO</p>
                      <p className="text-xs font-mono tracking-wider text-white mt-0.5">AP-2026-99120</p>
                    </div>
                    <div>
                      <p className="text-[9px] tracking-widest text-white/40 uppercase text-right">TIER</p>
                      <p className="text-xs font-medium tracking-widest text-[#d4a373] mt-0.5 text-right">GOLD ATELIER</p>
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="space-y-4">
                  <h3 className="text-[11px] font-semibold tracking-[0.2em] text-[#d4a373] uppercase">
                    GOLD ATELIER PRIVILEGES
                  </h3>
                  <div className="space-y-3">
                    <div className="flex gap-3 text-xs">
                      <span className="text-[#d4a373] font-bold">✓</span>
                      <p className="text-white/70 leading-relaxed">
                        Complimentary bespoke engraving on eligible precious metal cuffs and bands.
                      </p>
                    </div>
                    <div className="flex gap-3 text-xs">
                      <span className="text-[#d4a373] font-bold">✓</span>
                      <p className="text-white/70 leading-relaxed">
                        Priority access to high-jewelry drops, private capsule drops, and new model collections.
                      </p>
                    </div>
                    <div className="flex gap-3 text-xs">
                      <span className="text-[#d4a373] font-bold">✓</span>
                      <p className="text-white/70 leading-relaxed">
                        24/7 dedicated concierge service and personalized hand-packaging.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Campaign Offer */}
                <div className="bg-[#d4a373]/10 border border-[#d4a373]/20 rounded-xl p-5 text-center">
                  <span className="text-[10px] font-bold tracking-[0.2em] text-[#d4a373] uppercase block mb-1">
                    EXCLUSIVE SEASON OFFER
                  </span>
                  <p className="text-xs text-white/90 leading-relaxed max-w-xs mx-auto">
                    Receive a complimentary travel jewelry storage portfolio on orders of $250 or more.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* E. Mobile Nav Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-nav-panel"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-50 bg-[#0d0d0d] p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-16">
                <span className="font-display text-xl tracking-[0.25em] text-[#f5f5f5]">
                  {viewMode === 'aurelia' ? 'JIDNY' : 'JIDNY COUTURE'}
                </span>
                <button
                  id="close-mobile-menu-btn"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 text-white/60 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col gap-6 text-lg font-light tracking-[0.2em] text-white">
                <button
                  onClick={() => {
                    openShopCategory('all');
                    setShopSortOption('rating-desc');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left py-2 border-b border-white/5"
                >
                  BEST SELLERS
                </button>
                <button
                  onClick={() => {
                    openShopCategory('all');
                    setShopSortOption('alpha-asc');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left py-2 border-b border-white/5 text-[#d4a373]"
                >
                  NEW ARRIVALS
                </button>
                <button
                  onClick={() => {
                    openShopCategory('earrings');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left py-2 border-b border-white/5"
                >
                  EARRINGS
                </button>
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-white/15">
              <div className="flex justify-around items-center text-white/60 text-sm">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsSearchOpen(true);
                  }}
                  className="flex items-center gap-2"
                >
                  <Search size={16} /> Search
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsWishlistOpen(true);
                  }}
                  className="flex items-center gap-2"
                >
                  <Heart size={16} /> Favorites
                </button>
              </div>
              <p className="text-center text-[10px] tracking-widest text-white/30">
                JIDNY FASHION COUTURE © 2026
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* F. Product Details Page (Full-Screen Elegant Light-Themed Overlay - Disabled in favor of Inline View) */}
      <AnimatePresence>
        {false && selectedProduct && (
          <div className="fixed inset-0 z-50 bg-white overflow-y-auto text-neutral-900 font-sans">
            
            {/* Top Navigation / Close Bar */}
            <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-neutral-100 z-50">
              <div className="max-w-[1600px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
                
                {/* Brand Logo inside Details Page */}
                <span className="font-display text-sm font-semibold tracking-[0.25em] text-neutral-900">
                  {viewMode === 'aurelia' ? 'JIDNY' : 'JIDNY COUTURE'}
                </span>

                {/* Close Button */}
                <button
                  id="close-product-page-btn"
                  onClick={() => setSelectedProduct(null)}
                  className="flex items-center gap-2 text-neutral-500 hover:text-black transition-colors"
                >
                  <span className="text-[10px] font-bold tracking-widest uppercase">BACK TO BOUTIQUE</span>
                  <X size={16} strokeWidth={2} />
                </button>

              </div>
            </div>

            {/* Main Content Container */}
            <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-10">
              
              {/* Breadcrumbs */}
              <div className="flex items-center gap-2 text-[10px] sm:text-xs font-semibold tracking-wider text-neutral-400 mb-8 uppercase">
                <button onClick={() => setSelectedProduct(null)} className="hover:text-black transition-colors">
                  Home
                </button>
                <span className="text-neutral-300">/</span>
                <button onClick={() => setSelectedProduct(null)} className="hover:text-black transition-colors">
                  Best Sellers
                </button>
                <span className="text-neutral-300">/</span>
                <span className="text-neutral-900">{selectedProduct.name}</span>
              </div>

              {/* Product Info Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">
                
                {/* Left Side: Image Gallery */}
                <div className="lg:col-span-7 flex flex-col md:flex-row gap-4 md:gap-6">
                  
                  {/* Thumbnails Column (Left of Main Image) */}
                  <div className="flex md:flex-col flex-row gap-3 order-2 md:order-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
                    {[
                      selectedProduct.image,
                      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600&h=600',
                      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600&h=600',
                      'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=600&h=600',
                      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=600&h=600'
                    ].map((thumbUrl, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveDetailThumbnail(idx)}
                        className={`w-16 h-20 md:w-20 md:h-24 flex-shrink-0 bg-neutral-50 border overflow-hidden transition-all ${
                          activeDetailThumbnail === idx
                            ? 'border-black ring-1 ring-black'
                            : 'border-neutral-200 hover:border-neutral-400'
                        }`}
                      >
                        <img
                          src={thumbUrl}
                          alt={`Thumbnail ${idx + 1}`}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>

                  {/* Main Display Image - Cap height at 500px, keep aspect ratio square and extremely neat */}
                  <div className="flex-1 order-1 md:order-2 aspect-square max-h-[500px] bg-neutral-50 overflow-hidden relative border border-neutral-100 rounded-lg">
                    <img
                      src={[
                        selectedProduct.image,
                        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600&h=600',
                        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600&h=600',
                        'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=600&h=600',
                        'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=600&h=600'
                      ][activeDetailThumbnail]}
                      alt={selectedProduct.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover select-none"
                    />
                    
                    {selectedProduct.isBestSeller && (
                      <span className="absolute top-4 left-4 bg-black text-white text-[9px] font-bold tracking-widest px-3 py-1.5 uppercase">
                        BEST SELLER
                      </span>
                    )}
                  </div>

                </div>

                {/* Right Side: Product Details & Controls */}
                <div className="lg:col-span-5 flex flex-col text-left">
                  
                  {/* Title */}
                  <h1 className="text-xl md:text-2xl font-bold tracking-[0.05em] text-[#111111] uppercase mb-2">
                    {selectedProduct.name}
                  </h1>

                  {/* Price */}
                  <p className="text-lg font-semibold text-neutral-900 mb-8">
                    ${selectedProduct.price.toFixed(2)}
                  </p>

                  {/* Color Selector */}
                  <div className="mb-8">
                    <span className="text-[10px] font-bold tracking-[0.15em] text-neutral-500 uppercase block mb-3">
                      COLOR: {detailSelectedMaterial.toUpperCase()}
                    </span>
                    <div className="flex gap-3">
                      {selectedProduct.materials.map((material) => {
                        let colorClass = 'bg-[#f3dfa2]'; // Gold default
                        if (material.toLowerCase().includes('white') || material.toLowerCase().includes('silver') || material.toLowerCase().includes('sterling')) {
                          colorClass = 'bg-[#e5e7eb]';
                        } else if (material.toLowerCase().includes('rose')) {
                          colorClass = 'bg-[#f5d6cd]';
                        }
                        return (
                          <button
                            key={material}
                            onClick={() => setDetailSelectedMaterial(material)}
                            title={material}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                              detailSelectedMaterial === material
                                ? 'ring-1 ring-black ring-offset-2 scale-105'
                                : 'border border-neutral-200 hover:scale-105'
                            }`}
                          >
                            <span className={`w-6 h-6 rounded-full ${colorClass} block`} />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Stone Size Selector */}
                  <div className="mb-8">
                    <span className="text-[10px] font-bold tracking-[0.15em] text-neutral-500 uppercase block mb-3">
                      STONE SIZE
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {['3-PACK (ALL SIZES)', '2 MM', '3 MM', '4 MM'].map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedStoneSize(size)}
                          className={`px-4 py-2 text-[10px] font-bold tracking-wider transition-all border rounded-md ${
                            selectedStoneSize === size
                              ? 'bg-[#1e2d30] text-white border-[#1e2d30]'
                              : 'bg-white text-neutral-700 border-neutral-200 hover:border-black'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="flex items-center gap-2 text-[11px] text-neutral-500 mb-8 italic">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    <span>In-stock & ready to ship</span>
                  </div>

                  {/* Add To Cart & Wishlist Actions */}
                  <div className="flex gap-3 mb-12">
                    <button
                      onClick={() => {
                        addToCart(selectedProduct, detailSelectedMaterial);
                      }}
                      className="flex-1 py-4 bg-[#1e2d30] hover:bg-black text-white text-[11px] font-bold tracking-[0.25em] uppercase transition-all duration-300 rounded-lg"
                    >
                      ADD TO CART
                    </button>
                    <button
                      onClick={() => toggleWishlist(selectedProduct)}
                      className="p-4 border border-neutral-200 hover:border-black transition-colors flex items-center justify-center rounded-lg"
                      aria-label="Save to Wishlist"
                    >
                      <Heart
                        size={18}
                        strokeWidth={1.5}
                        className={
                          wishlist.some((p) => p.id === selectedProduct.id)
                            ? 'fill-black text-black'
                            : 'text-neutral-500 hover:text-black'
                        }
                      />
                    </button>
                  </div>

                  {/* Specs & Materials Description */}
                  <div className="border-t border-neutral-100 pt-8 text-xs text-neutral-600 leading-relaxed space-y-4">
                    <p>
                      Look gorgeous even when sleeping with our new Must-have Screw Back earrings. These Cubic Zirconia Screw Back Studs are breathtakingly worn solo or as part of an earring stack.
                    </p>
                    <div>
                      <p className="font-bold text-neutral-900 mb-1">Materials:</p>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>14K yellow, rose or white gold plated.</li>
                        <li>Measurements: Studs of 2mm, 3mm, and 4mm.</li>
                        <li>These small stud earrings are Crafted with a S925 post that screws into our flat back disc.</li>
                      </ul>
                    </div>
                  </div>

                </div>

              </div>

              {/* YOU MAY ALSO LIKE Section */}
              <div className="border-t border-neutral-100 mt-20 pt-16">
                
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xs sm:text-sm font-bold tracking-[0.2em] text-[#111111] uppercase">
                    YOU MAY ALSO LIKE
                  </h3>
                  <div className="flex gap-1">
                    <button className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-400 hover:text-black hover:border-neutral-300 transition-all text-xs">
                      ←
                    </button>
                    <button className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-400 hover:text-black hover:border-neutral-300 transition-all text-xs">
                      →
                    </button>
                  </div>
                </div>

                {/* 4 Cards Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { id: 'pair-1', name: 'Tiny Star Flat Back Studs', price: 12.95, img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=400&h=400' },
                    { id: 'pair-2', name: 'Small Crystal Screw Back Stud', price: 11.95, img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=400&h=400' },
                    { id: 'pair-3', name: 'Small Sphere Screw Back Stud', price: 11.95, img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=400&h=400' },
                    { id: 'pair-4', name: 'Tear Screw Back Stud', price: 12.95, img: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=400&h=400' }
                  ].map((item) => {
                    const isWishlisted = wishlist.some((p) => p.id === item.id);
                    return (
                      <div
                        key={item.id}
                        className="group flex flex-col cursor-pointer text-left relative"
                        onClick={() => {
                          const product = PRODUCTS.find((p) => p.id === item.id);
                          if (product) setSelectedProduct(product);
                        }}
                      >
                        {/* Image Container */}
                        <div className="aspect-[4/5] bg-neutral-50 overflow-hidden mb-3 relative border border-neutral-100 rounded-md">
                          <img
                            src={item.img}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          
                          {/* Wishlist Button with no background and filled with color black when saved */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const product = PRODUCTS.find((p) => p.id === item.id);
                              if (product) toggleWishlist(product);
                            }}
                            className="absolute top-3 right-3 text-neutral-500 hover:text-black transition-all"
                            aria-label="Add to favorites"
                          >
                            <Heart
                              size={16}
                              strokeWidth={1.5}
                              className={isWishlisted ? 'fill-black text-black' : 'text-neutral-500 hover:text-black'}
                            />
                          </button>
                        </div>

                        {/* Text details */}
                        <span className="text-[9px] font-semibold text-neutral-400 tracking-widest uppercase block">
                          YELLOW GOLD
                        </span>
                        <h4 className="text-[11px] font-bold tracking-wide text-neutral-900 mt-1 leading-tight group-hover:text-black group-hover:underline transition-colors line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="text-[11px] font-semibold text-neutral-600 mt-1">
                          ${item.price.toFixed(2)}
                        </p>

                        {/* Color indicators */}
                        <div className="flex gap-1 mt-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#f3dfa2]" />
                          <span className="w-2.5 h-2.5 rounded-full bg-[#e5e7eb]" />
                          <span className="w-2.5 h-2.5 rounded-full bg-[#f5d6cd]" />
                        </div>

                      </div>
                    );
                  })}
                </div>

              </div>

            </div>
          </div>
        )}
      </AnimatePresence>

      {/* --- QUICK ADD SPECIFIC MODAL (SHARP CORNERS, LIGHT CLEAN DESIGN) --- */}
      <AnimatePresence>
        {quickAddProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setQuickAddProduct(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            {/* Modal Content Frame with strictly sharp corners */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-4xl bg-white rounded-none overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-10 flex flex-col md:flex-row"
            >
              {/* Close Button on top right */}
              <button
                onClick={() => setQuickAddProduct(null)}
                className="absolute top-6 right-6 text-neutral-400 hover:text-black transition-colors z-20"
                aria-label="Close modal"
              >
                <X size={20} strokeWidth={1.5} />
              </button>

              {/* Left Side: Product Image Display with sharp corners */}
              <div className="w-full md:w-[55%] bg-[#f5f5f5] flex items-center justify-center relative min-h-[320px] md:min-h-[480px]">
                <img
                  src={quickAddProduct.image}
                  alt={quickAddProduct.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-none select-none"
                />

                {/* Left/Right Carousel buttons inside image box */}
                <div className="absolute bottom-6 right-6 flex items-center gap-1 bg-white/40 backdrop-blur-md rounded-full p-1 border border-black/5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickAddPrev();
                    }}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-black/70 hover:text-black hover:bg-black/5 transition-all text-sm font-light"
                    aria-label="Previous product"
                  >
                    ←
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickAddNext();
                    }}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-black/70 hover:text-black hover:bg-black/5 transition-all text-sm font-light"
                    aria-label="Next product"
                  >
                    →
                  </button>
                </div>
              </div>

              {/* Right Side: Product Customizations, clean and light layout */}
              <div className="w-full md:w-[45%] p-8 md:p-12 flex flex-col justify-center bg-white text-left">
                <div>
                  {/* Product Title */}
                  <h3 className="font-sans text-lg md:text-xl font-bold tracking-[0.05em] text-[#111111] leading-tight uppercase">
                    {quickAddProduct.name}
                  </h3>

                  {/* Price */}
                  <div className="text-base font-medium text-neutral-900 mt-2">
                    ${quickAddProduct.price.toFixed(2)}
                  </div>

                  {/* COLOR Selector */}
                  <div className="mt-8">
                    <span className="text-[10px] text-neutral-500 font-bold tracking-[0.15em] uppercase block mb-3">
                      COLOR: {quickAddSelectedMaterial}
                    </span>
                    <div className="flex items-center gap-3">
                      {quickAddProduct.materials.map((material, mIdx) => {
                        let colorClass = 'bg-[#e5c158]'; // Yellow Gold default
                        if (material.toLowerCase().includes('white') || material.toLowerCase().includes('silver') || material.toLowerCase().includes('sterling')) {
                          colorClass = 'bg-[#d1d5db]';
                        } else if (material.toLowerCase().includes('rose')) {
                          colorClass = 'bg-[#e2a899]';
                        }
                        
                        const isSelected = quickAddSelectedMaterial === material;
                        
                        return (
                          <button
                            key={mIdx}
                            title={material}
                            onClick={() => setQuickAddSelectedMaterial(material)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                              isSelected ? 'ring-1 ring-black ring-offset-2 scale-105' : 'border border-neutral-200 hover:scale-105'
                            }`}
                          >
                            <div className={`w-6 h-6 rounded-full ${colorClass}`} />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* SIZE Selector */}
                  <div className="mt-8">
                    <span className="text-[10px] text-neutral-500 font-bold tracking-[0.15em] uppercase block mb-3">
                      SIZE
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {quickAddSizes.map((size) => {
                        const isSelected = quickAddSelectedSize === size;
                        return (
                          <button
                            key={size}
                            onClick={() => setQuickAddSelectedSize(size)}
                            className={`px-5 py-2.5 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all ${
                              isSelected
                                ? 'bg-[#2d3e40] text-white border border-[#2d3e40]'
                                : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-400'
                            }`}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Stock Status Notification */}
                <p className="text-[11px] text-neutral-400 mt-8 mb-3 text-center">
                  In-stock & ready to ship
                </p>

                {/* Add to Bag and Wishlist Controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      addToCart(quickAddProduct, quickAddSelectedMaterial);
                      setQuickAddProduct(null);
                      setIsCartOpen(true);
                    }}
                    className="flex-1 py-3.5 bg-[#2d3e40] hover:bg-[#1e2a2c] text-white text-[11px] font-bold tracking-[0.2em] uppercase rounded-full transition-colors flex items-center justify-center"
                  >
                    ADD TO CART
                  </button>

                  <button
                    onClick={() => toggleWishlist(quickAddProduct)}
                    className="w-12 h-12 rounded-full border border-neutral-200 hover:border-neutral-400 flex items-center justify-center text-neutral-800 hover:bg-neutral-50 transition-colors shrink-0 animate-none"
                    aria-label="Add to wishlist"
                  >
                    <Heart
                      size={16}
                      className={wishlist.some((p) => p.id === quickAddProduct.id) ? 'fill-black text-black' : 'text-neutral-700'}
                    />
                  </button>
                </div>

                {/* Full Details link */}
                <div className="text-center mt-6">
                  <button
                    onClick={() => {
                      setSelectedProduct(quickAddProduct);
                      setQuickAddProduct(null);
                    }}
                    className="inline-block text-[10px] font-bold tracking-[0.2em] text-[#111111] uppercase border-b border-[#111111] pb-0.5 hover:text-neutral-500 hover:border-neutral-400 transition-colors"
                  >
                    VIEW FULL DETAILS
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* G. Floating Settings Panel Drawer (Designer Controls) */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            {/* Slide Panel */}
            <motion.div
              id="settings-panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-[#121212]/95 backdrop-blur-xl border-l border-white/5 p-6 sm:p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-6">
                  <div className="flex items-center gap-2 text-[#d4a373]">
                    <Sliders size={16} />
                    <h2 className="text-xs font-bold tracking-[0.25em] uppercase text-white">
                      DESIGNER CONTROLS
                    </h2>
                  </div>
                  <button
                    id="close-settings-panel"
                    onClick={() => setIsSettingsOpen(false)}
                    className="p-1 text-white/50 hover:text-white transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <p className="text-[11px] text-white/50 leading-relaxed tracking-wide mb-6">
                  Experience this premium website hero section in different visual layouts and contrast ratios. Perfect for viewing either style accurately.
                </p>

                <div className="space-y-6">
                  {/* Campaign Theme Mode */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-semibold tracking-wider text-[#d4a373] uppercase block">
                      CAMPAGIN BRAND & LAYOUT:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setViewMode('aurelia')}
                        className={`py-3 px-4 border rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all duration-300 flex flex-col items-center gap-1.5 ${
                          viewMode === 'aurelia'
                            ? 'bg-[#f5f5f5] text-black border-white'
                            : 'bg-transparent text-white/60 border-white/5 hover:border-white/20'
                        }`}
                      >
                        <span>Jidny Mode</span>
                        <span className="text-[8px] font-light tracking-wide opacity-80">(Left Aligned)</span>
                      </button>
                      <button
                        onClick={() => setViewMode('pavoi')}
                        className={`py-3 px-4 border rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all duration-300 flex flex-col items-center gap-1.5 ${
                          viewMode === 'pavoi'
                            ? 'bg-[#f5f5f5] text-black border-white'
                            : 'bg-transparent text-white/60 border-white/5 hover:border-white/20'
                        }`}
                      >
                        <span>Couture Mode</span>
                        <span className="text-[8px] font-light tracking-wide opacity-80">(Centered Slogan)</span>
                      </button>
                    </div>
                  </div>

                  {/* Overlay Opacity Slider */}
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center text-[10px] font-semibold tracking-wider text-[#d4a373]">
                      <span className="uppercase">Contrast Tint Opacity:</span>
                      <span className="font-mono text-white bg-white/10 px-1.5 py-0.5 rounded">
                        {settings.overlayOpacity}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="70"
                      step="5"
                      value={settings.overlayOpacity}
                      onChange={(e) =>
                        setSettings({ ...settings, overlayOpacity: parseInt(e.target.value) })
                      }
                      className="w-full accent-[#d4a373] h-1 bg-white/10 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[8px] text-white/40 tracking-wider uppercase">
                      <span>Bright (0%)</span>
                      <span>Mid Tint (35%)</span>
                      <span>Moody Tint (70%)</span>
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <span className="text-[10px] font-semibold tracking-wider text-[#d4a373] uppercase block">
                      AESTHETIC LAYOUT DETAILS:
                    </span>
                    
                    {/* Glassmorphic Navbar */}
                    <label className="flex items-center justify-between cursor-pointer group">
                      <span className="text-xs text-white/80 group-hover:text-white transition-colors">
                        Glassmorphic Header Blur
                      </span>
                      <input
                        type="checkbox"
                        checked={settings.blurNavbar}
                        onChange={(e) => setSettings({ ...settings, blurNavbar: e.target.checked })}
                        className="rounded bg-black border-white/10 text-[#d4a373] focus:ring-0 cursor-pointer h-4 w-4"
                      />
                    </label>

                    {/* Entrance animations */}
                    <label className="flex items-center justify-between cursor-pointer group">
                      <span className="text-xs text-white/80 group-hover:text-white transition-colors">
                        Slow Entrance Animations
                      </span>
                      <input
                        type="checkbox"
                        checked={settings.animateEntrance}
                        onChange={(e) =>
                          setSettings({ ...settings, animateEntrance: e.target.checked })
                        }
                        className="rounded bg-black border-white/10 text-[#d4a373] focus:ring-0 cursor-pointer h-4 w-4"
                      />
                    </label>

                    {/* Background Ken Burns */}
                    <label className="flex items-center justify-between cursor-pointer group">
                      <span className="text-xs text-white/80 group-hover:text-white transition-colors">
                        Cinematic Background Motion
                      </span>
                      <input
                        type="checkbox"
                        checked={settings.zoomBackground}
                        onChange={(e) =>
                          setSettings({ ...settings, zoomBackground: e.target.checked })
                        }
                        className="rounded bg-black border-white/10 text-[#d4a373] focus:ring-0 cursor-pointer h-4 w-4"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-white/10">
                <button
                  onClick={() => {
                    setSettings({
                      overlayOpacity: 20,
                      blurNavbar: true,
                      animateEntrance: true,
                      zoomBackground: true
                    });
                    setViewMode('aurelia');
                  }}
                  className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white text-[10px] font-bold tracking-widest uppercase transition-colors rounded-xl"
                >
                  RESET TO ARCHITECTURAL DEFAULTS
                </button>
                <p className="text-center text-[9px] text-white/30 tracking-wider">
                  CREATED FOR INTUITIVE REVIEW • JIDNY v2.6
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* H. Interactive Sliding Boutique Panel (Triggers when user clicks navbar links) */}
      <AnimatePresence>
        {showCategoryOverlay && (
          <div className="fixed inset-x-0 top-0 bottom-0 lg:bottom-auto lg:h-[450px] z-30">
            {/* Backdrop for clickout */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCategoryOverlay(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
            />
            
            {/* Content Drawer Dropdown */}
            <motion.div
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 120 }}
              className="absolute inset-x-0 top-0 bg-[#0d0d0d] border-b border-white/10 pt-24 pb-8 px-6 sm:px-12 max-h-screen overflow-y-auto"
            >
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/5 pb-4 mb-6">
                  <div>
                    <span className="text-[9px] tracking-[0.25em] text-[#d4a373] font-bold uppercase">
                      JIDNY BOUTIQUE
                    </span>
                    <h2 className="text-sm font-semibold tracking-[0.15em] text-white uppercase mt-0.5">
                      {activeCategory === 'all' ? 'THE FULL CAMPAIGN COLLECTION' : `${activeCategory} COLLECTION`}
                    </h2>
                  </div>
                  
                  {/* Category Pill Filters inside panel */}
                  <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-3 py-1 text-[10px] font-semibold tracking-wider uppercase transition-all duration-300 rounded-full border ${
                          activeCategory === cat.id
                            ? 'bg-[#d4a373] text-black border-[#d4a373]'
                            : 'bg-transparent text-white/50 border-white/10 hover:border-white/30 hover:text-white'
                        }`}
                      >
                        {cat.label.replace('COLLECTIONS', '').trim()}
                      </button>
                    ))}
                    <button
                      onClick={() => setShowCategoryOverlay(false)}
                      className="p-1 text-white/50 hover:text-white transition-colors sm:ml-4 flex items-center gap-1.5 text-[10px]"
                    >
                      <X size={14} /> CLOSE
                    </button>
                  </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="group bg-white/5 border border-white/5 hover:border-white/20 rounded-xl p-3 flex flex-col justify-between transition-all duration-300 cursor-pointer"
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowCategoryOverlay(false);
                      }}
                    >
                      <div className="relative aspect-square w-full rounded-lg overflow-hidden mb-3 bg-neutral-900">
                        <img
                          src={product.image}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {product.isNew && (
                          <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-[#d4a373] text-[8px] font-bold tracking-widest px-2 py-0.5 border border-[#d4a373]/30 uppercase rounded-full">
                            NEW
                          </span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product);
                          }}
                          className="absolute top-2 right-2 p-1.5 bg-black/40 hover:bg-black/80 rounded-full text-white hover:text-red-400 transition-colors"
                        >
                          <Heart size={12} className={wishlist.some(p => p.id === product.id) ? "fill-[#e63946] text-[#e63946]" : ""} />
                        </button>
                      </div>
                      
                      <div>
                        <h4 className="text-[11px] font-medium text-white tracking-wide truncate group-hover:text-[#d4a373] transition-colors">
                          {product.name}
                        </h4>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs font-semibold text-[#d4a373]">
                            ${product.price}.00
                          </span>
                          <span className="text-[9px] text-white/40 tracking-wider">
                            ★ {product.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
