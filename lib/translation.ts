/*!
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { AppTranslations, Translations } from './registry.ts'

import { generateFilePath } from '@nextcloud/router'
import DOMPurify from 'dompurify'
import escapeHTML from 'escape-html'
import { getLanguage } from './locale.ts'
import {
	getAppTranslations,
	hasAppTranslations,
	registerAppTranslations,
	unregisterAppTranslations,
} from './registry.ts'

interface TranslationOptions {
	/** enable/disable auto escape of placeholders (by default enabled) */
	escape?: boolean
	/** enable/disable sanitization (by default enabled) */
	sanitize?: boolean

	/**
	 * This is only intended for internal usage.
	 *
	 */
	bundle?: AppTranslations
}

interface TranslationVariableReplacementObject<T> {
	/** The value to use for the replacement */
	value: T
	/** Overwrite the `escape` option just for this replacement */
	escape: boolean
}

/**
 * Extracts variables from a translation key
 */
type ExtractedVariables<T extends string> = T extends `${string}{${infer Variable}}${infer Rest}`
	? Variable | ExtractedVariables<Rest>
	: never

type TranslationVariables<K extends string> = Record<ExtractedVariables<K>, string | number | TranslationVariableReplacementObject<string | number>>

export function translate<T extends string>(app: string, text: T, placeholders?: TranslationVariables<T>, options?: TranslationOptions): string
export function translate<T extends string>(app: string, text: T, number?: number, options?: TranslationOptions): string
/**
 * @inheritdoc
 * @deprecated This overload is deprecated either use placeholders or a number but not both
 */
export function translate<T extends string>(app: string, text: T, placeholders?: TranslationVariables<T>, number?: number, options?: TranslationOptions): string

/**
 * Translate a string
 *
 * @param app - The id of the app for which to translate the string
 * @param text - The string to translate
 * @param placeholdersOrNumber - Map of placeholder key to value or a number replacing `%n`
 * @param optionsOrNumber - The translation options or a number to replace `%n` with
 * @param options - Options object
 * @param options.escape - Enable/disable auto escape of placeholders (by default enabled)
 * @param options.sanitize - Enable/disable sanitization (by default enabled) [WARNING: This only work in DOM environment!]
 */
export function translate<T extends string>(
	app: string,
	text: T,
	placeholdersOrNumber?: TranslationVariables<T> | number,
	optionsOrNumber?: number | TranslationOptions,
	options?: TranslationOptions,
): string {
	const vars = typeof placeholdersOrNumber === 'object' ? placeholdersOrNumber : undefined
	const number = typeof optionsOrNumber === 'number' ? optionsOrNumber : (typeof placeholdersOrNumber === 'number' ? placeholdersOrNumber : undefined)

	const allOptions = {
		// defaults
		escape: true,
		sanitize: true,
		// overwrite with user config
		...(
			typeof options === 'object'
				? options
				: (
						typeof optionsOrNumber === 'object'
							? optionsOrNumber
							: {}
					)
		),
	}

	const identity = <T>(value: T): T => value
	const optSanitize = (allOptions.sanitize ? DOMPurify.sanitize : identity) || identity
	const optEscape = allOptions.escape ? escapeHTML : identity

	const isValidReplacement = (value: unknown) => typeof value === 'string' || typeof value === 'number'

	// TODO: cache this function to avoid inline recreation
	// of the same function over and over again in case
	// translate() is used in a loop
	const _build = (text: string, vars?: TranslationVariables<T>, number?: number) => {
		return text.replace(/%n/g, '' + number).replace(/{([^{}]*)}/g, (match, key: ExtractedVariables<T>) => {
			if (vars === undefined || !(key in vars)) {
				return optEscape(match)
			}

			const replacement = vars[key]
			if (isValidReplacement(replacement)) {
				return optEscape(`${replacement}`)
			} else if (typeof replacement === 'object' && isValidReplacement(replacement.value)) {
				// Replacement is an object so indiviual escape handling
				const escape = replacement.escape !== false ? escapeHTML : identity
				return escape(`${replacement.value}`)
			} else {
				/* This should not happen,
				 * but the variables are used defined so not allowed types could still be given,
				 * in this case ignore the replacement and use the placeholder
				 */
				return optEscape(match)
			}
		})
	}

	const bundle = options?.bundle ?? getAppTranslations(app)
	let translation = bundle.translations[text] || text
	translation = Array.isArray(translation) ? translation[0] : translation

	if (typeof vars === 'object' || number !== undefined) {
		return optSanitize(_build(
			translation,
			vars,
			number,
		))
	} else {
		return optSanitize(translation)
	}
}

