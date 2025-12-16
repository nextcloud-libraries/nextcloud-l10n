/*!
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { getCapabilities } from '@nextcloud/capabilities'

/**
 * Returns the user's locale
 */
export function getLocale(): string {
	return globalThis._nc_l10n_locale
}

/**
 * Returns user's locale in canonical form
 * E.g. `en-US` instead of `en_US`
 */
export function getCanonicalLocale(): string {
	return getLocale().replaceAll(/_/g, '-')
}

/**
 * Set the current user's language (locally).
 * This is to be used only for e.g. usage within web workers etc.
 *
 * @param locale - The new language code
 * @since 3.4.0
 */
export function setLocale(locale: string): void {
	globalThis._nc_l10n_locale = locale

	// also for browsers set the DOM
	if (typeof document !== 'undefined') {
		document.documentElement.dataset.locale = locale
	}
}

/**
 * Returns the user's language
 */
export function getLanguage(): string {
	return globalThis._nc_l10n_language
}

/**
 * Set the current user's language (locally).
 * This is to be used only for e.g. usage within web workers etc.
 *
 * @param lang - The new language code
 * @since 3.4.0
 */
export function setLanguage(lang: string): void {
	globalThis._nc_l10n_language = lang

	// also for browsers set the DOM
	if (typeof document !== 'undefined') {
		document.documentElement.lang = lang
	}
}

/**
 * Returns the user's timezone
 *
 * @since 3.5.0
 */
export function getTimezone(): string {
	if (!globalThis._nc_l10n_timezone) {
		let capabilities: undefined | { core?: { user?: { timezone?: string } } }
		try {
			capabilities = getCapabilities()
		} catch {
			// An error indicates getCapabilities threw due to no window object being present,
			// which is the case when called outside of a browser runtime

			// TODO: this try/catch block should be removed as soon as the @nextcloud/capabilities
			// package has been updated to check for presence of the window object.
			// Furthermore, everything except the return statement should be moved to the
			// end of this file where the remaining global state is initialized.
		}
		globalThis._nc_l10n_timezone ??= capabilities?.core?.user?.timezone
			|| Intl.DateTimeFormat().resolvedOptions().timeZone
	}
	return globalThis._nc_l10n_timezone
}

/**
 * Set the current user's timezone (locally).
 * This is to be used only for e.g. usage within web workers etc.
 *
 * @param timezone - The new timezone
 * @since 3.5.0
 */
export function setTimezone(timezone: string): void {
	globalThis._nc_l10n_timezone = timezone
}

/**
 * Check whether the current, or a given, language is read right-to-left
 *
 * @param language Language code to check, defaults to current language
 */
export function isRTL(language?: string): boolean {
	const languageCode = language || getLanguage()

	// Source: https://meta.wikimedia.org/wiki/Template:List_of_language_names_ordered_by_code
	const rtlLanguages = [

		'ae', // Avestan
		'ar', // 'العربية', Arabic
		'arc', // Aramaic
		'arz', // 'مصرى', Egyptian
		'bcc', // 'بلوچی مکرانی', Southern Balochi
		'bqi', // 'بختياري', Bakthiari
		'ckb', // 'Soranî / کوردی', Sorani
		'dv', // Dhivehi
		'fa', // 'فارسی', Persian
		'glk', // 'گیلکی', Gilaki
		'ha', // 'هَوُسَ', Hausa
		'he', // 'עברית', Hebrew
		'khw', // 'کھوار', Khowar
		'ks', // 'कॉशुर / کٲشُر', Kashmiri
		'ku', // 'Kurdî / كوردی', Kurdish
		'mzn', // 'مازِرونی', Mazanderani
		'nqo', // 'ߒߞߏ', N’Ko
		'pnb', // 'پنجابی', Western Punjabi
		'ps', // 'پښتو', Pashto,
		'sd', // 'سنڌي', Sindhi
		'ug', // 'Uyghurche / ئۇيغۇرچە', Uyghur
		'ur', // 'اردو', Urdu
		'ur-PK', // 'اردو', Urdu (nextcloud BCP47 variant)
		'uz-AF', // 'اوزبیکی', Uzbek Afghan
		'yi', // 'ייִדיש', Yiddish

	]

	return rtlLanguages.includes(languageCode)
}

// Initialize global state if needed (e.g. when not in DOM context like on WebWorker)

globalThis._nc_l10n_locale ??= (typeof document !== 'undefined' && document.documentElement.dataset.locale)
	|| Intl.DateTimeFormat().resolvedOptions().locale.replaceAll(/-/g, '_')

globalThis._nc_l10n_language ??= (typeof document !== 'undefined' && document.documentElement.lang)
	|| (globalThis.navigator?.language ?? 'en')
