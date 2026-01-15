
import React, { useState, useMemo } from 'react';
import { Product, Review } from '../types';

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Mobile UI Master Kit',
    description: 'Complete design system with 200+ components for React Native and Figma. Includes dark mode support, accessible components, and full documentation for seamless handoff.',
    price: 49.00,
    category: 'UI Kits',
    image: 'https://picsum.photos/seed/ui/800/500',
    rating: 4.9,
    reviews: 124,
    isNew: true
  },
  {
    id: '2',
    title: 'SaaS Growth Blueprint',
    description: 'A 120-page comprehensive guide on scaling your digital products and services. Covers customer acquisition, retention strategies, and pricing optimization.',
    price: 19.00,
    category: 'PDF Guides',
    image: 'https://picsum.photos/seed/book/800/500',
    rating: 4.8,
    reviews: 89
  },
  {
    id: '3',
    title: 'Stellar Icon Set Vol. 1',
    description: '500+ handcrafted vector icons for modern web and mobile applications. Available in SVG, PNG, and Figma formats with multiple stroke weights.',
    price: 25.00,
    category: 'Icons',
    image: 'https://picsum.photos/seed/icons/800/500',
    rating: 5.0,
    reviews: 42
  },
  {
    id: '4',
    title: 'Neo Admin Dashboard',
    description: 'High-performance React dashboard with real-time charts and secure authentication modules.',
    price: 79.00,
    category: 'Software',
    image: 'https://picsum.photos/seed/admin/800/500',
    rating: 4.7,
    reviews: 12
  }
];

const MOCK_REVIEWS: Review[] = [
  { id: 'r1', productId: '1', userName: 'Sarah Jenkins', rating: 5, comment: 'Absolutely saved my team weeks of work. The components are pixel-perfect!', date: '2 days ago', isVerified: true, userImage: 'https://i.pravatar.cc/150?u=sarah' },
  { id: 'r2', productId: '1', userName: 'Marcus Thorne', rating: 4, comment: 'Great library, would love more navigation patterns in the next update.', date: '1 week ago', isVerified: true, userImage: 'https://i.pravatar.cc/150?u=marcus' },
  { id: 'r3', productId: '2', userName: 'Lena Rivers', rating: 5, comment: 'The pricing chapter alone is worth the entire price. Insightful.', date: '3 days ago', isVerified: true, userImage: 'https://i.pravatar.cc/150?u=lena' },
];

const CATEGORIES = ['All Assets', 'UI Kits', 'PDF Guides', 'Figma Files', 'Software', 'Icons', 'Design Assets'];

