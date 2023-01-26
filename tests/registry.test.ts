import type { NextcloudWindowWithRegistry } from '../lib/registry'

import {
	getAppTranslations,
	hasAppTranslations,
	registerAppTranslations,
	unregisterAppTranslations,
} from '../lib/registry'

declare const window: NextcloudWindowWithRegistry

const clearWindow = () => {
	delete window._oc_l10n_registry_plural_functions
	delete window._oc_l10n_registry_translations
}

const pluralFunction = (number: number) => (number > 1 ? 1 : 0)

const mockWindow = () => {
	window._oc_l10n_registry_plural_functions = {
		core: pluralFunction,
	}
	window._oc_l10n_registry_translations = {
		core: {
			foo: 'foo',
			'_%n bar_::_%n bars_': [
				'%n bar',
				'%n bars',
			],
		},
	}
}

describe('registry', () => {
	beforeAll(clearWindow)
	afterEach(clearWindow)

	test('hasAppTranslations', () => {
		expect(hasAppTranslations('doesnotexist')).toBe(false)

		mockWindow()

		expect(hasAppTranslations('core')).toBe(true)
		expect(hasAppTranslations('doesnotexist')).toBe(false)

		// not fully initialized registry
		delete window._oc_l10n_registry_plural_functions
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
			expect(window._oc_l10n_registry_plural_functions?.core).toBe(pluralFunction)
			expect(Object.keys(window._oc_l10n_registry_translations?.core || {}).length > 0).toBe(true)
		})

		it('works with registered app', () => {
			mockWindow()

			expect(() => unregisterAppTranslations('core')).not.toThrowError()
			expect(window._oc_l10n_registry_plural_functions?.core).toBe(undefined)
			expect(window._oc_l10n_registry_translations?.core).toBe(undefined)
		})
	})

	describe('registerAppTranslations', () => {
		beforeEach(clearWindow)

		it('works without registry', () => {
			const translations = {
				foo: 'foo',
			}
			expect(() => registerAppTranslations('myapp', translations, pluralFunction)).not.toThrowError()
			expect(window._oc_l10n_registry_translations?.myapp).toMatchObject(translations)
			expect(window._oc_l10n_registry_plural_functions?.myapp).toBe(pluralFunction)
		})

		it('works with new app', () => {
			mockWindow()

			const translations = {
				foo: 'foo',
			}
			expect(() => registerAppTranslations('myapp', translations, pluralFunction)).not.toThrowError()
			expect(window._oc_l10n_registry_translations?.myapp).toMatchObject(translations)
			expect(window._oc_l10n_registry_plural_functions?.myapp).toBe(pluralFunction)
			// Unchanged other apps
			expect(Object.keys(window._oc_l10n_registry_translations?.core || {}).length > 0).toBe(true)
			expect(window._oc_l10n_registry_plural_functions?.core).toBe(pluralFunction)
		})

		it('works with already registered app', () => {
			const newTranslations = {
				newvalue: 'newvalue',
			}
			mockWindow()

			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const numBefore = Object.keys(window._oc_l10n_registry_translations!.core).length

			expect(() => registerAppTranslations('core', newTranslations, pluralFunction)).not.toThrowError()
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			expect(Object.keys(window._oc_l10n_registry_translations!.core).length).toBe(numBefore + 1)
			expect(window._oc_l10n_registry_plural_functions?.core).toBe(pluralFunction)
		})
	})
})
