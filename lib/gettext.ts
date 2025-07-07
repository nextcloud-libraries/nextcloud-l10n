/*!
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/**
 * This module provides functionality to translate applications independent from Nextcloud
 *
 * @packageDocumentation
 * @module @nextcloud/l10n/gettext
 * @example
 * ```js
import { getGettextBuilder } from '@nextcloud/l10n/gettext'
const gt = getGettextBuilder()
			.detectLocale() // or use setLanguage()
			.addTranslation(/* ... *\/)
			.build()
gt.gettext('some string to translate')
```
 */

import type { AppTranslations, PluralFunction } from './registry.ts'

import { getLanguage, getPlural, translate, translatePlural } from './index.ts'

export interface GettextTranslation {
	msgid: string
	msgid_plural?: string
	msgstr: string[]
}

export interface GettextTranslationContext {
	[msgid: string]: GettextTranslation
}

export interface GettextTranslationBundle {
	headers: {
		[headerName: string]: string
	}
	translations: {
		[context: string]: GettextTranslationContext
	}
}

class GettextWrapper {
	private bundle: AppTranslations

	constructor(pluralFunction: PluralFunction) {
		this.bundle = {
			pluralFunction,
			translations: {},
		}
	}

	/**
	 * Append new translations to the wrapper.
	 *
	 * This is useful if translations should be added on demand,
	 * e.g. depending on component usage.
	 *
	 * @param bundle - The new translation bundle to append
	 */
	addTranslations(bundle: GettextTranslationBundle): void {
		const dict = Object.values(bundle.translations[''] ?? {})
			.map(({ msgid, msgid_plural: msgidPlural, msgstr }) => {
				if (msgidPlural !== undefined) {
					return [`_${msgid}_::_${msgidPlural}_`, msgstr]
				}
				return [msgid, msgstr[0]]
			})

		this.bundle.translations = {
			...this.bundle.translations,
			...Object.fromEntries(dict),
		}
	}

	/**
	 * Get translated string (singular form), optionally with placeholders
	 *
	 * @param original original string to translate
	 * @param placeholders map of placeholder key to value
	 */
	gettext(original: string, placeholders: Record<string, string | number> = {}): string {
		return translate('', original, placeholders, undefined, { bundle: this.bundle })
	}

	/**
	 * Get translated string with plural forms
	 *
	 * @param singular Singular text form
	 * @param plural Plural text form to be used if `count` requires it
	 * @param count The number to insert into the text
	 * @param placeholders optional map of placeholder key to value
	 */
	ngettext(singular: string, plural: string, count: number, placeholders: Record<string, string | number> = {}): string {
		return translatePlural('', singular, plural, count, placeholders, { bundle: this.bundle })
	}
}

class GettextBuilder {
	private debug = false
	private language = 'en'
	private translations = {} as Record<string, GettextTranslationBundle>

	setLanguage(language: string): this {
		this.language = language
		return this
	}

	/**
	 * Try to detect locale from context with `en` as fallback value
	 * This only works within a Nextcloud page context.
	 *
	 * @deprecated use `detectLanguage` instead.
	 */
	detectLocale(): this {
		return this.detectLanguage()
	}

	/**
	 * Try to detect locale from context with `en` as fallback value.
	 * This only works within a Nextcloud page context.
	 */
	detectLanguage(): this {
		return this.setLanguage(getLanguage().replace('-', '_'))
	}

	/**
	 * Register a new translation bundle for a specified language.
	 *
	 * Please note that existing translations for that language will be overwritten.
	 *
	 * @param language - Language this is the translation for
	 * @param data - The translation bundle
	 */
	addTranslation(language: string, data: GettextTranslationBundle): this {
		this.translations[language] = data
		return this
	}

	enableDebugMode(): this {
		this.debug = true
		return this
	}

	build(): GettextWrapper {
		if (this.debug) {
			// eslint-disable-next-line no-console
			console.debug(`Creating gettext instance for language ${this.language}`)
		}

		const wrapper = new GettextWrapper((n: number) => getPlural(n, this.language))
		if (this.language in this.translations) {
			wrapper.addTranslations(this.translations[this.language])
		}
		return wrapper
	}
}

/**
 * Create a new GettextBuilder instance
 */
export function getGettextBuilder() {
	return new GettextBuilder()
}

export type {
	GettextBuilder,
	GettextWrapper,
}
