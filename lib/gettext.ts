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
import type { AppTranslations } from './registry.ts'
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
	},
	translations: {
		[context: string]: GettextTranslationContext
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
			console.debug(`Creating gettext instance for language ${this.language}`)
		}

		const translations = Object.values(this.translations[this.language]?.translations[''] ?? {})
			.map(({ msgid, msgid_plural: msgidPlural, msgstr }) => {
				if (msgidPlural !== undefined) {
					return [`_${msgid}_::_${msgidPlural}_`, msgstr]
				}
				return [msgid, msgstr[0]]
			})

		const bundle: AppTranslations = {
			pluralFunction: (n: number) => getPlural(n, this.language),
			translations: Object.fromEntries(translations),
		}

		return new GettextWrapper(bundle)
	}

}

class GettextWrapper {

	constructor(
		private bundle: AppTranslations,
	) {
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
