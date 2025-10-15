import React, { createContext, useContext, useMemo, useState, useEffect } from 'react'
import type { Product } from '../types'
import { calculatePurchaseCoins } from '../utils/points'

export type CartItem = {
  slug: string
  title: string
  price: string
  image?: string
  quantity: number
  category?: string
}

type CartContextValue = {
  items: CartItem[]
  addItem: (p: Product, quantity?: number) => void
  removeIndex: (index: number) => void
  updateQuantity: (index: number, quantity: number) => void
  clear: () => void
  subtotal: number
  tax: number
  total: number
  coinsEarned: number
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

// Cart storage key
const CART_STORAGE_KEY = 'nefol_cart_items'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Load cart from localStorage on component mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        if (Array.isArray(parsedCart)) {
          setItems(parsedCart)
        }
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error)
    }
  }, [])

  // Save cart to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error)
    }
  }, [items])

  const addItem = (p: Product, quantity: number = 1) => {
    setItems(prev => {
      const idx = prev.findIndex(i => i.slug === p.slug)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity }
        return next
      }
      return [...prev, { slug: p.slug, title: p.title, price: p.price, image: p.listImage, quantity, category: p.category }]
    })
  }

  const removeIndex = (index: number) => setItems(prev => prev.filter((_, i) => i !== index))
  
  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeIndex(index)
    } else {
      setItems(prev => prev.map((item, i) => 
        i === index ? { ...item, quantity } : item
      ))
    }
  }
  
  const clear = () => {
    setItems([])
    // Also clear from localStorage
    try {
      localStorage.removeItem(CART_STORAGE_KEY)
    } catch (error) {
      console.error('Failed to clear cart from localStorage:', error)
    }
  }

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + parsePrice(i.price) * i.quantity, 0), [items])
  
  // Category-specific tax calculation
  const tax = useMemo(() => {
    return items.reduce((totalTax, item) => {
      const itemSubtotal = parsePrice(item.price) * item.quantity
      const category = (item.category || '').toLowerCase()
      
      // 5% tax for hair products, 18% for others
      const taxRate = category.includes('hair') ? 0.05 : 0.18
      return totalTax + (itemSubtotal * taxRate)
    }, 0)
  }, [items])
  
  const total = useMemo(() => subtotal + tax, [subtotal, tax])
  
  const coinsEarned = useMemo(() => calculatePurchaseCoins(total), [total])

  const value = useMemo(() => ({ items, addItem, removeIndex, updateQuantity, clear, subtotal, tax, total, coinsEarned }), [items, subtotal, tax, total, coinsEarned])
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

export function parsePrice(input: string): number {
  const m = (input || '').replace(/[^0-9.]/g, '')
  const n = Number(m)
  return Number.isFinite(n) ? n : 0
}


