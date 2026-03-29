import { useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native'
import { useRouter } from 'expo-router'
import {
  getCart,
  removeProductFromCart,
  reduceProductQuantityInCart,
  addProductToCart,
  clearCart,
} from '@/api/services/cart-service'
import { Cart } from '@/api/types/cart'
import { CartItem } from '@/api/types/cartItem'

export default function CartScreen() {
  const router = useRouter()
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCart = async () => {
    try {
      const data = await getCart()
      setCart(data)
    } catch {
      setError('Failed to load cart')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

  const handleIncrease = async (item: CartItem) => {
    try {
      await addProductToCart(item.productId, 1)
      await fetchCart()
    } catch {
      Alert.alert('Error', 'Could not increase quantity')
    }
  }

  const handleDecrease = async (item: CartItem) => {
    try {
      if (item.quantity === 1) {
        await removeProductFromCart(item.productId)
      } else {
        await reduceProductQuantityInCart(item.productId, 1)
      }
      await fetchCart()
    } catch {
      Alert.alert('Error', 'Could not decrease quantity')
    }
  }

  const handleRemove = async (productId: number) => {
    try {
      await removeProductFromCart(productId)
      await fetchCart()
    } catch {
      Alert.alert('Error', 'Could not remove item')
    }
  }

  const handleClear = () => {
    Alert.alert('Clear Cart', 'Are you sure you want to clear your cart?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          await clearCart()
          await fetchCart()
        },
      },
    ])
  }

  if (loading) return <ActivityIndicator style={styles.center} />
  if (error) return <Text style={styles.error}>{error}</Text>
  if (!cart || cart.items.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Your cart is empty</Text>
        <TouchableOpacity onPress={() => router.push('/')}>
          <Text style={styles.link}>Browse products</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cart.items}
        keyExtractor={item => item.productId.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.itemHeader}>
              <Text style={styles.name}>{item.productName}</Text>
              <TouchableOpacity onPress={() => handleRemove(item.productId)}>
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.price}>
              £{item.productPrice.toFixed(2)} each
            </Text>

            <View style={styles.quantityRow}>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => handleDecrease(item)}
              >
                <Text style={styles.qtyButtonText}>−</Text>
              </TouchableOpacity>

              <Text style={styles.quantity}>{item.quantity}</Text>

              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => handleIncrease(item)}
              >
                <Text style={styles.qtyButtonText}>+</Text>
              </TouchableOpacity>

              <Text style={styles.itemTotal}>
                £{(item.productPrice * item.quantity).toFixed(2)}
              </Text>
            </View>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.subtotalRow}>
          <Text style={styles.subtotalLabel}>Subtotal</Text>
          <Text style={styles.subtotalValue}>
            £{cart.subTotal.toFixed(2)}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => router.push('/checkout')}
        >
          <Text style={styles.checkoutText}>Proceed to Checkout</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleClear}>
          <Text style={styles.clearText}>Clear cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16, gap: 12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: { fontSize: 16, fontWeight: '600', flex: 1 },
  removeText: { color: 'red', fontSize: 13 },
  price: { fontSize: 13, color: '#666', marginTop: 4 },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 12,
  },
  qtyButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyButtonText: { fontSize: 18, fontWeight: '600' },
  quantity: { fontSize: 16, fontWeight: '500', minWidth: 24, textAlign: 'center' },
  itemTotal: { marginLeft: 'auto', fontSize: 15, fontWeight: '600' },
  footer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    gap: 12,
  },
  subtotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subtotalLabel: { fontSize: 16, fontWeight: '600' },
  subtotalValue: { fontSize: 18, fontWeight: '700' },
  checkoutButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  checkoutText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  clearText: { textAlign: 'center', color: '#999', fontSize: 13 },
  emptyText: { fontSize: 16, color: '#666', marginBottom: 12 },
  link: { color: '#000', fontWeight: '600', textDecorationLine: 'underline' },
  error: { color: 'red', textAlign: 'center', marginTop: 20 },
})