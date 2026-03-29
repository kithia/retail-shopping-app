import { useEffect, useState } from 'react'
import { getCart } from '@/api/services/cart-service'

export function useCartCount() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    getCart()
      .then(cart => {
        const total = cart.items.reduce((sum, item) => sum + item.quantity, 0)
        setCount(total)
      })
      .catch(() => setCount(0))
  }, [])

  return count
}