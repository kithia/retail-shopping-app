import { useRouter } from "expo-router"
import {
  Text,
  TouchableOpacity,
} from 'react-native'

export function CartIcon() {
  const router = useRouter()

  return (
    <TouchableOpacity onPress={() => router.push('/cart')} style={{ marginHorizontal: 12 }}>
      <Text style={{ fontSize: 22 }}>🛒</Text>
    </TouchableOpacity>
  )
}