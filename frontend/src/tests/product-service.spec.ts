import client from '../api/client'
import { getProduct, getProducts } from '../api/services/product-service'

jest.mock('../api/client', () => ({
	__esModule: true,
	default: {
		get: jest.fn(),
		post: jest.fn(),
	},
}))

const mockedClient = jest.mocked(client)

/**
 * ProductService Test Suite
 */
describe('product-service', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('gets all products', async () => {
		const products = [
			{
				id: 1,
				name: 'Classic White Shirt',
				description: 'A timeless plain white cotton shirt, perfect for any occasion.',
				price: 25,
				stock: 10,
			},
			{
				id: 2,
				name: 'Navy Blue Trousers',
				description: 'Smart navy blue trousers made from high-quality fabric for comfort and style.',
				price: 40,
				stock: 5,
			},
		]

		mockedClient.get.mockResolvedValue({ data: products })

		await expect(getProducts()).resolves.toEqual(products)
		expect(mockedClient.get).toHaveBeenCalledWith('/products')
	})

	it('gets a product by id', async () => {
		const product = {
			id: 3,
			name: 'Silk Navy Tie',
			description: 'Elegant navy silk tie, ideal for formal and business wear.',
			price: 15,
			stock: 2,
		}

		mockedClient.get.mockResolvedValue({ data: product })

		await expect(getProduct('3')).resolves.toEqual(product)
		expect(mockedClient.get).toHaveBeenCalledWith('/products/3')
	})
})
