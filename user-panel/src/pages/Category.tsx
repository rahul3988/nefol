import { useEffect, useState } from 'react'
import { useProducts } from '../hooks/useProducts'
import type { Product } from '../data/products'

export default function CategoryPage() {
  const { items, loading, error } = useProducts()
  const [category, setCategory] = useState<string>('')
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])

  useEffect(() => {
    const hash = window.location.hash || '#/'
    const match = hash.match(/^#\/category\/([^?#]+)/)
    const cat = match?.[1] || ''
    setCategory(cat)
    
    if (items.length > 0) {
      const filtered = items.filter(product => {
        const productCategory = (product.category || '').toLowerCase()
        const targetCategory = cat.toLowerCase()
        
        // Map categories based on CSV data
        if (targetCategory === 'face') {
          return productCategory.includes('face') || 
                 productCategory.includes('moisturizer') ||
                 productCategory.includes('serum') ||
                 productCategory.includes('mask') ||
                 productCategory.includes('scrub') ||
                 productCategory.includes('cream') ||
                 productCategory.includes('cleanser')
        }
        if (targetCategory === 'hair') {
          return productCategory.includes('hair') || 
                 productCategory.includes('shampoo') ||
                 productCategory.includes('oil')
        }
        if (targetCategory === 'body') {
          return productCategory.includes('body') || 
                 productCategory.includes('lotion')
        }
        return false
      })
      setFilteredProducts(filtered)
    }
  }, [items, category])

  const getCategoryTitle = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'face': return 'Face Care'
      case 'hair': return 'Hair Care'
      case 'body': return 'Body Care'
      default: return 'Category'
    }
  }

  const getCategoryDescription = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'face': return 'Complete face care essentials for healthy, glowing skin'
      case 'hair': return 'Nourishing hair care products for strong, shiny hair'
      case 'body': return 'Body care products for smooth, hydrated skin'
      default: return 'Browse our products'
    }
  }

  if (loading) {
    return (
      <main className="py-10 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="py-10 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </main>
    )
  }

  return (
    <main className="py-10 dark:bg-slate-900">
      <div className="mx-auto max-w-6xl px-4">
        <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-slate-100">{getCategoryTitle(category)}</h1>
        <p className="mb-6 text-slate-600 dark:text-slate-400">{getCategoryDescription(category)}</p>
        
        {filteredProducts.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400">No products found in this category.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {filteredProducts.map((product) => (
              <article key={product.slug} className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
                <a href={`#/product/${product.slug}`}>
                  <img src={product.listImage} alt={product.title} className="h-40 w-full rounded-lg border border-slate-200 object-cover dark:border-slate-600" loading="lazy" />
                </a>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{product.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">{product.category}</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-slate-900 dark:text-slate-100">{product.price}</span>
                </div>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  <a href={`#/product/${product.slug}`} className="rounded-md border border-slate-200 px-3 py-2 text-center font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">View</a>
                  <button className="rounded-md bg-blue-600 px-3 py-2 font-semibold text-white hover:bg-blue-700">Add</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}