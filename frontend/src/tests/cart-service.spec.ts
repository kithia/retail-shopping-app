import client from '../api/client'
import {
	addProductToCart,
	checkoutCart,
	clearCart,
	getCart,
	reduceProductQuantityInCart,
	removeProductFromCart,
} from '../api/services/cart-service'

jest.mock('../api/client', () => ({
	__esModule: true,
	default: {
		get: jest.fn(),
		post: jest.fn(),
	},
}))

const mockedClient = jest.mocked(client)

/**
 * CartService Test Suite
 */
describe('cart-service', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('gets the current cart', async () => {
		const cart = {
			id: 1,
			items: [],
			subTotal: 0,
			lastActiveAt: new Date().toISOString(),
			createdAt: new Date().toISOString(),
		}

		mockedClient.get.mockResolvedValue({ data: cart })

		await expect(getCart()).resolves.toEqual(cart)
		expect(mockedClient.get).toHaveBeenCalledWith('/cart')
	})

	it('posts the add-to-cart payload', async () => {
		mockedClient.post.mockResolvedValue({ data: undefined })

		await addProductToCart(3, 2)

		expect(mockedClient.post).toHaveBeenCalledWith('/cart/add', {
			productId: 3,
			quantity: 2,
		})
	})

	it('posts the remove-from-cart payload', async () => {
		mockedClient.post.mockResolvedValue({ data: undefined })

		await removeProductFromCart(4)

		expect(mockedClient.post).toHaveBeenCalledWith('/cart/remove', {
			productId: 4,
		})
	})

	it('posts the reduce-quantity payload', async () => {
		mockedClient.post.mockResolvedValue({ data: undefined })

		await reduceProductQuantityInCart(5, 1)

		expect(mockedClient.post).toHaveBeenCalledWith('/cart/reduce', {
			productId: 5,
			quantity: 1,
		})
	})

	it('posts checkout and returns the response body', async () => {
		const checkoutResponse = {
			success: false,
			message: 'The following items are out of stock or do not have enough stock to fulfill your order:',
			insufficientStock: [
				{
					productName: 'Classic White Shirt',
					requested: 3,
				},
			],
		}

		mockedClient.post.mockResolvedValue({ data: checkoutResponse })

		await expect(checkoutCart()).resolves.toEqual(checkoutResponse)
		expect(mockedClient.post).toHaveBeenCalledWith('/cart/checkout')
	})

	it('posts checkout and returns a successful response', async () => {
		const checkoutResponse = {
			success: true,
			message: 'Checkout successful!',
			orderId: 12345,
		}

		mockedClient.post.mockResolvedValue({ data: checkoutResponse })

		await expect(checkoutCart()).resolves.toEqual(checkoutResponse)
		expect(mockedClient.post).toHaveBeenCalledWith('/cart/checkout')
	})


	it('posts the clear-cart request', async () => {
		mockedClient.post.mockResolvedValue({ data: undefined })

		await clearCart()

		expect(mockedClient.post).toHaveBeenCalledWith('/cart/clear')
	})
})
