import { BadRequestException, NotFoundException } from '@nestjs/common'
import { CartService } from '../services/cart.service'
import { ProductService } from '../services/product.service'
import { DiscountService } from '../services/discount.service'

/**
 * CartService Test Suite
 */
describe('CartService', () => {
	let service: CartService
	let productService: jest.Mocked<ProductService>
	let discountService: jest.Mocked<DiscountService>

	const productOne = {
		id: 1,
		name: 'Milk',
		description: 'Fresh milk',
		price: 2.5,
		stock: 10,
	}

	const productTwo = {
		id: 2,
		name: 'Bread',
		description: 'Wholegrain bread',
		price: 1.75,
		stock: 1,
	}

	beforeEach(() => {
		const products = new Map([
			[productOne.id, { ...productOne }],
			[productTwo.id, { ...productTwo }],
		])

		productService = {
			getAll: jest.fn(),
			getById: jest.fn((id: number) => {
				const product = products.get(id)

				if (!product) {
					throw new NotFoundException(`Product with id ${id} not found.`)
				}

				return product
			}),
		} as unknown as jest.Mocked<ProductService>

		discountService = {
			applyDiscounts: jest.fn().mockReturnValue([]),
		} as unknown as jest.Mocked<DiscountService>

		service = new CartService(productService, discountService)
		service.clear()
	})

	describe('getReservedQuantityById', () => {
		it('returns the reserved quantity for an item in the cart', () => {
			service.addProductById(1, 2)

			expect(service.getReservedQuantityById(1)).toBe(2)
		})

		it('throws not found when the product is not in the cart', () => {
			expect(() => service.getReservedQuantityById(99)).toThrow(NotFoundException)
		})
	})

	describe('addProductById', () => {
		it('throws bad request when quantity is not greater than zero', () => {
			expect(() => service.addProductById(1, 0)).toThrow(BadRequestException)
		})

		it('adds a new product and updates the subtotal', () => {
			service.addProductById(1, 2)

			const cart = service.get()

			expect(cart.items).toEqual([
				{
					productId: 1,
					productName: 'Milk',
					productPrice: 2.5,
					quantity: 2,
				},
			])
			expect(cart.subTotal).toBe(5)
		})

		it('increments an existing product and keeps subtotal in sync', () => {
			service.addProductById(1, 1)
			service.addProductById(1, 2)

			const cart = service.get()

			expect(cart.items[0].quantity).toBe(3)
			expect(cart.subTotal).toBe(7.5)
		})

		it('rethrows not found when the product does not exist in the catalogue', () => {
			expect(() => service.addProductById(999, 1)).toThrow(NotFoundException)
		})
	})

	describe('removeProductById', () => {
		it('removes an item and updates the subtotal', () => {
			service.addProductById(1, 2)

			service.removeProductById(1)

			expect(service.get().items).toEqual([])
			expect(service.get().subTotal).toBe(0)
		})

		it('throws not found when the product is not in the cart', () => {
			expect(() => service.removeProductById(1)).toThrow(NotFoundException)
		})
	})

	describe('reduceProductQuantityById', () => {
		it('throws bad request when quantity is not greater than zero', () => {
			expect(() => service.reduceProductQuantityById(1, 0)).toThrow(BadRequestException)
		})

		it('reduces quantity and subtotal for an existing item', () => {
			service.addProductById(1, 3)

			service.reduceProductQuantityById(1, 1)

			const cart = service.get()
			expect(cart.items[0].quantity).toBe(2)
			expect(cart.subTotal).toBe(5)
		})

		it('removes the item when reduction meets or exceeds the item quantity', () => {
			service.addProductById(1, 2)

			service.reduceProductQuantityById(1, 2)

			expect(service.get().items).toEqual([])
			expect(service.get().subTotal).toBe(0)
		})

		it('throws not found when the product is not in the cart', () => {
			expect(() => service.reduceProductQuantityById(1, 1)).toThrow(NotFoundException)
		})
	})

	describe('checkout', () => {
		it('returns a failure response when the cart is empty', () => {
			expect(service.checkout()).toEqual({
				success: false,
				message: 'Cart has expired. Please add items before checkout.',
			})
		})

		it('returns insufficient stock details and clears the cart', () => {
			service.addProductById(2, 2)

			const result = service.checkout()

			expect(result).toEqual({
				success: false,
				message: 'The following items are out of stock or do not have enough stock to fulfill your order:',
				insufficientStock: [
					{
						productName: 'Bread',
						requested: 2,
					},
				],
			})
			expect(service.get().items).toEqual([])
			expect(service.get().subTotal).toBe(0)
		})

		it('deducts stock, applies discounts, and clears the cart on success', () => {
			discountService.applyDiscounts.mockReturnValue([
				{
					discountId: 'promo-1',
					discountName: 'Test Discount',
					amountDeducted: 1.5,
				},
			])
			service.addProductById(1, 2)

			const result = service.checkout()

			expect(result).toEqual({
				success: true,
				order: [
					{
						productId: 1,
						productName: 'Milk',
						productPrice: 2.5,
						quantity: 2,
					},
				],
				subtotal: 5,
				appliedDiscounts: [
					{
						discountId: 'promo-1',
						discountName: 'Test Discount',
						amountDeducted: 1.5,
					},
				],
				totalDiscount: 1.5,
			})
			expect(productService.getById(1).stock).toBe(8)
			expect(discountService.applyDiscounts).toHaveBeenCalledWith(result.order, 5)
			expect(service.get().items).toEqual([])
			expect(service.get().subTotal).toBe(0)
		})
	})

	describe('handleCartExpiry', () => {
		it('clears the cart when it has been inactive for more than two minutes', () => {
			service.addProductById(1, 1)
			service.get().lastActiveAt = new Date(Date.now() - 2 * 60 * 1000 - 1)

			service.handleCartExpiry()

			expect(service.get().items).toEqual([])
			expect(service.get().subTotal).toBe(0)
		})

		it('keeps the cart when it is still active', () => {
			service.addProductById(1, 1)
			service.get().lastActiveAt = new Date()

			service.handleCartExpiry()

			expect(service.get().items).toHaveLength(1)
			expect(service.get().subTotal).toBe(2.5)
		})
	})
})
