export default function Contact() {
  return (
    <main className="py-10 dark:bg-slate-900">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-slate-900 dark:text-slate-100">Contact Us</h1>
          <p className="mx-auto max-w-3xl text-lg text-slate-600 dark:text-slate-400">
            Have a question or comment? Use the form below to send us a message, or contact us by mail.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Contact Form */}
          <div>
            <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-slate-100">Get In Touch!</h2>
            <p className="mb-6 text-slate-600 dark:text-slate-400">
              We'd love to hear from you - please use the form to send us your message or ideas. 
              Or simply pop in for a cup of fresh tea and a cookie:
            </p>
            
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="name">Name</label>
                <input 
                  id="name" 
                  className="h-12 w-full rounded-lg border border-slate-300 px-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100" 
                  required 
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="phone">Phone number</label>
                <input 
                  id="phone" 
                  type="tel" 
                  className="h-12 w-full rounded-lg border border-slate-300 px-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100" 
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="email">Email *</label>
                <input 
                  id="email" 
                  type="email" 
                  className="h-12 w-full rounded-lg border border-slate-300 px-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100" 
                  required 
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="message">Comment *</label>
                <textarea 
                  id="message" 
                  rows={6} 
                  className="w-full rounded-lg border border-slate-300 p-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100" 
                  required 
                />
              </div>
              <button className="h-12 rounded-lg bg-blue-600 px-8 font-semibold text-white hover:bg-blue-700 transition-colors">
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-slate-100">Contact Information</h2>
            
            <div className="space-y-8">
              {/* Office Addresses */}
              <div>
                <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Office Addresses</h3>
                <div className="space-y-4">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">Lucknow Office</h4>
                    <p className="text-slate-600 dark:text-slate-400">
                      703, BCC Tower, Sultanpur Road,<br />
                      Arjunganj, Lucknow,<br />
                      Uttar Pradesh – 226002, India
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">Greater Noida Office</h4>
                    <p className="text-slate-600 dark:text-slate-400">
                      D-2627, 12th Avenue, Gaur City-2,<br />
                      Sector 16C, Greater Noida West,<br />
                      Ghaziabad, Uttar Pradesh – 201009, India
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div>
                <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Contact Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                      <span className="text-blue-600 dark:text-blue-400">📞</span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">Phone</p>
                      <p className="text-slate-600 dark:text-slate-400">+91-8887847213</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                      <span className="text-blue-600 dark:text-blue-400">✉️</span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">Email</p>
                      <p className="text-slate-600 dark:text-slate-400">support@thenefol.com</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                      <span className="text-green-600 dark:text-green-400">💬</span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">WhatsApp</p>
                      <p className="text-slate-600 dark:text-slate-400">Chat with us on WhatsApp</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="mt-16">
          {/* Affiliate Program */}
          <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 dark:border-slate-700 dark:from-slate-800 dark:to-slate-800">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <span className="text-xl">🤝</span>
            </div>
            <h3 className="mb-4 text-2xl font-bold text-slate-900 dark:text-slate-100">Affiliate Program</h3>
            <p className="mb-6 text-slate-600 dark:text-slate-400">
              Join our affiliate program and earn commissions by promoting Nefol products. 
              Share our natural skincare solutions with your audience and get rewarded for every sale.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-green-600 dark:text-green-400">✓</span>
                <span className="text-sm text-slate-700 dark:text-slate-300">Competitive commission rates</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-600 dark:text-green-400">✓</span>
                <span className="text-sm text-slate-700 dark:text-slate-300">Marketing materials provided</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-600 dark:text-green-400">✓</span>
                <span className="text-sm text-slate-700 dark:text-slate-300">Real-time tracking dashboard</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-600 dark:text-green-400">✓</span>
                <span className="text-sm text-slate-700 dark:text-slate-300">Dedicated support team</span>
              </div>
            </div>
            <a href="#/affiliate" className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 transition-colors">
              Join Affiliate Program
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}