/**
 * Translate a string containing an object which possibly requires a plural form
 *
 * @param app - The id of the app for which to translate the string
 * @param textSingular - The string to translate for exactly one object
 * @param textPlural - The string to translate for n objects
 * @param number - Number to determine whether to use singular or plural
 * @param vars - Mapping of placeholder key to value
 * @param options - Options object
 */
export function translatePlural<T extends string, K extends string>(
	app: string,
	textSingular: T,
	textPlural: K,
	number: number,
	vars?: TranslationVariables<T> & TranslationVariables<K>,
	options?: TranslationOptions,
): string {
	const identifier = '_' + textSingular + '_::_' + textPlural + '_'
	const bundle = options?.bundle ?? getAppTranslations(app)
	const value = bundle.translations[identifier]

	if (typeof value !== 'undefined') {
		const translation = value
		if (Array.isArray(translation)) {
			const plural = bundle.pluralFunction(number)
			return translate(app, translation[plural], vars, number, options)
		}
	}

	// vars type is casted to allow extra keys without runtime filtering (they are harmless), and without allowing wrong keys in translate
	if (number === 1) {
		return translate(app, textSingular, vars as TranslationVariables<T>, number, options)
	} else {
		return translate(app, textPlural, vars as TranslationVariables<K>, number, options)
	}
}

/**
 * Load an app's translation bundle if not loaded already.
 *
 * @param appName - Name of the app to load
 */
export async function loadTranslations(appName: string): Promise<AppTranslations>
/**
 * Load an app's translation bundle if not loaded already.
 *
 * @param appName - Name of the app to load
 * @param callback - Callback to be called when the translations are loaded
 * @deprecated Use the returned promise instead
 */
export async function loadTranslations(appName: string, callback: (...args: []) => unknown): Promise<AppTranslations>
/**
 * Load an app's translation bundle if not loaded already.
 *
 * @param appName - Name of the app to load
 * @param callback - Callback to be called when the translations are loaded (deprecated)
 */
export async function loadTranslations(appName: string, callback?: (bundle: AppTranslations) => void): Promise<AppTranslations> {
	if (hasAppTranslations(appName) || getLanguage() === 'en') {
		const bundle = getAppTranslations(appName)
		callback?.(bundle)
		return bundle
	}

	let response: Response
	try {
		const url = generateFilePath(appName, 'l10n', getLanguage() + '.json')
		response = await fetch(url)
	} catch (error) {
		throw new Error('Network error', { cause: error })
	}

	if (response.ok) {
		try {
			const bundle = await response.json()
			if (typeof bundle.translations === 'object') {
				register(appName, bundle.translations)
				callback?.(bundle)
				return bundle
			}
		} catch {
			// error is probably a SyntaxError due to invalid response text, this is handled by next line
		}
		throw new Error('Invalid content of translation bundle')
	} else {
		throw new Error(response.statusText)
	}
}

/**
 * Register an app's translation bundle.
 *
 * @param appName name of the app
 * @param bundle translation bundle
 */
export function register(appName: string, bundle: Translations) {
	registerAppTranslations(appName, bundle, getPlural)
}

/**
 * Unregister all translations of an app
 *
 * @param appName name of the app
 * @since 2.1.0
 */
export function unregister(appName: string) {
	return unregisterAppTranslations(appName)
}

/**
 * Get array index of translations for a plural form
 *
 * @param number - The number of elements
 * @param language - The language to use (or autodetect if not set)
 * @return 0 for the singular form(, 1 for the first plural form, ...)
 */
