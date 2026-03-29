import { useCartCount } from "@/hooks/use-cart-count"
import { useRouter } from "expo-router"
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native'

function CartIcon() {
  const router = useRouter()
  const count = useCartCount()

  return (
    <TouchableOpacity onPress={() => router.push('/cart')} style={{ marginRight: 16 }}>
      <Text style={{ fontSize: 22 }}>🛒</Text>
      {count > 0 && (
        <View style={{
          position: 'absolute',
          top: -4,
          right: -4,
          backgroundColor: 'red',
          borderRadius: 8,
          minWidth: 16,
          height: 16,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>
            {count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  )
}