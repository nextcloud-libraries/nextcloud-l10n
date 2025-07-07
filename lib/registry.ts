/// <reference types="@nextcloud/typings" />
/*!
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/**
 * Translation bundle
 *
 * @example For German translation
 * ```json
	{
		"some": "einige",
		"_%n tree_::_%n trees_": [
			"%n Baum",
			"%n Bäume"
		]
	}
```
 */
export type Translations = Record<string, string | string[] | undefined>

/**
 * Function for getting plural form index from translated number
 *
 * @param number Input number to translate
 * @return Index of translation plural form
 * @example For most languages, like English or German
 * ```js
(number:number) => number === 1 ? 0 : 1
```
 */
export type PluralFunction = (number: number) => number

/**
 * Extended window interface with translation registry
 * Exported just for internal testing purpose
 *
 * @private
 */
export interface NextcloudWindowWithRegistry extends Nextcloud.v27.WindowWithGlobals {
	_oc_l10n_registry_translations?: Record<string, Translations>
	_oc_l10n_registry_plural_functions?: Record<string, PluralFunction>
}

declare const window: NextcloudWindowWithRegistry

export interface AppTranslations {
	translations: Translations
	pluralFunction: PluralFunction
}

/**
 * Check if translations and plural function are set for given app
 *
 * @param appId - The app id
 * @return
 */
export function hasAppTranslations(appId: string) {
	return (
		window._oc_l10n_registry_translations?.[appId] !== undefined
		&& window._oc_l10n_registry_plural_functions?.[appId] !== undefined
	)
}

/**
 * Register new, or extend available, translations for an app
 *
 * @param appId - The app id
 * @param translations - The translations list
 * @param pluralFunction - The plural function
 */
export function registerAppTranslations(
	appId: string,
	translations: Translations,
	pluralFunction: PluralFunction,
) {
	if (appId === '__proto__' || appId === 'constructor' || appId === 'prototype') {
		throw new Error('Invalid appId')
	}

	window._oc_l10n_registry_translations = Object.assign(
		window._oc_l10n_registry_translations || {},
		{
			[appId]: Object.assign(window._oc_l10n_registry_translations?.[appId] || {}, translations),
		},
	)

	window._oc_l10n_registry_plural_functions = Object.assign(
		window._oc_l10n_registry_plural_functions || {},
		{
			[appId]: pluralFunction,
		},
	)
}

/**
 * Unregister all translations and plural function for given app
 *
 * @param appId - The app id
 */
export function unregisterAppTranslations(appId: string) {
	delete window._oc_l10n_registry_translations?.[appId]
	delete window._oc_l10n_registry_plural_functions?.[appId]
}

/**
 * Get translations bundle for given app and current locale
 *
 * @param appId - The app id
 */
export function getAppTranslations(appId: string): AppTranslations {
	return {
		translations: window._oc_l10n_registry_translations?.[appId] ?? {},
		pluralFunction: window._oc_l10n_registry_plural_functions?.[appId] ?? ((number: number) => number),
	}
}
