import { NotFoundException } from '@nestjs/common'
import { ProductService } from '../product.service'

/**
 * ProductService Test Suite
 */
describe('ProductService', () => {
	let service: ProductService

	beforeEach(() => {
		service = new ProductService()
	})

	describe('getAll', () => {
		it('returns the full product catalogue', () => {
			const products = service.getAll()

			expect(products).toHaveLength(7)
			expect(products[0]).toEqual({
				id: 1,
				name: 'Classic White Shirt',
				description: 'A timeless plain white cotton shirt, perfect for any occasion.',
				price: 25,
				stock: 10,
			})
		})
	})

	describe('getById', () => {
		it('returns the product matching the provided id', () => {
			expect(service.getById(3)).toEqual({
				id: 3,
				name: 'Silk Navy Tie',
				description: 'Elegant navy silk tie, ideal for formal and business wear.',
				price: 15,
				stock: 2,
			})
		})

		it('throws not found when no product exists for the id', () => {
			expect(() => service.getById(999)).toThrow(NotFoundException)
		})
	})
})
