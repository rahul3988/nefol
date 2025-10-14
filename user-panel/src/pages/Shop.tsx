import { useProducts } from '../hooks/useProducts'
import { useCart } from '../contexts/CartContext'

interface ShopProps {
  addToCart?: (product: any) => void
  addToWishlist?: (product: any) => void
}

export default function Shop({ addToCart, addToWishlist }: ShopProps) {
  const { items, loading, error } = useProducts()
  const { addItem } = useCart()
  return (
    <main className="min-h-screen py-10" style={{backgroundColor: '#F4F9F9'}}>
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif mb-4" style={{color: '#1B4965'}}>SHOP ALL</h1>
          <p className="text-lg font-light max-w-2xl mx-auto" style={{color: '#9DB4C0'}}>
            Browse our full collection of premium skincare and haircare essentials crafted with natural ingredients.
          </p>
        </div>
        
        {loading && (
          <div className="text-center py-12">
            <p className="text-lg" style={{color: '#9DB4C0'}}>Loading products...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center py-12">
            <p className="text-lg text-red-600">{error}</p>
          </div>
        )}
        
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {items.map((p) => (
              <article key={p.slug} className="bg-white rounded-lg shadow-sm group overflow-hidden">
                <div className="relative overflow-hidden">
                  <a href={`#/product/${p.slug}`}>
                    <img 
                      src={p.listImage || (p.pdpImages && p.pdpImages[0])} 
                      alt={p.title} 
                      className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105" 
                      loading="lazy" 
                    />
                  </a>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                      onClick={() => addToWishlist?.(p)}
                      className="w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg"
                    >
                      <span className="text-lg" style={{color: '#1B4965'}}>❤️</span>
                    </button>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="text-white px-3 py-1 text-xs font-medium tracking-wide uppercase rounded-full" style={{backgroundColor: '#4B97C9'}}>
                      {p.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-medium tracking-wide mb-2" style={{color: '#1B4965'}}>
                    {p.title}
                  </h3>
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      <span className="text-sm">★★★★★</span>
                    </div>
                    <span className="text-sm ml-2" style={{color: '#9DB4C0'}}>4.5 (45 Reviews)</span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-lg font-medium" style={{color: '#1B4965'}}>
                      {p.price || '₹599'}
                    </span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          addItem(p)
                          addToCart?.(p)
                        }}
                        className="px-4 py-2 text-white text-xs font-medium transition-all duration-300 tracking-wide uppercase rounded shadow-lg"
                        style={{backgroundColor: '#4B97C9'}}
                      >
                        ADD TO CART
                      </button>
                      <a 
                        href={`#/product/${p.slug}`}
                        className="px-4 py-2 text-white text-xs font-medium transition-all duration-300 tracking-wide uppercase rounded shadow-lg"
                        style={{backgroundColor: '#1B4965'}}
                      >
                        VIEW
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