interface MarketplaceProps {
  onAddToCart?: () => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ onAddToCart }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Assets');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [minRating, setMinRating] = useState<number>(0);
  const [showFilters, setShowFilters] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [allReviews, setAllReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [expandedReviewsId, setExpandedReviewsId] = useState<string | null>(null);
  
  // Simulated purchased products to allow reviewing
  const [purchasedProductIds, setPurchasedProductIds] = useState<Set<string>>(new Set(['1']));
  
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(0);

  const handleProductView = (product: Product) => {
    setQuickViewProduct(product);
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      return [product, ...filtered].slice(0, 5);
    });
  };

  const getProductReviews = (productId: string) => {
    return allReviews.filter(r => r.productId === productId);
  };

  const calculateAvgRating = (productId: string, initialRating: number) => {
    const reviews = getProductReviews(productId);
    if (reviews.length === 0) return initialRating;
    const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    return Number((sum / reviews.length).toFixed(1));
  };

  const handleAddReview = (productId: string) => {
    if (!newReviewComment || newReviewRating === 0) return;
    
    const newReview: Review = {
      id: Math.random().toString(36).substr(2, 9),
      productId,
      userName: 'Alex Rivera',
      rating: newReviewRating,
      comment: newReviewComment,
      date: 'Just now',
      isVerified: true,
      userImage: 'https://picsum.photos/seed/alex/100/100'
    };

    setAllReviews([newReview, ...allReviews]);
    setNewReviewComment('');
    setNewReviewRating(0);
  };

  const handleBuy = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    setPurchasedProductIds(prev => new Set(prev).add(productId));
    alert("Simulated Purchase Successful! You can now review this product.");
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) onAddToCart();
  };

  const filteredProducts = useMemo(() => {
    return INITIAL_PRODUCTS.filter(p => {
      const currentRating = calculateAvgRating(p.id, p.rating);
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All Assets' || p.category === selectedCategory;
      const matchesPrice = p.price >= minPrice && p.price <= maxPrice;
      const matchesRating = currentRating >= minRating;
      
      return matchesSearch && matchesCategory && matchesPrice && matchesRating;
    });
  }, [searchQuery, selectedCategory, minPrice, maxPrice, minRating, allReviews]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All Assets');
    setMinPrice(0);
    setMaxPrice(1000);
    setMinRating(0);
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8 relative">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Header Filters */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-2 lg:pb-0">
              {CATEGORIES.map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 h-10 flex items-center justify-center rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat 
                      ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1 lg:w-80">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search assets..." 
                  className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-primary shadow-sm"
                />
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2.5 rounded-xl border transition-all flex items-center gap-2 font-bold text-xs uppercase tracking-widest ${
                  showFilters ? 'bg-primary border-primary text-white' : 'bg-white dark:bg-slate-900 text-slate-600'
                }`}
              >
                <span className="material-symbols-outlined text-lg">tune</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 py-4 border-y border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Min Rating</span>
            <div className="flex gap-2">
              {[0, 3, 4, 5].map((r) => (
                <button 
                  key={r}
                  onClick={() => setMinRating(r)}
                  className={`px-4 h-9 rounded-xl border font-bold text-xs transition-all ${
                    minRating === r ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white dark:bg-slate-900 text-slate-500'
                  }`}
                >
                  {r === 0 ? 'All' : `${r}★+`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-20">
          {filteredProducts.map((product) => {
            const currentRating = calculateAvgRating(product.id, product.rating);
            const reviews = getProductReviews(product.id);
            const reviewCount = reviews.length || product.reviews;
            const isExpanded = expandedReviewsId === product.id;
            const isPurchased = purchasedProductIds.has(product.id);
            
            return (
              <div 
                key={product.id}
                onClick={() => handleProductView(product)}
                className={`group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all cursor-pointer flex flex-col ${isExpanded ? 'ring-2 ring-primary/20' : ''}`}
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={product.image} alt={product.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                  
                  {/* Subtle Add to Cart Button - prominent on hover */}
                  <button 
                    onClick={handleAddToCartClick}
                    className="absolute top-3 right-3 size-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl flex items-center justify-center text-slate-400 opacity-0 group-hover:opacity-100 hover:text-primary hover:scale-110 transition-all shadow-lg z-10"
                    title="Add to Cart"
                  >
                    <span className="material-symbols-outlined text-xl">add_shopping_cart</span>
                  </button>

                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-[11px] font-black flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px] text-amber-400 fill-1">star</span>
                    {currentRating}
                  </div>
                  <div className="absolute top-3 left-3 bg-primary/90 text-white px-2 py-1 rounded text-[10px] font-black uppercase">
                    {product.category}
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white truncate">{product.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">{product.description}</p>
                  
                  <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-xl font-black text-slate-900 dark:text-white">${product.price.toFixed(2)}</span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedReviewsId(isExpanded ? null : product.id);
                        }}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isExpanded ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                      >
                        <span className="material-symbols-outlined text-sm">chat_bubble</span>
                        {reviewCount}
                      </button>
                      <button 
                        onClick={(e) => handleBuy(e, product.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold shadow-lg transition-all ${isPurchased ? 'bg-emerald-500 text-white' : 'bg-primary text-white shadow-primary/20'}`}
                      >
                        {isPurchased ? 'Purchased' : 'Buy Now'}
                      </button>
                    </div>
                  </div>

                  {/* Collapsible Inline Reviews */}
                  {isExpanded && (
                    <div className="mt-6 pt-6 border-t border-slate-50 space-y-4 animate-in slide-in-from-top-4 duration-300" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-between">
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Recent Feedback</h5>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500">
                          <span className="material-symbols-outlined text-xs fill-1">star</span>
                          {currentRating} Avg
                        </div>
                      </div>

                      <div className="space-y-3 max-h-48 overflow-y-auto pr-2 scrollbar-hide">
                        {reviews.length > 0 ? reviews.map(r => (
                          <div key={r.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <img src={r.userImage} className="size-5 rounded-full" alt="" />
                                <span className="text-[10px] font-black">{r.userName}</span>
                              </div>
                              <div className="flex text-amber-400">
                                {[...Array(5)].map((_, i) => (
                                  <span key={i} className={`material-symbols-outlined text-[10px] ${i < r.rating ? 'fill-1' : ''}`}>star</span>
                                ))}
                              </div>
                            </div>
                            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug italic">"{r.comment}"</p>
                          </div>
                        )) : (
                          <p className="text-[10px] text-center text-slate-400 py-4 font-bold">No reviews for this product yet.</p>
                        )}
                      </div>

                      {/* Inline Review Form (Only for Purchased) */}
                      <div className="pt-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                        {isPurchased ? (
                          <div className="space-y-3">
                            <p className="text-[9px] font-black uppercase text-primary tracking-widest">Rate this asset</p>
                            <div className="flex gap-1.5">
                              {[1, 2, 3, 4, 5].map(s => (
                                <button 
                                  key={s} 
                                  onClick={() => setNewReviewRating(s)}
                                  className={`size-8 rounded-lg flex items-center justify-center transition-all ${newReviewRating >= s ? 'bg-amber-100 text-amber-500' : 'bg-white text-slate-300'}`}
                                >
                                  <span className={`material-symbols-outlined text-sm ${newReviewRating >= s ? 'fill-1' : ''}`}>star</span>
                                </button>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <input 
                                type="text" 
                                value={newReviewComment}
                                onChange={(e) => setNewReviewComment(e.target.value)}
                                placeholder="Your thoughts..."
                                className="flex-1 bg-white border-none rounded-lg text-[11px] px-3 py-2 focus:ring-1 focus:ring-primary"
                              />
                              <button 
                                disabled={!newReviewComment || newReviewRating === 0}
                                onClick={() => handleAddReview(product.id)}
                                className="size-8 bg-primary text-white rounded-lg flex items-center justify-center disabled:opacity-30 shadow-md"
                              >
                                <span className="material-symbols-outlined text-sm">send</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-2">
                            <p className="text-[9px] font-black text-slate-400 uppercase leading-relaxed">
                              Purchase this asset to share your review
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <div className="mb-20">
            <h3 className="text-xl font-black mb-8 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">history</span> Recently Viewed
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {recentlyViewed.map(p => (
                <div key={p.id} onClick={() => setQuickViewProduct(p)} className="bg-white dark:bg-slate-900 rounded-xl p-3 border border-slate-100 dark:border-slate-800 cursor-pointer group">
                  <img src={p.image} className="aspect-video object-cover rounded-lg mb-3 group-hover:brightness-90 transition-all" alt="" />
                  <h5 className="text-[11px] font-black truncate">{p.title}</h5>
                  <p className="text-[10px] text-primary font-bold mt-1">${p.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => setQuickViewProduct(null)}></div>
          <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-full max-h-[90vh] animate-in zoom-in-95">
            <button onClick={() => setQuickViewProduct(null)} className="absolute top-6 right-6 z-10 size-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
              <span className="material-symbols-outlined">close</span>
            </button>
            
            <div className="w-full md:w-1/2 overflow-y-auto border-r border-slate-100 dark:border-slate-800">
              <img src={quickViewProduct.image} className="w-full aspect-video object-cover" alt="" />
              <div className="p-10 space-y-8">
                <div>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">{quickViewProduct.category}</span>
                  <h3 className="text-4xl font-black text-slate-900 dark:text-white mt-4">{quickViewProduct.title}</h3>
                  <p className="text-lg text-slate-600 dark:text-slate-400 mt-6 leading-relaxed">{quickViewProduct.description}</p>
                </div>
                <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                   <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Price</p>
                    <span className="text-4xl font-black text-slate-900 dark:text-white">${quickViewProduct.price.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={handleAddToCartClick}
                      className="px-6 h-14 rounded-2xl font-black text-xs uppercase tracking-widest border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined">add_shopping_cart</span>
                      Add
                    </button>
                    <button onClick={(e) => handleBuy(e, quickViewProduct.id)} className={`px-10 h-14 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all ${purchasedProductIds.has(quickViewProduct.id) ? 'bg-emerald-500 text-white' : 'bg-primary text-white shadow-primary/30'}`}>
                      {purchasedProductIds.has(quickViewProduct.id) ? 'Already Purchased' : 'Checkout Now'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2 flex flex-col bg-slate-50 dark:bg-slate-800/20 overflow-hidden">
              <div className="p-8 border-b border-slate-100 dark:border-slate-800">
                <h4 className="text-xl font-black flex items-center gap-2">
                   Reviews <span className="text-sm font-bold text-slate-400">({getProductReviews(quickViewProduct.id).length})</span>
                </h4>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {getProductReviews(quickViewProduct.id).map(review => (
                  <div key={review.id} className="space-y-3 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 animate-in slide-in-from-right-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <img src={review.userImage} className="size-10 rounded-full object-cover" alt="" />
                        <div>
                          <p className="text-sm font-black">{review.userName}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <div className="flex text-amber-400">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={`material-symbols-outlined text-sm ${i < review.rating ? 'fill-1' : ''}`}>star</span>
                              ))}
                            </div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase">{review.date}</span>
                          </div>
                        </div>
                      </div>
                      {review.isVerified && (
                        <span className="text-[9px] font-black uppercase text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded">Verified</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">"{review.comment}"</p>
                  </div>
                ))}

                {getProductReviews(quickViewProduct.id).length === 0 && (
                  <div className="text-center py-10">
                    <span className="material-symbols-outlined text-4xl text-slate-200">reviews</span>
                    <p className="text-slate-400 font-bold mt-2">No reviews yet. Be the first!</p>
                  </div>
                )}
              </div>

              {/* Add Review Form in Modal */}
              <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                {purchasedProductIds.has(quickViewProduct.id) ? (
                  <>
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">Share Your Experience</p>
                    <div className="flex items-center gap-2 mb-4">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button 
                          key={star} 
                          onClick={() => setNewReviewRating(star)}
                          className={`size-10 rounded-xl transition-all flex items-center justify-center ${
                            newReviewRating >= star ? 'bg-amber-100 text-amber-500' : 'bg-slate-50 text-slate-300'
                          }`}
                        >
                          <span className={`material-symbols-outlined ${newReviewRating >= star ? 'fill-1' : ''}`}>star</span>
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <input 
                        type="text" 
                        value={newReviewComment}
                        onChange={(e) => setNewReviewComment(e.target.value)}
                        placeholder="Tell others what you think..." 
                        className="flex-1 px-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary"
                      />
                      <button 
                        disabled={!newReviewComment || newReviewRating === 0}
                        onClick={() => handleAddReview(quickViewProduct.id)}
                        className="size-12 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined">send</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                    <p className="text-xs font-bold text-slate-500">Only verified owners can leave a review.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
