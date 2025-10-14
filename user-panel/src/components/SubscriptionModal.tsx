import React, { useState } from 'react'
import { X } from 'lucide-react'

interface SubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!whatsappNumber) return

    setIsSubmitting(true)
    try {
      // Here you would typically send the WhatsApp number to your backend
      console.log('Subscribing WhatsApp number:', whatsappNumber)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Close modal after successful subscription
      onClose()
    } catch (error) {
      console.error('Subscription failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      
      {/* Modal sliding from left */}
      <div className={`absolute top-1/2 left-0 transform -translate-y-1/2 transition-transform duration-500 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="relative w-full max-w-4xl bg-white rounded-lg overflow-hidden shadow-2xl">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 bg-white border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>

          <div className="flex flex-col lg:flex-row min-h-[500px]">
            {/* Left Section - Product Image */}
            <div className="lg:w-1/2 relative overflow-hidden" style={{ backgroundColor: '#F4F9F9' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100"></div>
              
              {/* Product Image */}
              <div className="relative h-full flex items-center justify-center p-8">
                <div className="relative z-10">
                  {/* Main Product Bottle */}
                  <div className="relative mb-8">
                    <img 
                      src="/IMAGES/BANNER (1).jpg" 
                      alt="Nefol Product"
                      className="w-64 h-80 object-contain mx-auto"
                    />
                    
                    {/* Product Details Overlay */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-lg p-4 w-56">
                      <div className="text-center">
                        <h3 className="text-lg font-bold mb-2" style={{ color: '#1B4965' }}>
                          NEFÖL
                        </h3>
                        <p className="text-sm mb-1" style={{ color: '#9DB4C0' }}>
                          NATURAL AS THE MORNING DEW
                        </p>
                        <p className="text-sm font-semibold" style={{ color: '#4B97C9' }}>
                          Blue Tea HAIR MASK
                        </p>
                        <p className="text-xs mt-2" style={{ color: '#9DB4C0' }}>
                          ARGAN, OLIVE SQUALANE, QUINOA PROTEIN
                        </p>
                        <p className="text-xs" style={{ color: '#9DB4C0' }}>
                          ALL TYPES OF HAIR
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-20 left-8 opacity-20">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                      <span className="text-2xl">🌿</span>
                    </div>
                  </div>
                  
                  <div className="absolute top-32 right-8 opacity-20">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <span className="text-xl">🦋</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Subscription Form */}
            <div className="lg:w-1/2 p-8 flex flex-col justify-center" style={{ backgroundColor: '#1B4965' }}>
              <div className="max-w-md mx-auto w-full">
                {/* Logo */}
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm font-bold">N</span>
                  </div>
                  <span className="text-2xl font-bold text-white">NEFÖL</span>
                </div>

                {/* Heading */}
                <h2 className="text-3xl font-bold text-white mb-4">
                  Join The Nefol Circle
                </h2>

                {/* Description */}
                <p className="text-white/90 mb-8 text-lg">
                  Stay ahead with exclusive style drops, member-only offers, and insider fashion updates.
                </p>

                {/* Subscription Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="tel"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="WhatsApp Number*"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting || !whatsappNumber}
                    className="w-full bg-white text-gray-900 py-3 px-6 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Subscribing...' : 'Subscribe Now'}
                  </button>
                </form>

                {/* Additional Info */}
                <p className="text-white/70 text-sm mt-6 text-center">
                  By subscribing, you agree to receive WhatsApp messages from Nefol.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}