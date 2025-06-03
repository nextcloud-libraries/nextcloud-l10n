/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { beforeEach, describe, expect, it } from 'vitest'
import { isRTL, setLanguage } from '../lib/locale.ts'

describe('isRTL', () => {
	beforeEach(() => {
		globalThis._nc_l10n_locale = 'en'
	})

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
