import { useEffect, useState } from 'react'
import type { Product } from '../types'
import { useCart } from '../contexts/CartContext'
import { getApiBase } from '../utils/apiBase'

export default function ProductPage() {
  const [product, setProduct] = useState<Product | null>(null)
  const [csvProduct, setCsvProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'ingredients'>('description')
  const [quantity, setQuantity] = useState(1)
  
  // Use cart context
  const { addItem } = useCart()

  useEffect(() => {
    const load = async () => {
      const hash = window.location.hash || '#/'
      const match = hash.match(/^#\/product\/([^?#]+)/)
      const slug = match?.[1]
      if (!slug) return
      const apiBase = getApiBase()
      
      // Fetch product data
      const res = await fetch(`${apiBase}/api/products/slug/${slug}`, { credentials: 'include' })
      if (!res.ok) { setProduct(null); setLoading(false); return }
      const r = await res.json()
      
      // Fetch CSV data
      try {
        const csvRes = await fetch(`${apiBase}/api/products-csv`)
        if (csvRes.ok) {
          const csvData = await csvRes.json()
          const csvMatch = csvData.find((csv: any) => 
            csv['Product Name']?.toLowerCase() === r.title?.toLowerCase() ||
            csv['Product Title']?.toLowerCase() === r.title?.toLowerCase() ||
            csv['SKU'] === r.slug
          )
          setCsvProduct(csvMatch)
        }
      } catch (error) {
        console.error('Failed to fetch CSV data:', error)
      }
      
      const toAbs = (u?: string) => {
        if (!u) return ''
        if (/^https?:\/\//i.test(u)) return u
        const base = apiBase.replace(/\/$/, '')
        const path = u.startsWith('/') ? u : `/${u}`
        return `${base}${path}`
      }
      const item: Product = {
        slug: r.slug,
        title: r.title,
        category: r.category,
        price: r.price,
        listImage: toAbs(r.list_image || ''),
        pdpImages: derivePdpImages(r, toAbs),
        description: r.description || ''
      }
      setProduct(item)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <main className="py-10 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl px-4">
          <div className="animate-pulse">
            <div className="h-8 w-3/4 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
            <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-96 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div className="space-y-4">
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="py-10 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Product not found</h1>
        </div>
      </main>
    )
  }

  const reviews = [
    { name: 'Sarah M.', rating: 5, date: '2 days ago', comment: 'Amazing product! My skin feels so much better after just one week of use.' },
    { name: 'Priya K.', rating: 5, date: '1 week ago', comment: 'Love the natural ingredients. No side effects and great results.' },
    { name: 'Anita R.', rating: 4, date: '2 weeks ago', comment: 'Good quality product. Would recommend to others.' },
    { name: 'Deepa S.', rating: 5, date: '3 weeks ago', comment: 'Perfect for my sensitive skin. Gentle and effective.' },
    { name: 'Riya P.', rating: 4, date: '1 month ago', comment: 'Nice texture and easy to apply. Results are visible.' }
  ]

  const ingredients = [
    { name: 'Aparajita (Blue Tea)', benefit: 'Antioxidant & Anti-aging', percentage: '15%' },
    { name: 'Grapeseed Extract', benefit: 'Moisturizing & Nourishing', percentage: '10%' },
    { name: 'Shea Butter', benefit: 'Deep Hydration', percentage: '8%' },
    { name: 'Vitamin E', benefit: 'Skin Protection', percentage: '5%' },
    { name: 'Natural Oils', benefit: 'Softening & Smoothing', percentage: '12%' }
  ]

  return (
    <>
      {/* Header */}
      <header className="border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <a href="#/" className="text-xl font-bold text-slate-900 dark:text-slate-100">Nefol</a>
              <nav className="hidden md:flex space-x-6">
                <a href="#/" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100">Home</a>
                <a href="#/shop" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100">Shop</a>
                <a href="#/skincare" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100">Skincare</a>
                <a href="#/ingredients" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100">Ingredients</a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              <button className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="py-8 dark:bg-slate-900">
      <div className="mx-auto max-w-6xl px-4">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm">
            <ol className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
              <li><a href="#/" className="hover:text-slate-900 dark:hover:text-slate-100">Home</a></li>
              <li>/</li>
              <li><a href="#/shop" className="hover:text-slate-900 dark:hover:text-slate-100">Shop</a></li>
              <li>/</li>
              <li><a href={`#/shop?category=${product.category}`} className="hover:text-slate-900 dark:hover:text-slate-100">{product.category}</a></li>
              <li>/</li>
              <li className="text-slate-900 dark:text-slate-100">{product.title}</li>
            </ol>
          </nav>

          {/* Product Details */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mb-12">
            {/* Product Media (supports up to 7 images + 1 video) */}
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center bg-black/5 dark:bg-black/20">
                {isVideo(product.pdpImages[selectedImage] || product.listImage) ? (
                  <video
                    src={product.pdpImages[selectedImage] || product.listImage}
                    controls
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <img 
                    src={product.pdpImages[selectedImage] || product.listImage} 
                    alt={product.title} 
                    className="h-full w-full object-cover" 
                  />
                )}
              </div>
              {product.pdpImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.pdpImages.slice(0, 8).map((src, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square overflow-hidden rounded-lg border-2 ${
                        selectedImage === index 
                          ? 'border-blue-500' 
                          : 'border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {isVideo(src) ? (
                        <>
                          <img src={product.listImage} alt={`${product.title} ${index + 1}`} className="h-full w-full object-cover opacity-70" />
                          <span className="absolute inset-0 grid place-items-center text-white">
                            ▶
                          </span>
                        </>
                      ) : (
                        <img src={src} alt={`${product.title} ${index + 1}`} className="h-full w-full object-cover" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">{product.title}</h1>
                <p className="text-slate-600 dark:text-slate-400 mb-4">{product.category}</p>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">(4.8) • 127 reviews</span>
                </div>
              </div>

              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                {(() => {
                  const mrp = csvProduct?.['MRP (₹)'] || csvProduct?.['MRP'] || product.price || '₹599'
                  const websitePrice = csvProduct?.['website price'] || csvProduct?.['Website Price'] || ''
                  
                  return websitePrice && websitePrice !== mrp ? (
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-medium line-through opacity-60 text-slate-500">
                        {mrp}
                      </span>
                      <span className="text-3xl font-bold text-green-600">
                        {websitePrice}
                      </span>
                    </div>
                  ) : (
                    <span>{mrp}</span>
                  )
                })()}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center space-x-4">
                <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">Quantity:</label>
                <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-slate-900 dark:text-slate-100 min-w-[3rem] text-center">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => {
                      if (product) {
                        addItem(product, quantity)
                        // Show success message
                        const button = document.querySelector('[data-add-to-cart]') as HTMLButtonElement
                        if (button) {
                          const originalText = button.textContent
                          button.textContent = 'Added to Cart!'
                          button.classList.add('bg-green-600', 'hover:bg-green-700')
                          button.classList.remove('bg-blue-600', 'hover:bg-blue-700')
                          setTimeout(() => {
                            button.textContent = originalText
                            button.classList.remove('bg-green-600', 'hover:bg-green-700')
                            button.classList.add('bg-blue-600', 'hover:bg-blue-700')
                          }, 2000)
                        }
                      }
                    }}
                    data-add-to-cart
                    className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                  >
                    Add to Cart
                  </button>
                  <button 
                    onClick={() => {
                      if (product) {
                        addItem(product, quantity)
                        window.location.hash = '#/checkout'
                      }
                    }}
                    className="rounded-lg border border-slate-200 px-6 py-3 font-semibold text-slate-900 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800"
                  >
                    Buy Now
                  </button>
                </div>
                <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
                  <span>✓ Free shipping on orders over ₹500</span>
                  <span>✓ 30-day return policy</span>
                  <span>✓ Secure payment</span>
                </div>
              </div>

              {/* Key Features */}
          <div className="space-y-3">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Key Features</h3>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li className="flex items-center space-x-2">
                    <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>100% Natural Ingredients</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Cruelty Free</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Paraben Free</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Suitable for All Skin Types</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
            <div className="flex space-x-8 mb-8">
              <button
                onClick={() => setActiveTab('description')}
                className={`pb-2 font-semibold ${
                  activeTab === 'description'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('ingredients')}
                className={`pb-2 font-semibold ${
                  activeTab === 'ingredients'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Ingredients
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-2 font-semibold ${
                  activeTab === 'reviews'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Reviews (127)
              </button>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === 'description' && (
                <div className="prose max-w-none">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {csvProduct?.['Product Description (Long)'] || csvProduct?.['Long Description'] || product.description}
                  </p>
                  
                  {/* Key Features from CSV */}
                  {csvProduct?.['Bullet Highlights (Short Desc.)'] && (
                    <div className="mt-6">
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Key Features</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400">
                        {csvProduct['Bullet Highlights (Short Desc.)'].split('\n').map((feature: string, index: number) => (
                          <li key={index}>{feature.trim()}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">How to Use</h4>
                      <ol className="list-decimal list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400">
                        {csvProduct?.['How to Use (Steps)'] ? 
                          csvProduct['How to Use (Steps)'].split('\n').map((step: string, index: number) => (
                            <li key={index}>{step.trim()}</li>
                          )) :
                          [
                            'Cleanse your face with a gentle cleanser',
                            'Apply a small amount to face and neck',
                            'Gently massage in circular motions',
                            'Use twice daily for best results'
                          ].map((step, index) => (
                            <li key={index}>{step}</li>
                          ))
                        }
                      </ol>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Benefits</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400">
                        {csvProduct?.['Ingredient Benefits'] ? 
                          csvProduct['Ingredient Benefits'].split('\n').map((benefit: string, index: number) => (
                            <li key={index}>{benefit.trim()}</li>
                          )) :
                          [
                            'Deep hydration and nourishment',
                            'Reduces signs of aging',
                            'Improves skin texture and tone',
                            'Protects against environmental damage'
                          ].map((benefit, index) => (
                            <li key={index}>{benefit}</li>
                          ))
                        }
                      </ul>
                    </div>
                  </div>
                  
                  {/* Product Details from CSV */}
                  {csvProduct && (
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Product Details</h4>
                        <div className="space-y-2 text-sm">
                          {csvProduct['SKU'] && (
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">SKU:</span>
                              <span className="text-slate-900 dark:text-slate-100">{csvProduct['SKU']}</span>
                            </div>
                          )}
                          {csvProduct['Net Quantity (Content)'] && (
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">Net Quantity:</span>
                              <span className="text-slate-900 dark:text-slate-100">{csvProduct['Net Quantity (Content)']}</span>
                            </div>
                          )}
                          {csvProduct['Net Weight (Product Only)'] && (
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">Net Weight:</span>
                              <span className="text-slate-900 dark:text-slate-100">{csvProduct['Net Weight (Product Only)']}</span>
                            </div>
                          )}
                          {csvProduct['Country of Origin'] && (
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">Country of Origin:</span>
                              <span className="text-slate-900 dark:text-slate-100">{csvProduct['Country of Origin']}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Key Ingredients</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {csvProduct['Key Ingredients'] || 'Premium natural ingredients carefully selected for optimal skin health.'}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* PDP Banners (4-6) */}
                  <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {getPdpBanners().map((src, i) => (
                      <img key={i} src={src} alt={`banner-${i+1}`} className="w-full h-40 object-cover rounded-lg border border-slate-200 dark:border-slate-700" />
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'ingredients' && (
                <div className="space-y-4">
                  {ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100">{ingredient.name}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{ingredient.benefit}</p>
                      </div>
                      <span className="text-sm font-semibold text-blue-600">{ingredient.percentage}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">4.8 out of 5</span>
                    </div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">Based on 127 reviews</span>
                  </div>

                  <div className="space-y-4">
                    {reviews.map((review, index) => (
                      <div key={index} className="p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                              <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                                {review.name.charAt(0)}
                              </span>
          </div>
          <div>
                              <h4 className="font-semibold text-slate-900 dark:text-slate-100">{review.name}</h4>
                              <div className="flex text-yellow-400">
                                {[...Array(review.rating)].map((_, i) => (
                                  <svg key={i} className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-sm text-slate-600 dark:text-slate-400">{review.date}</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Recently Reviewed Products Section */}
      <section className="py-16 bg-slate-50 dark:bg-slate-800">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8">Recently Reviewed Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {getRecentlyReviewedProducts().map((item, index) => (
              <div key={index} className="bg-white dark:bg-slate-700 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <a href={`#/product/${item.slug}`}>
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 line-clamp-2">{item.title}</h3>
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < item.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                        ))}
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-400 ml-2">({item.reviewCount})</span>
                    </div>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{item.price}</p>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Products Section */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {getRelatedProducts(product).map((item, index) => (
              <div key={index} className="bg-white dark:bg-slate-700 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <a href={`#/product/${item.slug}`}>
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 line-clamp-2">{item.title}</h3>
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < item.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                        ))}
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-400 ml-2">({item.reviewCount})</span>
                    </div>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{item.price}</p>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function derivePdpImages(row: any, toAbs: (u?: string)=>string): string[] {
  if (row.pdp_images && Array.isArray(row.pdp_images) && row.pdp_images.length) return row.pdp_images.map((u: string) => toAbs(u))
  if (row.list_image) return [toAbs(row.list_image)]
  return []
}

function isVideo(url?: string): boolean {
  if (!url) return false
  return /\.(mp4|webm|ogg)(\?|$)/i.test(url)
}

function getPdpBanners(): string[] {
  // Return 4-6 local banner images from public/IMAGES
  return [
    '/IMAGES/BANNER.jpg',
    '/IMAGES/BANNER2.jpg',
    '/IMAGES/BANNER3.jpg',
    '/IMAGES/BANNER4.jpg',
    '/IMAGES/BANNER5.jpg',
    '/IMAGES/BANNER6.jpg'
  ]
}

function getRecentlyReviewedProducts() {
  // Mock data for recently reviewed products
  return [
    {
      slug: 'vitamin-c-serum',
      title: 'Vitamin C Brightening Serum',
      image: '/IMAGES/vitamin-c-serum.jpg',
      price: '₹1,299',
      rating: 5,
      reviewCount: 89
    },
    {
      slug: 'hyaluronic-acid-moisturizer',
      title: 'Hyaluronic Acid Moisturizer',
      image: '/IMAGES/hyaluronic-moisturizer.jpg',
      price: '₹899',
      rating: 4,
      reviewCount: 156
    },
    {
      slug: 'retinol-night-cream',
      title: 'Retinol Night Cream',
      image: '/IMAGES/retinol-cream.jpg',
      price: '₹1,599',
      rating: 5,
      reviewCount: 67
    },
    {
      slug: 'niacinamide-toner',
      title: 'Niacinamide Pore Minimizing Toner',
      image: '/IMAGES/niacinamide-toner.jpg',
      price: '₹699',
      rating: 4,
      reviewCount: 203
    }
  ]
}

// Helper function to get related products based on current product
function getRelatedProducts(currentProduct: Product | null) {
  if (!currentProduct) return []
  
  // For now, return empty array - will be replaced with real API call
  // This should fetch related products from backend based on category
  return []
}