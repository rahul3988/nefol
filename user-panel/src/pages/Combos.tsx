import React, { useState, useEffect } from 'react'
import { getApiBase } from '../utils/apiBase'
import { Heart, Star, ShoppingCart, Package } from 'lucide-react'

interface Product {
  id: number
  slug: string
  title: string
  category: string
  price: string
  list_image: string
  description: string
}

export default function Combos() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const apiBase = getApiBase()
      const response = await fetch(`${apiBase}/api/products`)
      if (response.ok) {
        const data = await response.json()
        // Filter products for combo category
        const comboProducts = data.filter((product: Product) => {
          const category = (product.category || '').toLowerCase()
          return category.includes('combo') || 
                 category.includes('pack') ||
                 category.includes('bundle') ||
                 category.includes('set') ||
                 category.includes('kit') ||
                 category.includes('duo')
        })
        setProducts(comboProducts)
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
            Combo Offers
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Save more with our curated combo packs. Mix and match your favorite products at discounted prices.
          </p>
        </div>

        {/* Combo Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {loading ? (
            <div className="col-span-full text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">Loading combo offers...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-slate-800 dark:to-slate-800 rounded-2xl p-12">
                <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                  Coming Soon!
                </h3>
                <p className="text-xl text-slate-600 dark:text-slate-400 mb-6">
                  We're working on amazing combo offers for you.
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
                    src={product.list_image || "/IMAGES/1._Deep_Clean_Combo_165x.png"} 
                    alt={product.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      COMBO OFFER
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <button className="w-8 h-8 bg-white/80 dark:bg-slate-800/80 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 transition-colors">
                      <Heart className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    <Package className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">COMBO PACK</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                    {product.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                    {product.description || 'Premium combo pack with multiple products'}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {product.price || '₹1,299'}
                      </span>
                    </div>
                  </div>

                  <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Benefits Section */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-slate-800 dark:to-slate-800 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6 text-center">
            Why Choose Combo Packs?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                Save Money
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Get up to 22% discount when you buy products together in combo packs.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                Curated Selection
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Expert-curated combinations that work perfectly together for best results.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📦</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                Convenient Shopping
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Get everything you need in one order with free shipping on combo packs.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Save More?</h2>
          <p className="text-xl mb-8 opacity-90">
            Explore our combo packs and save up to 22% on your favorite Nefol products.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#/shop" 
              className="inline-block bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Shop All Combos
            </a>
            <a 
              href="#/contact" 
              className="inline-block border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
            >
              Get Expert Advice
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
