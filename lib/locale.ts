/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/**
 * Returns the user's locale
 */
export function getLocale(): string {
	return document.documentElement.dataset.locale || 'en'
}

/**
 * Returns user's locale in canonical form
 * E.g. `en-US` instead of `en_US`
 */
export function getCanonicalLocale(): string {
	return getLocale().replace(/_/g, '-')
}

/**
 * Returns the user's language
 */
export function getLanguage(): string {
	return document.documentElement.lang || 'en'
}

/**
 * Check whether the current, or a given, language is read right-to-left
 *
 * @param language Language code to check, defaults to current language
 */
export function isRTL(language?: string): boolean {
	const languageCode = language || getLanguage()

	const rtlLanguages = [
		/* eslint-disable no-multi-spaces */
		'ar', // Arabic
		'fa', // Persian
		'he', // Hebrew
		'ps', // Pashto,
		'ug', // 'Uyghurche / Uyghur
		'ur_PK', // Urdu
		'uz', // Uzbek Afghan
		/* eslint-enable no-multi-spaces */
	]

	return rtlLanguages.includes(languageCode)
}
