import {
	getCanonicalLocale,
	getLanguage,
	getLocale,
	isRTL
} from '../lib/locale'

const setLocale = (locale: string) => document.documentElement.setAttribute('data-locale', locale)
const setLanguage = (lang: string) => document.documentElement.setAttribute('lang', lang)

describe('getCanonicalLocale', () => {
	afterEach(() => {
		setLocale('')
	})

	it('Returns primary locales as is', () => {
		setLocale('de')
		expect(getCanonicalLocale()).toEqual('de')
		setLocale('zu')
		expect(getCanonicalLocale()).toEqual('zu')
	})

	it('Returns extended locales with hyphens', () => {
		setLocale('az_Cyrl_AZ')
		expect(getCanonicalLocale()).toEqual('az-Cyrl-AZ')
		setLocale('de_DE')
		expect(getCanonicalLocale()).toEqual('de-DE')
	})
})

test('getLanguage', () => {
	document.documentElement.removeAttribute('lang')
	// Expect fallback
	expect(getLanguage()).toBe('en')
	setLanguage('')
	expect(getLanguage()).toBe('en')

	// Expect value
	setLanguage('zu')
	expect(getLanguage()).toBe('zu')
})

test('getLocale', () => {
	document.documentElement.removeAttribute('data-locale')
	// Expect fallback
	expect(getLocale()).toBe('en')
	setLocale('')
	expect(getLocale()).toBe('en')

	// Expect value
	setLocale('de_DE')
	expect(getLocale()).toBe('de_DE')
})

describe('isRTL', () => {
	beforeEach(() => document.documentElement.removeAttribute('data-locale'))

	it('fallsback to English which is LTR', () => {
		// Expect fallback which is English = LTR
		expect(isRTL()).toBe(false)
	})

	it('uses the given argument over the current language', () => {
		// If a value is given it should use that language over the fallback
		expect(isRTL('ar')).toBe(true)
		setLanguage('ar')
		expect(isRTL('de')).toBe(false)
	})

	it('without an argument the current language is used', () => {
		// It uses the configured language
		setLanguage('he')
		expect(isRTL()).toBe(true)
	})

	it('without an argument the current language is used', () => {
		// It uses the configured language
		setLanguage('he')
		expect(isRTL()).toBe(true)
	})

	it('handles Uzbek Afghan correctly', () => {
		// Given as argument
		expect(isRTL('uz')).toBe(false)
		expect(isRTL('uz-AF')).toBe(true)

		// configured as current language
		setLanguage('uz')
		setLocale('uz_AF')
		expect(isRTL()).toBe(true)
	})
})
