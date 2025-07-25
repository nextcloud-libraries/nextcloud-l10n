/*!
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { afterEach, beforeAll, beforeEach, describe, expect, it, test } from 'vitest'
import {
	getAppTranslations,
	hasAppTranslations,
	registerAppTranslations,
	unregisterAppTranslations,
} from '../lib/registry.ts'

const pluralFunction = (number: number) => (number > 1 ? 1 : 0)

describe('registry', () => {
	beforeAll(clearWindow)
	afterEach(clearWindow)

	test('hasAppTranslations', () => {
		expect(hasAppTranslations('doesnotexist')).toBe(false)

		mockWindow()

		expect(hasAppTranslations('core')).toBe(true)
		expect(hasAppTranslations('doesnotexist')).toBe(false)

		// not fully initialized registry
		globalThis._oc_l10n_registry_plural_functions = {}
		expect(hasAppTranslations('core')).toBe(false)
	})

	describe('getAppTranslations', () => {
		beforeEach(() => {
			clearWindow()
		})

		it('without translations', () => {
			const bundle = getAppTranslations('doesnotexist')
			expect(bundle.translations).toMatchObject({})
			expect(typeof bundle.pluralFunction === 'function').toBe(true)
			expect(typeof bundle.pluralFunction(0)).toBe('number')
		})

		it('with translations', () => {
			mockWindow()

			let bundle = getAppTranslations('core')
			expect(Object.keys(bundle.translations).length > 0).toBe(true)
			expect(bundle.pluralFunction).toBe(pluralFunction)

			bundle = getAppTranslations('doesnotexist')
			expect(bundle.translations).toMatchObject({})
			expect(typeof bundle.pluralFunction === 'function').toBe(true)
		})
	})

	describe('unregisterAppTranslations', () => {
		beforeEach(clearWindow)

		it('works without registry', () => {
			expect(() => unregisterAppTranslations('doesnotexist')).not.toThrowError()
		})

		it('works with not registered app', () => {
			mockWindow()

			expect(() => unregisterAppTranslations('doesnotexist')).not.toThrowError()
			expect(globalThis._oc_l10n_registry_plural_functions?.core).toBe(pluralFunction)
			expect(Object.keys(globalThis._oc_l10n_registry_translations?.core || {}).length > 0).toBe(true)
		})

		it('works with registered app', () => {
			mockWindow()

			expect(() => unregisterAppTranslations('core')).not.toThrowError()
			expect(globalThis._oc_l10n_registry_plural_functions?.core).toBe(undefined)
			expect(globalThis._oc_l10n_registry_translations?.core).toBe(undefined)
		})
	})

	describe('registerAppTranslations', () => {
		beforeEach(clearWindow)

		it('works without registry', () => {
			const translations = {
				foo: 'foo',
			}
			expect(() => registerAppTranslations('myapp', translations, pluralFunction)).not.toThrowError()
			expect(globalThis._oc_l10n_registry_translations?.myapp).toMatchObject(translations)
			expect(globalThis._oc_l10n_registry_plural_functions?.myapp).toBe(pluralFunction)
		})

		it('works with new app', () => {
			mockWindow()

			const translations = {
				foo: 'foo',
			}
			expect(() => registerAppTranslations('myapp', translations, pluralFunction)).not.toThrowError()
			expect(globalThis._oc_l10n_registry_translations?.myapp).toMatchObject(translations)
			expect(globalThis._oc_l10n_registry_plural_functions?.myapp).toBe(pluralFunction)
			// Unchanged other apps
			expect(Object.keys(globalThis._oc_l10n_registry_translations?.core || {}).length > 0).toBe(true)
			expect(globalThis._oc_l10n_registry_plural_functions?.core).toBe(pluralFunction)
		})

		it('works with already registered app', () => {
			const newTranslations = {
				newvalue: 'newvalue',
			}
			mockWindow()

			const numBefore = Object.keys(globalThis._oc_l10n_registry_translations!.core).length

			expect(() => registerAppTranslations('core', newTranslations, pluralFunction)).not.toThrowError()

			expect(Object.keys(globalThis._oc_l10n_registry_translations!.core).length).toBe(numBefore + 1)
			expect(globalThis._oc_l10n_registry_plural_functions?.core).toBe(pluralFunction)
		})
	})
})

function mockWindow() {
	globalThis._oc_l10n_registry_plural_functions = {
		core: pluralFunction,
	}
	globalThis._oc_l10n_registry_translations = {
		core: {
			foo: 'foo',
			'_%n bar_::_%n bars_': [
				'%n bar',
				'%n bars',
			],
		},
	}
}

function clearWindow() {
	globalThis._oc_l10n_registry_plural_functions = {}
	globalThis._oc_l10n_registry_translations = {}
}
