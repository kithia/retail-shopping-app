import { Stack, useRouter } from 'expo-router'
import { ThemeProvider, DefaultTheme } from '@react-navigation/native'
import { AnimatedSplashOverlay } from '@/components/animated-icon/animated-icon';
import { CartIcon } from '@/components/cart-icon';

export default function StackLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <AnimatedSplashOverlay />
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: 'Shop All',
            headerRight: () => <CartIcon />,
            headerBackVisible: false,
            headerLeft: () => null,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen name="product/[id]" options={{ headerRight: () => <CartIcon /> }} />
        <Stack.Screen name="cart" options={{ title: 'Cart' }} />
        <Stack.Screen name="checkout" options={{ title: 'Checkout' }} />
      </Stack>
    </ThemeProvider>
  )
}
