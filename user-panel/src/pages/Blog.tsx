export default function Blog() {
  const posts = [
    {
      id: 'origin-blue-tea',
      title: 'The Origin of Blue Tea Flower',
      date: 'May 01, 2025',
      excerpt: 'Blue tea, commonly known as butterfly pea flower tea, originates from Southeast Asia, particularly Thailand, Vietnam, Malaysia, and India. The tea is derived from the Clitoria ternatea plant...',
      image: '/IMAGES/FACE SERUM (5).jpg',
      featured: true
    },
    {
      id: 'diy-skincare-tips',
      title: 'DIY Skincare Tips Using Blue Pea Flower Extract',
      date: 'May 01, 2025',
      excerpt: 'While professional skincare products provide formulated benefits, incorporating DIY treatments can enhance your routine. Here are some simple recipes using Blue Pea Flower extract...',
      image: '/IMAGES/HYDRATING MOISTURIZER (5).jpg',
      featured: false
    },
    {
      id: 'combat-skin-issues',
      title: 'How to Combat Common Skin Issues with Nefol\'s Skincare Line',
      date: 'May 01, 2025',
      excerpt: 'Everyone\'s skin is unique, but many of us face similar challenges. Whether it\'s acne, dryness, or signs of aging, Nefol\'s Blue Pea Flower-infused products can help address these concerns...',
      image: '/IMAGES/FACE MASK (5).jpg',
      featured: false
    },
    {
      id: 'skincare-routine-guide',
      title: 'A Comprehensive Guide to Nefol\'s Skincare Routine',
      date: 'May 01, 2025',
      excerpt: 'Achieving healthy, glowing skin doesn\'t have to be complicated. With the right products and a consistent routine, you can nurture your skin effectively...',
      image: '/IMAGES/FACE CLEANSER (5).jpg',
      featured: false
    },
    {
      id: 'natural-ingredients',
      title: 'Natural Ingredients for Glowing Skin: The Power of Blue Pea Flower and More',
      date: 'May 01, 2025',
      excerpt: 'Natural skincare offers a path to healthier, more radiant skin. By choosing products infused with powerful botanicals like the Blue Pea Flower...',
      image: '/IMAGES/BODY LOTION (5).jpg',
      featured: false
    },
    {
      id: 'blue-pea-benefits',
      title: 'Top 5 Skincare Benefits of Using Blue Pea Flower-Infused Products',
      date: 'May 01, 2025',
      excerpt: 'When it comes to skincare, natural ingredients are becoming increasingly popular for their gentle yet effective properties. The Blue Pea Flower stands out as a powerhouse ingredient...',
      image: '/IMAGES/HAIR MASK (5).jpg',
      featured: false
    },
    {
      id: 'miracle-blue-pea',
      title: 'The Miracle of Blue Pea Flower in Skincare',
      date: 'May 01, 2025',
      excerpt: 'The world of skincare is constantly evolving, with nature offering an abundance of ingredients that promise to enhance our beauty routines. One such gem is the Blue Pea Flower...',
      image: '/IMAGES/FACE SERUM (5).jpg',
      featured: false
    }
  ]

  const featuredPost = posts.find(post => post.featured)
  const regularPosts = posts.filter(post => !post.featured)

  return (
    <main className="py-10 dark:bg-slate-900">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-slate-900 dark:text-slate-100">Nefol Blogs</h1>
          <p className="mx-auto max-w-3xl text-lg text-slate-600 dark:text-slate-400">
            Discover expert skincare tips, ingredient insights, and beauty routines from our team of skincare professionals.
          </p>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-12">
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-lg dark:border-slate-700 dark:bg-slate-800">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img 
                    src={featuredPost.image} 
                    alt={featuredPost.title} 
                    className="h-64 w-full object-cover md:h-full" 
                    loading="lazy" 
                  />
                </div>
                <div className="p-8 md:w-1/2">
                  <div className="mb-2">
                    <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      Featured
                    </span>
                  </div>
                  <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-slate-100">{featuredPost.title}</h2>
                  <p className="mb-4 text-slate-600 dark:text-slate-400">{featuredPost.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500 dark:text-slate-400">On {featuredPost.date} by Nefol Aesthetics Pvt. Ltd.</span>
                    <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Articles Section */}
        <div className="mb-8">
          <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-slate-100">Recent Articles</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {regularPosts.map((post) => (
              <article key={post.id} className="rounded-xl border border-slate-200 bg-white overflow-hidden hover:shadow-lg transition-shadow dark:border-slate-700 dark:bg-slate-800">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="h-48 w-full object-cover" 
                  loading="lazy" 
                />
                <div className="p-6">
                  <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{post.title}</h3>
                  <p className="mb-4 text-sm text-slate-600 dark:text-slate-400 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400">{post.date}</span>
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors dark:text-blue-400 dark:hover:text-blue-300">
                      Read More →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Blog Tags */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800">
          <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Blog Tags</h3>
          <div className="flex flex-wrap gap-2">
            {['Body lotion', 'Face Care', 'Nefol', 'skin care', 'summer', 'Blue Tea', 'Natural Ingredients', 'Skincare Routine'].map((tag) => (
              <span 
                key={tag}
                className="rounded-full bg-white px-3 py-1 text-sm text-slate-600 border border-slate-200 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-blue-900 dark:hover:text-blue-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}


