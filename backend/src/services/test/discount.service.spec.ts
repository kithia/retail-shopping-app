import { DiscountService } from '../discount.service'
import { CartItem } from 'src/entities/cartItem'

/**
 * DiscountService Test Suite
 */
describe('DiscountService', () => {
	let service: DiscountService

	const shirtItem: CartItem = {
		productId: 1,
		productName: 'Shirt',
		productPrice: 25,
		quantity: 1,
	}

	const jeansItem: CartItem = {
		productId: 2,
		productName: 'Jeans',
		productPrice: 40,
		quantity: 1,
	}

	beforeEach(() => {
		service = new DiscountService()
	})

	it('returns no discounts when the cart does not qualify for any promotion', () => {
		const discounts = service.applyDiscounts([shirtItem], 25)

		expect(discounts).toEqual([])
	})

	it('applies the fixed amount discount when subtotal meets the minimum spend', () => {
		const discounts = service.applyDiscounts([jeansItem], 100)

		expect(discounts).toEqual([
			{
				discountId: '10GBPOFF',
				discountName: 'Big Spender',
				amountDeducted: 10,
			},
		])
	})

	it('does not apply the fixed amount discount when subtotal is below the minimum spend', () => {
		const discounts = service.applyDiscounts([jeansItem], 99.99)

		expect(discounts).toEqual([])
	})

	it('applies the shirt promotion when the required quantity threshold is reached', () => {
		const discounts = service.applyDiscounts(
			[
				{
					...shirtItem,
					quantity: 4,
				},
			],
			100,
		)

		expect(discounts).toContainEqual({
			discountId: '3SHIRTSFOR2',
			discountName: '3 Shirts for the Price of 2',
			amountDeducted: 25,
		})
	})

	it('does not apply the shirt promotion when the qualifying product is absent', () => {
		const discounts = service.applyDiscounts([jeansItem], 120)

		expect(discounts).toEqual([
			{
				discountId: '10GBPOFF',
				discountName: 'Big Spender',
				amountDeducted: 10,
			},
		])
	})

	it('returns both discounts when both rules apply', () => {
		const discounts = service.applyDiscounts(
			[
				{
					...shirtItem,
					quantity: 4,
				},
				jeansItem,
			],
			140,
		)

		expect(discounts).toEqual([
			{
				discountId: '10GBPOFF',
				discountName: 'Big Spender',
				amountDeducted: 10,
			},
			{
				discountId: '3SHIRTSFOR2',
				discountName: '3 Shirts for the Price of 2',
				amountDeducted: 25,
			},
		])
	})
})
