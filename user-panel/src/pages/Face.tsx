import React, { useState, useEffect } from 'react'
import { getApiBase } from '../utils/apiBase'
import { Heart, Star, ShoppingCart } from 'lucide-react'

interface Product {
  id: number
  slug: string
  title: string
  category: string
  price: string
  list_image: string
  description: string
}

export default function Face() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const apiBase = getApiBase()
      console.log('Face page - API Base:', apiBase)
      const response = await fetch(`${apiBase}/api/products`)
      console.log('Face page - Response status:', response.status)
      if (response.ok) {
        const data = await response.json()
        console.log('Face page - All products:', data)
        // Filter products for face category
        const faceProducts = data.filter((product: Product) => {
          const category = (product.category || '').toLowerCase()
          const matches = category.includes('face') || 
                 category.includes('moisturizer') ||
                 category.includes('serum') ||
                 category.includes('mask') ||
                 category.includes('scrub') ||
                 category.includes('cream') ||
                 category.includes('cleanser') ||
                 category.includes('toner') ||
                 category.includes('essence')
          console.log(`Face page - Product "${product.title}" (category: "${product.category}") matches: ${matches}`)
          return matches
        })
        console.log('Face page - Filtered products:', faceProducts)
        setProducts(faceProducts)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="py-10 dark:bg-slate-900 min-h-screen">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            Face Care Products
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Discover our range of natural face care products designed to enhance your natural beauty.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {loading ? (
            <div className="col-span-full text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">Loading face care products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-slate-800 dark:to-slate-800 rounded-2xl p-12">
                <div className="w-24 h-24 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                  Coming Soon!
                </h3>
                <p className="text-xl text-slate-600 dark:text-slate-400 mb-6">
                  We're working on amazing face care products for you.
                </p>
                <div className="bg-white dark:bg-slate-700 rounded-lg p-6 inline-block">
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    🚀 Upcoming Very Soon
                  </p>
                </div>
              </div>
            </div>
          ) : (
            products.map((product) => (
              <div key={product.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow group">
                <div className="relative">
                  <img 
                    src={product.list_image || "/IMAGES/FACE CLEANSER (1).jpg"} 
                    alt={product.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <button className="w-8 h-8 bg-white/80 dark:bg-slate-800/80 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 transition-colors">
                      <Heart className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                    {product.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                    {product.description || 'Premium face care product'}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {product.price || '₹599'}
                    </span>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Benefits Section */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-slate-800 dark:to-slate-800 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6 text-center">
            Why Choose Nefol Face Care?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌸</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                Brightening Formula
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Vitamin C and natural extracts help brighten dull skin and boost collagen production.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💧</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                Deep Hydration
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Green tea and White tea provide deep hydration to prevent wrinkles and fine lines.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                Gentle & Safe
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Suitable for all skin types including sensitive and acne-prone skin.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Glow?</h2>
          <p className="text-xl mb-8 opacity-90">
            Transform your skincare routine with Nefol's natural face care products.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#/shop" 
              className="inline-block bg-white text-pink-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Shop Face Care
            </a>
            <a 
              href="#/contact" 
              className="inline-block border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-pink-600 transition-colors"
            >
              Get Skincare Advice
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
