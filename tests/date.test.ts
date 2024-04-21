/* eslint-disable @typescript-eslint/ban-ts-comment */
/// <reference types="@nextcloud/typings" />
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { getDayNames, getDayNamesMin, getDayNamesShort, getFirstDay, getMonthNames, getMonthNamesShort } from '../lib/date'

declare let window: Nextcloud.v24.WindowWithGlobals

describe('date', () => {
	const orginalWarn = console.warn

	afterAll(() => {
		console.warn = orginalWarn
	})
	beforeEach(() => {
		console.warn = vi.fn()
	})

	describe('getFirstDay', () => {
		// @ts-ignore
		afterAll(() => { delete window.firstDay })

		it('works without `OC`', () => {
			expect(getFirstDay()).toBe(1)
			// Warning as fallback is being used
			expect(console.warn).toBeCalled()
		})

		it('works with `OC`', () => {
			window.firstDay = 3
			expect(getFirstDay()).toBe(3)
		})
	})

	describe('getDayNames', () => {
		// @ts-ignore
		afterAll(() => { delete window.dayNames })

		it('works without `OC`', () => {
			expect(getDayNames().length).toBe(7)
			// Warning as fallback is being used
			expect(console.warn).toBeCalled()
		})

		it('works with `OC`', () => {
			window.dayNames = 'a'.repeat(7).split('')
			expect(getDayNames()).toBe(window.dayNames)
		})
	})

	describe('getDayNamesShort', () => {
		// @ts-ignore
		afterAll(() => { delete window.dayNamesShort })

		it('works without `OC`', () => {
			expect(getDayNamesShort().length).toBe(7)
			// Warning as fallback is being used
			expect(console.warn).toBeCalled()
		})

		it('works with `OC`', () => {
			window.dayNamesShort = 'b'.repeat(7).split('')
			expect(getDayNamesShort()).toBe(window.dayNamesShort)
		})
	})

	describe('getDayNamesMin', () => {
		// @ts-ignore
		afterAll(() => { delete window.dayNamesMin })

		it('works without `OC`', () => {
			expect(getDayNamesMin().length).toBe(7)
			// Warning as fallback is being used
			expect(console.warn).toBeCalled()
		})

		it('works with `OC`', () => {
			window.dayNamesMin = 'c'.repeat(7).split('')
			expect(getDayNamesMin()).toBe(window.dayNamesMin)
		})
	})

	describe('getMonthNames', () => {
		// @ts-ignore
		afterAll(() => { delete window.monthNames })

		it('works without `OC`', () => {
			expect(getMonthNames().length).toBe(12)
			// Warning as fallback is being used
			expect(console.warn).toBeCalled()
		})

		it('works with `OC`', () => {
			window.monthNames = 'd'.repeat(12).split('')
			expect(getMonthNames()).toBe(window.monthNames)
		})
	})

	describe('getMonthNamesShort', () => {
		// @ts-ignore
		afterAll(() => { delete window.monthNamesShort })

		it('works without `OC`', () => {
			expect(getMonthNamesShort().length).toBe(12)
			// Warning as fallback is being used
			expect(console.warn).toBeCalled()
		})

		it('works with `OC`', () => {
			window.monthNamesShort = 'e'.repeat(12).split('')
			expect(getMonthNamesShort()).toBe(window.monthNamesShort)
		})
	})
})
