/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
	getCanonicalLocale,
	getLanguage,
	getLocale,
	isRTL,
} from '../lib/locale'

const setLocale = (locale: string) => document.documentElement.setAttribute('data-locale', locale)
const setLanguage = (lang: string) => document.documentElement.setAttribute('lang', lang)

describe('getLanguage', () => {
	it('returns the set language as it is', () => {
		setLanguage('de-DE')
		expect(getLanguage()).toEqual('de-DE')
	})

	it('returns the navigator language if no language is set', () => {
		const spy = vi.spyOn(navigator, 'language', 'get')
		spy.mockImplementationOnce(() => 'ar-EG')

		setLanguage('')
		expect(getLanguage()).toEqual('ar-EG')
		expect(spy).toHaveBeenCalledOnce()
	})
})

describe('getLocale', () => {
	it('returns the set locale as it is with underscore', () => {
		setLocale('de_DE')
		expect(getLocale()).toEqual('de_DE')
	})

	it('returns the environment locale with underscore if no locale is set', () => {
		setLocale('')
		expect(getLocale()).toEqual(process.env.LANG?.replaceAll('-', '_'))
	})
})

describe('getCanonicalLocale', () => {
	it('returns the set locale with hyphen', () => {
		setLocale('de_DE')
		expect(getCanonicalLocale()).toEqual('de-DE')
	})

	it('returns the set locale with multiple hyphen', () => {
		setLocale('az_Cyrl_AZ')
		expect(getCanonicalLocale()).toEqual('az-Cyrl-AZ')
	})

	it('returns the environment locale with hyphen if no locale is set', () => {
		expect(process.env.LANG).not.toBe('')

		setLocale('')
		expect(getCanonicalLocale()).toEqual(process.env.LANG)
	})
})

describe('isRTL', () => {
	beforeEach(() => document.documentElement.removeAttribute('data-locale'))

	it('falls back to English which is LTR', () => {
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
		expect(isRTL()).toBe(false)

		setLanguage('uz-AF')
		expect(isRTL()).toBe(true)
	})
})
