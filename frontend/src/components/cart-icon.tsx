import { useRouter } from "expo-router"
import {
  Text,
  TouchableOpacity,
} from 'react-native'

/**
 * Cart Icon Component
 * @returns JSX.Element
 */
export function CartIcon() {
  // Router
  const router = useRouter()

  return (
    <TouchableOpacity onPress={() => router.push('/cart')} style={{ marginHorizontal: 12 }}>
      <Text style={{ fontSize: 22 }}>🛒</Text>
    </TouchableOpacity>
  )
}