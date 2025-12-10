"use client"

import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { ProductCard } from '../components/ProductCard';
import { ProductModal } from '../components/ProductModal';
import { ChatWidget } from '../components/ChatWidget';
import { AdminDashboard } from '../components/AdminDashboard';
import { CartModal } from '../components/CartModal';
import { Toast } from '../components/Toast';
import { PRODUCTS, DEFAULT_PAYMENT } from '../lib/constants';
import { Product, ViewState, CartItem, PaymentDetails, ToastMessage } from '../lib/types';

function App() {
  // --- STATE ---
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);

  // Inventory State (Persisted in LocalStorage)
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window === 'undefined') return PRODUCTS;
    const saved = localStorage.getItem('fifi_products');
    return saved ? JSON.parse(saved) : PRODUCTS;
  });

  // Category State (Persisted in LocalStorage)
  const [categories, setCategories] = useState<string[]>(() => {
    if (typeof window === 'undefined') return ['Women', 'Men', 'Unisex'];
    const saved = localStorage.getItem('fifi_categories_v2');
    return saved ? JSON.parse(saved) : ['Women', 'Men', 'Unisex'];
  });

  // Shop Filter State
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Payment State (Persisted in LocalStorage)
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>(() => {
    if (typeof window === 'undefined') return DEFAULT_PAYMENT;
    const saved = localStorage.getItem('fifi_payment');
    return saved ? JSON.parse(saved) : DEFAULT_PAYMENT;
  });

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Modal State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Newsletter State
  const [email, setEmail] = useState('');

  // Toast State
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const notify = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ id: Date.now().toString(), message, type });
  };

  // --- EFFECTS ---
  useEffect(() => {
    localStorage.setItem('fifi_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('fifi_categories_v2', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('fifi_payment', JSON.stringify(paymentDetails));
  }, [paymentDetails]);

  // --- ACTIONS ---

  // Product Actions
  const handleAddToCart = (product: Product) => {
    const newItem: CartItem = { ...product, cartId: Date.now().toString() + Math.random() };
    setCartItems(prev => [...prev, newItem]);
    notify(`Added ${product.name} to bag`, 'success');
  };

  const handleRemoveFromCart = (cartId: string) => {
    setCartItems(prev => prev.filter(item => item.cartId !== cartId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const openProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  // Admin Actions
  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
    notify('Product added successfully', 'success');
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    notify('Product updated', 'success');
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    notify('Product deleted', 'info');
  };

  const handleUpdatePayment = (details: PaymentDetails) => {
    setPaymentDetails(details);
    notify('Payment settings saved', 'success');
  };

  const handleAddCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories(prev => [...prev, category]);
      notify(`Category "${category}" added`, 'success');
    }
  };

  const handleDeleteCategory = (category: string) => {
    setCategories(prev => prev.filter(c => c !== category));
    notify(`Category "${category}" removed`, 'info');
  };

  const handleAdminAccess = () => {
    const password = window.prompt("Enter Admin Password (hint: brown)");
    if (password?.toLowerCase() === 'brown') {
      setCurrentView(ViewState.ADMIN);
      notify('Welcome back, Fifi!', 'success');
    } else if (password) {
      notify('Incorrect password', 'error');
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      notify(`Subscribed with ${email}! 🍂`, 'success');
      setEmail('');
    }
  };

  // --- RENDERERS ---

  const renderHome = () => (
    <>
      <Hero onShopNow={() => setCurrentView(ViewState.SHOP)} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-gray-900">Featured Collections</h2>
          <p className="mt-4 text-gray-500">Hand-picked selections crafted for durability and style.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-6">
          {products.slice(0, 3).map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={openProductDetails}
              onAddToCart={handleAddToCart}
              notify={notify}
            />
          ))}
        </div>
      </div>
    </>
  );

  const renderShop = () => {
    const filteredProducts = products.filter(p => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8">All Products</h2>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          {/* Category Filter Pills */}
          <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
            <button
              onClick={() => setActiveCategory('All')}
              className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === 'All'
                ? 'bg-fifi-600 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-fifi-50'
                }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === cat
                  ? 'bg-fifi-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-fifi-50'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search bags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-fifi-500 focus:border-transparent bg-white shadow-sm"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-10 gap-x-6">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={openProductDetails}
                onAddToCart={handleAddToCart}
                notify={notify}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-fifi-50 rounded-xl border border-dashed border-fifi-200">
            <p className="text-fifi-800 text-lg font-serif">No bags found matching your search. 👜</p>
            <button onClick={() => { setActiveCategory('All'); setSearchQuery(''); }} className="mt-4 text-fifi-600 underline hover:text-fifi-800">Clear filters</button>
          </div>
        )}
      </div>
    );
  };

  const renderAbout = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
      <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
        <div className="relative">
          <div className="aspect-w-3 aspect-h-4 rounded-lg overflow-hidden shadow-xl transform hover:scale-[1.01] transition-transform duration-500">
            <img src="https://images.unsplash.com/photo-1590736969955-71cc94801759?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Fifi working" className="object-cover" />
          </div>
        </div>
        <div className="mt-10 lg:mt-0">
          <span className="text-fifi-500 font-bold tracking-wider uppercase text-sm">The Story</span>
          <h2 className="mt-2 text-4xl font-serif font-bold text-gray-900">Meet Fifi</h2>
          <div className="mt-6 prose prose-fifi text-gray-600 text-lg leading-relaxed space-y-4">
            <p>
              Hi! I'm Fifi. My journey began with a love for the natural world and the rich, comforting textures of the earth.
            </p>
            <p>
              FIFI-Bags is a celebration of craftsmanship. I wanted to move away from fast fashion and create durable, beautiful accessories that age gracefully, just like good leather.
            </p>
            <p>
              Every bag you see here is cut, stitched, and finished by me in my studio. I specialize in earthy palettes—rich browns, soft beiges, and deep terracottas.
            </p>
            <div className="py-6">
              <h3 className="text-2xl font-serif font-bold text-fifi-800 mb-4">Follow the Journey</h3>
              <p className="text-sm text-gray-500 mb-4">See behind-the-scenes creation and new drops first!</p>
              <div className="flex space-x-4">
                <a href="https://www.instagram.com/_fifibags?igsh=MThnc3gwOXllZmlvYw==" target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-600 text-white px-6 py-3 rounded-full font-bold shadow-md hover:shadow-lg hover:opacity-90 transition-all">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                  Instagram
                </a>
                <a href="https://www.tiktok.com/@fifi_bags?_r=1&_t=ZS-91xU6omRiSo" target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-bold shadow-md hover:shadow-lg hover:opacity-80 transition-all">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
                  TikTok
                </a>
              </div>
            </div>
            <div className="mt-8">
              <span className="font-handwriting text-3xl text-fifi-600 font-serif italic">Warmly, Fifi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-fifi-50 flex flex-col">
      {/* Navbar hidden in Admin view */}
      {currentView !== ViewState.ADMIN && (
        <Navbar
          currentView={currentView}
          setView={setCurrentView}
          cartCount={cartItems.length}
          onOpenCart={() => setIsCartOpen(true)}
        />
      )}

      <main className="flex-grow">
        {currentView === ViewState.HOME && renderHome()}
        {currentView === ViewState.SHOP && renderShop()}
        {currentView === ViewState.ABOUT && renderAbout()}

        {currentView === ViewState.ADMIN && (
          <AdminDashboard
            products={products}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            categories={categories}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
            paymentDetails={paymentDetails}
            onUpdatePayment={handleUpdatePayment}
            onExit={() => { setCurrentView(ViewState.HOME); notify('Logged out of Admin', 'info'); }}
            notify={notify}
          />
        )}
      </main>

      {/* Footer */}
      {currentView !== ViewState.ADMIN && (
        <footer className="bg-white border-t border-fifi-100">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-serif font-bold text-gray-900 mb-4">About Us</h3>
                <p className="text-gray-500 text-sm">FIFI-Bags creates handcrafted leather and canvas goods inspired by nature's palette. Made with love and built to last.</p>
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-gray-900 mb-4">Links</h3>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li onClick={() => setCurrentView(ViewState.SHOP)} className="cursor-pointer hover:text-fifi-600">Shop Collection</li>
                  <li onClick={() => setCurrentView(ViewState.ABOUT)} className="cursor-pointer hover:text-fifi-600">Our Story</li>
                  <li className="cursor-pointer hover:text-fifi-600">Shipping & Returns</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-gray-900 mb-4">Stay Connected</h3>
                <p className="text-gray-500 text-sm mb-4">Follow us for inspiration.</p>
                <div className="flex space-x-4 mb-4">
                  <a href="https://www.instagram.com/_fifibags?igsh=MThnc3gwOXllZmlvYw==" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-pink-600 transition-colors">
                    <span className="sr-only">Instagram</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                  </a>
                  <a href="https://www.tiktok.com/@fifi_bags?_r=1&_t=ZS-91xU6omRiSo" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-black transition-colors">
                    <span className="sr-only">TikTok</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
                  </a>
                </div>
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-fifi-500"
                    required
                  />
                  <button type="submit" className="bg-fifi-600 text-white px-4 py-2 rounded-md text-sm hover:bg-fifi-700 transition-colors">
                    Join
                  </button>
                </form>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-8 flex justify-between items-center">
              <p className="text-gray-400 text-sm">
                &copy; 2024 FIFI-Bags. Handcrafted in the Studio.
              </p>
              <button
                onClick={handleAdminAccess}
                className="text-2xl cursor-pointer hover:scale-110 transition-transform opacity-50 hover:opacity-100"
                title="Admin Login"
              >
                🤎
              </button>
            </div>
          </div>
        </footer>
      )}

      {/* Toast Notification Container */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Modals */}
      <ProductModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onAddToCart={handleAddToCart}
      />

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveFromCart}
        paymentDetails={paymentDetails}
        onClearCart={handleClearCart}
        notify={notify}
      />

      {/* Chat */}
      {currentView !== ViewState.ADMIN && <ChatWidget products={products} />}
    </div>
  );
}

export default App;