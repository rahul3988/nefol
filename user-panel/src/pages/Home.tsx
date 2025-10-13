import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Heart, Star, ShoppingCart, Play, Volume2, VolumeX, Sparkles, Zap, Crown, Gift } from 'lucide-react'

type Product = {
  id: number
  title: string
  category: string
  price: string
  list_image: string
  description: string
}

export default function Home() {
  const { user, isAuthenticated } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loyaltyPoints, setLoyaltyPoints] = useState(0)
  const [cashbackBalance, setCashbackBalance] = useState(0)
  const [activeDiscounts, setActiveDiscounts] = useState<any[]>([])
  const [personalizedContent, setPersonalizedContent] = useState<any>(null)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isMuted, setIsMuted] = useState(true)

  useEffect(() => {
    fetchProducts()
    fetchVideos()
    if (isAuthenticated && user) {
      fetchUserData()
      fetchPersonalizedContent()
    }
  }, [isAuthenticated, user])

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/products')
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
      const response = await fetch('http://localhost:4000/api/videos')
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

      const profileResponse = await fetch('http://localhost:4000/api/users/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (profileResponse.ok) {
        const profileData = await profileResponse.json()
        setLoyaltyPoints(profileData.loyalty_points || 0)
      }

      const cashbackResponse = await fetch('http://localhost:4000/api/cashback/balance', {
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

      const response = await fetch('http://localhost:4000/api/ai-personalization/content', {
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

  return (
    <main className="min-h-screen animate-aurora">
      {/* Ultra Aesthetic Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 animate-cosmic"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative mx-auto max-w-7xl px-4 text-center">
          <div className="glass-card p-12 animate-float-enhanced">
            <h1 className="font-display text-6xl md:text-8xl font-bold text-gradient-aurora mb-6 text-glow-primary">
              Nefol
            </h1>
            <p className="font-body text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto font-medium">
              Discover the future of natural beauty with our revolutionary skincare products
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <button className="btn-primary text-lg px-8 py-4 animate-gradient-enhanced font-button">
                <Sparkles className="w-5 h-5 mr-2" />
                Explore Collection
              </button>
              <button className="btn-glass text-lg px-8 py-4 font-button">
                <Crown className="w-5 h-5 mr-2" />
                Join VIP
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Ultra Aesthetic Product Grid */}
      <section className="py-20 relative">
        <div className="absolute inset-0 animate-magic opacity-30"></div>
        <div className="relative mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-6xl font-bold text-gradient-cosmic mb-6 text-glow-secondary">
              Featured Products
            </h2>
            <p className="font-body text-xl text-white/90 max-w-2xl mx-auto font-medium">
              Experience our premium collection of natural skincare products
            </p>
        </div>

          {loading ? (
            <div className="grid-revolutionary">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="glass-card p-8 loading-shimmer">
                  <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-2xl mb-6"></div>
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
                  <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid-revolutionary">
              {products.slice(0, 3).map((product, index) => (
                <div key={product.id} className="product-card card-3d group animate-float-enhanced" style={{animationDelay: `${index * 0.2}s`}}>
                  <div className="relative overflow-hidden">
                    <img 
                      src={product.list_image || "/IMAGES/FACE_CLEANSER__1_.jpg"} 
                      alt={product.title}
                      className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <button className="neu w-10 h-10 flex items-center justify-center hover:scale-110 transition-transform animate-pulse-glow">
                        <Heart className="w-5 h-5 text-red-500" />
                      </button>
                    </div>
                    <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <span className="bg-gradient-accent text-white px-3 py-1 rounded-full text-sm font-semibold animate-gradient">
                        {product.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-product text-xl font-bold text-white mb-2 text-glow-accent">
                      {product.title}
                    </h3>
                    <p className="font-description text-white/80 text-sm mb-4 line-clamp-2">
                      {product.description || 'Premium natural skincare product'}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-price text-2xl font-bold text-gradient-accent text-glow-accent">
                        {product.price || '₹599'}
                      </span>
                      <button className="btn-primary px-6 py-2 text-sm animate-gradient-enhanced font-button">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* Ultra Aesthetic Banner Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="glass-card p-0 overflow-hidden animate-cosmic">
            <div className="relative h-[500px] animate-aurora">
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <h2 className="font-display text-5xl md:text-7xl font-bold mb-6 text-gradient-magic text-glow-primary">
                    Natural Beauty
                  </h2>
                  <p className="font-body text-xl md:text-2xl mb-8 max-w-2xl mx-auto opacity-90 font-medium">
                    Discover the power of nature with our premium skincare collection
                  </p>
                  <button className="btn-primary text-lg px-8 py-4 bg-white/20 backdrop-blur-md border border-white/30 animate-gradient-enhanced font-button">
                    <Zap className="w-5 h-5 mr-2" />
                    Shop Now
                  </button>
                </div>
              </div>
              </div>
          </div>
        </div>
      </section>

      {/* Ultra Aesthetic Social Media Videos */}
      <section className="py-20 relative">
        <div className="absolute inset-0 animate-magic opacity-20"></div>
        <div className="relative mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-6xl font-bold text-gradient-sunset mb-6 text-glow-accent">
              Social Media
            </h2>
            <p className="font-body text-xl text-white/90 max-w-2xl mx-auto font-medium">
              Watch our community share their Nefol journey
            </p>
          </div>

          <div className="flex justify-center items-center gap-4 overflow-x-auto pb-4">
            {videos.map((video, index) => {
              const size = getVideoSize(index)
              const sizeClasses = {
                small: 'w-32 h-56',
                medium: 'w-40 h-72', 
                large: 'w-48 h-80'
              }
              
              return (
                <div key={video.id} className={`${sizeClasses[size]} flex-shrink-0 animate-float-enhanced`} style={{animationDelay: `${index * 0.3}s`}}>
                  <div className="glass-card p-0 overflow-hidden h-full group animate-cosmic">
                    <div className="relative h-full">
                      <video
                        src={video.video_type === 'local' ? `http://localhost:4000/uploads/${video.video_url}` : video.video_url}
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted={isMuted}
                        playsInline
                        controls={false}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <button 
                          onClick={toggleMute}
                          className="neu w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse-glow"
                        >
                          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Ultra Aesthetic Full Kit Image */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="glass-card p-0 overflow-hidden group animate-aurora">
            <div className="relative h-96 animate-cosmic">
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <h2 className="font-display text-4xl md:text-6xl font-bold mb-6 text-gradient-ocean text-glow-success">
                    Complete Kit
                  </h2>
                  <p className="font-body text-xl mb-8 max-w-xl mx-auto opacity-90 font-medium">
                    Get the full Nefol experience with our complete skincare kit
                  </p>
                  <button className="btn-primary text-lg px-8 py-4 bg-white/20 backdrop-blur-md border border-white/30 animate-gradient-enhanced font-button">
                    <Gift className="w-5 h-5 mr-2" />
                    View Kit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ultra Aesthetic Bottom Product Grid */}
      <section className="py-20 relative">
        <div className="absolute inset-0 animate-magic opacity-25"></div>
        <div className="relative mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-6xl font-bold text-gradient-fire mb-6 text-glow-success">
              More Products
            </h2>
            <p className="font-body text-xl text-white/90 max-w-2xl mx-auto font-medium">
              Explore our complete range of natural beauty products
            </p>
          </div>

          <div className="grid-revolutionary">
            {products.slice(3, 8).map((product, index) => (
              <div key={product.id} className="product-card card-3d group animate-float-enhanced" style={{animationDelay: `${index * 0.15}s`}}>
                <div className="relative overflow-hidden">
                  <img 
                    src={product.list_image || "/IMAGES/FACE_CLEANSER__1_.jpg"} 
                    alt={product.title}
                    className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <button className="neu w-10 h-10 flex items-center justify-center hover:scale-110 transition-transform animate-pulse-glow">
                      <Heart className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                  <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="bg-gradient-success text-white px-3 py-1 rounded-full text-sm font-semibold animate-gradient">
                      {product.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-product text-xl font-bold text-white mb-2 text-glow-success">
                    {product.title}
                  </h3>
                  <p className="font-description text-white/80 text-sm mb-4 line-clamp-2">
                    {product.description || 'Premium natural skincare product'}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-price text-2xl font-bold text-gradient-success text-glow-success">
                      {product.price || '₹599'}
                    </span>
                    <button className="btn-primary px-6 py-2 text-sm animate-gradient-enhanced font-button">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ultra Aesthetic User Stats */}
      {isAuthenticated && (
        <section className="py-20 relative">
          <div className="absolute inset-0 animate-aurora opacity-30"></div>
          <div className="relative mx-auto max-w-7xl px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-card p-8 text-center animate-float-enhanced">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-price text-2xl font-bold text-white mb-2 text-glow-primary">
                  {loyaltyPoints}
                </h3>
                <p className="font-body text-white/80 font-medium">Loyalty Points</p>
              </div>
              <div className="glass-card p-8 text-center animate-float-enhanced" style={{animationDelay: '0.2s'}}>
                <div className="w-16 h-16 bg-gradient-success rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-price text-2xl font-bold text-white mb-2 text-glow-success">
                  ₹{cashbackBalance}
                </h3>
                <p className="font-body text-white/80 font-medium">Cashback Balance</p>
              </div>
              <div className="glass-card p-8 text-center animate-float-enhanced" style={{animationDelay: '0.4s'}}>
                <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-price text-2xl font-bold text-white mb-2 text-glow-accent">
                  VIP
                </h3>
                <p className="font-body text-white/80 font-medium">Member Status</p>
              </div>
          </div>
        </div>
      </section>
      )}

      {/* Ultra Aesthetic Floating Action Button */}
      <button className="fab animate-float-enhanced">
        <Sparkles className="w-6 h-6" />
      </button>
    </main>
  )
}