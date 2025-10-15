import React, { useState } from 'react'
import SplashScreen from './components/SplashScreen'
import Logo from './components/Logo'
import ProfileAvatar from './components/ProfileAvatar'
import { useCart, CartProvider } from './contexts/CartContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'

// Extend User type to include profile_photo
interface ExtendedUser {
  id: number
  name: string
  email: string
  phone: string
  address: {
    street: string
    city: string
    state: string
    zip: string
  }
  profile_photo?: string
  loyalty_points: number
  total_orders: number
  member_since: string
  is_verified: boolean
}
import LoginPage from './pages/Login'
import Profile from './pages/Profile'
import AboutUs from './pages/AboutUs'
import FAQ from './pages/FAQ'
import BlueTeaBenefits from './pages/BlueTeaBenefits'
import ChairpersonMessage from './pages/ChairpersonMessage'
import USP from './pages/USP'
import PrivacyPolicy from './pages/PrivacyPolicy'
import RefundPolicy from './pages/RefundPolicy'
import ShippingPolicy from './pages/ShippingPolicy'
import TermsOfService from './pages/TermsOfService'
import Face from './pages/Face'
import Body from './pages/Body'
import Hair from './pages/Hair'
import Orders from './pages/Orders'
import Account from './pages/Account'
import Community from './pages/Community'
import Notifications from './pages/Notifications'
import PrivacySecurity from './pages/PrivacySecurity'
import PaymentMethods from './pages/PaymentMethods'
import LoyaltyRewards from './pages/LoyaltyRewards'
import Combos from './pages/Combos'
import Cart from './pages/Cart'
import Search from './pages/Search'

