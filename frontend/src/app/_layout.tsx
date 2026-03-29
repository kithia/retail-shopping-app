import { Stack } from 'expo-router'
import { ThemeProvider, DefaultTheme } from '@react-navigation/native'
import { AnimatedSplashOverlay } from '@/components/animated-icon/animated-icon';

export default function StackLayout() {

  return (
    <ThemeProvider value={DefaultTheme}>
      <AnimatedSplashOverlay />
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Shop All' }} />
        <Stack.Screen name="product/[id]" options={{ title: 'Product' }} />
        <Stack.Screen name="cart" options={{ title: 'Cart' }} />
        <Stack.Screen name="checkout" options={{ title: 'Checkout' }} />
      </Stack>
    </ThemeProvider>
  )
}
