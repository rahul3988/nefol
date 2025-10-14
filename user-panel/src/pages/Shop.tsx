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
    <main className="py-10 dark:bg-slate-900">
      <div className="mx-auto max-w-6xl px-4">
        <h1 className="mb-4 text-3xl font-bold text-slate-900 dark:text-slate-100">Shop All</h1>
        <p className="mb-6 text-slate-600 dark:text-slate-400">Browse our full collection of skincare and haircare essentials.</p>
        {loading && <p className="text-slate-600 dark:text-slate-400">Loading products...</p>}
        {error && <p className="text-red-600 dark:text-red-400">{error}</p>}
        {!loading && !error && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {items.map((p) => (
              <article key={p.slug} className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
                <a href={`#/product/${p.slug}`}>
                  <img src={p.listImage || (p.pdpImages && p.pdpImages[0])} alt={p.title} className="h-40 w-full rounded-lg border border-slate-200 object-cover dark:border-slate-600" loading="lazy" />
                </a>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{p.title}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-slate-900 dark:text-slate-100">{p.price}</span>
                </div>
                <div className="mt-1 grid grid-cols-3 gap-1">
                  <a href={`#/product/${p.slug}`} className="rounded-md border border-slate-200 px-2 py-2 text-center text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">View</a>
                  <button 
                    onClick={() => {
                      addItem(p)
                      addToCart?.(p)
                    }}
                    className="rounded-md bg-blue-600 px-2 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                  >
                    Cart
                  </button>
                  <button 
                    onClick={() => addToWishlist?.(p)}
                    className="rounded-md bg-red-500 px-2 py-2 text-xs font-semibold text-white hover:bg-red-600"
                  >
                    ❤️
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
