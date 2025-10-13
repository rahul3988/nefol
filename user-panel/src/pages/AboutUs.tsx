import React from 'react'
import { Heart, Leaf, Users, Award, Target, Globe, Shield } from 'lucide-react'

export default function AboutUs() {
  return (
    <main className="py-10 dark:bg-slate-900 min-h-screen">
      <div className="mx-auto max-w-6xl px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            About Nefol
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Natural beauty products that combine science with herbs, crafted with care and commitment to quality.
          </p>
        </div>

        {/* Our Story */}
        <div className="mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800 rounded-2xl p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                  Our Story
                </h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                  Nefol has a series of beauty products that don't have harmful components in them. 
                  Nefol products are based on the concept of combination with science and herbs. 
                  Nefol Aesthetics Private Limited extends social and financial help to causes such as 
                  education, health, women's rights and empowerment, rural development.
                </p>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  The concept of providing quality products to society took a long time for research. 
                  Nefol fulfilled all the global norms and set its standard accordingly.
                </p>
              </div>
              <div className="bg-white dark:bg-slate-700 rounded-xl p-6">
                <img 
                  src="/IMAGES/placeholder.jpg" 
                  alt="Nefol Story" 
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Blue Tea Innovation */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8 text-center">
            Our Innovation: Blue Tea
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🌿</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 text-center">
                Blue Tea Excellence
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Nefol products' main component is Blue Tea, a flower that gives a new standard in cosmetic excellence. 
                Blue Tea is an herbal infusion made from butterfly pea flowers which is rich in Anthocyanins.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 text-center">
                Natural Benefits
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Anthocyanins give the tea its bright blue color and medical properties - it uplifts mood, 
                facilitates digestion, and most importantly enhances skin and stimulates hair growth.
              </p>
            </div>
          </div>
        </div>

        {/* Our Commitment */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8 text-center">
            Our Commitment
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-800 dark:to-slate-800 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                Natural & Safe
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Nefol products are paraben, cruelty, nasties and sulphate free. 
                We use the same wisdom in combination with science to develop products that generate good results.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                Science & Technology
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                With beautiful incorporation of Vedic Science and technology, we produce products 
                which enhance, protect and glow skin, hair and body.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-800 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                Global Standards
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Our products complete all global criteria. For years we promise to give our best 
                to society and will maintain our culture.
              </p>
            </div>
          </div>
        </div>

        {/* Social Responsibility */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8 text-center">
            Social Responsibility
          </h2>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-slate-800 dark:to-slate-800 rounded-2xl p-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                Making a Difference
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-4xl mx-auto">
                Nefol Aesthetics Private Limited extends social and financial help to causes such as 
                education, health, women's rights and empowerment, rural development. We believe in 
                giving back to society and creating a positive impact beyond just skincare.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Join Our Journey</h2>
          <p className="text-xl mb-8 opacity-90">
            Experience the power of natural beauty with Nefol products. 
            Discover the difference that science-backed natural ingredients can make.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#/shop" 
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Explore Products
            </a>
            <a 
              href="#/contact" 
              className="inline-block border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}