import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Heart, Star, ShoppingCart, Play, Volume2, VolumeX, Sparkles, Zap, Crown, Gift } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { getApiBase } from '../utils/apiBase'
import type { Product } from '../types'

export default function Home() {
  const { user, isAuthenticated } = useAuth()
  const { addItem } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [csvProducts, setCsvProducts] = useState<any[]>([])
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loyaltyPoints, setLoyaltyPoints] = useState(0)
  const [cashbackBalance, setCashbackBalance] = useState(0)
  const [activeDiscounts, setActiveDiscounts] = useState<any[]>([])
  const [personalizedContent, setPersonalizedContent] = useState<any>(null)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isMuted, setIsMuted] = useState(true)

  // Hero slideshow images (rotate every 3 seconds)
  const heroImages = [
    '/IMAGES/BANNER (1).jpg',
    '/IMAGES/BANNER (2).jpg',
    '/IMAGES/BANNER (3).jpg'
  ]
  const [heroIndex, setHeroIndex] = useState(0)
  useEffect(() => {
    const id = window.setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length)
    }, 7000)
    return () => window.clearInterval(id)
  }, [])

  // Promotional banner (appears 3s after landing)
  const [showPromo, setShowPromo] = useState(false)
  const [promoDismissed, setPromoDismissed] = useState(false)
  useEffect(() => {
    const id = window.setTimeout(() => setShowPromo(true), 3000)
    return () => window.clearTimeout(id)
  }, [])

  useEffect(() => {
    fetchProducts()
    fetchCsvProducts()
    fetchVideos()
    if (isAuthenticated && user) {
      fetchUserData()
      fetchPersonalizedContent()
    }
  }, [isAuthenticated, user])

  const fetchCsvProducts = async () => {
    try {
      const apiBase = getApiBase()
      const response = await fetch(`${apiBase}/api/products-csv`)
      if (response.ok) {
        const data = await response.json()
        setCsvProducts(data)
      }
    } catch (error) {
      console.error('Failed to fetch CSV products:', error)
    }
  }

  const fetchProducts = async () => {
    try {
      const apiBase = getApiBase()
      const response = await fetch(`${apiBase}/api/products`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchVideos = async () => {
    try {
      const apiBase = getApiBase()
      const response = await fetch(`${apiBase}/api/videos`)
      if (response.ok) {
        const data = await response.json()
        setVideos(data)
      }
    } catch (error) {
      console.error('Failed to fetch videos:', error)
    }
  }

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const apiBase = getApiBase()
      const profileResponse = await fetch(`${apiBase}/api/users/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (profileResponse.ok) {
        const profileData = await profileResponse.json()
        setLoyaltyPoints(profileData.loyalty_points || 0)
      }

      const cashbackResponse = await fetch(`${apiBase}/api/cashback/balance`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (cashbackResponse.ok) {
        const cashbackData = await cashbackResponse.json()
        setCashbackBalance(cashbackData.balance || 0)
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error)
    }
  }

  const fetchPersonalizedContent = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const apiBase = getApiBase()
      const response = await fetch(`${apiBase}/api/ai-personalization/content`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setPersonalizedContent(data)
      }
    } catch (error) {
      console.error('Failed to fetch personalized content:', error)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const getVideoSize = (index: number): 'small' | 'medium' | 'large' => {
    const sizePattern: ('small' | 'medium' | 'large')[] = ['small', 'medium', 'large', 'medium', 'small']
    return sizePattern[index % sizePattern.length]
  }

  // Helper function to get CSV product data by matching title or SKU
  const getCsvProductData = (product: Product) => {
    return csvProducts.find(csv => 
      csv['Product Name']?.toLowerCase() === product.title?.toLowerCase() ||
      csv['Product Title']?.toLowerCase() === product.title?.toLowerCase() ||
      csv['SKU'] === product.slug
    )
  }

  // Functional handlers for buttons and CTAs
  const handleExploreCollection = () => {
    window.location.hash = '#/shop'
  }

  const handleJoinVIP = () => {
    if (isAuthenticated) {
      window.location.hash = '#/loyalty-rewards'
    } else {
      window.location.hash = '#/login'
    }
  }

  const handleShopNow = () => {
    window.location.hash = '#/shop'
  }

  const handleViewKit = () => {
    window.location.hash = '#/combos'
  }

  const handleAddToCart = (product: Product) => {
    addItem(product, 1)
  }

  const handleBuyNow = (product: Product) => {
    addItem(product, 1)
    window.location.hash = '#/cart'
  }

  const handleAddToWishlist = (product: Product) => {
    // Add wishlist functionality here
    console.log('Added to wishlist:', product.title)
  }

  const handleVideoClick = (video: any) => {
    if (video.redirect_url) {
      window.open(video.redirect_url, '_blank')
    }
  }

  // Dynamically scale videos in the social carousel: center = large, sides = medium/small
  useEffect(() => {
    const scroller = document.getElementById('video-scroller') as HTMLElement | null
    if (!scroller) return

    const updateVideoScales = () => {
      const items = Array.from(scroller.querySelectorAll('.video-item')) as HTMLElement[]
      const scRect = scroller.getBoundingClientRect()
      const scCenter = scRect.width / 2
      items.forEach((el) => {
        const rect = el.getBoundingClientRect()
        const itemCenter = rect.left - scRect.left + rect.width / 2
        const distance = Math.abs(itemCenter - scCenter)
        const max = scRect.width / 2
        const t = Math.min(distance / max, 1) // 0 (center) .. 1 (far)
        // Map: center 1.25 (large), mid ~1.05 (medium), far 0.9 (small)
        const scale = 1.25 - t * 0.35
        el.style.transform = `scale(${scale})`
        el.style.zIndex = String(100 - Math.round(t * 50))
      })
    }

    const onScroll = () => updateVideoScales()
    scroller.addEventListener('scroll', onScroll, { passive: true } as any)
    // Initial pass (delay to ensure layout ready)
    const id = window.setTimeout(updateVideoScales, 50)

    return () => {
      scroller.removeEventListener('scroll', onScroll)
      window.clearTimeout(id)
    }
  }, [videos])

  return (
    <main className="min-h-screen" style={{backgroundColor: '#F4F9F9'}}>
      {/* Sliding Promotional Banner */}
      <div className="relative overflow-hidden">
        <div
          className={`fixed top-1/2 right-0 z-50 transform transition-transform duration-500 ${showPromo && !promoDismissed ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="shadow-xl rounded-l-xl flex items-center gap-4 px-5 py-4"
               style={{backgroundColor: '#1B4965'}}>
            <div className="text-white">
              <div className="text-sm uppercase tracking-wide opacity-90">Limited Offer</div>
              <div className="text-lg font-semibold">Subscribe to get exclusive deals</div>
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2">
              <input
                type="email"
                required
                placeholder="Your email"
                className="h-9 w-56 rounded-md border border-white/30 bg-white/10 px-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button className="h-9 rounded-md bg-white/90 px-4 text-sm font-medium text-black hover:bg-white">
                Subscribe
              </button>
            </form>
            <button
              aria-label="Dismiss"
              onClick={() => setPromoDismissed(true)}
              className="ml-2 h-8 w-8 rounded-full bg-white/20 text-white hover:bg-white/30 flex items-center justify-center"
            >
              ×
              </button>
          </div>
        </div>
      </div>
      {/* Hero Banner Section - Enhanced Colors */}
      <section className="relative py-20" style={{background: 'linear-gradient(135deg, #4B97C9 0%, #D0E8F2 50%, #9DB4C0 100%)'}}>
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <h1 className="text-4xl md:text-6xl font-serif mb-6 text-white">
                ELEVATE YOUR SKIN WITH
            </h1>
              <h2 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-white">
                NATURAL BEAUTY
              </h2>
              <p className="text-lg mb-8 font-light text-white">
                infused with premium natural ingredients
              </p>
              <button
                onClick={handleExploreCollection}
                className="px-8 py-4 text-white font-medium transition-all duration-300 text-sm tracking-wide uppercase shadow-lg"
                style={{backgroundColor: '#1B4965'}}
              >
                SHOP NOW
              </button>
            </div>
            <div className="relative">
              <div className="relative z-10">
                <img 
                  src={heroImages[heroIndex]} 
                  alt="Nefol Hero"
                  className="w-full h-96 object-cover rounded-lg shadow-2xl"
                />
                <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full flex items-center justify-center shadow-lg" style={{backgroundColor: '#1B4965'}}>
                  <span className="text-white text-xs font-bold">NEW</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category - Enhanced Colors */}
      <section className="py-16" style={{backgroundColor: '#D0E8F2'}}>
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif mb-4" style={{color: '#1B4965'}}>
              SHOP BY CATEGORY
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Body */}
            <div className="text-center group cursor-pointer" onClick={() => window.location.hash = '#/body'}>
              <div
                className="mx-auto mb-4 flex items-center justify-center"
                style={{
                  width: '360px',
                  height: '360px',
                  WebkitMaskImage: 'radial-gradient(circle at center, rgba(0,0,0,1) 62%, rgba(0,0,0,0) 100%)',
                  maskImage: 'radial-gradient(circle at center, rgba(0,0,0,1) 62%, rgba(0,0,0,0) 100%)'
                }}
              >
                <img
                  src="/IMAGES/skin_categories.png"
                  alt="Body"
                  className="block w-full h-full object-contain"
                  style={{ filter: 'drop-shadow(0 24px 30px rgba(0,0,0,0.28))' }}
                />
              </div>
              <h3 className="text-sm font-medium tracking-wide" style={{color: '#1B4965'}}>Body</h3>
            </div>

            {/* Face */}
            <div className="text-center group cursor-pointer" onClick={() => window.location.hash = '#/face'}>
              <div
                className="mx-auto mb-4 flex items-center justify-center"
                style={{
                  width: '360px',
                  height: '360px',
                  WebkitMaskImage: 'radial-gradient(circle at center, rgba(0,0,0,1) 62%, rgba(0,0,0,0) 100%)',
                  maskImage: 'radial-gradient(circle at center, rgba(0,0,0,1) 62%, rgba(0,0,0,0) 100%)'
                }}
              >
                <img
                  src="/IMAGES/face_categories.svg"
                  alt="Face"
                  className="block w-full h-full object-contain"
                  style={{ filter: 'drop-shadow(0 24px 30px rgba(0,0,0,0.28))' }}
                />
              </div>
              <h3 className="text-sm font-medium tracking-wide" style={{color: '#1B4965'}}>Face</h3>
            </div>

            {/* Hair */}
            <div className="text-center group cursor-pointer" onClick={() => window.location.hash = '#/hair'}>
              <div
                className="mx-auto mb-4 flex items-center justify-center"
                style={{
                  width: '360px',
                  height: '360px',
                  WebkitMaskImage: 'radial-gradient(circle at center, rgba(0,0,0,1) 62%, rgba(0,0,0,0) 100%)',
                  maskImage: 'radial-gradient(circle at center, rgba(0,0,0,1) 62%, rgba(0,0,0,0) 100%)'
                }}
              >
                <img
                  src="/IMAGES/hair_categories.png"
                  alt="Hair"
                  className="block w-full h-full object-contain"
                  style={{ filter: 'drop-shadow(0 24px 30px rgba(0,0,0,0.28))' }}
                />
              </div>
              <h3 className="text-sm font-medium tracking-wide" style={{color: '#1B4965'}}>Hair</h3>
            </div>

            {/* Combos */}
            <div className="text-center group cursor-pointer" onClick={() => window.location.hash = '#/combos'}>
              <div
                className="mx-auto mb-4 flex items-center justify-center"
                style={{
                  width: '360px',
                  height: '360px',
                  WebkitMaskImage: 'radial-gradient(circle at center, rgba(0,0,0,1) 62%, rgba(0,0,0,0) 100%)',
                  maskImage: 'radial-gradient(circle at center, rgba(0,0,0,1) 62%, rgba(0,0,0,0) 100%)'
                }}
              >
                <img
                  src="/IMAGES/combo 3.3.jpg"
                  alt="Combos"
                  className="block w-full h-full object-contain"
                  style={{ filter: 'drop-shadow(0 24px 30px rgba(0,0,0,0.28))' }}
                />
              </div>
              <h3 className="text-sm font-medium tracking-wide" style={{color: '#1B4965'}}>Combos</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Shop What's New - Enhanced Colors */}
      <section className="py-16" style={{backgroundColor: '#F4F9F9'}}>
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif mb-4" style={{color: '#1B4965'}}>
              SHOP WHAT'S NEW
            </h2>
            <div className="flex justify-center space-x-8 mb-8">
              <button className="text-sm font-medium tracking-wide uppercase pb-2 border-b-2" style={{color: '#1B4965', borderColor: '#4B97C9'}}>
                NEW ARRIVALS
              </button>
              <button className="text-sm font-medium tracking-wide uppercase pb-2 border-b-2" style={{color: '#1B4965', borderColor: '#4B97C9'}}>
                BEST SELLERS
              </button>
              <button className="text-sm font-medium tracking-wide uppercase pb-2" style={{color: '#9DB4C0'}}>
                TOP RATED
              </button>
            </div>
        </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm">
                  <div className="h-80 rounded-t-lg" style={{backgroundColor: '#D0E8F2'}}></div>
                  <div className="p-6">
                    <div className="h-6 mb-2" style={{backgroundColor: '#9DB4C0'}}></div>
                    <div className="h-4 mb-4" style={{backgroundColor: '#9DB4C0'}}></div>
                    <div className="h-8" style={{backgroundColor: '#9DB4C0'}}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.slice(0, 4).map((product, index) => (
                <div key={product.slug} className="bg-white rounded-lg shadow-sm group">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={product.listImage || "/IMAGES/ANYTIME CREAM (3).jpg"} 
                      alt={product.title}
                      className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button 
                        onClick={() => handleAddToWishlist(product)}
                        className="w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg"
                      >
                        <Heart className="w-5 h-5" style={{color: '#1B4965'}} />
                      </button>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="text-white px-3 py-1 text-xs font-medium tracking-wide uppercase rounded-full" style={{backgroundColor: '#4B97C9'}}>
                        {product.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-medium tracking-wide mb-2" style={{color: '#1B4965'}}>
                      {product.title}
                    </h3>
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                      </div>
                      <span className="text-sm ml-2" style={{color: '#9DB4C0'}}>4.5 (45 Reviews)</span>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      {(() => {
                        const csvData = getCsvProductData(product)
                        const mrp = csvData?.['MRP (₹)'] || csvData?.['MRP'] || product.price || '₹599'
                        const websitePrice = csvData?.['website price'] || csvData?.['Website Price'] || ''
                        
                        return (
                          <div className="flex flex-col w-full">
                            <div className="flex items-center gap-2 mb-2">
                              {websitePrice && websitePrice !== mrp ? (
                                <>
                                  <span className="text-lg font-medium line-through opacity-60" style={{color: '#9DB4C0'}}>
                                    {mrp}
                                  </span>
                                  <span className="text-lg font-bold" style={{color: '#1B4965'}}>
                                    {websitePrice}
                                  </span>
                                </>
                              ) : (
                                <span className="text-lg font-medium" style={{color: '#1B4965'}}>
                                  {mrp}
                                </span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleAddToCart(product)}
                                className="flex-1 px-3 py-2 text-white text-xs font-medium transition-all duration-300 tracking-wide uppercase rounded shadow-lg"
                                style={{backgroundColor: '#4B97C9'}}
                              >
                                ADD TO CART
                              </button>
                              <button 
                                onClick={() => handleBuyNow(product)}
                                className="flex-1 px-3 py-2 text-white text-xs font-medium transition-all duration-300 tracking-wide uppercase rounded shadow-lg"
                                style={{backgroundColor: '#1B4965'}}
                              >
                                BUY NOW
                              </button>
                            </div>
                          </div>
                        )
                      })()}
                    </div>
                  </div>
                </div>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* Thoughtful Commitments - Enhanced Colors */}
      <section className="py-16" style={{backgroundColor: '#9DB4C0'}}>
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif mb-4 text-white">
              THOUGHTFUL COMMITMENTS
            </h2>
            <p className="text-lg font-light max-w-2xl mx-auto text-white">
              We are committed to providing you with the safest and most effective natural skincare products.
            </p>
          </div>

          

          {/* Sliding certifications */}
          <style>{`
            @keyframes certScroll {
              0% { transform: translateX(-50%); }
              100% { transform: translateX(0); }
            }
          `}</style>

          {/* Full-width white band behind the sliding items */}
          <div className="relative overflow-hidden py-6" style={{ backgroundColor: '#ffffff' }}>
            <div
              className="flex items-center gap-16 w-[200%]"
              style={{ animation: 'certScroll 40s linear infinite' }}
            >
              <div className="flex items-center gap-16 w-1/2 justify-around">
                <div className="text-center">
                  <div className="w-48 h-36 mx-auto mb-4 flex items-center justify-center">
                    <img 
                      src="/IMAGES/cruelity free.png" 
                      alt="Cruelty-Free"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-48 h-36 mx-auto mb-4 flex items-center justify-center">
                    <img 
                      src="/IMAGES/paraben free.png" 
                      alt="Paraben-Free"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-48 h-36 mx-auto mb-4 flex items-center justify-center">
                    <img 
                      src="/IMAGES/sulphate free.png" 
                      alt="Sulphate-Free"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-48 h-36 mx-auto mb-4 flex items-center justify-center">
                    <img 
                      src="/IMAGES/made safe.png" 
                      alt="Made Safe"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-48 h-36 mx-auto mb-4 flex items-center justify-center">
                    <img 
                      src="/IMAGES/Made in India.jpg" 
                      alt="Made in India"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-lg font-bold tracking-wide underline" style={{ color: '#1B4965' }}>Made in India</h3>
                </div>
              </div>
              <div className="flex items-center gap-16 w-1/2 justify-around">
                <div className="text-center">
                  <div className="w-48 h-36 mx-auto mb-4 flex items-center justify-center">
                    <img 
                      src="/IMAGES/cruelity free.png" 
                      alt="Cruelty-Free"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-48 h-36 mx-auto mb-4 flex items-center justify-center">
                    <img 
                      src="/IMAGES/paraben free.png" 
                      alt="Paraben-Free"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-48 h-36 mx-auto mb-4 flex items-center justify-center">
                    <img 
                      src="/IMAGES/sulphate free.png" 
                      alt="Sulphate-Free"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-48 h-36 mx-auto mb-4 flex items-center justify-center">
                    <img 
                      src="/IMAGES/made safe.png" 
                      alt="Made Safe"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-48 h-36 mx-auto mb-4 flex items-center justify-center">
                    <img 
                      src="/IMAGES/Made in India.jpg" 
                      alt="Made in India"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-lg font-bold tracking-wide underline" style={{ color: '#1B4965' }}>Made in India</h3>
                </div>
              </div>
            </div>
          </div>

          
        </div>
      </section>

      {/* Shop by Collection - Enhanced Colors */}
      <section className="py-16" style={{backgroundColor: '#D0E8F2'}}>
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img 
                src="/IMAGES/ANYTIME CREAM (3).jpg" 
                alt="Nefol Collection"
                className="w-full h-96 object-cover rounded-lg shadow-2xl"
              />
            </div>
            <div className="text-left">
              <h2 className="text-3xl font-serif mb-4" style={{color: '#1B4965'}}>
                NEFOL COLLECTION
                  </h2>
              <h3 className="text-xl font-light mb-4" style={{color: '#4B97C9'}}>
                ELEVATE YOUR SKINCARE WITH
              </h3>
              <p className="text-lg font-light mb-8 leading-relaxed" style={{color: '#1B4965'}}>
                Our premium collection combines the best of nature and science to deliver exceptional results for your skin.
              </p>
              <button 
                onClick={handleShopNow}
                className="px-8 py-4 text-white font-medium transition-all duration-300 text-sm tracking-wide uppercase shadow-lg"
                style={{backgroundColor: '#4B97C9'}}
              >
                SHOP NOW
                  </button>
                </div>
          </div>
        </div>
      </section>

      {/* Complete Kit - Banner Image */}
      <section className="py-16" style={{backgroundColor: '#F4F9F9'}}>
        <div className="mx-auto max-w-7xl px-4">
          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
            <img src={heroImages[heroIndex]} alt="Complete Kit" className="w-full h-[420px] object-cover" />
            <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-serif mb-4 text-white">THE COMPLETE KIT</h2>
                <p className="text-white/90 mb-6">Get the full Nefol experience in one curated bundle</p>
                <button
                  onClick={handleViewKit}
                  className="px-8 py-3 text-white font-medium tracking-wide uppercase rounded shadow-lg"
                  style={{backgroundColor: '#1B4965'}}
                >
                  View Kit
                  </button>
                </div>
              </div>
          </div>
        </div>
      </section>

      {/* Trusted Partners - Kimirica Inspired */}
      <section className="py-16" style={{backgroundColor: '#F4F9F9'}}>
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif mb-4 text-black">
              AVAILABLE ON
            </h2>
          </div>

          <style>{`
            @keyframes brandScroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
          `}</style>

          <div className="relative overflow-hidden py-6 rounded-lg" style={{backgroundColor: '#D0E8F2'}}>
            <div
              className="flex items-center gap-16 w-[200%]"
              style={{ animation: 'brandScroll 30s linear infinite' }}
            >
              <div className="flex items-center gap-16 w-1/2 justify-around">
                <img src="/IMAGES/Amazon.jpg" alt="Amazon" className="h-12 w-auto object-contain drop-shadow" />
                <img src="/IMAGES/Flipkart-logo.png" alt="Flipkart" className="h-12 w-auto object-contain drop-shadow" />
                <img src="/IMAGES/meesho.png" alt="Meesho" className="h-12 w-auto object-contain drop-shadow" />
                <img src="/IMAGES/Amazon.jpg" alt="Amazon" className="h-12 w-auto object-contain drop-shadow" />
                <img src="/IMAGES/Flipkart-logo.png" alt="Flipkart" className="h-12 w-auto object-contain drop-shadow" />
                <img src="/IMAGES/meesho.png" alt="Meesho" className="h-12 w-auto object-contain drop-shadow" />
              </div>
              <div className="flex items-center gap-16 w-1/2 justify-around">
                <img src="/IMAGES/Amazon.jpg" alt="Amazon" className="h-12 w-auto object-contain drop-shadow" />
                <img src="/IMAGES/Flipkart-logo.png" alt="Flipkart" className="h-12 w-auto object-contain drop-shadow" />
                <img src="/IMAGES/meesho.png" alt="Meesho" className="h-12 w-auto object-contain drop-shadow" />
                <img src="/IMAGES/Amazon.jpg" alt="Amazon" className="h-12 w-auto object-contain drop-shadow" />
                <img src="/IMAGES/Flipkart-logo.png" alt="Flipkart" className="h-12 w-auto object-contain drop-shadow" />
                <img src="/IMAGES/meesho.png" alt="Meesho" className="h-12 w-auto object-contain drop-shadow" />
              </div>
              </div>
          </div>
        </div>
      </section>

      {/* Social Media - Local Videos */}
      <section className="py-0" style={{backgroundColor: '#D0E8F2'}}>
        <div className="w-screen">
          <div className="text-center mb-6 pt-6">
            <h2 className="text-3xl font-serif mb-2" style={{color: '#1B4965'}}>SOCIAL MEDIA</h2>
            <p className="text-gray-700">Watch our latest posts and reels</p>
          </div>

          <style>{`
            #video-scroller { scrollbar-width: none; -ms-overflow-style: none; }
            #video-scroller::-webkit-scrollbar { display: none; }
          `}</style>

          {(() => {
            const localVideos = [
              '/IMAGES/aec80e47574f9e853b2d6809785f62d7.mp4',
              '/IMAGES/d81e113b2399f2e11d9d93481687e5c0.mp4',
              '/IMAGES/dc7d14a7-cb58-4ba0-8aa5-338bcb21462f.mp4',
              '/IMAGES/e8bf5173d20af563206012c88e21c781_720w.mp4',
              '/IMAGES/Open Pores, Acne Marks & Blackheads Treatment F.mp4'
            ]
            const apiVideos = (videos || []).map((v: any) =>
              v.video_type === 'local' ? `${getApiBase()}/uploads/${v.video_url}` : v.video_url
            )
            const allVideos = [...localVideos, ...apiVideos]
            const doubled = [...allVideos, ...allVideos]

            // Auto-scroll via requestAnimationFrame
            const startAutoScroll = () => {
              const scroller = document.getElementById('video-scroller') as HTMLElement | null
              if (!scroller) return
              let rafId = 0
              const speed = 0.6 // px per frame
              const step = () => {
                if (scroller.scrollWidth === 0) { rafId = requestAnimationFrame(step); return }
                scroller.scrollLeft += speed
                const half = scroller.scrollWidth / 2
                if (scroller.scrollLeft >= half) {
                  scroller.scrollLeft -= half
                }
                rafId = requestAnimationFrame(step)
              }
              rafId = requestAnimationFrame(step)
              return () => cancelAnimationFrame(rafId)
            }
            // Kick off after paint
            setTimeout(startAutoScroll, 100)

            const scrollByViewport = (dir: number) => {
              const scroller = document.getElementById('video-scroller') as HTMLElement | null
              if (!scroller) return
              const delta = (scroller.clientWidth * 0.2) * dir
              scroller.scrollBy({ left: delta, behavior: 'smooth' })
              window.setTimeout(() => scroller.dispatchEvent(new Event('scroll')), 120)
              }
              
              return (
              <div className="relative">
                <button
                  aria-label="Prev"
                  onClick={() => scrollByViewport(-1)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow px-3 py-2 rounded"
                >
                  &lt;
                </button>

                <div
                  id="video-scroller"
                  className="flex overflow-x-hidden snap-x snap-mandatory"
                  style={{ scrollBehavior: 'smooth' }}
                >
                  {doubled.map((src, idx) => (
                    <div
                      key={idx}
                      className="video-item snap-start shrink-0 bg-white overflow-hidden"
                      style={{ width: '20%', transformOrigin: 'center center', transition: 'transform 200ms ease' }}
                    >
                      <video
                        src={src}
                        className="block w-full h-auto"
                        autoPlay
                        loop
                        muted
                        playsInline
                        controls={false}
                      />
                    </div>
                  ))}
                </div>

                        <button 
                  aria-label="Next"
                  onClick={() => scrollByViewport(1)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow px-3 py-2 rounded"
                        >
                  &gt;
                        </button>
                </div>
              )
          })()}
        </div>
      </section>

      {/* Forever Favorites - Kimirica Inspired */}
      <section className="py-16" style={{backgroundColor: '#F4F9F9'}}>
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif mb-4 text-black">
              FOREVER FAVORITES
                  </h2>
            <p className="text-lg font-light max-w-2xl mx-auto text-gray-600">
              Discover our most loved products that have become staples in skincare routines worldwide.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="relative group cursor-pointer">
              <img 
                src="/IMAGES/ANYTIME CREAM (3).jpg" 
                alt="Luxury Skincare"
                className="w-full h-80 object-cover rounded-lg shadow-lg transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-center text-white">
                  <h3 className="text-2xl font-serif mb-2">LUXURY SKINCARE</h3>
                  <button 
                    className="px-6 py-3 bg-white text-black font-medium transition-all duration-300 text-sm tracking-wide uppercase rounded"
                  >
                    SHOP NOW
                  </button>
                </div>
              </div>
            </div>
            <div className="relative group cursor-pointer">
              <img 
                src="/IMAGES/ANYTIME CREAM (3).jpg" 
                alt="Natural Beauty"
                className="w-full h-80 object-cover rounded-lg shadow-lg transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-center text-white">
                  <h3 className="text-2xl font-serif mb-2">NATURAL BEAUTY</h3>
                  <button 
                    className="px-6 py-3 bg-white text-black font-medium transition-all duration-300 text-sm tracking-wide uppercase rounded"
                  >
                    SHOP NOW
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials - Kimirica Inspired */}
      <section className="py-16" style={{backgroundColor: '#F4F9F9'}}>
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif mb-4 text-black">
              WHAT OUR CUSTOMERS SAY
            </h2>
            <div className="flex justify-center mb-4">
              <div className="flex text-yellow-400">
                <Star className="w-6 h-6 fill-current" />
                <Star className="w-6 h-6 fill-current" />
                <Star className="w-6 h-6 fill-current" />
                <Star className="w-6 h-6 fill-current" />
                <Star className="w-6 h-6 fill-current" />
                  </div>
                </div>
            <p className="text-lg font-light max-w-3xl mx-auto italic text-gray-600">
              "Nefol has completely transformed my skincare routine. The natural ingredients work wonders and my skin has never looked better!"
            </p>
                  </div>
          <div className="flex justify-center space-x-8">
            {['Rhea Sharma', 'Ananya Singh', 'Priya Patel', 'Neha Gupta', 'Sara Khan'].map((name, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center text-white font-bold" style={{backgroundColor: '#4B97C9'}}>
                  {name.split(' ').map(n => n[0]).join('')}
                </div>
                <p className="text-sm font-medium text-black">{name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Thoughtful Self-Care - Kimirica Inspired */}
      <section className="py-16" style={{backgroundColor: '#F4F9F9'}}>
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="text-3xl font-serif mb-4 text-black">
            THOUGHTFUL SELF-CARE
          </h2>
          <p className="text-lg font-light max-w-2xl mx-auto mb-8 text-gray-600">
            Embrace the power of natural ingredients and transform your skincare routine with our thoughtfully crafted products.
          </p>
          <button 
            onClick={handleExploreCollection}
            className="px-8 py-4 text-white font-medium transition-all duration-300 text-sm tracking-wide uppercase"
            style={{backgroundColor: '#1B4965'}}
          >
            SHOP ALL PRODUCTS
          </button>
        </div>
      </section>

      {/* Floating Action Button - Kimirica Inspired */}
      <button 
        onClick={handleExploreCollection}
        className="fixed bottom-8 right-8 w-14 h-14 text-white transition-all duration-300 z-50 shadow-lg rounded-full flex items-center justify-center"
        style={{backgroundColor: '#1B4965'}}
      >
        <Sparkles className="w-6 h-6" />
      </button>
    </main>
  )
}