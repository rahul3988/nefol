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
  ]

  return (
    <main className="min-h-screen py-10" style={{backgroundColor: '#F4F9F9'}}>
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif mb-4" style={{color: '#1B4965'}}>BLOG</h1>
          <p className="text-lg font-light max-w-2xl mx-auto" style={{color: '#9DB4C0'}}>
            Discover the latest insights on natural skincare, beauty tips, and the science behind our ingredients.
          </p>
        </div>

        {/* Featured Post */}
        {posts.filter(post => post.featured).map((post) => (
          <div key={post.id} className="mb-16">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="relative">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-96 lg:h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="text-white px-3 py-1 text-xs font-medium tracking-wide uppercase rounded-full" style={{backgroundColor: '#4B97C9'}}>
                      FEATURED
                    </span>
                  </div>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="mb-4">
                    <span className="text-sm font-light" style={{color: '#9DB4C0'}}>{post.date}</span>
                  </div>
                  <h2 className="text-3xl font-serif mb-4" style={{color: '#1B4965'}}>
                    {post.title}
                  </h2>
                  <p className="text-lg font-light mb-6 leading-relaxed" style={{color: '#9DB4C0'}}>
                    {post.excerpt}
                  </p>
                  <a 
                    href={`#/blog/${post.id}`}
                    className="inline-block px-8 py-4 text-white font-medium transition-all duration-300 text-sm tracking-wide uppercase shadow-lg"
                    style={{backgroundColor: '#1B4965'}}
                  >
                    READ MORE
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.filter(post => !post.featured).map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-sm group overflow-hidden">
              <div className="relative overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="text-white px-3 py-1 text-xs font-medium tracking-wide uppercase rounded-full" style={{backgroundColor: '#4B97C9'}}>
                    BLOG
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-3">
                  <span className="text-sm font-light" style={{color: '#9DB4C0'}}>{post.date}</span>
                </div>
                <h3 className="text-xl font-serif mb-3" style={{color: '#1B4965'}}>
                  {post.title}
                </h3>
                <p className="text-sm font-light mb-4 leading-relaxed" style={{color: '#9DB4C0'}}>
                  {post.excerpt}
                </p>
                <a 
                  href={`#/blog/${post.id}`}
                  className="inline-block px-6 py-3 text-white font-medium transition-all duration-300 text-xs tracking-wide uppercase shadow-lg"
                  style={{backgroundColor: '#4B97C9'}}
                >
                  READ MORE
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h3 className="text-2xl font-serif mb-4" style={{color: '#1B4965'}}>Stay Updated</h3>
            <p className="text-lg font-light mb-6" style={{color: '#9DB4C0'}}>
              Subscribe to our newsletter for the latest beauty tips, product updates, and exclusive offers.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 h-12 rounded-lg border border-gray-300 px-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                required 
              />
              <button 
                type="submit"
                className="px-8 py-3 text-white font-medium transition-all duration-300 text-sm tracking-wide uppercase shadow-lg rounded-lg"
                style={{backgroundColor: '#1B4965'}}
              >
                SUBSCRIBE
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}