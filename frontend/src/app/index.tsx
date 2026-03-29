import { useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native'
import { useRouter } from 'expo-router'
import { getProducts } from '@/api/services/product-service'
import { Product } from '@/types/product'

export default function ProductListScreen() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadProducts = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getProducts()
      setProducts(data)
    } catch (err) {
      const message =
        'Something went wrong while loading products.\nPlease try again.\n\nIf the issue persists, contact customer support.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  if (isLoading) return <ActivityIndicator style={styles.center} />
  if (error) return <Text style={styles.error}>{error}</Text>

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={p => p.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/product/${item.id}`)}
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>£{item.price.toFixed(2)}</Text>
            <Text style={item.stock > 0 ? styles.inStock : styles.outOfStock}>
              {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16, gap: 12 },
  card: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  name: { fontSize: 16, fontWeight: '600' },
  price: { fontSize: 14, color: '#444', marginTop: 4 },
  inStock: { fontSize: 12, color: 'green', marginTop: 4 },
  outOfStock: { fontSize: 12, color: 'red', marginTop: 4 },
  error: { color: 'red', textAlign: 'center', marginTop: 20 },
})