function AppContent() {
  const { items: cartItems } = useCart()
  const { user, isAuthenticated, logout, refreshUser } = useAuth()
  const [showSplash, setShowSplash] = useState(true)
  const [showSearch, setShowSearch] = useState(false)
  const [showWishlist, setShowWishlist] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [wishlistItems, setWishlistItems] = useState<any[]>([])

  const handleSplashComplete = () => {
    setShowSplash(false)
  }

  // Handle ESC key to close modals
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeAllModals()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Refresh user data when component mounts
  React.useEffect(() => {
    if (isAuthenticated) {
      refreshUser()
    }
  }, [isAuthenticated, refreshUser])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Redirect to dedicated search page with query parameter
      window.location.hash = `#/search?q=${encodeURIComponent(searchQuery.trim())}`
      setSearchQuery('')
      setShowSearch(false)
    }
  }

  // Function to close all modals
  const closeAllModals = () => {
    setShowSearch(false)
    setShowWishlist(false)
    setShowProfile(false)
  }

  // Function to open specific modal and close others
  const openModal = (modalType: 'search' | 'wishlist' | 'profile') => {
    closeAllModals()
    switch (modalType) {
      case 'search':
        setShowSearch(true)
        break
      case 'wishlist':
        setShowWishlist(true)
        break
      case 'profile':
        setShowProfile(true)
        break
    }
  }

  const addToCart = (product: any) => {
    // This function is kept for compatibility with existing components
    // The actual cart functionality is now handled by the CartContext
    alert(`${product.name} added to cart!`)
  }

  const addToWishlist = (product: any) => {
    setWishlistItems(prev => [...prev, product])
    alert(`${product.name} added to wishlist!`)
  }

  const removeFromWishlist = (index: number) => {
    setWishlistItems(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className={`min-h-screen bg-white text-slate-900 ${showSplash ? 'overflow-hidden h-screen' : ''}`}>
      {showSplash ? (
        <SplashScreen onComplete={handleSplashComplete} />
      ) : (
        <>
          <header className="nav-glass">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
              <Logo className="font-display text-2xl font-bold text-gradient-primary hover:text-gradient-secondary transition-all duration-300" />
              
              <nav className="hidden items-center gap-8 md:flex text-slate-600 dark:text-slate-400">
                <a href="#/" className="font-body text-lg font-medium hover:text-gradient-primary transition-all duration-300 relative group">
                  Home
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
                </a>
                
                <div className="group relative">
                  <button className="font-body text-lg font-medium hover:text-gradient-primary transition-all duration-300 flex items-center relative">
                    Categories
                    <span className="ml-2 transform transition-transform duration-300 group-hover:rotate-180">▼</span>
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-56 glass-card opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 transform translate-y-2 group-hover:translate-y-0">
                    <div className="py-3">
                      <a href="#/face" className="block px-6 py-3 text-sm font-medium hover:text-gradient-primary transition-all duration-300 hover:bg-gradient-primary/10">Face Care</a>
                      <a href="#/hair" className="block px-6 py-3 text-sm font-medium hover:text-gradient-primary transition-all duration-300 hover:bg-gradient-primary/10">Hair Care</a>
                      <a href="#/body" className="block px-6 py-3 text-sm font-medium hover:text-gradient-primary transition-all duration-300 hover:bg-gradient-primary/10">Body Care</a>
                      <a href="#/combos" className="block px-6 py-3 text-sm font-medium hover:text-gradient-primary transition-all duration-300 hover:bg-gradient-primary/10">Combo Packs</a>
                    </div>
                  </div>
                </div>
                
                <a href="#/shop" className="font-body text-lg font-medium hover:text-gradient-primary transition-all duration-300 relative group">
                  Shop All
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a href="#/ingredients" className="font-body text-lg font-medium hover:text-gradient-primary transition-all duration-300 relative group">
                  Ingredients
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a href="#/blog" className="font-body text-lg font-medium hover:text-gradient-primary transition-all duration-300 relative group">
                  Blog
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a href="#/contact" className="font-body text-lg font-medium hover:text-gradient-primary transition-all duration-300 relative group">
                  Contact
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
                </a>
              </nav>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => openModal('search')}
                  className="neu w-12 h-12 flex items-center justify-center hover:scale-110 transition-all duration-300" 
                  aria-label="Search"
                >
                  <span className="text-lg">🔍</span>
                </button>
                
                <a 
                  href="#/cart"
                  className="neu w-12 h-12 flex items-center justify-center hover:scale-110 transition-all duration-300 relative" 
                  aria-label="Shopping Cart"
                >
                  <span className="text-lg">🛒</span>
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                      {cartItems.length}
                    </span>
                  )}
                </a>
                
                <button 
                  onClick={() => openModal('profile')}
                  className="neu w-12 h-12 flex items-center justify-center hover:scale-110 transition-all duration-300 overflow-hidden rounded-full" 
                  aria-label="Account"
                >
                  <ProfileAvatar 
                    profilePhoto={(user as ExtendedUser)?.profile_photo}
                    name={(user as ExtendedUser)?.name}
                    size="md"
                    className="w-full h-full"
                  />
                </button>
                
                <button className="neu w-12 h-12 flex items-center justify-center hover:scale-110 transition-all duration-300 md:hidden" aria-label="Menu">
                  <span className="text-lg">☰</span>
                </button>
              </div>
            </div>
          </header>
      <RouterView addToCart={addToCart} addToWishlist={addToWishlist} />

      <footer className="border-t border-gray-800 bg-gray-900 py-16 text-sm text-gray-400">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 sm:grid-cols-2 md:grid-cols-6">
          <div className="md:col-span-2">
            <h3 className="mb-4 text-xl font-light tracking-wide text-white">Nefol</h3>
            <p className="text-gray-400 font-light leading-relaxed">Natural and safe skincare for every skin type. Made with love and care.</p>
            <p className="mt-4 text-gray-400 font-light">Call us: +91-8887-847213</p>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-medium tracking-wide uppercase text-white">Categories</h4>
            <ul className="space-y-2">
              <li><a href="#/" className="text-gray-400 hover:text-white transition-colors font-light">Home</a></li>
              <li><a href="#/body" className="text-gray-400 hover:text-white transition-colors font-light">Body</a></li>
              <li><a href="#/face" className="text-gray-400 hover:text-white transition-colors font-light">Face</a></li>
              <li><a href="#/hair" className="text-gray-400 hover:text-white transition-colors font-light">Hair</a></li>
              <li><a href="#/combos" className="text-gray-400 hover:text-white transition-colors font-light">Combos</a></li>
              <li><a href="#/blog" className="text-gray-400 hover:text-white transition-colors font-light">Blogs</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-medium tracking-wide uppercase text-white">Further Info.</h4>
            <ul className="space-y-2">
              <li><a href="#/shop" className="text-gray-400 hover:text-white transition-colors font-light">Shop</a></li>
              <li><a href="#/orders" className="text-gray-400 hover:text-white transition-colors font-light">Orders</a></li>
              <li><a href="#/account" className="text-gray-400 hover:text-white transition-colors font-light">Account</a></li>
              <li><a href="#/community" className="text-gray-400 hover:text-white transition-colors font-light">Community</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-medium tracking-wide uppercase text-white">Company Info</h4>
            <ul className="space-y-2">
              <li><a href="#/about" className="text-gray-400 hover:text-white transition-colors font-light">About Us</a></li>
              <li><a href="#/faq" className="text-gray-400 hover:text-white transition-colors font-light">FAQ</a></li>
              <li><a href="#/chairperson-message" className="text-gray-400 hover:text-white transition-colors font-light">Chairperson Message</a></li>
              <li><a href="#/usp" className="text-gray-400 hover:text-white transition-colors font-light">Why Choose Nefol</a></li>
              <li><a href="#/blue-tea-benefits" className="text-gray-400 hover:text-white transition-colors font-light">Blue Tea Benefits</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-medium tracking-wide uppercase text-white">Customer Service</h4>
            <ul className="space-y-2">
              <li><a href="#/privacy-policy" className="text-gray-400 hover:text-white transition-colors font-light">Privacy Policy</a></li>
              <li><a href="#/refund-policy" className="text-gray-400 hover:text-white transition-colors font-light">Refund Policy</a></li>
              <li><a href="#/shipping-policy" className="text-gray-400 hover:text-white transition-colors font-light">Shipping Policy</a></li>
              <li><a href="#/terms-of-service" className="text-gray-400 hover:text-white transition-colors font-light">Terms of Service</a></li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <h4 className="mb-4 text-sm font-medium tracking-wide uppercase text-white">Newsletter</h4>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input type="email" required placeholder="Your email" className="h-10 w-full rounded-md border border-gray-700 bg-gray-800 px-3 text-gray-100 placeholder-gray-400 focus:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600" />
              <button className="h-10 rounded-md bg-gray-800 px-4 font-medium text-white hover:bg-gray-700 transition-colors border border-gray-700">Submit</button>
            </form>
            <small className="mt-4 block text-gray-400 font-light">©{new Date().getFullYear()} NEFOL • Made with ❤ by SearchMantra</small>
          </div>
        </div>
      </footer>

      {/* Search Modal */}
      {showSearch && (
        <div 
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-20"
          onClick={closeAllModals}
        >
          <div 
            className="w-full max-w-2xl rounded-xl bg-white dark:bg-slate-800 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold dark:text-slate-100">Search Products</h2>
              <button
                onClick={closeAllModals}
                className="text-2xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSearch} className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, ingredients, or categories..."
                  className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:bg-slate-700 dark:text-slate-100"
                  autoFocus
                />
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 transition-colors"
                >
                  Search
                </button>
              </div>
            </form>
            <div className="text-center text-slate-500 dark:text-slate-400">
              <p>Search functionality will be implemented with backend integration</p>
            </div>
          </div>
        </div>
      )}

      {/* Wishlist Modal */}
      {showWishlist && (
        <div 
          className="fixed inset-0 z-50 flex items-end justify-end bg-black/50 p-4"
          onClick={closeAllModals}
        >
          <div 
            className="w-full max-w-md rounded-xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 p-6">
              <h2 className="text-xl font-bold">Wishlist ({wishlistItems.length})</h2>
              <button
                onClick={closeAllModals}
                className="text-2xl text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto p-6">
              {wishlistItems.length === 0 ? (
                <div className="text-center text-slate-500 py-8">
                  <div className="text-4xl mb-2">❤️</div>
                  <p>Your wishlist is empty</p>
                  <p className="text-sm">Save products you love!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {wishlistItems.map((item: any, index: number) => (
                    <div key={index} className="flex items-center space-x-4 rounded-lg border border-slate-200 p-4">
                      <img src={item.image || '/IMAGES/FACE SERUM (5).jpg'} alt={item.name} className="h-16 w-16 rounded-lg object-cover" />
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-slate-600">₹{item.price || '999'}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            addToCart(item)
                            removeFromWishlist(index)
                          }}
                          className="rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700"
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() => removeFromWishlist(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          🗑️
                        </button>
                      </div>
              </div>
            ))}
          </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfile && (
        <div 
          className="fixed inset-0 z-50 flex items-end justify-end bg-black/50 p-4"
          onClick={closeAllModals}
        >
          <div 
            className="w-full max-w-md rounded-xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 p-6">
              <h2 className="text-xl font-bold">My Account</h2>
              <button
                onClick={closeAllModals}
                className="text-2xl text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              {isAuthenticated ? (
                <>
                  <div className="text-center mb-6">
                    <ProfileAvatar 
                      profilePhoto={(user as ExtendedUser)?.profile_photo}
                      name={(user as ExtendedUser)?.name}
                      size="xl"
                      className="mx-auto mb-4"
                    />
                    <h3 className="text-lg font-semibold dark:text-slate-100">Welcome back!</h3>
                    <p className="text-slate-600 dark:text-slate-400">{user?.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-500">{user?.email}</p>
                  </div>
                  <div className="space-y-3">
                    <a 
                      href="#/profile" 
                      className="block w-full rounded-lg border border-slate-300 dark:border-slate-600 py-3 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-center"
                      onClick={closeAllModals}
                    >
                      My Profile
                    </a>
                    <a 
                      href="#/cart"
                      className="block w-full rounded-lg border border-slate-300 dark:border-slate-600 py-3 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-center relative"
                      onClick={closeAllModals}
                    >
                      🛒 Cart ({cartItems.length})
                    </a>
                    <button 
                      onClick={() => openModal('wishlist')}
                      className="block w-full rounded-lg border border-slate-300 dark:border-slate-600 py-3 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-center relative"
                    >
                      ❤️ Wishlist ({wishlistItems.length})
                    </button>
                    <a 
                      href="#/affiliate" 
                      className="block w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 transition-colors text-center"
                      onClick={closeAllModals}
                    >
                      Affiliate Program
                    </a>
                    <button
                      onClick={() => {
                        logout()
                        closeAllModals()
                      }}
                      className="w-full rounded-lg border border-red-300 dark:border-red-600 py-3 font-semibold text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-2xl">
                      👤
                    </div>
                    <h3 className="text-lg font-semibold dark:text-slate-100">Welcome!</h3>
                    <p className="text-slate-600 dark:text-slate-400">Sign in to access your account</p>
                  </div>
                  <div className="space-y-3">
                    <a 
                      href="#/login" 
                      className="block w-full rounded-lg border border-slate-300 dark:border-slate-600 py-3 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-center"
                      onClick={closeAllModals}
                    >
                      Sign In
                    </a>
                    <a 
                      href="#/login" 
                      className="block w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 transition-colors text-center"
                      onClick={closeAllModals}
                    >
                      Create Account
                    </a>
                  </div>
                </>
              )}
              <div className="mt-6 space-y-2 text-sm">
                <a href="#/contact" className="block text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">Help & Support</a>
              </div>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  )
}

// Lightweight hash-based router to avoid external deps
import Home from './pages/Home'
import Shop from './pages/Shop'
import Skincare from './pages/Skincare'
import Ingredients from './pages/Ingredients'
import Blog from './pages/Blog'
import Contact from './pages/Contact'
import ProductPage from './pages/Product'
import CategoryPage from './pages/Category'
import Affiliate from './pages/Affiliate'
import Checkout from './pages/Checkout'
import Confirmation from './pages/Confirmation'

interface RouterViewProps {
  addToCart?: (product: any) => void
  addToWishlist?: (product: any) => void
}

function RouterView({ addToCart, addToWishlist }: RouterViewProps) {
  const [hash, setHash] = useState(window.location.hash || '#/')
  React.useEffect(() => {
    const onHashChange = () => setHash(window.location.hash || '#/')
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])
  const path = hash.replace('#', '')
  const lower = path.toLowerCase()
  if (lower.startsWith('/product/')) return <ProductPage />
  if (lower.startsWith('/category/')) return <CategoryPage />
  if (lower.startsWith('/search')) return <Search addToWishlist={addToWishlist} />
  switch (lower) {
    case '/product':
    case '/':
      return <Home />
    case '/shop': return <Shop addToWishlist={addToWishlist} />
    case '/skincare': return <Skincare />
    case '/ingredients': return <Ingredients />
    case '/blog': return <Blog />
    case '/contact': return <Contact />
    case '/checkout': return <Checkout />
    case '/confirmation': return <Confirmation />
    case '/affiliate': return <Affiliate />
    case '/cart': return <Cart />
    case '/profile': return <Profile />
    case '/login': return <LoginPage />
    case '/about': return <AboutUs />
    case '/faq': return <FAQ />
    case '/blue-tea-benefits': return <BlueTeaBenefits />
    case '/chairperson-message': return <ChairpersonMessage />
    case '/usp': return <USP />
    case '/privacy-policy': return <PrivacyPolicy />
    case '/refund-policy': return <RefundPolicy />
    case '/shipping-policy': return <ShippingPolicy />
    case '/terms-of-service': return <TermsOfService />
    case '/face': return <Face />
    case '/body': return <Body />
    case '/hair': return <Hair />
    case '/orders': return <Orders />
    case '/account': return <Account />
    case '/community': return <Community />
    case '/notifications': return <Notifications />
    case '/privacy-security': return <PrivacySecurity />
    case '/payment-methods': return <PaymentMethods />
    case '/loyalty-rewards': return <LoyaltyRewards />
    case '/combos': return <Combos />
    default:
      return <Home />
  }
}

export default function App() {
  return (
    <CartProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </CartProvider>
  )
}

