import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { addProductToCart } from '@/api/services/cart-service'
import { getProduct } from '@/api/services/product-service'
import { Product } from '@/api/types/product'

export default function ProductDetailScreen() {
  const router = useRouter()
  const params = useLocalSearchParams<{ id?: string | string[] }>()
  const productId = Array.isArray(params.id) ? params.id[0] : params.id

  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProduct()
  }, [productId])

  const loadProduct = async () => {
    if (!productId) {
      setError('No product ID provided')
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      const data = await getProduct(productId)
      setProduct(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load product'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!product) {
      return
    }

    try {
      setIsSubmitting(true)
      await addProductToCart(product.id, 1)
      Alert.alert('Added to cart', `${product.name} has been added to your cart.`)
      router.push("/cart")
    } catch {
      Alert.alert('Unable to add item', 'Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) return <ActivityIndicator style={styles.center} />
  if (error || !product) return <Text style={styles.error}>{error ?? 'Product not found'}</Text>

  return (
    <>
      <Stack.Screen options={{ title: product.name }} />
      <View style={styles.container}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>£{product.price.toFixed(2)}</Text>
        <Text style={styles.description}>{product.description}</Text>
        <Text style={product.stock > 0 ? styles.inStock : styles.outOfStock}>
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </Text>
        <TouchableOpacity
          style={[styles.button, product.stock === 0 && styles.buttonDisabled]}
          disabled={product.stock === 0 || isSubmitting}
          onPress={handleAddToCart}
        >
          <Text style={styles.buttonText}>
            {isSubmitting ? 'Adding...' : 'Add to cart'}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, padding: 24, gap: 16, backgroundColor: '#fff' },
  name: { fontSize: 28, fontWeight: '700', color: '#111' },
  price: { fontSize: 22, fontWeight: '600', color: '#444' },
  description: { fontSize: 16, lineHeight: 24, color: '#444' },
  inStock: { fontSize: 14, color: 'green' },
  outOfStock: { fontSize: 14, color: 'red' },
  button: {
    marginTop: 8,
    backgroundColor: '#111',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  error: { color: 'red', textAlign: 'center', marginTop: 20 },
})