import { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from 'react-native'
import { useRouter } from 'expo-router'
import { checkoutCart } from '@/api/services/cart-service'
import { CheckoutResponse } from '@/types/dtos/chekout-reponse'
import { CartItem } from '@/types/cartItem'
import { AppliedDiscount } from '@/types/applied-discount'

export default function CheckoutScreen() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<CheckoutResponse | null>(null)

  const handleCheckout = async () => {
    setIsLoading(true)
    try {
      const response = await checkoutCart()
      setResult(response)
    } catch {
      setResult({ success: false, message: 'Something went wrong. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  // Pre-checkout confirmation view
  if (!result) {
    return (
      <View style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.title}>Ready to checkout?</Text>
          <Text style={styles.subtitle}>
            Any applicable discounts will be applied automatically.
          </Text>

          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={handleCheckout}
            disabled={isLoading}
          >
            {isLoading
              ? <ActivityIndicator color='#fff' />
              : <Text style={styles.checkoutText}>Place Order</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backText}>Back to cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  // Failure view
  if (!result.success) {
    return (
      <View style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.failureIcon}>✕</Text>
          <Text style={styles.failureTitle}>Checkout Failed</Text>
          <Text style={styles.failureMessage}>
            {result.message ?? 'Your order could not be completed.'}
          </Text>

          {result.insufficientStock && result.insufficientStock.length > 0 && (
            <View style={styles.stockIssueList}>
              <Text style={styles.stockIssueTitle}>Please consider adjusting your cart:</Text>
              {result.insufficientStock.map((stockIssue) => (
                <Text
                  key={stockIssue.productName}
                  style={styles.stockIssueItem}
                >
                  {stockIssue.productName}: Requested {stockIssue.requested}
                </Text>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() => router.push('/')}
          >
            <Text style={styles.checkoutText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  // Success view
  const total = (result.subtotal ?? 0) - (result.totalDiscount ?? 0)

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.successIcon}>✓</Text>
      <Text style={styles.successTitle}>Order Placed!</Text>
      <Text style={styles.successSubtitle}>Thank you for your purchase.</Text>

      {/* Order Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        {result.order?.map((item: CartItem) => (
          <View key={item.productId} style={styles.orderRow}>
            <View style={styles.orderRowLeft}>
              <Text style={styles.orderItemName}>{item.productName}</Text>
              <Text style={styles.orderItemQty}>x{item.quantity}</Text>
            </View>
            <Text style={styles.orderItemPrice}>
              £{(item.productPrice * item.quantity).toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      {/* Discounts */}
      {result.appliedDiscounts && result.appliedDiscounts.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Discounts Applied</Text>
          {result.appliedDiscounts.map((discount: AppliedDiscount) => (
            <View key={discount.discountId} style={styles.orderRow}>
              <Text style={styles.discountName}>{discount.name}</Text>
              <Text style={styles.discountAmount}>
                -£{discount.amountDeducted.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Totals */}
      <View style={styles.section}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal</Text>
          <Text style={styles.totalValue}>£{result.subtotal?.toFixed(2)}</Text>
        </View>

        {(result.totalDiscount ?? 0) > 0 && (
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Discount</Text>
            <Text style={styles.discountAmount}>
              -£{result.totalDiscount?.toFixed(2)}
            </Text>
          </View>
        )}

        <View style={[styles.totalRow, styles.grandTotalRow]}>
          <Text style={styles.grandTotalLabel}>Total</Text>
          <Text style={styles.grandTotalValue}>£{total.toFixed(2)}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.checkoutButton}
        onPress={() => router.push('/')}
      >
        <Text style={styles.checkoutText}>Continue Shopping</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollContent: { padding: 16, gap: 16 },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 16,
  },

  // Pre-checkout
  title: { fontSize: 22, fontWeight: '700', textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center' },

  // Failure
  failureIcon: { fontSize: 48, color: 'red' },
  failureTitle: { fontSize: 22, fontWeight: '700', color: 'red' },
  failureMessage: { fontSize: 15, color: '#444', textAlign: 'center' },
  stockIssueList: {
    width: '100%',
    backgroundColor: '#fff1f1',
    borderRadius: 8,
    padding: 12,
    gap: 6,
  },
  stockIssueTitle: { fontSize: 14, fontWeight: '700', color: '#8a1f1f' },
  stockIssueItem: { fontSize: 14, color: '#8a1f1f' },

  // Success
  successIcon: { fontSize: 48, color: 'green', textAlign: 'center' },
  successTitle: { fontSize: 24, fontWeight: '700', textAlign: 'center' },
  successSubtitle: { fontSize: 15, color: '#666', textAlign: 'center' },

  // Sections
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },

  // Order rows
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  orderItemName: { fontSize: 14, color: '#333' },
  orderItemQty: { fontSize: 13, color: '#999' },
  orderItemPrice: { fontSize: 14, fontWeight: '500' },

  // Discounts
  discountName: { fontSize: 14, color: 'green' },
  discountAmount: { fontSize: 14, color: 'green', fontWeight: '500' },

  // Totals
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: { fontSize: 14, color: '#666' },
  totalValue: { fontSize: 14, color: '#333' },
  grandTotalRow: { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#eee' },
  grandTotalLabel: { fontSize: 16, fontWeight: '700' },
  grandTotalValue: { fontSize: 18, fontWeight: '700' },

  // Buttons
  checkoutButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    width: '100%',
  },
  checkoutText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  backText: { color: '#999', fontSize: 13 },
})