export function getPlural(number: number, language = getLanguage()) {
	if (language === 'pt-BR') {
		// temporary set a locale for brazilian
		language = 'xbr'
	}

	if (language.length > 3) {
		language = language.substring(0, language.lastIndexOf('-'))
	}

	/*
	 * The plural rules are derived from code of the Zend Framework (2010-09-25),
	 * which is subject to the new BSD license (http://framework.zend.com/license/new-bsd).
	 * Copyright (c) 2005-2010 Zend Technologies USA Inc. (http://www.zend.com)
	 */
	switch (language) {
		case 'az':
		case 'bo':
		case 'dz':
		case 'id':
		case 'ja':
		case 'jv':
		case 'ka':
		case 'km':
		case 'kn':
		case 'ko':
		case 'ms':
		case 'th':
		case 'tr':
		case 'vi':
		case 'zh':
			return 0

		case 'af':
		case 'bn':
		case 'bg':
		case 'ca':
		case 'da':
		case 'de':
		case 'el':
		case 'en':
		case 'eo':
		case 'es':
		case 'et':
		case 'eu':
		case 'fa':
		case 'fi':
		case 'fo':
		case 'fur':
		case 'fy':
		case 'gl':
		case 'gu':
		case 'ha':
		case 'he':
		case 'hu':
		case 'is':
		case 'it':
		case 'ku':
		case 'lb':
		case 'ml':
		case 'mn':
		case 'mr':
		case 'nah':
		case 'nb':
		case 'ne':
		case 'nl':
		case 'nn':
		case 'no':
		case 'oc':
		case 'om':
		case 'or':
		case 'pa':
		case 'pap':
		case 'ps':
		case 'pt':
		case 'so':
		case 'sq':
		case 'sv':
		case 'sw':
		case 'ta':
		case 'te':
		case 'tk':
		case 'ur':
		case 'zu':
			return number === 1 ? 0 : 1

		case 'am':
		case 'bh':
		case 'fil':
		case 'fr':
		case 'gun':
		case 'hi':
		case 'hy':
		case 'ln':
		case 'mg':
		case 'nso':
		case 'xbr':
		case 'ti':
		case 'wa':
			return number === 0 || number === 1 ? 0 : 1

		case 'be':
		case 'bs':
		case 'hr':
		case 'ru':
		case 'sh':
		case 'sr':
		case 'uk':
			return number % 10 === 1 && number % 100 !== 11
				? 0
				: number % 10 >= 2
					&& number % 10 <= 4
					&& (number % 100 < 10 || number % 100 >= 20)
					? 1
					: 2

		case 'cs':
		case 'sk':
			return number === 1 ? 0 : number >= 2 && number <= 4 ? 1 : 2

		case 'ga':
			return number === 1 ? 0 : number === 2 ? 1 : 2

		case 'lt':
			return number % 10 === 1 && number % 100 !== 11
				? 0
				: number % 10 >= 2 && (number % 100 < 10 || number % 100 >= 20)
					? 1
					: 2

		case 'sl':
			return number % 100 === 1
				? 0
				: number % 100 === 2
					? 1
					: number % 100 === 3 || number % 100 === 4
						? 2
						: 3

		case 'mk':
			return number % 10 === 1 ? 0 : 1

		case 'mt':
			return number === 1
				? 0
				: number === 0 || (number % 100 > 1 && number % 100 < 11)
					? 1
					: number % 100 > 10 && number % 100 < 20
						? 2
						: 3

		case 'lv':
			return number === 0
				? 0
				: number % 10 === 1 && number % 100 !== 11
					? 1
					: 2

		case 'pl':
			return number === 1
				? 0
				: number % 10 >= 2
					&& number % 10 <= 4
					&& (number % 100 < 12 || number % 100 > 14)
					? 1
					: 2

		case 'cy':
			return number === 1
				? 0
				: number === 2
					? 1
					: number === 8 || number === 11
						? 2
						: 3

		case 'ro':
			return number === 1
				? 0
				: number === 0 || (number % 100 > 0 && number % 100 < 20)
					? 1
					: 2

		case 'ar':
			return number === 0
				? 0
				: number === 1
					? 1
					: number === 2
						? 2
						: number % 100 >= 3 && number % 100 <= 10
							? 3
							: number % 100 >= 11 && number % 100 <= 99
								? 4
								: 5

		default:
			return 0
	}
}

// Export short-hand

export {
	translatePlural as n,
	translate as t,
}
